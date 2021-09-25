import React from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <Link to="/" className={`${styles.link} ${styles.logo}`}>
        Instagram
      </Link>
      <div className={styles.linksDiv}>
        <Link className={styles.link} to="/signin">
          Sign In
        </Link>
        <Link className={styles.link} to="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
