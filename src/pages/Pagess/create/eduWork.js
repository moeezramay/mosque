import { useRouter } from "next/navigation";
import NavMini from "./navMini";
import { useTranslation } from "react-i18next";
import { AppContext } from "../AppContext";
import { useState, useContext, useEffect } from "react";

export default function Educwork() {
    const [t, i18n] = useTranslation("global");
    const { eduworkContext, setEduworkContext } = useContext(AppContext);
    const { push } = useRouter();

    //----------Storing input data in state----------------
    const [edulevel, setEdulevel] = useState("");
    const [subject, setSubject] = useState("");
    const [profession, setProfession] = useState("");
    const [job, setJob] = useState("");
    const [language1, setLanguage1] = useState("");
    const [language2, setLanguage2] = useState("");
    //-----------------^^^^^^^^^^--------------------------

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

    //------------------Updates State----------------

    const handleSelectChange = (e, setFunction) => {
        setFunction(e.target.value);
        console.log("about:", edulevel);
    };
    //------------------^^^^^^^^^^^^^^^----------------

    //------------------Updates Context and shifts page----------------
    const handleSubmit = (e) => {
        e.preventDefault();

        const eduWorkData = {
            //Add all data to this object
            education: edulevel,
            subject: subject,
            profession: profession,
            job: job,
            language1: language1,
            language2: language2,
        };

        setEduworkContext(eduWorkData); //Updates context

        console.log("eduwork: ", eduworkContext);

        push("/Pagess/create/personal");
    };
    //------------------^^^^^^^^^^^^^^^----------------

    return (
        <form onSubmit={handleSubmit}>
            <NavMini />
            <div className="parent-eduwork">
                <div className="heading-container-eduwork">
                    <div className="heading-eduwork">
                        {t("eduWork.heading")}
                    </div>
                </div>
                <div className="box-container-eduwork">
                    <div className="box-eduwork">
                        <div>
                            <div className="location-eduwork">
                                {t("eduWork.level")}
                            </div>
                            <div className="select-location-eduwork">
                                <select
                                    value={edulevel}
                                    onChange={(e) =>
                                        handleSelectChange(e, setEdulevel)
                                    }
                                    required
                                >
                                    <option></option>
                                    <option>Bachelors</option>
                                    <option>Masters</option>
                                    <option>Phd</option>
                                </select>
                            </div>
                        </div>
                        <div className="select-conatiner-eduwork">
                            <div className="location-eduwork">
                                {t("eduWork.subject")}
                            </div>
                            <div className="input-container-eduwork">
                                <input
                                    onChange={(e) => {
                                        setSubject(e.target.value);
                                    }}
                                    className="input-little-eduwork"
                                    required
                                />
                            </div>
                        </div>
                        <div className="select-conatiner-eduwork">
                            <div className="location-eduwork">
                                {t("eduWork.profession")}
                            </div>
                            <div className="select-location-eduwork">
                                <select
                                    value={profession}
                                    onChange={(e) =>
                                        handleSelectChange(e, setProfession)
                                    }
                                    required
                                >
                                    <option></option>
                                    <option>Developer</option>
                                    <option>Programmer</option>
                                    <option>Coder</option>
                                </select>
                            </div>
                        </div>

                        <div className="select-conatiner-eduwork">
                            <div className="location-eduwork">
                                {t("eduWork.job")}
                            </div>
                            <div className="select-location-eduwork">
                                <select
                                    value={job}
                                    onChange={(e) =>
                                        handleSelectChange(e, setJob)
                                    }
                                    required
                                >
                                    <option></option>
                                    <option>Full Stack Developer</option>
                                    <option>MERN Stack Dev</option>
                                    <option>iOS Dev</option>
                                </select>
                            </div>
                        </div>
                        <div className="select-conatiner-eduwork">
                            <div className="location-eduwork">
                                {t("eduWork.language1")}
                            </div>
                            <div className="select-location-eduwork">
                                <select
                                    value={language1}
                                    onChange={(e) =>
                                        handleSelectChange(e, setLanguage1)
                                    }
                                    required
                                >
                                    <option></option>
                                    <option>Urdu</option>
                                    <option>Hindi</option>
                                    <option>Punjabi</option>
                                </select>
                            </div>
                        </div>
                        <div className="select-conatiner-eduwork">
                            <div className="location-eduwork">
                                {t("eduWork.language2")}
                            </div>
                            <div className="select-location-eduwork">
                                <select
                                    value={language2}
                                    onChange={(e) =>
                                        handleSelectChange(e, setLanguage2)
                                    }
                                    required
                                >
                                    <option></option>
                                    <option>Urdu</option>
                                    <option>Hindi</option>
                                    <option>Punjabi</option>
                                </select>
                            </div>
                        </div>

                        <div className="button-container-eduwork">
                            <button type="submit" className="button-eduwork">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}