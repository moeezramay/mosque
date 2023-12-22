import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { useTranslation } from "react-i18next";

export default function ResetPassPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [t, i18n] = useTranslation("global");
  const [email, setEmail] = useState("");
  const { push } = useRouter();

  useEffect(() => {
    const verifyTokenAndProcess = async () => {
      if (token && localStorage.getItem("email")) {
        console.log("Reset Token:", token);
        console.log("Email:", localStorage.getItem("email"));
        setEmail(localStorage.getItem("email"));
      } else {
        //push("/Pagess/sign/signIn/signIn");
      }
    };

    verifyTokenAndProcess();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(email, password);
      const res = await fetch("/api/forgotPass/resetPass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password, email: email }),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error on forgotPass frontend:", errorMessage.error);
        return;
      }
      const data = await res.json();
      console.log("Data recieved from backend: ", data);
      if (data.check === true) {
        alert("Password Reset");
        push("/Pagess/sign/signIn/signIn");
      } else {
        alert("Error resetting password");
      }
    } catch (error) {
      console.log("Could not reset password", error);
    }
  };

  return (
    <form onSubmit={() => handleSubmit(e)}>
      <div className="parent-reset">
        <div className="logo-reset">
          <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
          <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
        </div>
        <div className="parent-container-reset">
          <div className="box-reset">
            <div className="text-container-reset">
              <div className="text-reset">{t("signIn.reset")}</div>
            </div>
            <div className="email-container-reset">
              <div>New Password</div>
              <div className="email-input-container-reset">
                <input
                  className="email-input-reset"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="confirm-text-reset">Confirm Password</div>
              <div className="email-input-container-reset">
                <input
                  className="email-input-reset"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </div>
              <div className="submit-container-reset">
                <button
                  className="submit-reset"
                  onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </button>
              </div>
              <div className="remember-container-reset">
                <div
                  className="remember-reset"
                  onClick={() => {
                    push("/Pagess/sign/signIn/signIn");
                  }}
                >
                  Go back to Login?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
