import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button'; // Assuming you are using Material-UI
import styles from './HomeHeader.module.css'; // Import your CSS file
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const HomeHeader = () => {
return (
    <div className={styles.header}>
<div className={styles.header2}>
<div className={styles.rectangleParent}>
  <img className={styles.frameChild} alt="" src="/rectangle-8@2x.png" />
  <b className={styles.herosPetStoreContainer}>
    <p className={styles.herosPet}>Hero’s Pet</p>
    <p className={styles.herosPet}>Store</p>
  </b>
</div>
<div className={styles.homeParent}>
<Link className={styles.home} to="/">
    Home
  </Link>
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
  name="Login"
  size="medium"
  variant="outlined"
  startIcon={<ExitToAppIcon />}
  href="/Login"
  sx={{ borderRadius: "0px 0px 0px 0px", width: 166, height: 65 }}
>
  Login
</Button>
</div>
</div>
  );
};

export default HomeHeader;