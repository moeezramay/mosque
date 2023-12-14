import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { signIn, useSession, signOut } from "next-auth/react";
import SignGoogle from "../../../../../public/signGooglesvg";

export default function SignIn() {
  const { data: session } = useSession();
  const [t, i18n] = useTranslation("global");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { push } = useRouter();

  const shiftToSignUp = () => {
    console.log("signIn Clicked");
    push("/Pagess/sign/signUp/signUp");
  };

  const signInWithGoogle = async () => {
    const res = await signIn("google");
  };

  const SignIn = async () => {
    let data = {
      email: email,
      password: password,
    };
    const res = await fetch("/api/createAcc/signIn", {
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
    console.log("Response: ", response);

    const token = response.token;
    const msg = response.email;
    const username = response.name;
    console.log("msg", msg);

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("email", msg);
      localStorage.setItem("username", username);
      console.log("token", token);
      push("/Pagess/create/results/results");
    }
  };
  if (false) {
    push("/Pagess/sign/check");
  } else {
    return (
      <div>
        <div className="signIn-parent-signIn">
          <div className="logo-signIn">
            <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
            <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
          </div>
          <div className="parent-container-signIn">
            <div className="box-signIn">
              <div className="fields-container-signIn">
                <div className="name-signIn">{t("signIn.email")}</div>
                <input
                  type="email"
                  className="input-signIn"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="fields-container-signIn">
                <div className="name-signIn">{t("signIn.password")}</div>
                <input
                  type="password"
                  className="input-signIn"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>

              <div className="terms-container-signIn">
                <div className="terms-signIn">
                  {t("signIn.terms1")}{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {t("signIn.terms2")}
                  </span>{" "}
                  Policy
                </div>
              </div>
              <div className="signIn-btn-container-signIn">
                <button className="signIn-button-signIn" onClick={SignIn}>
                  {t("signIn.login")}
                </button>
              </div>
              <div className="or-container-signIn">
                <div className="or-left-signIn"></div>
                <div className="or-signIn">OR</div>
                <div className="or-right-signIn"></div>
              </div>
              <div className="signGoogle-signIn">
                <div
                  onClick={signInWithGoogle}
                  className="signIn-google-container-signIn"
                >
                  <SignGoogle />
                </div>
              </div>
              <div className="no-acc-container-signIn">
                <div className="no-acc-signIn">
                  {t("signIn.acc1")}{" "}
                  <span
                    onClick={shiftToSignUp}
                    style={{ color: "#b52d3b", cursor: "pointer" }}
                  >
                    {t("signIn.acc2")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
