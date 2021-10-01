import React, { useState, useContext, useEffect } from "react";
import styles from "./EditUser.module.css";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import loadingPhoto from "../../Assets/Spinner.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal";

import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const EditUser = () => {
  const { state, dispatch } = useContext(UserContext);
  const [url, setUrl] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const localUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(state ? state.name : "");
  const [username, setUsername] = useState(state ? state.username : "");
  const [email, setEmail] = useState(state ? state.email : "");
  const [bio, setBio] = useState(state ? state.bio : "");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [usernameErr, setUsernameErr] = useState(false);
  const [editErr, setEditErr] = useState(false);
  const [editErrMsg, setEditErrMsg] = useState("");

  const [vName, setVName] = useState("");
  const [verifyErr, setVerifyErr] = useState(false);
  const [verifyErrMsg, setVerifyErrMsg] = useState("");
  const [reportText, setReportText] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [sendVerify, setSendVerify] = useState(false);
  const [sendMsg, setSendMsg] = useState(false);

  const history = useHistory();
  const token = localStorage.getItem("jwt");

  if (!token) {
    history.push("/signin");
  }

  useEffect(() => {
    if (sendMsg) {
      sendReportMessageEmail();
    }
    if (sendVerify) {
      sendVerificationEmail();
    }
  }, [sendVerify, sendMsg]);

  const selectImage = () => {
    document.getElementById("select-file").click();
  };

  const deleteFromCloud = () => {
    setLoading(true);
    const imageId = state.photoUrl.split("/");
    const imgId =
      imageId[imageId.length - 3] +
      "/" +
      imageId[imageId.length - 2] +
      "/" +
      imageId[imageId.length - 1];
    const imgPublicId = imgId.includes(".jpg")
      ? imgId.replace(".jpg", "")
      : imgId.replace(".jpeg", "");
    fetch("/delete", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        publicId: imgPublicId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        fetch("/updatephoto", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            userId: state ? state._id : localUser._id,
            photoUrl:
              "https://res.cloudinary.com/aniketyadav/image/upload/v1632396298/no_image_h0h6lq.jpg",
          }),
        });
        toast.info("Profile photo updated!", {
          position: toast.POSITION.BOTTOM_CENTER,
          style: { backgroundColor: "#5A5B5C", color: "white" },
          icon: false,
          autoClose: 3000,
          hideProgressBar: true,
        });
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const uploadToCloud = (file) => {
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "insta-clone-profilepic");
    data.append("cloud_name", "aniketyadav");
    fetch("https://api.cloudinary.com/v1_1/aniketyadav/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((responseData) => {
        setUrl(responseData.url);
        if (responseData) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, photoUrl: responseData.url })
          );
          dispatch({
            type: "UPDATEPHOTO",
            payload: responseData.url,
          });
          fetch("/updatephoto", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              userId: state ? state._id : localUser._id,
              photoUrl: responseData.url,
            }),
          });
          toast.info("Profile photo updated!", {
            position: toast.POSITION.BOTTOM_CENTER,
            style: { backgroundColor: "#5A5B5C", color: "white" },
            icon: false,
            autoClose: 3000,
            hideProgressBar: true,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removePhoto = () => {
    deleteFromCloud();
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...state,
        photoUrl:
          "https://res.cloudinary.com/aniketyadav/image/upload/v1632396298/no_image_h0h6lq.jpg",
      })
    );
    dispatch({
      type: "UPDATEPHOTO",
      payload:
        "https://res.cloudinary.com/aniketyadav/image/upload/v1632396298/no_image_h0h6lq.jpg",
    });
  };

  const updatePhoto = (file) => {
    if (state.photoUrl.includes("no_image_h0h6lq")) {
      uploadToCloud(file);
    } else {
      uploadToCloud(file);
      deleteFromCloud();
    }
  };

  const updateUser = () => {
    fetch("/updateuser", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        userId: state ? state._id : "",
        name: name,
        email: email,
        username: username,
        bio: bio,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setName(result.name);
        setUsername(result.username);
        setEmail(result.email);
        dispatch({
          type: "UPDATEUSER",
          payload: result,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...state,
            name: result.name,
            username: result.username,
            email: result.email,
            bio: result.bio,
          })
        );
        toast.info("Profile updated!", {
          position: toast.POSITION.BOTTOM_CENTER,
          style: { backgroundColor: "#5A5B5C", color: "white" },
          icon: false,
          autoClose: 3000,
          hideProgressBar: true,
        });
        setTimeout(() => {
          history.goBack();
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  const validateUser = () => {
    fetch(`/checkuser/${username}`, {
      method: "get",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        if (results.message === "not exists") {
          updateUser();
        }
        if (results.message === "exists" && username === state.username) {
          updateUser();
        }
        if (results.message === "exists" && username !== state.username) {
          console.log(" validate called");
          setUsernameErr(true);
          setUsername(state ? state.username : "");
          setTimeout(() => setUsernameErr(false), 4000);
        }
      })
      .catch((err) => console.log(err));
  };

  const sendEmail = (to, subject, html, message) => {
    setFormLoading(true);
    fetch("/sendmail", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: to,
        subject: subject,
        html: html,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        if (!results) {
          toast.info("Some error occured!", {
            position: toast.POSITION.BOTTOM_CENTER,
            style: { backgroundColor: "#5A5B5C", color: "white" },
            icon: false,
            autoClose: 3000,
            hideProgressBar: true,
          });
          setVName("");
          setReportText("");
          setFormLoading(false);
        }
        toast.info(message, {
          position: toast.POSITION.BOTTOM_CENTER,
          style: { backgroundColor: "#5A5B5C", color: "white" },
          icon: false,
          autoClose: 3000,
          hideProgressBar: true,
        });
        setVName("");
        setReportText("");
        setFormLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const sendVerificationEmail = () => {
    sendEmail(
      "aniani4848@gmail.com",
      "Verification request",
      `<h2>I am ${vName}, my username is @${username} and my user id is ${
        state ? state._id : localUser._id
      }.</h2><p>This is a request mail to verify me.</p>`,
      "Verification requested."
    );
    setSendVerify(false);
  };

  const sendReportMessageEmail = () => {
    sendEmail(
      "aniani4848@gmail.com",
      "Report Message for Instagram clone",
      `<h2>I am ${
        state ? state.name : localUser.name
      }, my username is @${username} and my user id is ${
        state ? state._id : localUser._id
      }.</h2><h4>This is a mail with message :</h4><p>"${reportText}".</p>`,
      "Thanks for Reporting!"
    );
    setSendMsg(false);
  };

  const reset = () => {
    setError(false);
    setErrorMsg("");
    setFormLoading(true);
    fetch("/edit-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: password,
        newPassword: newPassword,
        userId: state ? state._id : localUser._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setFormLoading(false);
          setErrorMsg(result.error);
          setError(true);
          setPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          return;
        }
        setFormLoading(false);
        setErrorMsg("");
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setError(false);
        toast.info("Password changed!", {
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
    <div>
      {formLoading && (
        <Modal type="popup" closeModal={setFormLoading}>
          <img src={loadingPhoto} alt="gif" className={styles.loadingGif} />
        </Modal>
      )}
      <div className={styles.mainDiv}>
        <h3 className={styles.heading}>Edit Profile</h3>
        <div className={styles.rowDiv}>
          <div className={styles.rowLeftDiv}>
            <div className={styles.profilePic}>
              {loading ? (
                <img alt="loading" src={loadingPhoto} />
              ) : (
                <img
                  alt="profile_pic"
                  src={state ? state.photoUrl : localUser.photoUrl}
                />
              )}
            </div>
          </div>
          <div>
            <p style={{ fontSize: "20px" }}>{username}</p>
            <div style={{ display: "flex" }}>
              {state && !state.photoUrl.includes("no_image_h0h6lq") && (
                <p
                  style={{
                    color: "#ed4956",
                    fontWeight: "bold",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    removePhoto();
                  }}
                >
                  Remove Profile Photo
                </p>
              )}
              &nbsp;
              <p
                style={{
                  color: "#0095f6",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  selectImage();
                }}
              >
                Change Profile Photo
              </p>
            </div>
          </div>
          <input
            id="select-file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                updatePhoto(e.target.files[0]);
              }
            }}
            hidden="hidden"
          />
        </div>
        <div className={styles.formRowDiv}>
          <div style={{ marginLeft: "97px" }} className={styles.formRowLeftDiv}>
            <aside className={styles.formLeftAside}>
              <p>Name</p>
            </aside>
          </div>
          <div className={styles.formRowRightDiv}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formRowDiv}>
          <div style={{ marginLeft: "68px" }} className={styles.formRowLeftDiv}>
            <aside className={styles.formLeftAside}>
              <p>Username</p>
            </aside>
          </div>
          <div className={styles.formRowRightDiv}>
            {usernameErr && (
              <p
                style={{ marginTop: "-20px", marginBottom: "0px" }}
                className={styles.error}
              >
                Username already exists!
              </p>
            )}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formRowDiv}>
          <div
            style={{ marginLeft: "101px" }}
            className={styles.formRowLeftDiv}
          >
            <aside className={styles.formLeftAside}>
              <p>Email</p>
            </aside>
          </div>
          <div className={styles.formRowRightDiv}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formRowDiv}>
          <div
            style={{ marginLeft: "118px" }}
            className={styles.formRowLeftDiv}
          >
            <aside className={styles.formLeftAside}>
              <p>Bio</p>
            </aside>
          </div>
          <div className={styles.formRowRightDiv}>
            <textarea
              type="text"
              placeholder="Bio"
              rows="10"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
        {editErr && (
          <div>
            <p className={styles.error}>{editErrMsg}</p>
          </div>
        )}
        <button
          className={styles.button}
          onClick={() => {
            if (!name || !username || !email) {
              setEditErrMsg("Fields cannot be empty.");
              setEditErr(true);
              setTimeout(() => setEditErr(false), 3000);
              return;
            } else if (
              state &&
              name === state.name &&
              username === state.username &&
              email === state.email &&
              bio === state.bio
            ) {
              history.goBack();
              return;
            } else {
              validateUser();
              return;
            }
          }}
        >
          Submit
        </button>
        <hr className={styles.hrStyle} />
        <h3 className={styles.heading}>Change Password</h3>
        <div className={styles.formRowDiv}>
          <div style={{ marginLeft: "49px" }} className={styles.formRowLeftDiv}>
            <aside className={styles.formLeftAside}>
              <p>Old Password</p>
            </aside>
          </div>
          <div className={styles.formRowRightDiv}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formRowDiv}>
          <div style={{ marginLeft: "40px" }} className={styles.formRowLeftDiv}>
            <aside className={styles.formLeftAside}>
              <p>New Password</p>
            </aside>
          </div>
          <div className={styles.formRowRightDiv}>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formRowDiv}>
          <div
            style={{ marginLeft: "-20px" }}
            className={styles.formRowLeftDiv}
          >
            <aside className={styles.formLeftAside}>
              <p>Confirm New Password</p>
            </aside>
          </div>
          <div className={styles.formRowRightDiv}>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <div>
            <p className={styles.error}>{errorMsg}</p>
          </div>
        )}
        <button
          className={styles.button}
          style={{ marginTop: "20px", width: "130px" }}
          onClick={() => {
            if (newPassword.length < 8) {
              setErrorMsg(
                "Please make sure new password's length is atleast 8 characters."
              );
              setError(true);
              setTimeout(() => setError(false), 2000);
            } else if (newPassword !== confirmNewPassword) {
              setErrorMsg("Please make sure both passwords match.");
              setError(true);
              setTimeout(() => setError(false), 3000);
            } else {
              reset();
            }
          }}
        >
          Change Password
        </button>
        <Link className={styles.forgotPassText} to="/reset">
          <p>
            <strong>Forgot password?</strong>
          </p>
        </Link>
        <hr className={styles.hrStyle} />
        <h3 className={styles.heading}>Request Verification</h3>
        <h4 style={{ marginTop: "10px" }} className={styles.heading}>
          Apply for Instagram Verification
        </h4>
        <h5
          style={{
            marginTop: "10px",
            color: "grey",
            width: "300px",
            alignSelf: "center",
          }}
          className={styles.heading}
        >
          Verified accounts have blue checkmarks next to their name to show that
          Instagram has confirmed they're the real presence of the public
          figures, celebrities and brands they represent
        </h5>
        <div className={styles.formRowDiv}>
          <div
            style={{ marginLeft: "101px" }}
            className={styles.formRowLeftDiv}
          >
            <aside className={styles.formLeftAside}>
              <p>Username</p>
            </aside>
          </div>
          <div className={styles.formRowRightDiv}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              readOnly
            />
          </div>
        </div>
        <div className={styles.formRowDiv}>
          <div
            style={{ marginLeft: "101px" }}
            className={styles.formRowLeftDiv}
          >
            <aside className={styles.formLeftAside}>
              <p>Full name</p>
            </aside>
          </div>
          <div className={styles.formRowRightDiv}>
            <input
              type="text"
              placeholder="Full name"
              value={vName}
              onChange={(e) => setVName(e.target.value)}
            />
          </div>
        </div>
        {verifyErr && (
          <div>
            <p className={styles.error}>{verifyErrMsg}</p>
          </div>
        )}
        <Link to="#" style={{ alignSelf: "center" }}>
          <button
            className={styles.button}
            onClick={() => {
              if (!username || !vName) {
                setVerifyErrMsg("Fields cannot be empty.");
                setVerifyErr(true);
                setTimeout(() => setVerifyErr(false), 3000);
                return;
              } else {
                setSendVerify(true);
                return;
              }
            }}
          >
            Submit
          </button>
        </Link>
        <h5
          style={{
            marginTop: "0px",
            marginBottom: "20px",
            color: "grey",
            width: "300px",
            alignSelf: "center",
          }}
          className={styles.heading}
        >
          Verifying users takes 6-7 business days, so please wait after sending
          a request
        </h5>
        <hr className={styles.hrStyle} />
        <h3 className={styles.heading}>Report an Issue</h3>
        <h5
          style={{
            marginTop: "10px",
            color: "grey",
            width: "300px",
            alignSelf: "center",
          }}
          className={styles.heading}
        >
          Please help us in improving Instagram. If you notice any bugs or
          problems on this website or if you have any suggestions, please make
          sure to let us know
        </h5>
        <div className={styles.formRowDiv}>
          <div
            style={{ marginLeft: "118px" }}
            className={styles.formRowLeftDiv}
          >
            <aside className={styles.formLeftAside}>
              <p>Message</p>
            </aside>
          </div>
          <div className={styles.formRowRightDiv}>
            <textarea
              style={{ marginBottom: "0px" }}
              type="text"
              placeholder="Enter Issue/Bug/Message..."
              rows="10"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />
          </div>
        </div>
        <button
          className={styles.button}
          style={{
            marginTop: "20px",
            width: "100px",
            backgroundColor: "#ed4956",
          }}
          onClick={() => {
            setSendMsg(true);
          }}
        >
          Report
        </button>
        <hr className={styles.hrStyle} />
        <h3 className={styles.heading}>About</h3>
        <h5
          style={{
            marginTop: "10px",
            marginBottom: "20px",
            color: "grey",
            width: "230px",
            alignSelf: "center",
          }}
          className={styles.heading}
        >
          This website is a project website solely created by Aniket Yadav in
          the name of E-ASY Productions an e-Production house.
        </h5>
        <div className={styles.connectDiv}>
          <a className={styles.iconStyle} href="mailto:aniani4848@gmail.com">
            <EmailIcon />
          </a>
          <a
            className={styles.iconStyle}
            href="https://www.instagram.com/aniket.cp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </a>
          <a
            className={styles.iconStyle}
            href="https://www.linkedin.com/in/aniketyadav4848/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
          </a>
          <a
            className={styles.iconStyle}
            href="https://github.com/aniketyadav44"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </a>
          <a
            className={styles.iconStyle}
            href="https://twitter.com/AniketY8888"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon />
          </a>
        </div>
      </div>

      <ToastContainer />
      <p className={styles.footerText}>
        © 2021 Instagram clone from E-ASY Productions(Aniket)
      </p>
    </div>
  );
};

export default EditUser;
