import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../App";
import styles from "./Home.module.css";
import { useHistory, Link } from "react-router-dom";
import Modal from "../Modal";
import PostComponent from "../PostComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";

const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);

  const [comment, setComment] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openMoreModal, setOpenMoreModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const history = useHistory();
  const token = localStorage.getItem("jwt");
  const localUser = JSON.parse(localStorage.getItem("user"));
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

  const deletePost = (id) => {
    setOpenMoreModal(false);
  };

  const editPost = (id) => {
    setOpenMoreModal(false);
  };
  return (
    <>
      {openMoreModal && (
        <Modal type="popup" closeModal={setOpenMoreModal}>
          <div className={styles.showMoreDiv}>
            {data[currentIndex].owner._id !== localUser._id &&
              (data[currentIndex].owner.followers.includes(localUser._id) ? (
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
            {data[currentIndex].owner._id === localUser._id && (
              <p onClick={editPost}>Edit post</p>
            )}
            {data[currentIndex].owner._id === localUser._id && (
              <p onClick={deletePost}>Delete post</p>
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
      {data.map((item, index) => {
        return (
          <div key={item._id} className={styles.mainPostDiv}>
            <div className={styles.postHeader}>
              <img alt="profile_pic" src={item.owner.photoUrl} />
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
                {item.likes.includes(localUser._id) ? (
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
                <strong>
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
                {item.createdAt}
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
    </>
  );
};

export default Home;
