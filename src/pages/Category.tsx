import { FunctionComponent } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./Category.module.css";

const Category: FunctionComponent = () => {
  return (
    <div className={styles.category}>
      <div className={styles.categoryChild} />
      <div className={styles.categoryItem} />
      <div className={styles.categoryInner} />
      <div className={styles.categorytable}>
        <div className={styles.categorytableChild} />
      </div>
      <div className={styles.sidenavigation}>
        <div className={styles.sidenavigationChild} />
        <div className={styles.dashboardParent}>
          <a className={styles.dashboard}>Dashboard</a>
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
          <a className={styles.dashboard}>Order</a>
        </div>
      </div>
      <div className={styles.rectangleParent}>
        <img className={styles.frameChild} alt="" src="/rectangle-8@2x.png" />
        <b className={styles.herosPetStoreContainer}>
          <p className={styles.herosPet}>Hero’s Pet</p>
          <p className={styles.herosPet}>Store</p>
        </b>
      </div>
      <b className={styles.category2}>Category</b>
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
    </div>
  );
};

export default Category;
