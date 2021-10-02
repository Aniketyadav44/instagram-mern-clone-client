import React, { useContext, useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../App";
import loadingPhoto from "../Assets/Spinner.gif";
import verifiedIcon from "../Assets/verified.png";

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
  const [searchModal, setSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null);

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

  useEffect(() => {
    searchQuery !== "" && setSearchModal(true);
    searchQuery === "" && setSearchModal(false);
    window.onclick = () => {
      searchModal && setSearchModal(false);
      searchModal && setSearchQuery("");
    };
  }, [searchQuery, searchModal]);

  const fetchSearchUsers = (query) => {
    setData([]);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setData(results);
      });
  };

  return (
    <>
      <div className={styles.navbar}>
        <Link
          to={state ? "/" : "/signin"}
          className={`${styles.link} ${styles.logo}`}
        >
          Instagram
        </Link>
        {state && (
          <input
            className={styles.searchBar}
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchSearchUsers(e.target.value);
            }}
          />
        )}
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
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    profileModal
                      ? setProfileModal(false)
                      : setProfileModal(true);
                  }}
                  alt="profile-pic"
                  src={state.photoUrl}
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
              <Link
                style={{ textDecoration: "none" }}
                to={state ? `/profile/${state._id}` : "/signin"}
              >
                <div className={styles.modalItem}>
                  <AccountCircleOutlinedIcon />
                  <p style={{ marginLeft: "5px" }}>Profile</p>
                </div>
              </Link>
            </div>
            <div>
              <Link style={{ textDecoration: "none" }} to={"/edituser"}>
                <div className={styles.modalItem}>
                  <SettingsIcon />
                  <p style={{ marginLeft: "5px" }}>Settings</p>
                </div>
              </Link>
            </div>
            <div style={{ borderTop: "2px solid #ccc" }} onClick={logOut}>
              <p className={styles.modalItem}>Log Out</p>
            </div>
          </div>
          <div className={styles.modalTriangle}></div>
        </>
      )}
      {searchModal && (
        <>
          <div className={styles.mainModalDiv}>
            <div className={styles.searchModal}>
              {data ? (
                data.user ? (
                  data.user.length === 0 ? (
                    <div className={styles.notFound}>
                      <strong>No results found.</strong>
                    </div>
                  ) : (
                    data.user.map((item) => {
                      return (
                        <Link
                          to={`/profile/${item._id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <div
                            className={styles.searchModalItem}
                            key={item._id}
                          >
                            <img
                              className={styles.searchProfilePic}
                              alt="profile_img"
                              src={item.photoUrl}
                            />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <p style={{ fontSize: "15px" }}>
                                  <strong>{item.username}</strong>
                                </p>
                                {item.verified && (
                                  <img
                                    alt="verifid_icon"
                                    className={styles.verifiedIcon}
                                    src={verifiedIcon}
                                  />
                                )}
                              </div>
                              <p style={{ fontSize: "15px", color: "grey" }}>
                                {item.name}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )
                ) : (
                  <img
                    src={loadingPhoto}
                    alt="gif"
                    className={styles.loadingGif}
                  />
                )
              ) : (
                <img
                  src={loadingPhoto}
                  alt="gif"
                  className={styles.loadingGif}
                />
              )}
            </div>
            <div className={styles.searchModalTriangle}></div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
