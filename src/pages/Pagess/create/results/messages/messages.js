import ResultsNav from "../navResult";
import { useState, useEffect } from "react";

export default function Messages() {
  const [inbox, setInbox] = useState(true);
  const [messageArray, setMessageArray] = useState([]);

  //--------------------Get Message--------------------
  useEffect(() => {
    const GetMessage = async () => {
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
      console.log("Message: ", messageArray);
    };
    GetMessage();
  }, []);
  //--------------------^^^^^^^^^^--------------------

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
            {messageArray.length > 0 ? (
              messageArray.map((message, index) => (
                <div key={index}>{messageArray[index].message_text}</div>
              ))
            ) : (
              <div style={{ marginLeft: "20px", marginTop: "20px" }}>
                No messages to show...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
