import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Dashboard,
  SupervisedUserCircle,
  Category,
  LocalMall,
  MonetizationOn,
  ShoppingCart,
  ExitToApp,
  Menu
} from "@mui/icons-material";
import styles from "./Sidenav.module.css";

interface SideNavigationProps {
  activeLink?: string;
  isOpen: boolean; // Add isOpen property

}

const SideNavigation: React.FC<SideNavigationProps> = ({ activeLink }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, link: "/dashboard" },
    { text: "Admin", icon: <SupervisedUserCircle />, link: "/admin" },
    { text: "Category", icon: <Category />, link: "/category" },
    { text: "Product", icon: <LocalMall />, link: "/product" },
    { text: "Sales", icon: <MonetizationOn />, link: "/sales" },
    { text: "Order", icon: <ShoppingCart />, link: "/order" },
    { text: "Logout", icon: <ExitToApp />, link: "/Login" },
  ];

  return (
    <div className={styles.sidenavigation}>
      <Drawer
        variant="permanent"
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : styles.drawerClose}`}
        classes={{
          paper: `${isOpen ? styles.drawerOpen : styles.drawerClose}`,
        }}
      >
        <IconButton onClick={toggleDrawer} className={styles.menuButton}>
          <Menu />
        </IconButton>
        <List>
          {menuItems.map((item, index) => (
            <Link to={item.link} key={index} className={styles.NavLink}>
              <Tooltip title={!isOpen ? item.text : ""} placement="right">
                <ListItem button selected={activeLink === item.text.toLowerCase()}>
                  <ListItemIcon className={styles.listItemIcon}>{item.icon}</ListItemIcon>
                  {isOpen && <ListItemText primary={item.text} />}
                </ListItem>
              </Tooltip>
            </Link>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default SideNavigation;
