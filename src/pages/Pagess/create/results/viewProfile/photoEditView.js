import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
// import PictureProfile from "./picture";
import * as StackBlur from "stackblur-canvas";

export default function PhotoEditView({ data, routerQuery }) {
  const { push } = useRouter();
  const router = useRouter();

  const [t, i18n] = useTranslation("global");
  const [userInfo, setUserInfo] = useState([]);
  const [email, setEmail] = useState("");
  const [images, setImages] = useState([
    { imageUrl: null, isBlurred: false, backup: null, imageBase64: "" },
  ]);

  //----------Storing input data in state----------------
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const imageRefs = useRef([]);
  const [msg, setMsg] = useState("");
  const [prevImages, setPrevImages] = useState([]);
  const [access, setAccess] = useState(false);

  //-----------------^^^^^^^^^^--------------------------
  // const StackBlur = require("stackblur-canvas");

  useEffect(() => {
    console.log("routerQuery", routerQuery);
    const userInfoString = routerQuery.name;
    if (userInfoString) {
      try {
        const userInfoArray = JSON.parse(userInfoString);
        setUserInfo(userInfoArray);
        localStorage.setItem("currentNavOption", "search");
      } catch (error) {
        console.error("Error parsing userInfo:", error);
      }
    } else {
      console.error("userInfo is not defined in query parameters");
    }
  }, [routerQuery]);

  useEffect(() => {
    setEmail(userInfo.email);
    let tempAccess = false;
    var getImg = async () => {
      //Getting access first to see if the user has access to the images
      try {
        const res = await fetch("/api/interest/getAccessImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            viewed: userInfo.email,
            viewer: localStorage.getItem("email"),
          }),
        });
        const data1 = await res.json();
        console.log("Hello");
        if (data1.error) {
          console.log("Error: ", data1.error);
          setAccess(false);
        } else {
          console.log("Data1: ", data1.access);
          if (data1.access[0].status === "approved") {
            setAccess(true);
          } else if (
            data1.access[0].status === "" ||
            data1.access[0].status === "denied"
          ) {
            setAccess(false);
          }
        }
      } catch (error) {
        console.log("Error: ", error);
      }
      try {
        const res = await fetch("/api/update/getProfileImgPublic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userInfo.email,
          }),
        });
        const data = await res.json();
        if (data.error) {
          setImageUrl(null);
        } else {
          const updatedImages = data.images.map((imageData) => {
            return {
              imageUrl: imageData.image,
              isBlurred: imageData.privacy === "yes",
              backup: imageData.backup,
              imageBase64: "data:image/jpeg;base64," + imageData.image,
            };
          });
          setPrevImages(updatedImages);
          setImages(updatedImages);
        }
        // setLoading(true);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getImg();
  }, [userInfo]);

  const handleImageChange = (e) => {
    setMsg("");
    const files = e.target.files;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          let width = img.width;
          let height = img.height;

          if (width > 100 || height > 100) {
            if (width > height) {
              height *= 100 / width;
              width = 100;
            } else {
              width *= 100 / height;
              height = 100;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const resizedBase64 = canvas.toDataURL("image/jpeg");

          setImages((prevState) => [
            ...prevState,
            {
              imageUrl: resizedBase64,
              isBlurred: false,
              backup: resizedBase64,
              imageBase64: resizedBase64.split(",")[1],
            },
          ]);
        };

        img.src = reader.result;
      };
      console.log("Images: ", images);
      reader.readAsDataURL(file);
    });
  };

  //------------------UPLOAD DATA------------------

  const handleUpload = async (e) => {
    e.preventDefault();
    console.log("Requesting Images");
    try {
      const res = await fetch("/api/interest/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viewed: userInfo.email,
          viewer: localStorage.getItem("email"),
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log("Error: ", data.error);
        return;
      }
      alert("Private Images Requested");

      console.log("Data: ", data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  //------------------BLUR 1------------------

  const toggleBlur = (index) => {
    const imageUrlValue = images[index].imageUrl;
    const isBlurredValue = images[index].isBlurred;
    const backupValue = images[index].backup;

    if (imageUrlValue == null) {
      return;
    }

    setImages((prevState) => {
      const updatedImages = [...prevState];
      updatedImages[index] = {
        ...prevState[index],
        isBlurred: !isBlurredValue,
      };
      return updatedImages;
    });

    const imageRef = imageRefs.current[index];

    if (!imageRef) {
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 100;
    canvas.height = 100;

    ctx.drawImage(imageRef, 0, 0, 100, 100);

    if (!isBlurredValue) {
      canvas.remove();
      // Apply the blur effect if not already blurred
      StackBlur.canvasRGB(canvas, 0, 0, 100, 100, 10); // 10 is the blur radius
      const blurredImageUrl = canvas.toDataURL();
      const saveBlur = canvas.toDataURL("image/jpeg");

      setImages((prevState) => {
        const updatedImages = [...prevState];
        updatedImages[index] = {
          ...prevState[index],
          imageUrl: blurredImageUrl,
        };
        console.log("images", updatedImages);

        return updatedImages;
      });
    } else {
      setImages((prevState) => {
        const updatedImages = [...prevState];
        updatedImages[index] = {
          ...prevState[index],
          imageUrl: backupValue,
        };
        console.log("images", updatedImages);
        return updatedImages;
      });
    }
  };

  const handleImageRefLoaded = (index) => {
    const imageRef = imageRefs.current[index];
    // Do nothing if the imageRef is already set
    if (imageRef) return;

    // Set the imageRef once it's loaded
    imageRefs.current[index] = imageRef;
  };

  const handleDelete = async (index, deletePic) => {
    try {
      const res = await fetch("/api/update/deletePublicImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userInfo.email,
          image: deletePic,
        }),
      });
      if (!res.ok) {
        throw new Error("Error while deleting");
      }
      const data = await res.json();
      console.log("Data: ", data);
      alert("Image deleted successfully");
    } catch (error) {
      console.log("Error while deleting:", error);
    }
  };
  return (
    <div style={{ paddingBottom: "40px" }}>
      <div className="picture-container-basicEdit">
        <div>Profile Picture </div>
        <div className="img-container-basicEdit">
          <PictureProfile userInfo={userInfo} />
        </div>
      </div>
      <div className="public-contianer-photoEdit">
        {images.map((image, index) => (
          <div key={index}>
            {image.imageUrl && loading ? (
              <div>
                <canvas
                  ref={(ref) => (imageRefs.current[index] = ref)}
                  width={100}
                  height={100}
                  style={{
                    border: "1px solid black",
                    display: "none",
                  }}
                ></canvas>

                <img
                  ref={(ref) => (imageRefs.current[index] = ref)}
                  src={
                    access
                      ? image.backup || "/female.jpeg"
                      : image.imageUrl || "/female.jpeg"
                  }
                  width={100}
                  height={100}
                  alt=""
                  onLoad={() => handleImageRefLoaded(index)}
                />
              </div>
            ) : (
              image.imageUrl && (
                <div className="loader">
                  <div></div>
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {!access && (
        <button
          className="save-aboutEdit"
          onClick={(e) => {
            handleUpload(e);
          }}
        >
          Request Private
        </button>
      )}
    </div>
  );
}

//---------------OTHER FUNCTION---------------------

export function PictureProfile({ userInfo }) {
  // const StackBlur = require("stackblur-canvas");

  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isBlurred, setIsBlurred] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [backup, setBackup] = useState(null);
  const [uploadBlur, setUploadBlur] = useState(null);
  const [access, setAccess] = useState(false);

  useEffect(() => {
    setEmail(localStorage.getItem("currentUserViewed"));
    var getImg = async () => {
      try {
        const res = await fetch("/api/interest/getAccessImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            viewed: userInfo.email,
            viewer: localStorage.getItem("email"),
          }),
        });
        const data1 = await res.json();
        console.log("Hello");
        if (data1.error) {
          console.log("Error: ", data1.error);
          setAccess(false);
        } else {
          if (data1.access[0].status === "approved") {
            setAccess(true);
          } else if (
            data1.access[0].status === "" ||
            data1.access[0].status === "denied"
          ) {
            setAccess(false);
          }
        }
      } catch (error) {
        console.log("Error: ", error);
      }
      try {
        const res = await fetch("/api/createAcc/getProfileImg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("currentUserViewed"),
          }),
        });
        const data = await res.json();
        if (data.error) {
          console.log("Error: ", data.error);

          setImageUrl(null);
        } else {
          setImageUrl("data:image/jpeg;base64," + data.image);
          setBackup("data:image/jpeg;base64," + data.backup);
          if (data.privacy === "yes") {
            setIsBlurred(true);
          }
          //Adso Set the image to the state
          setImage(data.image);
        }
        setLoading(true);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getImg();
  }, []);

  const toggleBlur = () => {
    if (imageUrl == null) {
      return;
    }

    setIsBlurred(!isBlurred); // Toggle blur state = true

    const canvas = document.createElement("canvas"); // Create a new canvas element
    const ctx = canvas.getContext("2d");

    // Set canvas width and height
    canvas.width = 100;
    canvas.height = 100;

    // Draw the image onto the canvas
    ctx.drawImage(imageRef.current, 0, 0, 100, 100);

    if (isBlurred === false) {
      canvas.remove();
      // Apply the blur effect if not already blurred
      StackBlur.canvasRGB(canvas, 0, 0, 100, 100, 10); // 10 is the blur radius
      const blurredImageUrl = canvas.toDataURL();
      const saveBlur = canvas.toDataURL("image/jpeg");
      setUploadBlur(saveBlur.split(",")[1]);
      setImageUrl(blurredImageUrl);
    } else {
      setImageUrl(backup);
    }
  };
  return (
    <div>
      {loading ? (
        <div>
          <canvas
            ref={canvasRef}
            width={100}
            height={100}
            style={{
              border: "1px solid black",
              display: "none",
            }}
          ></canvas>

          <img
            ref={imageRef}
            src={access ? backup || "/female.jpeg" : imageUrl || "/female.jpeg"}
            width={100}
            height={100}
            alt=""
          />
        </div>
      ) : (
        <div className="loader">
          <div></div>
        </div>
      )}
    </div>
  );
}
