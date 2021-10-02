import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../App";
import styles from "./Home.module.css";
import { useHistory, Link } from "react-router-dom";
import Modal from "../Modal";
import PostComponent from "../PostComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loadingPhoto from "../../Assets/Spinner.gif";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";

const getTime = (date) => {
  const today = new Date();
  const createdDate = new Date(date);
  const diffTime = Math.abs(today - createdDate);
  const diffSecs = Math.ceil(diffTime / 1000);
  const diffMins = Math.ceil(diffTime / (1000 * 60));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonth = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  const diffYear = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30 * 365));
  var period;
  console.log(today, createdDate, diffSecs, diffMins);
  if (diffSecs < 60) {
    period = diffSecs > 1 ? diffSecs + " secs ago" : diffSecs + " sec ago";
  } else if (diffMins < 60) {
    period = diffMins > 1 ? diffMins + " mins ago" : diffMins + " min ago";
  } else if (diffHours < 24) {
    period = diffHours > 1 ? diffHours + " hours ago" : diffHours + " hour ago";
  } else if (diffDays < 30) {
    period = diffDays > 1 ? diffDays + " days" : diffDays + " day";
  } else if (diffMonth < 12) {
    period = diffMonth > 1 ? diffMonth + " months" : diffMonth + " month";
  } else {
    period = diffYear > 1 ? diffYear + " years" : diffYear + " year";
  }
  return period;
};

