import { FunctionComponent, useState } from "react";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";

const Login: FunctionComponent = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={styles.login}>
      <div className={styles.loginChild} />
      <div className={styles.loginItem} />
      <div className={styles.loginInner} />
      <TextField
        className={styles.rectangleTextfield}
        color="primary"
        name="Email"
        label="Email Address"
        required={true}
        variant="outlined"
        type="email"
        sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "305px" }}
      />
      <TextField
        className={styles.loginChild1}
        color="primary"
        name="Password"
        label="Password"
        required={true}
        variant="outlined"
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleShowPasswordClick}
                aria-label="toggle password visibility"
              >
                <Icon>{showPassword ? "visibility_off" : "visibility"}</Icon>
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "305px" }}
      />
      <Button
        className={styles.frameButton}
        disableElevation={true}
        color="secondary"
        name="Dashboard"
        size="small"
        variant="contained"
        href="/dashboard"
        sx={{ borderRadius: "0px 0px 0px 0px", width: 194, height: 52 }}
      >
        Login now
      </Button>
      <b className={styles.login1}>Login</b>
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
      <img className={styles.rectangleIcon} alt="" src="/rectangle-19@2x.png" />
    </div>
  );
};

export default Login;
