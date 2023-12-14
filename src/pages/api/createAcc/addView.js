import excuteQuery from "@/lib/db";

const dotenv = require("dotenv");
dotenv.config();

//Function To increase views when clicking view bio button
export default async function AddInfoAcc(req, res) {
  try {
    console.log("Content: ", req.body);
    const content = req.body;
    if (!content) {
      console.log("content empty");
      res.status(400).json({ error: "Content cannot be empty on addInfoAcc." });
      return;
    }
    const username = content.username;

    const updateQuery = `
  UPDATE createAcc
  SET views = COALESCE(views, 0) + 1
  WHERE username = ?;
`;
    const values = [username];

    const result = await excuteQuery({
      query: updateQuery,
      values,
    });
    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