const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);

  const [comment, setComment] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openMoreModal, setOpenMoreModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [modalList, setModalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [homeLoading, setHomeLoading] = useState(true);
  const [likesLoading, setLikesLoading] = useState(false);
  const history = useHistory();
  const token = localStorage.getItem("jwt");
  if (!token) {
    history.push("/signin");
  }

  useEffect(() => {
    fetch("/allposts", {
      method: "get",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setHomeLoading(false);
        setData(result.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const copyToClipboard = () => {
    var dummy = document.createElement("input"),
      text =
        window.location.href +
        `post/${data[currentIndex]._id}/?copy_source=web`;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    toast.info("Link copied to clipboard", {
      position: toast.POSITION.BOTTOM_CENTER,
      style: { backgroundColor: "#5A5B5C", color: "white" },
      icon: false,
      autoClose: 3000,
      hideProgressBar: true,
    });
    setOpenMoreModal(false);
  };

  const postComment = (text, id) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postedBy: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        setComment("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const likePost = (id) => {
    fetch(`/like/${id}`, {
      method: "put",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch(`/unlike/${id}`, {
      method: "put",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const follow = (id) => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: id,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setData((prevState) => {
          return [
            ...prevState.slice(0, currentIndex),
            {
              ...prevState[currentIndex],
              owner: {
                ...prevState[currentIndex].owner,
                followers: [
                  ...prevState[currentIndex].owner.followers,
                  results._id,
                ],
              },
            },
            ...prevState.slice(currentIndex + 1, data.length),
          ];
        });
      })
      .catch((err) => console.log(err));
    setOpenMoreModal(false);
  };

  const unfollow = (id) => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: id,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: results.following,
            followers: results.followers,
          },
        });
        setData((prevState) => {
          const newFollowersArray = prevState[
            currentIndex
          ].owner.followers.filter((item) => item !== results._id);
          return [
            ...prevState.slice(0, currentIndex),
            {
              ...prevState[currentIndex],
              owner: {
                ...prevState[currentIndex].owner,
                followers: newFollowersArray,
              },
            },
            ...prevState.slice(currentIndex + 1, data.length),
          ];
        });
      })
      .catch((err) => console.log(err));
    setOpenMoreModal(false);
  };

  const deletePost = () => {
    setLoading(true);
    const imageId = data[currentIndex].photoUrl.split("/");
    const imgId =
      imageId[imageId.length - 2] + "/" + imageId[imageId.length - 1];
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
        fetch(`/deletepost/${data[currentIndex]._id}`, {
          method: "delete",
          headers: {
            Authorization: localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((result) => {
            const newData = data.filter((item) => {
              return item._id !== result._id;
            });
            setLoading(false);
            setData(newData);
            toast.info("Post Deleted!", {
              position: toast.POSITION.BOTTOM_CENTER,
              style: { backgroundColor: "#5A5B5C", color: "white" },
              icon: false,
              autoClose: 3000,
              hideProgressBar: true,
            });
          })
          .catch((err) => console.result);
      })
      .catch((err) => console.log(err));
    setOpenMoreModal(false);
  };

  const getList = (list) => {
    setLikesLoading(true);
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
        setLikesLoading(false);
        setModalList(results);
      })
      .catch((err) => console.log(err));
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
      {openMoreModal && (
        <Modal type="popup" closeModal={setOpenMoreModal}>
          <div className={styles.showMoreDiv}>
            {data[currentIndex].owner._id !== state._id &&
              (data[currentIndex].owner.followers.includes(state._id) ? (
                <p style={{ color: "red" }}>
                  <strong
                    onClick={() => {
                      unfollow(data[currentIndex].owner._id);
                    }}
                  >
                    Unfollow
                  </strong>
                </p>
              ) : (
                <p style={{ color: "red" }}>
                  <strong
                    onClick={() => {
                      follow(data[currentIndex].owner._id);
                    }}
                  >
                    Follow
                  </strong>
                </p>
              ))}

            <Link
              style={{ color: "black", textDecoration: "none" }}
              to={`/post/${data[currentIndex]._id}`}
            >
              <p>Go to post</p>
            </Link>
            <p onClick={copyToClipboard}>Copy Link</p>
            {data[currentIndex].owner._id === state._id && (
              <Link
                style={{ color: "black", textDecoration: "none" }}
                to={`/edit/${data[currentIndex]._id}`}
              >
                <p>Edit post</p>
              </Link>
            )}
            {data[currentIndex].owner._id === state._id && (
              <p
                onClick={() => {
                  deletePost();
                }}
              >
                Delete post
              </p>
            )}
            <p
              onClick={() => {
                setOpenMoreModal(false);
              }}
            >
              Cancel
            </p>
          </div>
        </Modal>
      )}
      {openLikesModal && (
        <Modal type="popup" closeModal={setOpenLikesModal}>
          {likesLoading ? (
            <img src={loadingPhoto} alt="gif" className={styles.loadingGif} />
          ) : (
            <div style={{ overflow: "hidden" }}>
              <div className={styles.followListHeading}>
                <p>Likes</p>
              </div>
              <div className={styles.showLikesDiv}>
                <>
                  {modalList.map((item) => {
                    return <FollowListItem key={item._id} data={item} />;
                  })}
                </>
              </div>
            </div>
          )}
        </Modal>
      )}
      {openModal && data[currentIndex] && (
        <Modal closeModal={setOpenModal}>
          <PostComponent
            style={{
              marginTop: "40px !important",
              paddingBottom: "-10px !important",
            }}
            data={data[currentIndex]}
          />
        </Modal>
      )}
      {loading && (
        <Modal type="popup" closeModal={setLoading}>
          <img src={loadingPhoto} alt="gif" className={styles.loadingGif} />
        </Modal>
      )}
      {homeLoading && (
        <Modal type="popup" closeModal={setHomeLoading}>
          <img src={loadingPhoto} alt="gif" className={styles.loadingGif} />
        </Modal>
      )}
      {data.map((item, index) => {
        return (
          <div key={item._id} className={styles.mainPostDiv}>
            <div className={styles.postHeader}>
              <Link
                to={`/profile/${item.owner._id}`}
                style={{ color: "black", textDecoration: "none" }}
              >
                <div className={styles.profilePic}>
                  <img alt="profile_pic" src={item.owner.photoUrl} />
                </div>
              </Link>

              <div>
                <Link
                  to={`/profile/${item.owner._id}`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <h5 style={{ width: "500px" }}>{item.owner.username}</h5>
                </Link>
                {item.location && <p>{item.location}</p>}
              </div>
              <MoreHorizIcon
                onClick={() => {
                  setCurrentIndex(index);
                  setOpenMoreModal(true);
                }}
                className={styles.moreIcon}
              />
            </div>
            <img src={item.photoUrl} alt="post" />
            <div className={styles.postFooter}>
              <div>
                {item.likes.includes(state._id) ? (
                  <FavoriteIcon
                    onClick={() => {
                      unlikePost(item._id);
                    }}
                    className={styles.footerIcon}
                    style={{ color: "#ED4956" }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    onClick={() => {
                      likePost(item._id);
                    }}
                    className={styles.footerIcon}
                  />
                )}
              </div>
              <p style={{ marginBottom: "10px" }}>
                <strong
                  onClick={() => {
                    if (item.likes.length > 0) {
                      getList(item.likes);
                      setOpenLikesModal(true);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.likes.length > 0 && item.likes.length}{" "}
                  {item.likes.length === 0
                    ? "Be the first one to like"
                    : item.likes.length === 1
                    ? "like"
                    : "likes"}
                </strong>
              </p>
              <p style={{ whiteSpace: "pre-line" }}>
                <strong>{item.owner.username}</strong>&nbsp;
                {item.caption}
              </p>
              {item.comments.length > 2 && (
                <p
                  onClick={() => {
                    setCurrentIndex(index);
                    setOpenModal(true);
                  }}
                  style={{
                    fontSize: "15px",
                    color: "grey",
                    margin: "5px auto",
                    cursor: "pointer",
                  }}
                >
                  View all {item.comments.length} comments
                </p>
              )}
              {item.comments && item.comments.length > 2
                ? item.comments
                    .slice(item.comments.length - 2, item.comments.length)
                    .map((commentItem) => {
                      return (
                        <div key={commentItem._id}>
                          <p>
                            <strong>{commentItem.postedBy.username}</strong>{" "}
                            &nbsp;
                            {commentItem.text}
                          </p>
                        </div>
                      );
                    })
                : item.comments.map((commentItem) => {
                    return (
                      <div key={commentItem._id}>
                        <p>
                          <strong>{commentItem.postedBy.username}</strong>{" "}
                          &nbsp;
                          {commentItem.text}
                        </p>
                      </div>
                    );
                  })}
              <p style={{ color: "grey", marginTop: "10px", fontSize: "12px" }}>
                {getTime(item.createdAt)}
              </p>
            </div>
            <div className={styles.commentDiv}>
              <CommentOutlinedIcon />
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder="Add a comment..."
                autoCorrect="off"
                spellCheck="false"
              />
              <div
                onClick={() => {
                  comment.length > 0 && postComment(comment, item._id);
                }}
                className={styles.postButton}
                disabled
              >
                Post
              </div>
            </div>
          </div>
        );
      })}
      <ToastContainer />
      <p className={styles.footerText}>
        © 2021 Instagram clone from E-ASY Productions(Aniket)
      </p>
    </>
  );
};

export default Home;
