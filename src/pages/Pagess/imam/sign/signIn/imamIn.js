import { useTranslation } from "react-i18next";
import { signIn, useSession, signOut } from "next-auth/react";
import { use } from "i18next";
import SignGoogle from "../../../../../../public/signGooglesvg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ImamIn() {
  const [t, i18n] = useTranslation("global");
  const { push } = useRouter();

  const shiftToUserSignIn = () => {
    push("/Pagess/sign/signIn/signIn");
  };
  const shiftToImamSignUp = () => {
    push("/Pagess/imam/sign/signUp/imamUp");
  };
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
                  // setEmail(e.target.value);
                }}
              />
            </div>
            <div className="fields-container-signIn">
              <div className="name-signIn">{t("signIn.password")}</div>
              <input
                type="password"
                className="input-signIn"
                onChange={(e) => {
                  // setPassword(e.target.value);
                }}
              />
            </div>

            <div className="terms-container-signIn">
              <div className="terms-signIn">
                {t("signIn.terms1")}{" "}
                <span style={{ fontWeight: "bold" }}>{t("signIn.terms2")}</span>{" "}
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
              <button className="signIn-button-signIn">
                {" "}
                {/* onClick={signIn} */}
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
                  // signInWithGoogle();
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
                  style={{ color: "#b52d3b", cursor: "pointer" }}
                  onClick={shiftToImamSignUp}
                >
                  {t("signIn.acc2")}
                </span>
              </div>
              <div className="no-acc-imam-signIn" onClick={shiftToUserSignIn}>
                {t("signIn.user")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
