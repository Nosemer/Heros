// Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button'; // Assuming you are using Material-UI
import styles from './Header.module.css'; // Import your CSS file
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Dashboard, SupervisedUserCircle, Category, LocalMall, MonetizationOn, ShoppingCart } from "@mui/icons-material";
import { useAuth } from '../components/AuthContext';

const Header = () => {
    const [activeLink, setActiveLink] = useState<string | null>(null); // Specify type as string | null
    const location = useLocation();
    const [dateTime, setDateTime] = useState<string>("");

    // Set active link based on current location
    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location]); 
    useEffect(() => {
        // Function to update date and time every second
        const updateDateTime = () => {
            const now = new Date();
            const dateString = now.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            const timeString = now.toLocaleTimeString();
            const dateTimeString = `${dateString} ${timeString}`;
            setDateTime(dateTimeString);
        };

        // Update date and time immediately and then every second
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, []);
  return (
    <div className={styles.header}>
       <div className={styles.dashboardInner}>
        {dateTime}
        </div>
      <div className={styles.rectangleParent}>
        <img className={styles.frameChild} alt="" src="/rectangle-8@2x.png" />
      </div>
      <div className={styles.herosPetStoreContainer}>
          <p className={styles.herosPet}>Hero’s Pet Store</p>
        <p className={styles.herosPetAdd}>Brgy. 62, 1376 Sta Maria st. Tondo Manila </p>
        </div>
      <nav className={styles.navigation}>
      <Link
                    className={`${styles.NavHead} ${activeLink === "/dashboard" && styles.active}`}
                    to="/userdashboard"
                    onClick={() => setActiveLink("/dashboard")}
                >
                    <Dashboard /> Dashboard
                </Link>
                <Link
                    className={`${styles.NavHead} ${activeLink === "/category" && styles.active}`}
                    to="/usercategory"
                    onClick={() => setActiveLink("/category")}
                >
                    <Category /> Category
                </Link>
                <Link
                    className={`${styles.NavHead} ${activeLink === "/product" && styles.active}`}
                    to="/userproduct"
                    onClick={() => setActiveLink("/product")}
                >
                    <LocalMall /> Product
                </Link>
                <Link
                    className={`${styles.NavHead} ${activeLink === "/order" && styles.active}`}
                    to="/userorder"
                    onClick={() => setActiveLink("/order")}
                >
                    <ShoppingCart /> Order
                </Link>
      </nav>
      
    

    </div>
  );
};

export default Header;

