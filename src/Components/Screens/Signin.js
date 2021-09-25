import React from "react";
import styles from "./Signin.module.css";
import { Link } from "react-router-dom";

const Signin = () => {
  return (
    <>
      <div className={styles.signin}>
        <p className={styles.logo}>Instagram</p>
        <input
          className={styles.input}
          type="text"
          placeholder="Username or email"
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
        />
        <button className={styles.signinButton}>Log in</button>
        <Link className={styles.forgotPassText} to="/">
          <p>Forgot password?</p>
        </Link>
      </div>
      <div className={styles.signupOuterBox}>
        <div className={styles.signupInnerBox}>
          <p className={styles.signupText} style={{ marginRight: "10px" }}>
            Don't have an account?{" "}
          </p>
          <Link
            className={styles.signupText}
            to="/signup"
            style={{
              color: "#0095f6",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signin;
