import { useEffect, useState } from "react";
import NextImage from "next/image";

export default function PictureProfile() {
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    setEmail(localStorage.getItem("email"));
    var getImg = async () => {
      try {
        const res = await fetch("/api/createAcc/getProfileImg", {
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
          setImageUrl("data:image/jpeg;base64," + data.image);
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
  const handleImageChange = (e) => {
    setMsg("");
    const file = e.target.files[0];
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
        setImageUrl(resizedBase64);
        setImageBase64(resizedBase64.split(",")[1]);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };
  const handleUpload = async () => {
    setMsg("Updating.....");
    if (imageBase64 != "" && loading && email && email != "") {
      try {
        const res = await fetch("/api/createAcc/setProfileImg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, image: imageBase64 }),
        });
        const data = await res.json();
        console.log("Data: ", data);
        if (data.error) {
          setMsg("Error: " + data.error);
        } else {
          setMsg("Image uploaded successfully");
        }
      } catch (error) {
        console.log("Error: ", error);
        setMsg("Error: Image not found");
      }
    } else {
      console.log("Image not found");
      setMsg("Error: Image not found");
    }
  };
  return (
    <div>
      {loading ? (
        <NextImage
          src={imageUrl ? imageUrl : "/female.jpeg"}
          width={100}
          height={100}
          style={{
            border: "1px solid black",
          }}
          alt=""
        />
      ) : (
        <div className="loader">
          <div></div>
        </div>
      )}
      {loading && (
        <input
          className="profile-select-input"
          type="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={handleImageChange}
        />
      )}

      <button onClick={handleUpload} className="profile-add-button">
        Set Image
      </button>
      <div>{msg}</div>
    </div>
  );
}
