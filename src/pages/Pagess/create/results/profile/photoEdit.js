import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import PictureProfile from "./picture";
import * as StackBlur from "stackblur-canvas";

export default function PhotoEdit() {
  const { push } = useRouter();
  const [t, i18n] = useTranslation("global");

  // const StackBlur = require("stackblur-canvas");

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

  //-----------------^^^^^^^^^^--------------------------

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
    var getImg = async () => {
      try {
        const res = await fetch("/api/update/getProfileImgPublic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
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
  }, []);

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
    console.log("Handle Upload");

    // Filter out empty images
    const updatedImages = images.filter((image) => {
      // Check if the imageUrl of the current image matches any in arrays
      const match = prevImages.some((arr) => arr.imageUrl === image.imageUrl);
      // Return false to remove the image if there's a match
      return !match;
    });

    const imagePrivacyPairs = updatedImages.map((image) => {
      if (image.isBlurred == false || !image.uploadBlur) {
        return {
          picture: image.imageUrl,
          privacy: "no",
          backup: image.backup,
        };
      } else {
        return {
          picture: image.imageUrl,
          privacy: "yes",
          backup: image.backup,
        };
      }
    });
    console.log("Image Privacy Pairs: ", images, prevImages);
    if (
      imagePrivacyPairs.length === 0 ||
      imagePrivacyPairs[0].picture === null
    ) {
      alert("No image to upload / Cannot upload similar picture");
      return;
    }

    try {
      const res = await fetch("/api/update/setProfileImgPublic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("email"),
          type: "public",
          image: imagePrivacyPairs,
        }),
      });
      const data = await res.json();
      console.log("Data: ", data);
      if (data.error) {
        setMsg("Error: " + data.error);
      } else {
        alert("Image uploaded successfully");
        setMsg("Image uploaded successfully");
      }
    } catch (error) {
      console.log("Error: ", error);
      setMsg("Error: Image not found");
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
          email: localStorage.getItem("email"),
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
        <div>Profile Picture</div>
        <div className="img-container-basicEdit">
          <PictureProfile />
        </div>
      </div>
      <div className="public-contianer-photoEdit">
        <input
          id=""
          type="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={handleImageChange}
        />
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
                  src={image.imageUrl || "/female.jpeg"}
                  width={100}
                  height={100}
                  alt=""
                  onLoad={() => handleImageRefLoaded(index)}
                />
                <div
                  className="hide-btn-picture"
                  onClick={() => toggleBlur(index)}
                >
                  Hide
                </div>
                <div
                  className="hide-btn-picture"
                  style={{ marginTop: "10px" }}
                  onClick={() => handleDelete(index, image.imageUrl)}
                >
                  Delete
                </div>
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

      <button
        className="save-aboutEdit"
        onClick={(e) => {
          handleUpload(e);
        }}
      >
        Save Changes
      </button>
    </div>
  );
}