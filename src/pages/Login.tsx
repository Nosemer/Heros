import { FunctionComponent, useState } from "react";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
  Switch,
  FormControlLabel,
  Alert
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import styles from "./Login.module.css";
import HomeHeader from "../Admincomponents/HomeHeader";
import { useAuth } from "../components/AuthContext";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const Login: FunctionComponent = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const [isUser, setisUser] = useState(true); // Initially set to admin
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  
  const handleLogin = async () => {
    setLoading(true); // Set loading to true

    try {
      let apiUrl;
      if (isUser) {
        apiUrl = 'http://localhost:3001/api/login';
      } else {
        apiUrl = 'http://localhost:3001/api/login/admin';
      }

      const response = await axios.post(apiUrl, { username, password });

      if (response.data.success) {
        setShowAlert(true);
        setAlertSeverity('success');
        setAlertMessage('Login successful');
        login(response.data.user);

        setTimeout(() => {
          if (isUser) {
            navigate('/UserCategory');
          } else {
            navigate('/Admin');
          }
        }, 2000);
      } else {
        if (response.data.error === 'Invalid username') {
          setUsernameError('Incorrect username');
          setPasswordError('');
        } else if (response.data.error === 'Invalid password') {
          setPasswordError('Incorrect password');
          setUsernameError('');
        } else {
          setUsernameError('Incorrect username');
          setPasswordError('Incorrect password');
        }
      }
    } catch (error) {
      console.error('Error logging in:', (error as Error).message);
    } finally {
      setLoading(false); // Set loading to false after login process is complete
    }
  };
  
  return (
    <div className={styles.login}>
      <HomeHeader />
      <Backdrop style={{ zIndex: 10000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={styles.loginChild} />
      <FormControlLabel
          className={styles.switchControl}
          control={<Switch onChange={() => setisUser((prev) => !prev)} color="default"/>}
          label={<span className={styles.switchLabel}>Admin</span>}
      />
      <div className={styles.loginItem} />
      <div className={styles.loginInner} />
      <TextField
        className={styles.rectangleTextfield}
        color="primary"
        name="Username"
        label="Username"
        required={true}
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ "& .MuiInputBase-root": { height: "41px" }, width: "305px" }}
        error={!!usernameError} // Highlight the field if there's an error
        helperText={usernameError} // Display the error message
      />
      <TextField
        className={styles.loginChild1}
        color="primary"
        name="Password"
        label="Password"
        required={true}
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={showPassword ?  "password": "text"}
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
        error={!!passwordError} // Highlight the field if there's an error
        helperText={passwordError} // Display the error message
      />
      <Button
        className={styles.frameButton}
        disableElevation={true}
        color="secondary"
        name="Dashboard"
        size="small"
        variant="contained"
        onClick={handleLogin}
        sx={{ borderRadius: "0px 0px 0px 0px", width: 194, height: 52 }}
      >
        Login now
      </Button>
      <b className={styles.login1}>Login</b>
      <video className={styles.rectangleIcon} autoPlay loop>
      <source src="vid1.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    </div>
  );
};

export default Login;
