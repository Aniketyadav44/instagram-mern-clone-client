import React, { useContext, useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import homeIcon from "../Assets/insta_home.png";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [profileModal, setProfileModal] = useState(false);
  const [toggle, setToggle] = useState(false);

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
                <img
                  className={styles.homeIcon}
                  alt="home_icon"
                  src={homeIcon}
                />
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
              <img
                onClick={() => {
                  profileModal ? setProfileModal(false) : setProfileModal(true);
                }}
                alt="profile-pic"
                className={styles.profilePic}
                src="https://res.cloudinary.com/aniketyadav/image/upload/v1632396298/no_image_h0h6lq.jpg"
              />
            </>
          )}
        </div>
      </div>
      {profileModal && (
        <>
          <div className={styles.profileModal}>
            <div>
              <Link
                style={{ textDecoration: "none" }}
                to={state ? "/profile" : "/signin"}
              >
                <p className={styles.modalItem}>Profile</p>
              </Link>
            </div>
            <div>
              <p className={styles.modalItem}>Settings</p>
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
