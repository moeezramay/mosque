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
        {/* <div className="others-parent-footer">
          <div className="legal-container-parent-footer">
            <div className="legal-container-1-footer">
              <div className="legal-heading-footer">
                {t("footer.legalHead1")}
              </div>
              <a
                href="https://www.cupidmedia.com/our-story/"
                className="legal-para-1-footer"
              >
                {t("footer.legalPara1")}
              </a>
              <a
                href="https://www.cupidmedia.com/our-sites/"
                className="legal-para-2-footer"
              >
                {t("footer.legalPara2")}
              </a>
              <a
                href="https://www.cupidmedia.com/"
                className="legal-para-2-footer"
              >
                {t("footer.legalPara3")}
              </a>
              <a
                href="https://www.cupidmedia.com/affiliates/"
                className="legal-para-2-footer"
              >
                {t("footer.legalPara4")}
              </a>
            </div>
            <div className="legal-container-2-footer">
              <div className="legal-heading-footer">
                {t("footer.legalHead2")}
              </div>
              <a
                href="https://www.muslima.com/en/general/success"
                className="legal-para-1-footer"
              >
                {t("footer.legalPara5")}
              </a>
              <a
                href="https://www.muslima.com/en/general/contact"
                className="legal-para-2-footer"
              >
                {t("footer.legalPara6")}
              </a>
              <a
                href="http://www.onlinedatingsafetytips.com/"
                className="legal-para-2-footer"
              >
                {t("footer.legalPara7")}
              </a>
              <a
                href="https://www.muslima.com/en/general/sitemap"
                className="legal-para-2-footer"
              >
                {t("footer.legalPara8")}
              </a>
            </div>
            <div className="legal-container-2-footer">
              <div className="legal-heading-footer">
                {t("footer.legalHead3")}
              </div>
              <a
                href="https://www.muslima.com/en/general/termsofuse"
                className="legal-para-1-footer"
              >
                {t("footer.legalPara9")}
              </a>
              <a
                href="https://www.muslima.com/en/general/privacystatement"
                className="legal-para-2-footer"
              >
                {t("footer.legalPara10")}
              </a>
              <a
                href="https://www.muslima.com/en/general/paymentRefund"
                className="legal-para-2-footer"
              >
                {t("footer.legalPara11")}
              </a>
              <a
                href="https://www.muslima.com/en/general/privacystatement#cookiepolicy"
                className="legal-para-2-footer"
              >
                {t("footer.legalPara12")}
              </a>
              <a
                href="https://www.muslima.com/en/general/communityguidelines"
                className="legal-para-2-footer"
              >
                {t("footer.legalPara13")}
              </a>
            </div>
            <div className="legal-container-2-footer">
              <div className="legal-heading-2-footer">
                {t("footer.legalHead4")}
              </div>
            </div>
          </div>
          <div className="mobile-footer">
            <div className="copyrights-parent-footer">
              <div>{t("footer.rights")}</div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
