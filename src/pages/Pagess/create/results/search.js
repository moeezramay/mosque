import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppContext } from "../../AppContext";
import ResultHeart from "../../../../../public/resultheartsvg";
import Camera from "../../../../../public/camerasvg";
import Envelope from "../../../../../public/envelope";
import Stop from "../../../../../public/stopsvg";
import Excalim from "../../../../../public/exclaimsvg";
import Wali from "../../../../../public/waliSVG";
import { Data, useLoadScript } from "@react-google-maps/api";
import Map from "./map";
import HeartClick from "../../../../../public/heartClickSvg";

export default function Search() {
  const [data, setData] = useState([]);
  //Setting the Current User's Coordinates
  const [cLocation, setcLocation] = useState(null);
  let locationSet = false;
  const [email, setEmail] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { filterContext, setFilterContext } = useContext(AppContext);
  //Context Range Variable
  const { rangeContext, setRangeContext } = useContext(AppContext);
  const [mapText, setMapText] = useState("Show Map");
  const [mapVisible, setMapVisible] = useState(false);
  const [loadMap, setLoadMap] = useState(false);
  const [locAccess, setLocAccess] = useState(true);
  const [mapData, setMapData] = useState([]);
  const [tempData, setTempData] = useState([]); //To store temp data for maps
  const [zoom, setZoom] = useState(10);
  const [viewBio, setViewBio] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null); //Temporary storage for users
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [heartClicked, setHeartClicked] = useState(false);

  const ethnicities_existing = [
    "asian",
    "african",
    "latin",
    "east indian",
    "mixed",
    "native american",
    "pacific islander",
    "caucasian",
  ];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD2vzJGdXaHatCi0Hf-2Z6PvQyRYlh3Akc",
  });

  const { push } = useRouter();

  const [mapCenter, setMapCenter] = useState({
    lat: 41.881832,
    lng: -87.623177,
  });

  //Updator for Current Location
  useEffect(() => {
    console.log("Current Location Has Been Set");
    console.log(cLocation);
    if (cLocation && !locationSet) {
      locationSet = true;
      var tempData = data.map((e) => {
        let tempLoc = JSON.parse(e.locations)[0];
        e.distance = Math.round(
          getDistance(cLocation[0], cLocation[1], tempLoc[0], tempLoc[1])
        );
        return e;
      });
    }
  }, [cLocation]);

  //-------------------Sending Message------------------------
  const SendMessage = async (e, user) => {
    e.preventDefault();
    console.log("Send message fucntion started", user);
    const receiver = user;
    const sender = localStorage.getItem("email");

    const data = {
      senderEmail: sender,
      receiverEmail: receiver,
      messageText: messageText,
    };

    const res = await fetch("/api/message/sendMessage", {
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
  };

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------------Calculate Distance------------------------

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lng1 - lng2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515; // distance in miles
    dist = dist * 1.609344; // convert miles to kilometers
    return dist;
  };
  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------------Api to get nearest mosque mosque------------------------

  const getMosqueData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `/api/getMosque/getMosque?latitude=${latitude}&longitude=${longitude}`
      );
      const data = await response.json();

      if (response.ok && data.status === "OK" && data.results.length > 0) {
        const mosquesData = data.results.slice(0, 5).map((result) => ({
          location: result.geometry.location,
          name: result.name,
        }));
        console.log("Sliced mosque data: ", mosquesData);

        return mosquesData;
      } else {
        console.error("Error fetching data from Google Places API:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------------Api to get user's mosque------------------------

  const getUserData = async () => {
    try {
      const email = localStorage.getItem("email");
      const res = await fetch("/api/getMosque/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Data fetched from user's mosque: ", data);
        return data;
      } else {
        console.error("Error fetching data of user selected mosque:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  const showMap = async (e, user) => {
    let locationAccessGrant = false;
    e.preventDefault();
    if (!loadMap || !locAccess) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setcLocation([latitude, longitude]);
          setMapCenter({ lat: latitude, lng: longitude });

          setMapData([]);
          setMapData((prev) => [
            ...prev,
            {
              lat: latitude,
              lng: longitude,
              name: "You",
              type: "user",
            },
          ]);

          setZoom(15);

          let getData = new Promise((resolve, reject) => {
            //Contains data for 5 closest mosques
            resolve(getMosqueData(latitude, longitude));
          });

          getData.then((mosquesData) => {
            //Data sorted into MapData with closest mosques
            const updatedMapData = mosquesData.map((mosque) => ({
              location: {
                lat: mosque.location.lat,
                lng: mosque.location.lng,
              },
              name: mosque.name,
              type: "mosque",
            }));

            setMapData((prev) => [...prev, ...updatedMapData]);
          });

          //Getting user selected mosques
          let getData2 = new Promise((resolve, reject) => {
            resolve(getUserData());
          });

          getData2.then((userData) => {
            const updatedMapData = userData.map((data) => ({
              location: {
                lat: data.location.lat,
                lng: data.location.lng,
              },
              name: data.name,
              type: "mosque2",
            }));
            const uniqueMapData = filterUniqueLocations([
              ...mapData,
              ...updatedMapData,
            ]);

            setMapData((prev) => [...prev, ...uniqueMapData]);
          });

          setLoadMap(true);
          locationAccessGrant = true;

          if (locationAccessGrant) {
            if (mapVisible === false) {
              setMapVisible(true);
              setMapText("Hide Map");
            } else {
              setMapVisible(false);
              setMapText("Show Map");
            }
          }
          setLocAccess(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          locationAccessGrant = false;
          if (locationAccessGrant) {
            if (mapVisible === false) {
              setMapVisible(true);
              setMapText("Hide Map");
            } else {
              setMapVisible(false);
              setMapText("Show Map");
            }
          }
          setLocAccess(false);
        }
      );
    }

    if (loadMap && locAccess) {
      if (mapVisible === false) {
        setMapVisible(true);
        setMapText("Hide Map");
      } else {
        setMapVisible(false);
        setMapText("Show Map");
      }
    }
  };

  const filterUniqueLocations = (data) => {
    const uniqueLocations = new Set();
    return data.filter((item) => {
      const key = `${item.location.lat}-${item.location.lng}`;
      if (!uniqueLocations.has(key)) {
        uniqueLocations.add(key);
        return true;
      }
      return false;
    });
  };

  //-------------Checks for token----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token === null && !token) {
      push("/Pagess/sign/signIn/signIn");
    }
  }, []);
  //-------------^^^^^^^^^^^^^^^-----------------

  //-------------Api to retrieve data------------------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
      setEmail(email1);
      try {
        const res = await fetch("/api/createAcc/getInfoAcc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email1),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const response = await res.json();
        console.log("Incoming Data:");
        console.log(response.user.rows);

        //Adding a Distance Tracker to the Users
        response.user.rows = response.user.rows.map((e) => {
          e["distance"] = "Unknown";
          return e;
        });

        setData(response.user.rows);
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  //-------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------Function to calculate age------------------
  function calculateAge(year, month, day) {
    const dateOfBirth = `${year}-${month}-${day}`;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If the birth date for the current year hasn't occurred yet, subtract one year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return <div>{age}</div>;
  }
  //-------------^^^^^^^^^^^^^^^^^^^^------------------

  //--------------------View Bio function-------------------
  const ViewBio = async (e, user) => {
    e.preventDefault();

    const username = user;

    const res = await fetch("/api/createAcc/addView", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
  };
  //--------------------^^^^^^^^^^^^^-------------------

  const check = (item, userItem) => {
    if (item.length == 0 || item.indexOf(userItem.toLowerCase()) !== -1) {
      return 1;
    }
  };

  useEffect(() => {
    var filtered = data.filter((item) => {
      if (
        filterContext.ethnicities.length == 0 ||
        filterContext.ethnicities.indexOf(
          item.personal_ethnicity.toLowerCase()
        ) !== -1 ||
        (ethnicities_existing.indexOf(item.personal_ethnicity.toLowerCase()) ===
          -1 &&
          filterContext.ethnicities.indexOf("other") !== -1)
      ) {
        if (check(filterContext.bodytype, item.personal_build)) {
          if (check(filterContext.income, item.personal_income)) {
            if (check(filterContext.maritalStatus, item.personal_marital)) {
              if (check(filterContext.smoking, item.personal_smoke)) {
                if (check(filterContext.drinking, item.personal_drink)) {
                  if (check(filterContext.phone, item.personal_long)) {
                    if (
                      check(
                        filterContext.religiousness,
                        item.religion_religious
                      )
                    ) {
                      if (check(filterContext.sects, item.religion_sector)) {
                        if (
                          check(filterContext.reverts, item.religion_revert)
                        ) {
                          if (
                            check(filterContext.halals, item.religion_halal)
                          ) {
                            if (
                              check(filterContext.hijabs, item.religion_hijab)
                            ) {
                              if (
                                check(filterContext.prays, item.religion_pray)
                              ) {
                                if (
                                  item.distance != "Unknown" &&
                                  item.distance < rangeContext * 1
                                ) {
                                  return item;
                                } else if (item.distance == "Unknown") {
                                  return item;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    setFilteredData(filtered);
  }, [filterContext, data, rangeContext]);

  return (
    <div>
      <div className="top-container-search">
        <div className="top-left-search">
          <div className="search-heading-search">Search Results</div>
          <button
            className="map-show-search"
            onClick={(e) => {
              e.preventDefault();
              showMap(e, email);
            }}
          >
            {mapText}
          </button>
          {!locAccess && (
            <div className="map-error-search">Access to Location Denied :/</div>
          )}
        </div>
        <div className="top-right-search">
          <div className="select-container-right-search">
            <select className="select-top-search">
              <option>Sort By: Online</option>
              <option>Sort By: Age</option>
              <option>Sort By: ASC</option>
              <option>Sort By: DSC</option>
            </select>
            <select className="select-top2-search">
              <option>Per Page: 10</option>
              <option>Per Page: 15</option>
              <option>Per Page: 20</option>
            </select>
          </div>
        </div>
      </div>
      <div
        className="map-container-search"
        style={{
          height: mapVisible ? 500 : 0,
        }}
      >
        <div className="map-body-search">
          {isLoaded ? (
            <Map
              positions={mapData}
              center={mapCenter}
              display={mapVisible}
              zoom={zoom}
              people={data}
            />
          ) : null}
        </div>
      </div>
      <div className="bottom-container-search">
        {filteredData.map((userInfo) => (
          <div key={userInfo.id} className="result-parent-container-search">
            <div className="result-img-parent-search">
              <div className="img-container-search">
                <Image
                  src="/female.jpeg"
                  alt="default"
                  layout="responsive"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div className="result-right-parent-container">
              <div className="result-line1-container-search">
                <div>{userInfo.aboutme_looking}</div>
                <div className="active-text-search">
                  <div>active n years ago</div>
                </div>
              </div>
              <div className="result-line2-container-search">
                <div>{userInfo.username},</div>
                <div className="age-search">
                  {calculateAge(
                    userInfo.aboutme_year,
                    userInfo.aboutme_month,
                    userInfo.aboutme_day
                  )}
                </div>
                <div className="mini-seprator-search"></div>
                <div
                  className="heart-container-search"
                  onClick={() => setHeartClicked(!heartClicked)}
                >
                  {heartClicked ? <HeartClick /> : <ResultHeart />}
                </div>
                <div
                  className="heart-container-search"
                  onClick={(e) => {
                    setSelectedUserInfo(userInfo);
                    setShowMessage(true);
                  }}
                >
                  <Envelope />
                </div>
                {/* Shows Message Details */}
                {showMessage && (
                  <div className="msg-container-search">
                    <div className="msg-sub-search">
                      <div className="msg-heading-search">
                        <div className="msg-text-search">New Message</div>
                        <div className="close-msg-search">
                          <div
                            onClick={(e) => {
                              setShowMessage(false);
                            }}
                          >
                            X
                          </div>
                        </div>
                      </div>
                      <div className="divider-msg-search"></div>
                      <div className="msg-mini-container-search">
                        <div className="msg-mini-text-search">Message</div>
                        <textarea
                          placeholder="Enter your message here"
                          className="msg-input-search"
                          onChange={(e) => {
                            setMessageText(e.target.value);
                          }}
                        ></textarea>
                        <div className="send-msg-container-search">
                          <button
                            className="send-msg-search"
                            onClick={(e) => {
                              SendMessage(e, selectedUserInfo.email);
                              setShowMessage(false);
                            }}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* ^^^^^^^^^^^^^ */}
                <div className="heart-container-search">
                  <Camera />
                </div>
                <div className="heart-container-search">
                  <Stop />
                </div>
                <div className="heart-container-search">
                  <Excalim />
                </div>
                <div className="heart-container-search">
                  <Wali />
                </div>
                <div className="mini-seprator-search"></div>
                <button
                  className="view-bio-search"
                  onClick={(e) => {
                    setSelectedUserInfo(userInfo);
                    ViewBio(e, userInfo.username);
                    setViewBio(true);
                  }}
                >
                  View bio
                </button>
                {/* Shows Bio Details */}
                {viewBio && (
                  <div className="bio-container-search">
                    {console.log(
                      "data found on user:",
                      selectedUserInfo.username
                    )}
                    <div className="bio-sub-search">
                      <div className="bio-heading-search">
                        <div className="bio-text-search">Biography</div>
                        <div className="close-bio-search">
                          <div
                            onClick={(e) => {
                              setViewBio(false);
                            }}
                          >
                            X
                          </div>
                        </div>
                      </div>
                      <div className="divider-bio-search"></div>
                      <div className="bio-mini-container-search">
                        <div className="bio-mini-text-search">
                          A Little bit about me
                        </div>
                        <div className="bio-mini-text2-search">
                          {selectedUserInfo.aboutme_about}
                        </div>
                      </div>
                      <div className="bio-mini-container-search">
                        <div className="bio-mini-text-search">
                          What I am looking for
                        </div>
                        <div className="bio-mini-text2-search">
                          {selectedUserInfo.aboutme_looking}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* ^^^^^^^^^^^^^ */}
              </div>
              <div className="result-line3-container-search">
                <div>{userInfo.distance + " Km Away"}</div>
                <div className="mini-seprator-search"></div>
                <div className="distance-search">{userInfo.mosque}</div>
              </div>
              <div className="result-line4-container-search">
                <div>{userInfo.eduwork_profession} -</div>
                <div className="info-search">{userInfo.religion_sector} - </div>
                <div className="info-search">{userInfo.eduwork_subject} -</div>
                <div className="info-search">{userInfo.personal_height} -</div>
                <div className="info-search"> {userInfo.religion_pray}</div>
              </div>
              <div className="result-line5-container-search">
                <div>{userInfo.religion_halal} -</div>
                <div className="info-search"> {userInfo.personal_smoke} -</div>
                <div className="info-search"> {userInfo.personal_drink} -</div>
              </div>
              <div className="result-line5-container-search">
                <div> {userInfo.personal_marriage} -</div>
                <div className="info-search">{userInfo.personal_relocate}</div>
              </div>
              <div className="result-line5-container-search">
                <div>Annual Income: {userInfo.personal_income}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
