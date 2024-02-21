import { useTranslation } from "react-i18next";

export default function Footer() {
  const [t, i18n] = useTranslation("global");

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e);
  };

  return (
    <div>
      <div className="parent-container-footer">
        <div className="change-language-section-footer">
          <div className="change-language-head-footer">
            {t("footer.language")}
          </div>
          <div>
            <span
              className="change-language-footer"
              onClick={() => handleLanguageChange("en")}
            >
              English |
            </span>
            <span
              className="change-language-footer"
              onClick={() => handleLanguageChange("es")}
            >
              {" "}
              español |
            </span>
            <span
              className="change-language-footer"
              onClick={() => handleLanguageChange("fr")}
            >
              {" "}
              Français |
            </span>
            <span
              className="change-language-footer"
              onClick={() => handleLanguageChange("de")}
            >
              {" "}
              Deutsch |
            </span>
            <span
              className="change-language-footer"
              onClick={() => handleLanguageChange("ru")}
            >
              {" "}
              русский |
            </span>
            <span
              className="change-language-footer"
              onClick={() => handleLanguageChange("it")}
            >
              {" "}
              Italiano |
            </span>
            <span
              className="change-language-footer"
              onClick={() => handleLanguageChange("pt")}
            >
              {" "}
              Português |
            </span>
            <span
              className="change-language-footer"
              onClick={() => handleLanguageChange("fi")}
            >
              {" "}
              Suomi |
            </span>
            <span
              className="change-language-footer"
              onClick={() => handleLanguageChange("nl")}
            >
              {" "}
              Nederlands
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
