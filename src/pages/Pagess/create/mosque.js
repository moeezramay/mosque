import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import NavMini from "./navMini";
import { useTranslation } from "react-i18next";
import { AppContext } from "../AppContext";
import { use } from "i18next";

import Select from "react-select";

export default function Mosque() {
  const [t, i18n] = useTranslation("global");
  const { push } = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [arrMosque, setArrMosque] = useState([]);
  const [checkedMosques, setCheckedMosques] = useState([]);
  const [reset, setReset] = useState(false);
  //-----------------Data to send to database----------------

  const { genderContext, setGenderContext } = useContext(AppContext);
  const { aboutmeContext, setAboutmeContext } = useContext(AppContext);
  const { personalContext, setPersonalContext } = useContext(AppContext);
  const { eduworkContext, setEduworkContext } = useContext(AppContext);
  const { religonContext, setReligonContext } = useContext(AppContext);
  const { mosqueContext, setMosqueContext } = useContext(AppContext);

  //-----------------Updates the input suggestions----------------
  const handleInputChange = async (value) => {
    setInputValue(value);
    setReset(!reset);

    const res = await fetch("/api/getMosque/getNames", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: value }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    setArrMosque(response);
  };
  //------------------^^^^^^^^^^^^^^^----------------

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

  //In case of page refresh, the data is stored in local storage
  useEffect(() => {
    if (localStorage.getItem("aboutMe") !== null) {
      let about = localStorage.getItem("aboutMe");
      about = JSON.parse(about);
      setAboutmeContext(about);
      let personal = localStorage.getItem("personal");
      personal = JSON.parse(personal);
      setPersonalContext(personal);
      let eduwork = localStorage.getItem("eduwork");
      eduwork = JSON.parse(eduwork);
      setEduworkContext(eduwork);
      let religon = localStorage.getItem("religon");
      religon = JSON.parse(religon);
      setReligonContext(religon);
    }
  }, []);

  useEffect(() => {
    console.log("aboutmeContext: ", religonContext);
  }, [aboutmeContext]);
  //------------------^^^^^^^^^^^^^^^----------------

  //------------------Updates data and shifts to next page----------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");
    if (email === null || !email) {
      console.log("email not found");
      return;
    }
    console.log("email found:", email);

    if (mosqueContext.length === 0) {
      alert("Please select a mosque");
      return;
    }

    const dataToSend = {
      email,
      gender: genderContext,
      aboutMe: aboutmeContext || "",
      personal: personalContext || "",
      eduwork: eduworkContext || "",
      religion: religonContext || "",
      mosque: mosqueContext || [],
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
    console.log("username success", username);

    push("/Pagess/create/results/results");
  };
  //------------------^^^^^^^^^^^^^^^----------------

  const handleCheckboxChange = (mosque) => {
    const { id, name } = mosque;

    // Check if the mosque is already checked
    const isChecked = checkedMosques.some((item) => item.id === id);

    if (isChecked) {
      // If already checked, remove it from checkedMosques and mosqueContext
      setCheckedMosques((prev) => prev.filter((item) => item.id !== id));
      setMosqueContext((prev) => prev.filter((item) => item.id !== id));
    } else {
      // If not checked, add it to checkedMosques and mosqueContext
      setCheckedMosques((prev) => [...prev, { id, name }]);
      setMosqueContext((prev) => [...prev, { id, name }]);
    }
  };

  // Reset all checkboxes when input changes
  useEffect(() => {
    setCheckedMosques([]);
  }, [reset]);

  useEffect(() => {
    console.log("checkedMosques:", mosqueContext);
  }, [mosqueContext]);

  //------------------Remove added mosque----------------

  const removeAddedMosque = (mosque) => {
    setMosqueContext((prev) => prev.filter((item) => item.id !== mosque.id));
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
                  className="input-little-mosque"
                  onChange={(e) => handleInputChange(e.target.value)}
                  required
                />
                {arrMosque && arrMosque.length > 0 && (
                  <div className="option-container-mosque">
                    {arrMosque.map((mosque, index) => (
                      <div className="mini-option-mosque">
                        <p key={index}>{mosque.name} </p>
                        <label className="check-option-mosque">
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(mosque)}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="button-container-mosque">
              <button type="submit" className="button-mosque">
                Next
              </button>
            </div>
          </div>
          <div className="box-mosque">
            <div className="select-conatiner-mosque">
              <div className="input-container-mosque">
                <div className="added-title-mosque">Mosques Added</div>
                {mosqueContext.length > 0 ? (
                  <div>
                    {mosqueContext.map((mosque, index) => (
                      <div key={index}>
                        <div className="mosque-added-mosque">
                          - {mosque.name}
                        </div>
                        <div
                          className="remove-added-mosque"
                          onClick={() => {
                            removeAddedMosque(mosque);
                          }}
                        >
                          Remove
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
