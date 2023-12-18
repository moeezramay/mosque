import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [t, i18n] = useTranslation("global");

  const { push } = useRouter();

  const jwt = require("jsonwebtoken"); //To decode the token we recieve from backend

  const shiftToSignIn = () => {
    console.log("signIn Clicked");
    push("/Pagess/sign/signIn/signIn");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const acc = {
        email: emailAddress,
        password: password,
        firstName: firstName,
        lastName: lastName,
      };

      const res = await fetch("/api/createAcc/createAcc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(acc),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error if:", errorMessage.error);
        return;
      }
      const response = await res.json();

      const token = 1;
      const msg = response.message;
      const username = "dsa";
      console.log("msg", msg);

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("email", msg);
        localStorage.setItem("username", username);
        console.log("token", token);
      }
      push("/Pagess/create/gender");
    } catch (error) {
      console.log("Error cought on last", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="signUp-parent-signUp">
          <div className="logo-signUp">
            <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
            <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
          </div>
          <div className="parent-container-signUp">
            <div className="box-signUp">
              <div className="fields-container-signUp">
                <div className="name-signUp">{t("signIn.first")}</div>
                <input
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  className="input-signUp"
                />
              </div>
              <div className="fields-container-signUp">
                <div className="name-signUp">{t("signIn.last")}</div>
                <input
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  type="text"
                  className="input-signUp"
                />
              </div>
              <div className="fields-container-signUp">
                <div className="name-signUp">{t("signIn.email")}</div>
                <input
                  onChange={(e) => {
                    setEmailAddress(e.target.value);
                  }}
                  type="email"
                  className="input-signUp"
                />
              </div>
              <div className="fields-container-signUp">
                <div className="name-signUp">{t("signIn.password")}</div>
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  className="input-signUp"
                />
              </div>
              <div className="fields-container-signUp">
                <div className="name-signUp">{t("signIn.confirm")}</div>
                <input
                  onChange={(e) => {
                    setConfirm(e.target.value);
                  }}
                  type="password"
                  className="input-signUp"
                />
              </div>
              <div className="terms-container-signUp">
                <div className="terms-signUp">
                  {t("signIn.terms1")}{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {t("signIn.terms2")}
                  </span>{" "}
                  {t("signIn.policy")}
                </div>
              </div>
              <div className="signUp-btn-container-signUp">
                <button type="submit" className="signUp-button-signUp">
                  {t("signIn.register")}
                </button>
              </div>
              <div className="no-acc-container-signUp">
                <div className="no-acc-signUp">
                  {t("signIn.already1")}{" "}
                  <span
                    onClick={shiftToSignIn}
                    style={{ color: "#b52d3b", cursor: "pointer" }}
                  >
                    {t("signIn.already2")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
