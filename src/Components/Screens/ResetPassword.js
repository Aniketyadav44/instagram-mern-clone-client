import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import loadingPhoto from "../../Assets/Spinner.gif";
import Modal from "../Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { UserContext } from "../../App";

const ResetPassword = () => {
  const { state, dispatch } = useContext(UserContext);
  const [login, setLogin] = useState(state ? state.username : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const postReset = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: login,
        username: login,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setLoading(false);
          setError(result.error);
          return;
        }

        setLoading(false);
        toast.info("Reset mail sent!", {
          position: toast.POSITION.BOTTOM_CENTER,
          style: { backgroundColor: "#5A5B5C", color: "white" },
          icon: false,
          autoClose: 3000,
          hideProgressBar: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {loading && (
        <Modal type="popup" closeModal={setLoading}>
          <img src={loadingPhoto} alt="gif" className={styles.loadingGif} />
        </Modal>
      )}
      <div className={styles.reset}>
        <div className={styles.logo}>
          <LockOutlinedIcon
            style={{ width: "90px", height: "90px", marginTop: "15px" }}
          />
        </div>
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          <strong>Trouble Logging In?</strong>
        </p>
        <p
          style={{
            fontSize: "13px",
            alignSelf: "center",
            width: "252px",
            textAlign: "center",
            color: "grey",
            marginBottom: "15px",
          }}
        >
          Enter your email or username and we'll send you a link to reset your
          password.
        </p>
        <input
          className={styles.input}
          type="text"
          placeholder="Email or username"
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
          }}
        />
        <button onClick={postReset} className={styles.resetButton}>
          Send Reset Link
        </button>
        {error && <p className={styles.error}>{error}</p>}
        {!localStorage.getItem("user") && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ width: "278px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <strong style={{ color: "grey", fontSize: "13px" }}>
                  —————————— OR ——————————
                </strong>
              </div>
              <p
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  marginTop: "15px",
                  marginBottom: "90px",
                }}
                onClick={() => {
                  history.push("/signup");
                }}
              >
                <strong style={{ fontSize: "14px" }}>Create New Account</strong>
              </p>
            </div>
            <div
              onClick={() => {
                history.goBack();
              }}
              style={{
                backgroundColor: "#fafafa",
                border: "1px solid rgb(206, 206, 206)",
                cursor: "pointer",
                width: "100%",
                height: "40px",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                Back To Login
              </p>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
      <p className={styles.footerText}>
        © 2021 Instagram clone from E-ASY Productions(Aniket)
      </p>
    </>
  );
};

export default ResetPassword;
