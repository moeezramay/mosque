import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export default function ResetPassPage() {
  const router = useRouter();
  const { params } = router.query;
  let userEmail = "";
  let password = "";
  let firstName = "";
  let lastName = "";
  let token = "";
  // const [password, setPassword] = useState("");
  const [t, i18n] = useTranslation("global");
  const { push } = useRouter();

  useEffect(() => {
    if (params) {
      userEmail = params[0];
      console.log("User Email:", userEmail);

      password = params[1];
      firstName = params[2];
      lastName = params[3];
      token = params[4];
      console.log("Token:", token);
    } else {
      console.log("User Email or token is empty");
    }
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email found on front:", userEmail);
    try {
      const res = await fetch("/api/createAcc/createAcc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          email: userEmail,
          firstName: firstName,
          lastName: lastName,
        }),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error on forgotPass frontend:", errorMessage.error);
        return;
      }
      const data = await res.json();
      console.log("Data recieved from backend: ", data);
      if (data.check === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", userEmail);
        push("/Pagess/create/gender");
      } else {
        alert("Error on creating account, please try again.");
      }
    } catch (error) {
      console.log("Could not create account", error);
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
              <div className="text-reset">Confirm Email {userEmail}</div>
            </div>
            <div className="email-container-reset">
              <div className="submit-container-reset">
                <button
                  className="submit-reset"
                  onClick={(e) => handleSubmit(e)}
                >
                  Confirm
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
