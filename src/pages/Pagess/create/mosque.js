import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import NavMini from "./navMini";
import { useTranslation } from "react-i18next";
import { AppContext } from "../AppContext";
import { use } from "i18next";

export default function Mosque() {
    const [t, i18n] = useTranslation("global");
    const { push } = useRouter();
    const { mosque, setMosque } = useState("");

    //-----------------Data to send to database----------------

    const { genderContext, setGenderContext } = useContext(AppContext);
    const { aboutmeContext, setAboutmeContext } = useContext(AppContext);
    const { personalContext, setPersonalContext } = useContext(AppContext);
    const { eduworkContext, setEduworkContext } = useContext(AppContext);
    const { religonContext, setReligonContext } = useContext(AppContext);
    const { mosqueContext, setMosqueContext } = useContext(AppContext);

    //------------------Checks for token----------------
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token === null && !token) {
            console.log("token not found");
            push("/Pagess/sign/signIn/signIn");
        } else {
            console.log("Token found!");
        }
    }, []);
    //------------------^^^^^^^^^^^^^^^----------------

    //------------------Updates data and shifts to next page----------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = localStorage.getItem("email");

        console.log("email found:", email);

        const dataToSend = {
            email,
            gender: genderContext,
            aboutMe: aboutmeContext,
            personal: personalContext,
            eduwork: eduworkContext,
            religion: religonContext,
            mosque: mosqueContext,
        };

        const res = await fetch("/api/createAcc/addInfoAcc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });
        if (!res.ok) {
            const errorMessage = await res.json();
            console.error("Error if:", errorMessage.error);
            return;
        }
        const response = await res.json();
        const username = response.username;
        console.log("username", username);

        push("/Pagess/create/results/results");
    };
    //------------------^^^^^^^^^^^^^^^----------------

    return (
        <form onSubmit={handleSubmit}>
            <NavMini />
            <div className="parent-mosque">
                <div className="heading-container-mosque">
                    <div className="heading-mosque">Link To A Mosque</div>
                </div>
                <div className="box-container-mosque">
                    <div className="box-mosque">
                        <div className="select-conatiner-mosque">
                            <div className="input-container-mosque">
                                <input
                                    placeholder="Enter your mosque name here"
                                    className="input-little-mosque"
                                    required
                                    onChange={(e) =>
                                        setMosqueContext(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="button-container-mosque">
                            <button type="submit" className="button-mosque">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
