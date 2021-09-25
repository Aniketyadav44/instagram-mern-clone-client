import React from "react";
import styles from "./Signup.module.css";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <>
      <div className={styles.signup}>
        <p className={styles.logo}>Instagram</p>
        <p className={styles.postLogo}>
          Sign up to see photos from your friends
        </p>
        <input className={styles.input} type="text" placeholder="Email" />
        <input className={styles.input} type="text" placeholder="Full Name" />
        <input className={styles.input} type="text" placeholder="Username" />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
        />
        <button className={styles.signupButton}>Sign up</button>
        <p
          style={{ fontSize: "12px", marginBottom: "40px", marginTop: "15px" }}
          className={styles.postLogo}
        >
          By signing up, you agree to our <strong>Terms</strong> ,{" "}
          <strong>Data Policy</strong> and <strong>Cookies Policy</strong> .
        </p>
      </div>
      <div className={styles.signinOuterBox}>
        <div className={styles.signinInnerBox}>
          <p className={styles.signinText} style={{ marginRight: "10px"}}>Have an account? </p>
          <Link className={styles.signinText}
            to="/signin"
            style={{ color: "#0095f6", textDecoration: "none", fontWeight:"bold" }}
          >
            Log in
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
