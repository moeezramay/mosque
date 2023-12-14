import excuteQuery from "@/lib/db";

const dotenv = require("dotenv");
dotenv.config();

//Function to add all info after account is created
export default async function AddInfoAcc(req, res) {
  try {
    const content = req.body;
    console.log("content email new: ", content.gender);
    if (!content) {
      console.log("content empty");
      res.status(400).json({ error: "Content cannot be empty on addInfoAcc." });
      return;
    }
    const updateQuery = `
    UPDATE createAcc
    SET
      gender = ?,
      aboutme_location = ?,
      aboutme_country = ?,
      aboutme_day = ?,
      aboutme_month = ?,
      aboutme_year = ?,
      aboutme_tag = ?,
      aboutme_about = ?,
      aboutme_looking = ?,
      personal_citizen = ?,
      personal_origin = ?,
      personal_relocate = ?,
      personal_income = ?,
      personal_marriage = ?,
      personal_marital = ?,
      personal_children1 = ?,
      personal_children2 = ?,
      personal_living = ?,
      personal_height = ?,
      personal_build = ?,
      personal_smoke = ?,
      personal_drink = ?,
      personal_disability = ?,
      personal_long = ?,
      eduwork_education = ?,
      eduwork_subject = ?,
      eduwork_profession = ?,
      eduwork_job = ?,
      eduwork_language1 = ?,
      eduwork_language2 = ?,
      religion_religious = ?,
      religion_sector = ?,
      religion_hijab = ?,
      religion_beard = ?,
      religion_revert = ?,
      religion_halal = ?,
      religion_pray = ?,
      mosque = ?,
      personal_ethnicity = ?,
      religon_quran = ?
    WHERE
      email = ?;
  `;

    const values = [
      content.gender,
      content.aboutMe.location,
      content.aboutMe.country,
      content.aboutMe.day,
      content.aboutMe.month,
      content.aboutMe.year,
      content.aboutMe.tag,
      content.aboutMe.about,
      content.aboutMe.looking,
      content.personal.citizen,
      content.personal.origin,
      content.personal.relocate,
      content.personal.income,
      content.personal.marriage,
      content.personal.marital,
      content.personal.children1,
      content.personal.children2,
      content.personal.living,
      content.personal.height,
      content.personal.build,
      content.personal.smoke,
      content.personal.drink,
      content.personal.disability,
      content.personal.long,
      content.eduwork.education,
      content.eduwork.subject,
      content.eduwork.profession,
      content.eduwork.job,
      content.eduwork.language1,
      content.eduwork.language2,
      content.religion.religious,
      content.religion.sector,
      content.religion.hijab,
      content.religion.beard,
      content.religion.revert,
      content.religion.halal,
      content.religion.pray,
      content.mosque,
      content.personal.ethnicity,
      content.religion.quran,
      content.email,
    ];

    const result = await excuteQuery({
      query: updateQuery,
      values,
    });

    console.log("ttt", result);

    console.log("SQL Query:", updateQuery);
    console.log("SQL Values:", values);
    console.log("Result:", result);

    if (result.error) {
      console.log("Database Error:", result.error);
    }
    res.json({
      username: "Info Added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
