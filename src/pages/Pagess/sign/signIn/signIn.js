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
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleUser, setGoogleUser] = useState("");
  const [registered, setRegistered] = useState(true);
  let check = false;

  const { push } = useRouter();

  const shiftToSignUp = () => {
    console.log("signIn Clicked");
    push("/Pagess/sign/signUp/signUp");
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
  //Check if user exists

  /*let tempEmail = "";
        let tempName = "";
        const checkEmail = session?.user?.email;
        const checkName = session?.user?.name;

        console.log(checkEmail);
        console.log(checkName);
        try {
            const res = await fetch("/api/google/checkUserExist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: checkEmail }),
            });
            if (!res.ok) {
                const errorMessage = await res.json();
                console.error("Error if:", errorMessage.error);
                return;
            }
            const responseData = await res.json();
            console.log("User exists:", responseData);
            if (responseData.user === true) {
                check = true;
                console.log("Check set to true", checkEmail);
                tempEmail = checkEmail;
                tempName = checkName;
            } else {
                alert("User does not exist, please signup first");
                check = false;
            }
        } catch (error) {
            console.log("Error on first if statement: ", error);
        }
        console.log("check", check);

        //If the user exists
        if (status === "authenticated" && check === true) {
            console.log("Google SignIn Success", tempEmail);
            localStorage.setItem("email", tempEmail);
            localStorage.setItem("username", tempName);
        } else {
            console.log("Google SignIn Failed");
            return;
        }
        try {
            const res = await fetch("/api/google/getToken", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(googleEmail),
            });
            if (!res.ok) {
                const errorMessage = await res.json();
                console.error("Error if:", errorMessage.error);
                return;
            }
            const responseData = await res.json();
            const token = responseData.token;
            localStorage.setItem("token", token);
            console.log("res", responseData);
            push("/Pagess/create/results/results");
        } catch (error) {
            console.log("Could not create token from google signin", error);
        }
    };*/
  /*useEffect(() => {
        const checkGoogleUser = async () => {
            let em = localStorage.getItem("email");
            let name = localStorage.getItem("username");
            console.log("Email: " + em, "Name: " + name);
            if (em != "" && name != "" && em != null && name != null) {
                console.log("push");
                push("/Pagess/create/results/results");
            } else {
                console.log("OOOOOOOOOOOOOOO push");
            }
        };
        checkGoogleUser();
    }, []);*/

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
