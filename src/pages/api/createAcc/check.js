import excuteQuery from "@/lib/db";

const dotenv = require("dotenv");
dotenv.config();

//Function To increase views when clicking view bio button
export default async function Check(req, res) {
  try {
    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
