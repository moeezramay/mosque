import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ResultsNav from "../navResult";
import Image from "next/image";
import MessageSend from "../../../../../../public/sendMsgSvg";

export default function MessageHome() {
  const [inputText, setInputText] = useState("");
  const [socket, setSocket] = useState(null);
  const [defaultScreen, setDefaultScreen] = useState(true);
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [recievedMessages, setRecievedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [filteredMessage, setFilteredMessage] = useState([]); //All emails for the current user
  const [uniqueUsers, setUniqueUsers] = useState([]); //All unique users for the current user
  const [emailFound, setEmailFound] = useState("");
  const [allMessages, setAllMessages] = useState([]); //All messages for the current user
  const [filteredAndSortedMessages, setFilteredAndSortedMessages] = useState(
    []
  );
  const [message, setMessage] = useState(""); //Message to send
  const [selectedUser, setSelectedUser] = useState(""); //Selected user to display messages

  useEffect(() => {
    const socketInitializer = async () => {
      const username = localStorage.getItem("username");
      setUsername(username);

      const email = localStorage.getItem("email");
      setEmailFound(email);

      if (email === "" || !email || email === null) {
        console.log("no email found");
        return;
      }
      await fetch("/api/message/socket");
      const newSocket = io();
      setSocket(newSocket);

      newSocket.on("connection", () => {
        console.log("connected with server");
      });

      newSocket.emit("addUser", email);

      newSocket.on("messageFromServer", (message) => {
        console.log(message);
      });

      newSocket.on("getRecievedMessages", (arr, email1) => {
        let em = localStorage.getItem("email");
        if (email1 === em) {
          setRecievedMessages(arr);
        }
      });

      newSocket.on("getSentMessages", (arr, email2) => {
        let em = localStorage.getItem("email");
        console.log("em", em);
        console.log("email2", email2);
        if (email2 === em) {
          setSentMessages(arr);
        }
      });

      newSocket.on("refreshOther", (result, email) => {
        console.log("Email on refreshOther:", email);
        let tempE = localStorage.getItem("email");
        if (email === tempE) {
          console.log("Email found on refreshOther:", tempE);
          setRecievedMessages(result);
        } else {
          console.log("Refresh false");
        }
      });
    };

    socketInitializer();
  }, []);

  //-----------Fetch recieved/Sent messages------------------
  useEffect(() => {
    //Fetch recieved messages
    const email = localStorage.getItem("email");
    console.log("email on live: ", email);
    if (socket != null) {
      socket.emit("getRecievedMessages", email);
      socket.emit("getSentMessages", email);
      console.log("message sent");
    }
  }, [socket]);
  //--------------------^^^^^^^^^^--------------------

  //-------Filtered array for left pane contact display------

  useEffect(() => {
    // Combine and filter messages
    const allMessages = [
      ...sentMessages.map((message) => ({
        email: message.receiver_email,
        ...message,
      })),
      ...recievedMessages.map((message) => ({
        email: message.sender_email,
        ...message,
      })),
    ];

    const uniqueEmails = Array.from(
      new Set(allMessages.map((message) => message.email))
    );
    console.log("sent messg", sentMessages);
    console.log("Unique Emails:", uniqueEmails);
    setFilteredMessage(uniqueEmails);
  }, [sentMessages, recievedMessages]);
  //--------------------^^^^^^^^^^--------------------------

  //-----get unique username and filter state for dups------
  useEffect(() => {
    const fetchData = async () => {
      const uniqueUsersSet = new Set();

      for (const email of filteredMessage) {
        try {
          const res = await fetch("/api/message/getUsername", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          if (!res.ok) {
            const errorMessage = await res.json();
            console.error("Error if:", errorMessage.error);
            continue;
          }

          const response = await res.json();

          uniqueUsersSet.add(response.user);
        } catch (error) {
          console.error("Error on fetching data:", error.message);
        }
      }
      setUniqueUsers(Array.from(uniqueUsersSet));
    };

    fetchData();
  }, [filteredMessage]);

  //--------------------^^^^^^^^^^--------------------------

  //---------Fetch All User Data for a single user----------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
      try {
        const res = await fetch("/api/message/getSingleUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email1),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const response = await res.json();
        setData(response.user.rows);
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };
    fetchData();
  }, []);

  //--------------------^^^^^^^^^^--------------------

  //---------Get email of selected user--------------
  const selectUser = async (user) => {
    console.log("User selected", user);
    setSelectedUser(user);
    const res = await fetch("/api/message/getEmailbyName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log("Email found:", response.email);
    setEmailFound(response.email);

    setDefaultScreen(false);
  };
  //--------------------^^^^^^^^^^--------------------

  //---------Display messages in order----------------
  useEffect(() => {
    const allMessages1 = [...sentMessages, ...recievedMessages];

    setAllMessages(allMessages1); //Storing every message first
  }, [sentMessages, recievedMessages]);

  const sortByTimestamp = (a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp);

  useEffect(() => {
    const tempEmail = localStorage.getItem("email"); // Fix the typo in 'localstorage'

    const filteredAndSortedMessages = allMessages
      .filter(
        (message) =>
          (message.sender_email === emailFound &&
            message.receiver_email === tempEmail) ||
          (message.sender_email === tempEmail &&
            message.receiver_email === emailFound)
      )
      .sort(sortByTimestamp);

    setFilteredAndSortedMessages(filteredAndSortedMessages);
  }, [allMessages, emailFound]);
  //--------------------^^^^^^^^^^--------------------

  //------------------Send message--------------------
  const handleMessage = async () => {
    if (!socket || socket === null) {
      console.log("socket not found");
      return;
    }
    const emailCurrent = localStorage.getItem("email");
    const res = await fetch("/api/message/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderEmail: emailCurrent,
        receiverEmail: emailFound,
        messageText: message,
      }),
    });
    if (!res.ok) {
      console.log("Error occured while send msg live");
      return;
    }
    const response = await res.json();
    console.log("server: ", response.message);
    setMessage("");
    socket.emit("getSentMessages", emailCurrent);

    socket.emit("refreshOther", emailFound);
  };

  //--------------------^^^^^^^^^^--------------------

  return (
    <div>
      <div className="parent-live">
        <ResultsNav />
        <div className="box-container-live">
          <div className="left-container-live">
            <div className="header-left0-live">
              <div className="header-left1-live">
                <Image
                  src="/female.jpeg"
                  alt="default"
                  layout="responsive"
                  width={100}
                  height={100}
                  className="profile-image-live"
                />
              </div>
              <div className="name-left-live">{username}</div>
            </div>
            <div className="body-left-container-live">
              {/* Mapping username for left pane */}
              {uniqueUsers.map((user, index) => (
                <div
                  key={index}
                  className="container-user-live"
                  onClick={() => {
                    selectUser(user);
                  }}
                >
                  <div className="parent-select-user-live">
                    <div className="profile-user-live">
                      <Image
                        src="/female.jpeg"
                        alt="default"
                        layout="responsive"
                        width={80}
                        height={80}
                        className="profile-image-live"
                      />
                    </div>
                    <div className="name-user-live">{user}</div>
                  </div>
                  <div className="user-bottom-live"></div>
                </div>
              ))}
              {/* Mapping username for left pane^^^^^^*/}
            </div>
          </div>
          <div className="seprator-live"></div>
          {/* Show default screen if messages not open*/}
          {defaultScreen ? (
            <div className="default-container-live">
              <div>Messages Will Appear Here</div>
            </div>
          ) : (
            <div className="right-container-live">
              <div className="header-right0-live">
                <div className="header-right1-live">
                  <Image
                    src="/female.jpeg"
                    alt="default"
                    layout="responsive"
                    width={100}
                    height={100}
                    className="profile-image-live"
                  />
                </div>
                <div className="name-right-live">{selectedUser}</div>
              </div>
              <div className="msgs-parent-live">
                {filteredAndSortedMessages.map((message, index) => (
                  <div
                    key={index}
                    className={
                      message.sender_email != emailFound
                        ? "sender-live"
                        : "receiver-live"
                    }
                  >
                    <div
                      className={
                        message.sender_email != emailFound
                          ? "sender-text-container-live"
                          : "reciever-text-container-live"
                      }
                    >
                      <div
                        className={
                          message.sender_email != emailFound
                            ? "sender-text-live"
                            : "reciever-text-live"
                        }
                      >
                        {message.message_text}
                      </div>
                    </div>

                    {/* {  <p>Sender: {message.sender_email}</p>
                    <p>Receiver: {message.receiver_email}</p>
                    <p>Timestamp: {message.timestamp}</p>} */}
                  </div>
                ))}
              </div>

              <div className="input-parent-live">
                <div className="input-container-live">
                  <input
                    className="input-live"
                    placeholder="Enter a message here.."
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button className="send-msg-live" onClick={handleMessage}>
                    <MessageSend />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
