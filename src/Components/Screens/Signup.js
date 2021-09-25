import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link, useHistory } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const signUp = (e) => {
    setError("");
    e.preventDefault();
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
          return;
        } else {
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className={styles.signup}>
        <p className={styles.logo}>Instagram</p>
        <p className={styles.postLogo}>
          Sign up to see photos from your friends
        </p>
        <input
          className={styles.input}
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
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
        <button className={styles.signupButton} onClick={signUp}>
          Sign up
        </button>
        {error&&<p className={styles.error}>
          {error}
        </p>}
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
          <p className={styles.signinText} style={{ marginRight: "10px" }}>
            Have an account?{" "}
          </p>
          <Link
            className={styles.signinText}
            to="/signin"
            style={{
              color: "#0095f6",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Log in
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
