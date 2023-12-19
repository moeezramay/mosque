import ResultsNav from "../navResult";
import { useState, useEffect } from "react";
import Stop from "../../../../../../public/stopsvg";
import Excalim from "../../../../../../public/exclaimsvg";
import Wali from "../../../../../../public/waliSVG";
import ResultHeart from "../../../../../../public/resultheartsvg";
import Camera from "../../../../../../public/camerasvg";
import Envelope from "../../../../../../public/envelope";
import Image from "next/image";
import { use } from "i18next";

export default function Messages() {
  const [inbox, setInbox] = useState(true);
  const [messageArray, setMessageArray] = useState([]); //for inbox messages
  const [messageArray2, setMessageArray2] = useState([]); //For Sent messages
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [data, setData] = useState({});
  const [view, setView] = useState(false);

  //--------------------Get Message--------------------
  //inbox messages
  useEffect(() => {
    const GetMessageInbox = async () => {
      const email = localStorage.getItem("email");

      console.log("Send this email: ", email);

      const res = await fetch("/api/message/getMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error if:", errorMessage.error);
        return;
      }
      const response = await res.json();
      setMessageArray(response.message);
    };
    GetMessageInbox();
  }, []);

  //sent messages
  useEffect(() => {
    const GetMessageSent = async () => {
      const email = localStorage.getItem("email");

      console.log("Send this email: ", email);

      const res = await fetch("/api/message/getMessageSent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error if:", errorMessage.error);
        return;
      }
      const response = await res.json();
      setMessageArray2(response.message);
    };
    GetMessageSent();
  }, []);

  useEffect(() => {
    console.log("Message: ", messageArray);
    console.log("Message2: ", messageArray2);
  }, [messageArray, messageArray2]);
  //--------------------^^^^^^^^^^--------------------

  //--------------------Send Message--------------------
  const SendMessage = async (e, user) => {
    e.preventDefault();
    console.log("Send message fucntion started", user);
    const sender = user;
    const receiver = localStorage.getItem("email");

    const data = {
      senderEmail: sender,
      receiverEmail: receiver,
      messageText: messageText,
    };

    const res = await fetch("/api/message/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
  };
  //--------------------^^^^^^^^^^--------------------

  //--------------------Fetch User Data--------------------
  const fetchData = async (e, em) => {
    e.preventDefault();
    const email1 = em;
    if (email1 === "" || !email1 || email1 === null) {
      return;
    }
    try {
      const res = await fetch("/api/message/getUserInfo", {
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
      setData(response.user);
      console.log("Data: ", data);
    } catch (error) {
      console.error("Error on first try fetching data:", error.message);
    }
  };

  useEffect(() => {
    console.log("data:", data);
  }, [data]);
  //--------------------^^^^^^^^^^--------------------
  //-------------Function to calculate age------------------
  function calculateAge(year, month, day) {
    const dateOfBirth = `${year}-${month}-${day}`;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If the birth date for the current year hasn't occurred yet, subtract one year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return <div>{age}</div>;
  }
  //-------------^^^^^^^^^^^^^^^^^^^^------------------

  return (
    <div className="parent-msg">
      <div className="background-shade-msg"></div>
      <div>
        <ResultsNav />
      </div>
      <div className="container-box-msg">
        <div className="sub-container-msg">
          <div className="container-left-msg">
            {inbox ? (
              <div className="inbox-text-msg">Inbox</div>
            ) : (
              <div className="inbox-text-msg">Sent</div>
            )}
            <div className="seperator-msg"></div>
            <div className="inbox-mini-msg" onClick={() => setInbox(true)}>
              Inbox
            </div>
            <div className="seperator-msg"></div>
            <div className="inbox-mini2-msg" onClick={() => setInbox(false)}>
              Sent
            </div>
          </div>
          <div className="container-right-msg">
            {inbox ? (
              <div className="inbox-text-msg">Inbox</div>
            ) : (
              <div className="inbox-text-msg">Sent</div>
            )}
            <div className="seperator2-msg"></div>
            {inbox ? (
              messageArray.length > 0 ? (
                messageArray.map((message, index) => (
                  <div className="inbox-msgs-msg" key={index}>
                    <div className="bottom-container-msg">
                      <div className="result-parent-container-msg">
                        <div className="result-img-parent-msg">
                          <div className="img-container-msg">
                            <Image
                              src="/female.jpeg"
                              alt="default"
                              layout="responsive"
                              width={100}
                              height={100}
                            />
                          </div>
                        </div>
                        <div className="result-right-parent-container">
                          <div className="result-line2-container-msg">
                            <button
                              className="btn-msg-msg"
                              onClick={(e) => {
                                fetchData(e, message.sender_email);
                                setView(true);
                              }}
                            >
                              View
                            </button>
                            {/* Shows Message Details */}
                            {view && (
                              <div className="msg-container-msg">
                                <div className="msg-sub-msg">
                                  <div className="msg-heading-msg">
                                    <div className="msg-text-msg">
                                      View Details
                                    </div>
                                    <div className="close-msg-msg">
                                      <div
                                        onClick={(e) => {
                                          setView(false);
                                        }}
                                      >
                                        X
                                      </div>
                                    </div>
                                  </div>
                                  <div className="divider-msg-msg"></div>
                                  <div className="msg-mini-container-msg">
                                    {console.log("Second data", data)}
                                    <div>
                                      Name:
                                      {data[0].username}
                                    </div>
                                    <div>
                                      Age:{" "}
                                      {calculateAge(
                                        data[0].aboutme_year,
                                        data[0].aboutme_month,
                                        data[0].aboutme_day
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="mini-seprator1-msg"></div>
                            <div
                              className="heart-container-msg"
                              onClick={(e) => {
                                setShowMessage(true);
                              }}
                            >
                              <button className="btn-msg-msg">Reply</button>
                            </div>
                            {/* Shows Message Details */}
                            {showMessage && (
                              <div className="msg-container-msg">
                                <div className="msg-sub-msg">
                                  <div className="msg-heading-msg">
                                    <div className="msg-text-msg">
                                      New Message
                                    </div>
                                    <div className="close-msg-msg">
                                      <div
                                        onClick={(e) => {
                                          setShowMessage(false);
                                        }}
                                      >
                                        X
                                      </div>
                                    </div>
                                  </div>
                                  <div className="divider-msg-msg"></div>
                                  <div className="msg-mini-container-msg">
                                    <div className="msg-mini-text-msg">
                                      Message
                                    </div>
                                    <textarea
                                      placeholder="Enter your message here"
                                      className="msg-input-msg"
                                      onChange={(e) => {
                                        setMessageText(e.target.value);
                                      }}
                                    ></textarea>
                                    <div className="send-msg-container-msg">
                                      <button
                                        className="send-msg-msg"
                                        onClick={(e) => {
                                          SendMessage(e, message.sender_email);
                                          setShowMessage(false);
                                        }}
                                      >
                                        Send
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="result-line4-container-msg">
                            <div>Message:</div>
                            <div className="info-msg">
                              {message.message_text}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sent-msgs-msg">No messages to show...</div>
              )
            ) : (
              <div className="">...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
