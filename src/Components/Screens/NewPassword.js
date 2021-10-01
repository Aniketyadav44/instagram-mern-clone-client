import React, { useState, useContext } from "react";
import styles from "./NewPassword.module.css";
import { useHistory, useParams } from "react-router-dom";
import loadingPhoto from "../../Assets/Spinner.gif";
import Modal from "../Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../App";

const NewPassword = () => {
  const { state, dispatch } = useContext(UserContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const history = useHistory();

  const { token } = useParams();
  console.log(token);

  const reset = () => {
    if (newPassword.length < 8) {
      setError(
        "Please make sure new password's length is atleast 8 characters."
      );
      return;
    } else if (newPassword !== confirmNewPassword) {
      setError("Please make sure both passwords match.");
      return;
    }
    setError("");
    setLoading(true);
    fetch("/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: newPassword,
        sentToken: token,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setLoading(false);
          setError(result.error);
          return;
        }
        localStorage.clear();
        dispatch({ type: "CLEAR" });
        setLoading(false);
        toast.info("Password changed!", {
          position: toast.POSITION.BOTTOM_CENTER,
          style: { backgroundColor: "#5A5B5C", color: "white" },
          icon: false,
          autoClose: 3000,
          hideProgressBar: true,
        });
        setTimeout(() => {
          history.push("/signin");
        }, 2000);
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
        <p
          style={{ fontSize: "16px", marginBottom: "20px", marginTop: "25px" }}
        >
          <strong>Change Password</strong>
        </p>
        <input
          className={styles.input}
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => {
            setConfirmNewPassword(e.target.value);
          }}
        />
        <button onClick={reset} className={styles.resetButton}>
          Reset Password
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
      <ToastContainer />
      <p className={styles.footerText}>
        © 2021 Instagram clone from E-ASY Productions(Aniket)
      </p>
    </>
  );
};

export default NewPassword;
