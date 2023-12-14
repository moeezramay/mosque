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
        <div className="others-parent-footer">
          <div className="visit-other-container-footer">
            <div className="visit-other-heading-footer">
              {t("footer.visit")}
            </div>
            <div className="links-container-footer">
              {/* Container 1 */}
              <div className="container-1-footer">
                <a
                  href="https://www.afrointroductions.com"
                  className="links-footer"
                >
                  AfroIntroductions.com
                </a>
                <a href="https://www.asiandating.com/" className="links-footer">
                  AsianDating.com
                </a>
                <a href="https://www.bbwcupid.com/" className="links-footer">
                  BBWCupid.com
                </a>
                <a href="https://www.blackcupid.com/" className="links-footer">
                  BlackCupid.com
                </a>
                <a href="https://www.brazilcupid.com/" className="links-footer">
                  BrazilCupid.com
                </a>
                <a
                  href="https://www.cambodiancupid.com/"
                  className="links-footer"
                >
                  CambodianCupid.com
                </a>
                <a
                  href="https://www.caribbeancupid.com/"
                  className="links-footer"
                >
                  CaribbeanCupid.com
                </a>
              </div>
              {/* Container 2 */}
              <div className="container-2-footer">
                <a
                  href="https://www.chinalovecupid.com/"
                  className="links-footer"
                >
                  ChinaLoveCupid.com
                </a>
                <a
                  href="https://www.colombiancupid.com/"
                  className="links-footer"
                >
                  ColombianCupid.com
                </a>
                <a
                  href="https://www.dominicancupid.com/"
                  className="links-footer"
                >
                  DominicanCupid.com
                </a>
                <a href="https://www.elitecupid.com/" className="links-footer">
                  EliteCupid.com
                </a>
                <a href="https://www.eurocupid.com/" className="links-footer">
                  EuroCupid.com
                </a>
                <a
                  href="https://www.filipinocupid.com/"
                  className="links-footer"
                >
                  FilipinoCupid.com
                </a>
                <a
                  href="https://www.hongkongcupid.com/"
                  className="links-footer"
                >
                  HongKongCupid.com
                </a>
              </div>
              {/* Container 3 */}
              <div className="container-2-footer">
                <a href="https://www.indiancupid.com/" className="links-footer">
                  IndianCupid.com
                </a>
                <a
                  href="https://www.indonesiancupid.com/"
                  className="links-footer"
                >
                  IndonesianCupid.com
                </a>
                <a
                  href="https://www.internationalcupid.com/"
                  className="links-footer"
                >
                  InternationalCupid.com
                </a>
                <a
                  href="https://www.interracialcupid.com/"
                  className="links-footer"
                >
                  InterracialCupid.com
                </a>
                <a href="https://www.japancupid.com/" className="links-footer">
                  JapanCupid.com
                </a>
                <a href="https://www.kenyancupid.com/" className="links-footer">
                  KenyaCupid.com
                </a>
                <a href="https://www.koreancupid.com/" className="links-footer">
                  KoreanCupid.com
                </a>
              </div>
              {/* Container 4*/}
              <div className="container-2-footer">
                <a href="https://www.ukrainedate.com/" className="links-footer">
                  UkranianDate.com
                </a>
                <a
                  href="https://www.vietnamcupid.com/"
                  className="links-footer"
                >
                  VietnamCupid.com
                </a>
              </div>
            </div>
          </div>
          <div className="legal-container-parent-footer">
            {/* Company Legal Section */}
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
              {/*  Legal Section */}
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
              {/*  Others Section */}
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
        </div>
      </div>
    </div>
  );
}
