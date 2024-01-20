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
  const [logout, setLogout] = useState(false);
  const { push } = useRouter();

  //------------------Retrieves data----------------
  useEffect(() => {
    const fetchData = async () => {
      if (
        localStorage.getItem("email") === null ||
        localStorage.getItem("email") === undefined ||
        localStorage.getItem("email") === "" ||
        localStorage.getItem("username") === null ||
        localStorage.getItem("username") === undefined ||
        localStorage.getItem("username") === ""
      ) {
        push("/Pagess/sign/signIn/signIn");
      }
      const email1 = localStorage.getItem("email");
      setEmail(email1);
      const user1 = localStorage.getItem("username");
      setUsername(user1);

      console.log("email found nav:", email);

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

  //------------------Log out----------------
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    push("/Pagess/sign/signIn/signIn");
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
        <div className="account-navResult" onClick={() => setLogout(!logout)}>
          {username}
        </div>
      </div>
      {logout && (
        <div className="logout-container-navResult">
          <button
            className="logout-btn-navResult"
            onClick={(e) => {
              handleLogout(e);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
