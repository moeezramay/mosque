import NavBar from "../navBar/nav";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Google from "../../../../public/googlesvg";
import Apple from "../../../../public/applesvg";
import Footer from "../footer/footer";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [t, i18n] = useTranslation("global");

  useEffect(() => {
    const GetResponse = async () => {
      console.log("Api call sent!");

      const res = await fetch("/api/createAcc/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify("hello"),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error on resoponse:", errorMessage.error);
        return;
      } else {
        console.log("Server connected!");
      }
    };
    GetResponse();
  }, []);

  return (
    <div style={{ height: "auto" }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="header-home-parent">
        <div className="navbar-parent-home">
          <NavBar />
        </div>
        <div className="image-home">
          <Image src="/homepage.jpg" alt="home" layout="fill" />
        </div>
        <div className="title-container-home">
          <div className="title-img-home">
            <div className="title-img-sub-home">
              <div>{t("img.title1")}</div>
              <div className="title-partner-home">{t("img.title2")}</div>
              <div className="img-subtitle-home">{t("img.subtitle")}</div>
              <button className="img-btn-home">{t("img.btn")}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-img-home">
        <div className="img-subtext-container-home">
          <div className="red-ball-home"></div>
          <div className="img-subtext-home">{t("img.subtext1")}</div>
        </div>
        <div className="img-subtext-container-home">
          <div className="red-ball-home"></div>
          <div className="img-subtext-home">{t("img.subtext2")}</div>
        </div>
        <div className="img-subtext-container-home">
          <div className="red-ball-home"></div>
          <div className="img-subtext-home">{t("img.subtext3")}</div>
        </div>
      </div>
      <div className="img-footer-bar-home">
        <div>Muslim Women | Muslim Men</div>
      </div>
      <div className="introduction-section-parent-home">
        <div className="intro-container-home">
          <div className="intro-heading-home">{t("intro.heading1")}</div>
          <div className="intro-paragraph-home">{t("intro.para1")}</div>
        </div>
        <div className="intro-container-home">
          <div className="intro-heading-home">{t("intro.heading2")}</div>
          <div className="intro-paragraph-home">{t("intro.para2")}</div>
          <div className="intro-paragraph-home">{t("intro.para3")}</div>
        </div>
        <div className="intro-container-home">
          <div className="intro-heading-home">{t("intro.heading3")}</div>
          <div className="intro-paragraph-home">{t("intro.para4")}</div>
          <div className="intro-paragraph-home">{t("intro.para5")}</div>
        </div>
      </div>
      <div className="results-section-home">
        <div className="results-heading-home">{t("results.heading")}</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="displayResults-home">
            <div className="results-container-home">
              <div className="results-img-home">
                <Image
                  src="/result1.jpg"
                  alt="results"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="home-con">
                <div className="results-story-home">
                  "{t("results.story1")}"
                </div>
                <div className="results-name-home">{t("results.name1")}</div>
              </div>
            </div>
            <div className="results-container-home">
              <div className="results-img-home">
                <Image
                  src="/result2.jpg"
                  alt="results"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="home-con">
                <div className="results-story-home">
                  "{t("results.story2")}"
                </div>
                <div className="results-name-home">{t("results.name2")}</div>
              </div>
            </div>
            <div className="results-container-home">
              <div className="results-img-home">
                <Image
                  src="/result3.jpg"
                  alt="results"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="home-con">
                <div className="results-story-home">
                  "{t("results.story3")}"
                </div>
                <div className="results-name-home">{t("results.name3")}</div>
              </div>
            </div>
            <div className="results-container-home">
              <div className="results-img-home">
                <Image
                  src="/result4.jpg"
                  alt="results"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="home-con">
                <div className="results-story-home">
                  "{t("results.story4")}"
                </div>
                <div className="results-name-home">{t("results.name4")}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="results-button-container-home">
          <button className="results-button-home">{t("results.button")}</button>
        </div>
      </div>
      <div className="works-section-home">
        <div className="works-title-home">{t("works.heading")}</div>
        <div className="works-sub-home">{t("works.sub")}</div>
        <div className="svg-container-home">
          <div className="create-profile-svg-home">
            {/* Add svg here */}
            <div className="first-svg-title-home">{t("works.step1")}</div>
            <div className="svg-sub-container-home">
              <div className="first-svg-sub-home">{t("works.para1")}</div>
            </div>
          </div>
          <div className="create-profile-svg-home">
            {/* Add svg here */}
            <div className="first-svg-title-home">{t("works.step2")}</div>
            <div className="svg-sub-container-home">
              <div className="first-svg-sub-home">{t("works.para2")}</div>
            </div>
          </div>
          <div className="create-profile-svg-home">
            {/* Add svg here */}
            <div className="first-svg-title-home">{t("works.step3")}</div>
            <div className="svg-sub-container-home">
              <div className="first-svg-sub-home">{t("works.para3")}</div>
            </div>
          </div>
        </div>
        <div className="works-button-container-home">
          <button className="works-button-home">{t("works.button")}</button>
        </div>
      </div>
      <div className="bottom-image-section-home">
        <div className="bottom-image-home">
          <Image src="/footerimage.jpg" alt="bottom" layout="fill" />
        </div>
        <div className="download-section-home">
          <div className="download-container-home">
            <div className="download-subContainer-home">
              <div className="download-heading-home">
                {t("download.heading")}
              </div>
              <div className="google-svg-home">
                <Google />
              </div>
              <div className="apple-svg-home">
                <Apple />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
