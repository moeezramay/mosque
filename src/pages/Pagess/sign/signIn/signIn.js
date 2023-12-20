import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { signIn, useSession, signOut } from "next-auth/react";
import SignGoogle from "../../../../../public/signGooglesvg";
import { use } from "i18next";

export default function SignIn() {
  const { status, data: session } = useSession();
  const [t, i18n] = useTranslation("global");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleUser, setGoogleUser] = useState("");
  let check = false;

  const { push } = useRouter();

  const shiftToSignUp = () => {
    console.log("signIn Clicked");
    push("/Pagess/sign/signUp/signUp");
  };

  //---------------SignInWith GOOGLE----------------------------
  // const signInWithGoogle = async () => {
  //   const result = await signIn("google");

  //   if (status === "authenticated") {
  //     push("/Pagess/create/results/results");
  //   } else {
  //     console.log("Google SignIn Failed");
  //     return;
  //   }
  // };
  const signInWithGoogle = async () => {
    const result = await signIn("google");
    //Check if user exists

    let tempEmail = "";
    let tempName = "";
    if (status === "authenticated") {
      const checkEmail = session?.user?.email;
      const checkName = session?.user?.name;
      try {
        const res = await fetch("/api/google/checkUserExist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkEmail),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const responseData = await res.json();
        console.log("responseData", responseData.user);

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
    }
    console.log("check", check);

    //If the user exists
    if (status === "authenticated" && check === true) {
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
      console.log("res", token);
      simulateDelay(6000);
      push("/Pagess/create/results/results");
    } catch (error) {
      console.log("Could not create token from google signin", error);
    }
  };
  useEffect(() => {
    const checkGoogleUser = async () => {
      let em = localStorage.getItem("email");
      let name = localStorage.getItem("username");
      if (em != "" && name != "" && em != null && name != null) {
        console.log("push");
      } else {
        console.log("NOOOOOOOOOOOOOOO push");
      }
    };
    checkGoogleUser();
  }, []);

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
