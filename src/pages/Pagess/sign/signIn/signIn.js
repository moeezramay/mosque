import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { signIn, useSession, signOut } from "next-auth/react";
import SignGoogle from "../../../../../public/signGooglesvg";
import { use } from "i18next";

export default function SignIn() {
  const { data: session } = useSession();
  const [t, i18n] = useTranslation("global");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(true);

  const { push } = useRouter();

  const shiftToSignUp = () => {
    console.log("signIn Clicked");
    push("/Pagess/sign/signUp/signUp");
  };

  const shiftToImam = () => {
    push("/Pagess/imam/sign/signIn/imamIn");
  };
  useEffect(() => {
    if (session && session.user && session.user.name) {
      console.log("GOOGLE USER SUCCESSFULLY CONNECTED");
      console.log(session.user.name);
      console.log(session.user.email);

      const fetchToken = async () => {
        //If the User Exists the Token Is fetched
        const res = await fetch("/api/google/getToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(session.user.email),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const responseData = await res.json();
        const token = responseData.token;

        //Successful Redirection
        localStorage.setItem("token", token);
        localStorage.setItem("email", session.user.email);
        localStorage.setItem("username", session.user.name);
        console.log("res", responseData);

        push("/Pagess/create/results/results");
      };

      const validateUser = async () => {
        try {
          const res = await fetch("/api/google/checkUserExist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });
          if (!res.ok) {
            const errorMessage = await res.json();
            console.error("ERROR: ", errorMessage.error);
            return;
          }
          const responseData = await res.json();
          console.log("USER FOUND", responseData);
          if (responseData.user === true) {
            fetchToken();
          } else {
            //-----------USER DOESNOT EXIST-----------
            console.log("USER IS NOT REGISTERED");
            setRegistered(false);
            localStorage.setItem("goog", 2);
          }
        } catch (error) {
          console.log("VALIDATION ERROR", error);
        }
      };
      validateUser();
    } else {
      console.log("GOOGLE USER NOT CONNECTED");
    }
  }, [session]);

  const signInWithGoogle = async () => {
    if (navigator.userAgent.includes("Mac")) {
      if (!localStorage.getItem("goog")) {
        localStorage.setItem("goog", 1);
      }
    }
    await signIn("google");
  };

  //---------------^^^^^^^^^-----------------------------

  //---------------Default signIn----------------------------
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
      alert("Invalid Email or Password");
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
              <div className="forgot-container-signIn">
                <div
                  className="forgot-signIn"
                  onClick={() => {
                    push("/Pagess/sign/forgotPass/forgotPass");
                  }}
                >
                  {t("signIn.forgot")}
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
              <div className="imam-signIn" onClick={shiftToImam}>
                SignIn As Imam?
              </div>
              <div className="signGoogle-signIn">
                <div
                  onClick={() => {
                    signInWithGoogle();
                  }}
                  className="signIn-google-container-signIn"
                >
                  <SignGoogle />
                </div>
              </div>
              {!registered && (
                <div className="user-not-google-signIn">
                  User is not registered
                </div>
              )}
              <div className="no-acc-container-signIn">
                <div className="no-acc-signIn">
                  {t("signIn.acc1")}{" "}
                  <span
                    onClick={shiftToSignUp}
                    style={{
                      color: "#b52d3b",
                      cursor: "pointer",
                    }}
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
