import { FunctionComponent } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";

const Dashboard: FunctionComponent = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardChild} />
      <div className={styles.sidenavigation}>
        <div className={styles.sidenavigationChild} />
        <div className={styles.dashboardParent}>
          <a className={styles.order}>Dashboard</a>
          <Link className={styles.admin} to="/admin">
            <p className={styles.herosPet}>Admin</p>
          </Link>
          <Link className={styles.admin} to="/category">
            Category
          </Link>
          <Link className={styles.admin} to="/product">
            Product
          </Link>
          <Link className={styles.admin} to="/sales">
            Sales
          </Link>
          <a className={styles.order}>Order</a>
        </div>
      </div>
      <div className={styles.dashboardItem} />
      <Button
        className={styles.dashboardInner}
        disableElevation={true}
        color="primary"
        name="Logout"
        variant="outlined"
        href="/login"
        sx={{ borderRadius: "0px 0px 0px 0px", width: 166, height: 65 }}
      >
        Logout
      </Button>
      <div className={styles.rectangleParent}>
        <img className={styles.frameChild} alt="" src="/rectangle-8@2x.png" />
        <b className={styles.herosPetStoreContainer}>
          <p className={styles.herosPet}>Hero’s Pet</p>
          <p className={styles.herosPet}>Store</p>
        </b>
      </div>
      <b className={styles.dashboard2}>Dashboard</b>
      <div className={styles.rectangleDiv} />
      <div className={styles.dashboardChild1} />
      <div className={styles.dashboardChild2} />
      <div className={styles.fastsale}>
        <div className={styles.fastsaleChild} />
      </div>
      <div className={styles.latestSale}>
        <div className={styles.latestSaleChild} />
      </div>
    </div>
  );
};

export default Dashboard;
