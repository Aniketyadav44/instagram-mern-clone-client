import React, { useState } from "react";
import styles from "./Signin.module.css";
import { Link, useHistory } from "react-router-dom";

const Signin = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const signIn = (e) => {
    e.preventDefault();
    setError("");
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: login,
        username: login,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
          return;
        }
        localStorage.setItem("jwt", result.token);
        localStorage.setItem("user", result.user);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className={styles.signin}>
        <p className={styles.logo}>Instagram</p>
        <input
          className={styles.input}
          type="text"
          placeholder="Username or email"
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
          }}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={signIn} className={styles.signinButton}>
          Log in
        </button>
        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}
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
