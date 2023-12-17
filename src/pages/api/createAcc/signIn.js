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

// Function to decrypt data using AES (Advanced Encryption Standard)
function decryptData(encryptedData, key, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decryptedData =
    decipher.update(encryptedData, "base64", "utf8") + decipher.final("utf8");
  return decryptedData;
}

//----------------^^^^^^^^^^^^^^^^^^^^^^^^^----------------->

//---------------SignIn Account-------------------------->
export default async function SignIn(req, res) {
  try {
    const content = req.body;

    console.log("content: ", content);
    if (!content) {
      console.log("content empty");
      res.status(400).json({ error: "Content cannot be empty on sign in." });
      return;
    }
    const email = content.email;
    const password = content.password;

    const updateQuery = `
    SELECT *
    FROM createAcc
    WHERE email = ?;
    `;
    const values = [email];

    const result = await excuteQuery({
      query: updateQuery,
      values,
    });

    console.log("result: ", result);

    const user = result;

    console.log("Username: ", user[0].username);

    const decryptedPassword = decryptData(user[0].password, keyBuffer, iv);

    if (password !== decryptedPassword) {
      res.status(400).json({ error: "Wrong password." });
    }

    const token = jwt.sign({ id: user.id }, KEY);

    res.json({
      token,
      email: user[0].email,
      name: user[0].username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}