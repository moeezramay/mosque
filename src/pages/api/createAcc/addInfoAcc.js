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

    const result = await sql`
    UPDATE createAcc
    SET
      gender = ${content.gender},
      aboutme_location = ${content.aboutMe.location},
      aboutme_country = ${content.aboutMe.country},
      aboutme_day = ${content.aboutMe.day},
      aboutme_month = ${content.aboutMe.month},
      aboutme_year = ${content.aboutMe.year},
      aboutme_tag = ${content.aboutMe.tag},
      aboutme_about = ${content.aboutMe.about},
      aboutme_looking = ${content.aboutMe.looking},
      personal_citizen = ${content.personal.citizen},
      personal_origin = ${content.personal.origin},
      personal_relocate = ${content.personal.relocate},
      personal_income = ${content.personal.income},
      personal_marriage = ${content.personal.marriage},
      personal_marital = ${content.personal.marital},
      personal_children1 = ${content.personal.children1},
      personal_children2 = ${content.personal.children2},
      personal_living = ${content.personal.living},
      personal_height = ${content.personal.height},
      personal_build = ${content.personal.build},
      personal_smoke = ${content.personal.smoke},
      personal_drink = ${content.personal.drink},
      personal_disability = ${content.personal.disability},
      personal_long = ${content.personal.long},
      eduwork_education = ${content.eduwork.education},
      eduwork_subject = ${content.eduwork.subject},
      eduwork_profession = ${content.eduwork.profession},
      eduwork_job = ${content.eduwork.job},
      eduwork_language1 = ${content.eduwork.language1},
      eduwork_language2 = ${content.eduwork.language2},
      religion_religious = ${content.religion.religious},
      religion_sector = ${content.religion.sector},
      religion_hijab = ${content.religion.hijab},
      religion_beard = ${content.religion.beard},
      religion_revert = ${content.religion.revert},
      religion_halal = ${content.religion.halal},
      religion_pray = ${content.religion.pray},
      mosque = ${content.mosque},
      personal_ethnicity = ${content.personal.ethnicity},
      religon_quran = ${content.religion.quran}
    WHERE
      email = ${content.email}
  `;

    console.log("ttt", result);

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
