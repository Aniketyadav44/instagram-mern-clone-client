import React, { useState, useContext, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { UserContext } from "../../App";
import styles from "./Profile.module.css";
import Modal from "../Modal";
import PostComponent from "../PostComponent";

import verifiedIcon from "../../Assets/verified.png";

import ModeCommentIcon from "@mui/icons-material/ModeComment";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Profile = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const token = localStorage.getItem("jwt");
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openListModal, setOpenListModal] = useState(false);
  const [openListModalType, setOpenListModalType] = useState("");
  const [modalList, setModalList] = useState([]);
  if (!token) {
    history.push("/signin");
  }
  const getUser = () => {
    fetch(`/user/${userId}`, {
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        setUser(results.user);
        setData(results.posts);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getUser();
  }, []);

  const follow = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUser((prevState) => {
          return {
            ...prevState,
            followers: [...prevState.followers, results._id],
          };
        });
      })
      .catch((err) => console.log(err));
  };

  const unfollow = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUser((prevState) => {
          const newFollowersArray = prevState.followers.filter(
            (item) => item !== results._id
          );
          return {
            ...prevState,
            followers: newFollowersArray,
          };
        });
      })
      .catch((err) => console.log(err));
  };

  const getList = (list) => {
    const bodyParam = list.toString();
    fetch(`/userlist/${bodyParam}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((results) => {
        setModalList(results);
      })
      .catch((err) => console.log(err));
  };

  const showPost = (index) => {
    setCurrentIndex(index);
    setOpenModal(true);
  };

  const FollowListItem = (props) => {
    const item = props.data;
    return (
      <div className={styles.followListItem}>
        <a href={`/profile/${item._id}`}>
          <img alt="profile_img" src={item.photoUrl} />
        </a>

        <div>
          <a
            href={`/profile/${item._id}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            <p style={{ fontWeight: "bold" }}>{item.username}</p>
          </a>

          <p style={{ color: "rgba(var(--f52,142,142,142),1)" }}>{item.name}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      {openModal && data[currentIndex] && (
        <Modal closeModal={setOpenModal}>
          <PostComponent
            style={{ marginTop: "40px !important" }}
            data={data[currentIndex]}
          />
        </Modal>
      )}
      {openListModal && (
        <Modal type="popup" closeModal={setOpenListModal}>
          <div style={{ overflow: "hidden" }}>
            <div className={styles.followListHeading}>
              <p>
                {openListModalType === "followers" ? "Followers" : "Following"}
              </p>
            </div>
            <div className={styles.showMoreDiv}>
              <>
                {modalList.map((item) => {
                  return <FollowListItem key={item._id} data={item} />;
                })}
              </>
            </div>
          </div>
        </Modal>
      )}
      {user && (
        <div>
          <div className={styles.profileMain}>
            <div className={styles.profile}>
              <div>
                <div className={styles.profilePic}>
                  <img alt="profile_pic" src={user.photoUrl} />
                </div>
                <div className={styles.profileDetails}>
                  <div className={styles.hero}>
                    <p className={styles.usernameStyle}>{user.username}</p>
                    {user.verified && (
                      <img
                        alt="verifid_icon"
                        className={styles.verifiedIcon}
                        src={verifiedIcon}
                      />
                    )}
                    {userId === state._id ? (
                      <button
                        style={{
                          backgroundColor: "white",
                          color: "black",
                          border: "1px solid #ccc",
                        }}
                        className={styles.button}
                        onClick={() => {
                          history.push(`/edituser/${user._id}`);
                        }}
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        {user.followers.includes(state._id) ? (
                          <button
                            style={{
                              backgroundColor: "white",
                              color: "black",
                              border: "1px solid #ccc",
                            }}
                            onClick={unfollow}
                            className={styles.button}
                          >
                            Following
                          </button>
                        ) : (
                          <button onClick={follow} className={styles.button}>
                            Follow
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.bigScreenStats}>
                    <p>
                      <span>
                        <strong>{data && data.length}</strong>{" "}
                        {data && data.length === 1 ? "post" : "posts"}
                      </span>{" "}
                      &emsp;&emsp;
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (user.followers.length > 0) {
                            getList(user.followers);
                            setOpenListModalType("followers");
                            setOpenListModal(true);
                          }
                        }}
                      >
                        <strong>{user.followers.length}</strong> followers
                      </span>
                      &emsp;&emsp;{" "}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (user.following.length > 0) {
                            getList(user.following);
                            setOpenListModalType("following");
                            setOpenListModal(true);
                          }
                        }}
                      >
                        <strong>{user.following.length}</strong> following
                      </span>
                    </p>
                    <p className={styles.name}>
                      <strong>{user.name}</strong>
                    </p>
                    <p className={styles.bio}>This is the bio of the user</p>
                  </div>
                </div>
              </div>
              <div className={styles.nameAndBio}>
                <p className={styles.name}>
                  <strong>{user.name}</strong>
                </p>
                <p className={styles.bio}>This is the bio of the user</p>
              </div>
              <hr className={styles.profileDivider} />
              <div className={styles.bigScreenGallery}>
                {data &&
                  data.map((item, index) => {
                    return (
                      <div
                        key={item._id}
                        className={styles.overlayBigContainer}
                      >
                        <img
                          className={styles.overlayImg}
                          onClick={() => {
                            showPost(index);
                          }}
                          alt="pic"
                          src={item.photoUrl}
                        />
                        <div
                          onClick={() => {
                            showPost(index);
                          }}
                          className={styles.imgOverlayText}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FavoriteIcon
                              style={{ color: "white", margin: "5px" }}
                            />
                            <p style={{ color: "white" }}>
                              <strong>{item.likes.length}</strong>
                            </p>
                          </div>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <ModeCommentIcon
                              style={{ color: "white", margin: "5px" }}
                            />
                            <p style={{ color: "white" }}>
                              <strong>{item.comments.length}</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className={styles.smallScreenStats}>
            <div className={styles.spanText}>
              <strong>{data && data.length}</strong>
              <p>{data && data.length === 1 ? "post" : "posts"}</p>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (user.followers.length > 0) {
                  getList(user.followers);
                  setOpenListModalType("followers");
                  setOpenListModal(true);
                }
              }}
              className={styles.spanText}
            >
              <strong>{user.followers.length}</strong>
              <p>followers</p>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (user.following.length > 0) {
                  getList(user.following);
                  setOpenListModalType("following");
                  setOpenListModal(true);
                }
              }}
              className={styles.spanText}
            >
              <strong>{user.following && user.following.length}</strong>
              <p>following</p>
            </div>
          </div>
          <div className={styles.smallScreenGallery}>
            {data &&
              data.map((item, index) => {
                return (
                  <div key={item._id} className={styles.overlayContainer}>
                    <img
                      className={styles.overlayImg}
                      onClick={() => {
                        showPost(index);
                      }}
                      alt="pic"
                      src={item.photoUrl}
                    />
                    <div
                      onClick={() => {
                        showPost(index);
                      }}
                      className={styles.imgOverlayText}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FavoriteIcon
                          style={{ color: "white", margin: "5px" }}
                        />
                        <p style={{ color: "white" }}>
                          <strong>{item.likes.length}</strong>
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ModeCommentIcon
                          style={{ color: "white", margin: "5px" }}
                        />
                        <p style={{ color: "white" }}>
                          <strong>{item.comments.length}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
