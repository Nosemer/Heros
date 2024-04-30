import { FunctionComponent, useState } from "react";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./Admin.module.css";

const Admin: FunctionComponent = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={styles.admin}>
      <div className={styles.adminChild} />
      <div className={styles.sidenavigation}>
        <div className={styles.sidenavigationChild} />
        <div className={styles.dashboardParent}>
          <a className={styles.dashboard}>Dashboard</a>
          <Link className={styles.category} to="/admin">
            <p className={styles.herosPet}>Admin</p>
          </Link>
          <Link className={styles.category} to="/category">
            Category
          </Link>
          <Link className={styles.category} to="/product">
            Product
          </Link>
          <Link className={styles.category} to="/sales">
            Sales
          </Link>
          <a className={styles.dashboard}>Order</a>
        </div>
      </div>
      <div className={styles.adminItem} />
      <div className={styles.rectangleParent}>
        <img className={styles.frameChild} alt="" src="/rectangle-8@2x.png" />
        <b className={styles.herosPetStoreContainer}>
          <p className={styles.herosPet}>Hero’s Pet</p>
          <p className={styles.herosPet}>Store</p>
        </b>
      </div>
      <b className={styles.admin3}>Admin</b>
      <div className={styles.adminInner} />
      <TextField
        className={styles.rectangleTextfield}
        color="primary"
        name="First_Name"
        label="First Name"
        variant="filled"
        sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
      />
      <TextField
        className={styles.adminChild1}
        color="primary"
        name="Last_Name"
        label="Last Name"
        required={true}
        variant="filled"
        sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
      />
      <TextField
        className={styles.adminChild2}
        color="primary"
        name="Email"
        label="Email Address"
        required={true}
        variant="filled"
        type="email"
        sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
      />
      <FormControl
        className={styles.positionParent}
        variant="filled"
        sx={{
          borderRadius: "0px 0px 0px 0px",
          width: "360px",
          height: "41px",
          m: 0,
          p: 0,
          "& .MuiInputBase-root": {
            m: 0,
            p: 0,
            minHeight: "41px",
            justifyContent: "center",
            display: "inline-flex",
          },
          "& .MuiInputLabel-root": {
            m: 0,
            p: 0,
            minHeight: "41px",
            display: "inline-flex",
          },
          "& .MuiMenuItem-root": {
            m: 0,
            p: 0,
            height: "41px",
            display: "inline-flex",
          },
          "& .MuiSelect-select": {
            m: 0,
            p: 0,
            height: "41px",
            alignItems: "center",
            display: "inline-flex",
          },
          "& .MuiInput-input": { m: 0, p: 0 },
          "& .MuiInputBase-input": { textAlign: "left", p: "0 !important" },
        }}
      >
        <InputLabel color="primary">Position</InputLabel>
        <Select
          color="primary"
          name="Position"
          label="Position"
          disableUnderline
          displayEmpty
        >
          <MenuItem value="Owner">Owner</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
          <MenuItem value="Employee">Employee</MenuItem>
        </Select>
        <FormHelperText />
      </FormControl>
      <TextField
        className={styles.adminChild3}
        color="primary"
        name="Password"
        label="Password"
        required={true}
        variant="filled"
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
        sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
      />
      <TextField
        className={styles.adminChild4}
        color="primary"
        name="Confirm_Password"
        label="Confirm Password"
        required={true}
        variant="filled"
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
        sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
      />
      <TextField
        className={styles.adminChild5}
        color="primary"
        name="Contact"
        label="Contact Number"
        required={true}
        variant="filled"
        sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "360px" }}
      />
      <FormControl
        className={styles.sexParent}
        variant="filled"
        sx={{
          borderRadius: "0px 0px 0px 0px",
          width: "360px",
          height: "41px",
          m: 0,
          p: 0,
          "& .MuiInputBase-root": {
            m: 0,
            p: 0,
            minHeight: "41px",
            justifyContent: "center",
            display: "inline-flex",
          },
          "& .MuiInputLabel-root": {
            m: 0,
            p: 0,
            minHeight: "41px",
            display: "inline-flex",
          },
          "& .MuiMenuItem-root": {
            m: 0,
            p: 0,
            height: "41px",
            display: "inline-flex",
          },
          "& .MuiSelect-select": {
            m: 0,
            p: 0,
            height: "41px",
            alignItems: "center",
            display: "inline-flex",
          },
          "& .MuiInput-input": { m: 0, p: 0 },
          "& .MuiInputBase-input": { textAlign: "left", p: "0 !important" },
        }}
      >
        <InputLabel color="primary">Sex</InputLabel>
        <Select
          color="primary"
          name="Sex"
          label="Sex"
          disableUnderline
          displayEmpty
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
        <FormHelperText />
      </FormControl>
      <div className={styles.rectangleDiv} />
      <Button
        className={styles.frameButton}
        disableElevation={true}
        color="primary"
        name="Logout"
        variant="outlined"
        href="/login"
        sx={{ borderRadius: "0px 0px 0px 0px", width: 166, height: 65 }}
      >
        Logout
      </Button>
      <Button
        className={styles.adminChild6}
        disableElevation={true}
        color="primary"
        name="Add"
        variant="contained"
        sx={{ borderRadius: "0px 0px 0px 0px" }}
      >
        Add User
      </Button>
    </div>
  );
};

export default Admin;
