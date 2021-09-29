import React, { useContext, useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../App";

import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsIcon from "@mui/icons-material/Settings";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  const [profileModal, setProfileModal] = useState(false);

  const localUser = JSON.parse(localStorage.getItem("user"));

  const logOut = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    setProfileModal(false);
    history.push("/signin");
  };

  useEffect(() => {
    window.onclick = () => {
      profileModal && setProfileModal(false);
    };
  }, [profileModal]);

  return (
    <>
      <div className={styles.navbar}>
        <Link
          to={state ? "/" : "/signin"}
          className={`${styles.link} ${styles.logo}`}
        >
          Instagram
        </Link>
        <div className={styles.linksDiv}>
          {state && (
            <>
              <Link
                to={state ? "/" : "/signin"}
                style={{ textDecoration: "none" }}
              >
                {location.pathname === "/" ? (
                  <HomeIcon className={styles.navIcon} />
                ) : (
                  <HomeOutlinedIcon className={styles.navIcon} />
                )}
              </Link>
              <Link to={state ? "/create" : "/signin"}>
                {location.pathname === "/create" ? (
                  <AddBoxIcon className={styles.navIcon} />
                ) : (
                  <AddBoxOutlinedIcon className={styles.navIcon} />
                )}
              </Link>
              {profileModal && (
                <div
                  onClick={() => {
                    profileModal
                      ? setProfileModal(false)
                      : setProfileModal(true);
                  }}
                  className={styles.profilePicSelect}
                ></div>
              )}
              <div className={styles.profilePic}>
                <img
                  onClick={() => {
                    profileModal
                      ? setProfileModal(false)
                      : setProfileModal(true);
                  }}
                  alt="profile-pic"
                  src={localUser.photoUrl}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {profileModal && (
        <>
          <div className={styles.profileModal}>
            <div>
              <a
                style={{ textDecoration: "none" }}
                href={state ? `/profile/${localUser._id}` : "/signin"}
              >
                <div className={styles.modalItem}>
                  <AccountCircleOutlinedIcon />
                  <p style={{ marginLeft: "5px" }}>Profile</p>
                </div>
              </a>
            </div>
            <div>
              <div className={styles.modalItem}>
                <SettingsIcon />
                <p style={{ marginLeft: "5px" }}>Settings</p>
              </div>
            </div>
            <div style={{ borderTop: "2px solid #ccc" }} onClick={logOut}>
              <p className={styles.modalItem}>Log Out</p>
            </div>
          </div>
          <div className={styles.modalTriangle}></div>
        </>
      )}
    </>
  );
};

export default Navbar;
