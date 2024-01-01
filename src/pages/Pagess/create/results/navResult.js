import { useTranslation } from "react-i18next";
import SearchIcon from "../../../../../public/searchsvg";
import MessageIcon from "../../../../../public/messageIconsvg";
import HeartIcon from "../../../../../public/hearticonSvg";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResultsNav() {
  const [t, i18n] = useTranslation("global");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { push } = useRouter();

  //------------------Retrieves data----------------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      setEmail(email1);
      const user1 = localStorage.getItem("username");
      setUsername(user1);

      console.log("email found nav:", email);

      // If need to retrieve username from db

      // //Retrieving data
      // const res = await fetch("/api/createAcc/getInfoAcc", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(email),
      // });
      // if (!res.ok) {
      //   const errorMessage = await res.json();
      //   console.error("Error if:", errorMessage.error);
      //   return;
      // }
      // const response = await res.json();
      // const username = response.username;
      console.log("username", username);
    };
    fetchData();
  }, []);
  //------------------^^^^^^^^^^^^^^^----------------

  //------------------Shift to messages----------------
  const shiftToMessages = () => {
    // push("/Pagess/create/results/messages/messages");
    push("/Pagess/create/results/messages/liveMessage");
  };

  const shiftToSearch = () => {
    push("/Pagess/create/results/results");
  };

  //------------------^^^^^^^^^^^^^^^----------------

  return (
    <div style={{ zIndex: "1" }}>
      <div className="navbar-parent-container-navResult">
        <div
          className="navbar-logo-navResult"
          onClick={() => {
            push("/Pagess/HomePage/home");
          }}
        >
          <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
          <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
        </div>
        <div className="svg-container-navResult">
          <div className="search-navResult" onClick={shiftToSearch}>
            <SearchIcon />
          </div>
          <div className="message-navResult" onClick={shiftToMessages}>
            <MessageIcon />
          </div>
          <div className="message-navResult">
            <HeartIcon />
          </div>
        </div>
        <div className="account-navResult">{username}</div>
      </div>
    </div>
  );
}
