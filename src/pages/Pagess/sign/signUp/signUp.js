import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { signIn, useSession, signOut } from "next-auth/react";
import SignUpGoogle from "../../../../../public/signupGooglesvg";
import emailjs from "emailjs-com";

export default function SignUp() {
    const { status, data: session } = useSession();
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

    //------------------Email send-----------------------
    const sendEmail = (user) => {
        const templateId = "template_ucwlucj";
        console.log(emailAddress);
        const templateParams = {
            to_name: user,
        };

        // Send the email
        emailjs
            .send(
                "service_2offjoq",
                templateId,
                templateParams,
                "N3l8CQkoHqaZ8p5Ro"
            )
            .then(
                (result) => {
                    console.log(result.text);
                },
                (error) => {
                    console.log(error.text);
                }
            );
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
                setGoogleUser(session.user.name);
                setGoogleEmail(session.user.email);
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
                    console.log("DATA RECIEVED", responseData);
                    //setUserExist(true);
                    if (responseData.user === true) {
                        fetchToken();
                    } else {
                        //-----------USER DOESNOT EXIST-----------
                        console.log("USER IS NOT REGISTERED");
                        //setUserExist(false);
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

    //------------------^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    //---------------SignInWith GOOGLE----------------------------

    const signUpWithGoogle = async () => {
        const result = await signUp("google");
        /*if (status === "authenticated") {
            const checkEmail = session?.user?.email;
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
                if (responseData && responseData.userExists === true) {
                    setUserExist(true);
                } else {
                    setUserExist(false);
                    alert("User does not exist, please signup first");
                    //Set User Sign Up Data
                }
            } catch (error) {
                console.log("Error on first if statement: ", error);
            }
        }

        //If the user exists
        if (status === "authenticated" && userExist === true) {
            const name = session?.user?.name;
            const email = session?.user?.email;
            setGoogleUser(name);
            setGoogleEmail(email);
            localStorage.setItem("email", googleEmail);
            localStorage.setItem("username", googleUser);

            push("/Pagess/create/results/results");
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
        } catch (error) {
            console.log("Could not create token from google signin", error);
        }*/
    };
    //---------------^^^^^^^^^-----------------------------

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
                console.error("Error if res:", errorMessage.error);
                alert("Email already exists");
                return;
            }
            const response = await res.json();

            const token = response.token;
            const msg = response.message;
            const username = "dsa";
            console.log("msg", msg);

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("email", msg);
                localStorage.setItem("username", username);
                console.log("token", token);
            }
            sendEmail(emailAddress);
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
                        <span style={{ color: "#358fa1" }}>
                            {t("nav.first")}
                        </span>
                        <span style={{ color: "#b52d3b" }}>
                            {t("nav.second")}
                        </span>
                    </div>
                    <div className="parent-container-signUp">
                        <div className="box-signUp">
                            <div className="fields-container-signUp">
                                <div className="name-signUp">
                                    {t("signIn.first")}
                                </div>
                                <input
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                    }}
                                    className="input-signUp"
                                />
                            </div>
                            <div className="fields-container-signUp">
                                <div className="name-signUp">
                                    {t("signIn.last")}
                                </div>
                                <input
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                    }}
                                    type="text"
                                    className="input-signUp"
                                />
                            </div>
                            <div className="fields-container-signUp">
                                <div className="name-signUp">
                                    {t("signIn.email")}
                                </div>
                                <input
                                    onChange={(e) => {
                                        setEmailAddress(e.target.value);
                                    }}
                                    type="email"
                                    className="input-signUp"
                                />
                            </div>
                            <div className="fields-container-signUp">
                                <div className="name-signUp">
                                    {t("signIn.password")}
                                </div>
                                <input
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    type="password"
                                    className="input-signUp"
                                />
                            </div>
                            <div className="fields-container-signUp">
                                <div className="name-signUp">
                                    {t("signIn.confirm")}
                                </div>
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
                                <button
                                    type="submit"
                                    className="signUp-button-signUp"
                                >
                                    {t("signIn.register")}
                                </button>
                            </div>
                            <div className="or-container-signIn">
                                <div className="or-left-signIn"></div>
                                <div className="or-signIn">OR</div>
                                <div className="or-right-signIn"></div>
                            </div>
                            <div className="signGoogle-signIn">
                                <div
                                    // onClick={signInWithGoogle}
                                    className="signIn-google-container-signIn"
                                >
                                    <SignUpGoogle />
                                </div>
                            </div>
                            <div className="no-acc-container-signUp">
                                <div className="no-acc-signUp">
                                    {t("signIn.already1")}{" "}
                                    <span
                                        onClick={shiftToSignIn}
                                        style={{
                                            color: "#b52d3b",
                                            cursor: "pointer",
                                        }}
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
