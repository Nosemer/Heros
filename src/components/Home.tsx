import { FunctionComponent } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home: FunctionComponent = () => {
  return (
    <a className={styles.home}>
      <div className={styles.homeChild} />
      <img className={styles.homeItem} alt="" src="/rectangle-3@2x.png" />
      <div className={styles.header}>
        <div className={styles.rectangleParent}>
          <img className={styles.frameChild} alt="" src="/rectangle-8@2x.png" />
          <b className={styles.herosPetStoreContainer}>
            <p className={styles.herosPet}>Hero’s Pet</p>
            <p className={styles.herosPet}>Store</p>
          </b>
        </div>
        <div className={styles.homeParent}>
          <a className={styles.home1}>Home</a>
          <Link className={styles.about} to="/about">
            About
          </Link>
          <a
            className={styles.contact}
            href="https://www.facebook.com/messages/t/109817815396558"
            target="_blank"
          >
            Contact
          </a>
        </div>
        <Button
          className={styles.headerChild}
          disableElevation={true}
          color="primary"
          name="Login"
          size="medium"
          variant="outlined"
          href="/login"
          sx={{ borderRadius: "0px 0px 0px 0px", width: 166, height: 65 }}
        >
          Login
        </Button>
      </div>
      <div className={styles.letsGoWrapper}>
        <b className={styles.letsGo}>Let’s Go</b>
      </div>
      <b className={styles.petStore}>Pet store</b>
      <b className={styles.whereEveryTail}>
        Where every tail wags and every purr finds its purr-fect match!' It's
        catchy and emphasizes the joy pets bring.
      </b>
      <div className={styles.component1}>
        <div className={styles.component1Child} />
        <Link className={styles.aboutUs} to="/about">
          About us
        </Link>
        <a
          className={styles.contactUs}
          href="https://www.facebook.com/messages/t/109817815396558"
          target="_blank"
        >
          Contact us
        </a>
        <b className={styles.contactUs1}>Contact us</b>
        <img className={styles.image1Icon} alt="" src="/image-1@2x.png" />
        <div className={styles.arjayJoveroGuillermo}>
          Arjay Jovero Guillermo
        </div>
        <img className={styles.image2Icon} alt="" src="/image-2@2x.png" />
        <div className={styles.div}>0915 633 8960</div>
        <img className={styles.image3Icon} alt="" src="/image-3@2x.png" />
        <div className={styles.herosPetStore}>Heros Pet Store </div>
      </div>
      <img className={styles.homeInner} alt="" src="/rectangle-6@2x.png" />
      <img className={styles.rectangleIcon} alt="" src="/rectangle-6@2x.png" />
    </a>
  );
};

export default Home;
