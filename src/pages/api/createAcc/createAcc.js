import excuteQuery from "@/lib/db";

const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

const KEY = "safasfgasgasasvasdfva";

//-------------------Aes Encryption-------------------------->

const crypto = require("crypto");

const secretKey = Buffer.from(process.env.SECRET_KEY, "hex");

const keyBuffer = Buffer.from(process.env.SECRET_KEY, "hex");

const iv = Buffer.from(process.env.SECRET_IV, "hex");

// Function to encrypt data using AES (Advanced Encryption Standard) encryption
function encryptData(data, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);

  let encryptedData =
    cipher.update(data, "utf8", "base64") + cipher.final("base64");
  return encryptedData;
}

//----------------^^^^^^^^^^^^^^^^^^^^^^^^^----------------->

//---------------Create Account-------------------------->
export default async function CreateAccount(req, res) {
  try {
    const content = req.body;
    console.log("content", content);

    if (!content) {
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    const email = content.email;
    console.log("email", email);

    const password = content.password;
    console.log("pass", password);

    const encryptedPassword = encryptData(password, secretKey, iv);
    console.log("encryptedPassword", encryptedPassword);

    const fullName = content.firstName + " " + content.lastName;
    console.log("fullName", fullName);

    try {
      const result = await excuteQuery({
        query:
          "INSERT INTO createacc(email, password, username) VALUES(?, ?, ?)",
        values: [email, encryptedPassword, fullName],
      });
    } catch (error) {
      return res.status(500).json({ error: "Error in query" });
    }

    if (!result) {
      return res.status(500).json({ error: "Error in query" });
    }

    console.log("ttt", result);
    res.json({
      message: content.email,
      name: fullName,
      token: jwt.sign(
        {
          email: content.email,
          name: fullName,
        },
        KEY
      ),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
