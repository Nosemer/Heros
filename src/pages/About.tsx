import { FunctionComponent } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./About.module.css";

const About: FunctionComponent = () => {
  return (
    <div className={styles.about}>
      <div className={styles.aboutChild} />
      <img className={styles.aboutItem} alt="" src="/rectangle-3@2x.png" />
      <div className={styles.header}>
        <div className={styles.rectangleParent}>
          <img className={styles.frameChild} alt="" src="/rectangle-8@2x.png" />
          <b className={styles.herosPetStoreContainer}>
            <p className={styles.herosPet}>Hero’s Pet</p>
            <p className={styles.herosPet}>Store</p>
          </b>
        </div>
        <div className={styles.homeParent}>
          <a className={styles.home}>Home</a>
          <Link className={styles.about1} to="/about">
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
      <b className={styles.herosPetStoreContainer1}>
        <p className={styles.herosPet}>&nbsp;</p>
        <p className={styles.herosPet}>
          Heros Pet Store was established on March 31, 2023, with the mission of
          providing high-quality pet care and services to the local community.
          Founded by passionate pet lover Arjay Jovero Guillermo, the store was
          born out of his deep love for his furry companion dog, Hero, and his
          desire to extend that love and care to other pets. This intimate
          relationship served as the foundation and the reason why Heros Pet
          Store will celebrate its founding anniversary on March 31, 2024, and
          inspired Arjay to establish a secure haven where owners and their dogs
          could celebrate and deepen their bond. The company's significant
          success and growing popularity in their community, where they have
          gained loyal customers who want their pets to be well-treated. This
          critical success, because of their love of pets, was evidence of the
          growing respect and admiration for their company in the local
          community.
        </p>
        <p className={styles.herosPet}>&nbsp;</p>
        <p className={styles.herosPet}>
          At Heros Pet Store, our mission is to enrich the lives of pets and
          their owners by providing quality products, expert grooming services,
          and individual care. We strive to foster a community where pets
          thrive, and families enjoy their company. Heros Pet Store aims to be
          the best destination for pet owners seeking quality pet care services.
          They see a future in which every pet and their family receive
          customized attention, high-quality goods, and professional advice to
          foster lifetime ties to their client and their pet. Through our
          perseverance in being the best pet store for every pet that needs us,
          we hope to set the bar for excellence in the pet industry and inspire
          others to prioritize the well-being and happiness of pets. Heros Pet
          Store is more than just a retail store; it is a testament to the
          continuing bond between humans and animals. With a dedicated team,
          commitment to quality, and passion for pets, the store aims to be a
          trusted partner in every pet's journey. Whether it's grooming
          services, premium pet food, or expert advice, Heros Pet Store is here
          to serve the needs of both pets and the families that love them.
        </p>
      </b>
      <b className={styles.herosPetStore1}>Heros Pet Store Background</b>
      <img className={styles.aboutInner} alt="" src="/rectangle-6@2x.png" />
      <img className={styles.rectangleIcon} alt="" src="/rectangle-7@2x.png" />
      <b className={styles.ourGoalIsContainer}>
        <p className={styles.herosPet}>
          Our goal is to be your community's ultimate pet haven, where every
          wag, chirp, and purr finds its home sweet home. From tailoring
          personalized pet care to providing a diverse range of premium
          products, we're committed to being your trusted companion on every
          step of your pet parenting journey. Your pet's happiness is our
          passion, and we're here to make tails wag and hearts sing. Welcome to
          our pet paradise!.
        </p>
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
        <div className={styles.herosPetStore2}>Heros Pet Store </div>
      </div>
    </div>
  );
};

export default About;
