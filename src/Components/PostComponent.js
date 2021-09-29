import React, { useState } from "react";
import styles from "./PostComponent.module.css";
import "react-toastify/dist/ReactToastify.css";

import verifiedIcon from "../Assets/verified.png";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";

const PostComponent = (props) => {
  const [post, setPost] = useState(props.data);
  const [comment, setComment] = useState("");
  const localUser = JSON.parse(localStorage.getItem("user"));

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
        setPost((prevState) => {
          return {
            ...prevState,
            owner: {
              ...prevState.owner,
              followers: [...prevState.owner.followers, results._id],
            },
          };
        });
      })
      .catch((err) => console.log(err));
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
        setPost((prevState) => {
          const newFollowersArray = prevState.owner.followers.filter(
            (item) => item !== results._id
          );
          return {
            ...prevState,
            owner: {
              ...prevState.owner,
              followers: newFollowersArray,
            },
          };
        });
      })
      .catch((err) => console.log(err));
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
        setPost((prevState) => {
          return {
            ...prevState,
            likes: result.likes,
          };
        });
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
        setPost((prevState) => {
          return {
            ...prevState,
            likes: result.likes,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
        setPost((prevState) => {
          return {
            ...prevState,
            comments: result.comments,
          };
        });
        setComment("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HeaderCompenent = (props) => {
    return (
      <div className={props.customStyle}>
        <a
          href={`/profile/${post.owner._id}`}
          style={{
            color: "black",
            textDecoration: "none",
            alignSelf: "center",
          }}
        >
          <img
            className={styles.profilePic}
            alt="profile_pic"
            src={post.owner.photoUrl}
          />
        </a>

        <div style={{ display: "flex", marginRight: "175px" }}>
          <a
            href={`/profile/${post.owner._id}`}
            style={{
              color: "black",
              textDecoration: "none",
              alignSelf: "center",
            }}
          >
            <p>
              <strong>{post.owner.username}</strong>
            </p>
          </a>

          {post.owner.verified && (
            <img
              alt="verifid_icon"
              className={styles.verifiedIcon}
              src={verifiedIcon}
            />
          )}
          {post.owner._id !== localUser._id && (
            <div className={styles.dot}></div>
          )}
          {post.owner._id !== localUser._id &&
            (post.owner.followers &&
            post.owner.followers &&
            post.owner.followers.includes(localUser._id) ? (
              <p
                onClick={() => {
                  unfollow(post.owner._id);
                }}
                style={{
                  alignSelf: "center",
                  cursor: "pointer",
                  marginRight: "-17px",
                }}
              >
                <strong>Unfollow</strong>
              </p>
            ) : (
              <p
                onClick={() => {
                  follow(post.owner._id);
                }}
                style={{ alignSelf: "center", cursor: "pointer" }}
              >
                <strong>Follow</strong>
              </p>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.mainDiv}>
      <HeaderCompenent customStyle={styles.smallScreenPostHeader} />
      <div className={styles.leftDiv}>
        <img
          style={{ width: "100%", height: "100%", marginBottom: "-4px" }}
          alt="postImg"
          src={post.photoUrl}
        />
      </div>
      <div className={styles.rightDiv}>
        <HeaderCompenent customStyle={styles.postHeader} />
        <div className={styles.commentsWrapper}>
          <div className={styles.commentsDiv}>
            <div className={styles.commentDivItem}>
              <img
                style={{ marginTop: "0px" }}
                className={styles.profilePic}
                alt="profile_pic"
                src={post.owner.photoUrl}
              />
              {post.owner.verified && (
                <img
                  alt="verifid_icon"
                  className={styles.verifiedIcon}
                  src={verifiedIcon}
                />
              )}
              <p style={{ marginLeft: "66px", fontSize: "14px" }}>
                <strong>{post.owner.username} </strong>
                {post.caption}
              </p>
            </div>
            {post.comments
              .slice(0)
              .reverse()
              .map((comment) => {
                return (
                  <div key={comment._id} className={styles.commentDivItem}>
                    <img
                      style={{ marginTop: "0px" }}
                      className={styles.profilePic}
                      alt="profile_pic"
                      src={comment.postedBy.photoUrl}
                    />
                    <p style={{ marginLeft: "66px", fontSize: "14px" }}>
                      <strong>{comment.postedBy.username} </strong>
                      {comment.postedBy.verified && (
                        <img
                          alt="verifid_icon"
                          className={styles.verifiedIcon}
                          src={verifiedIcon}
                        />
                      )}
                      {comment.text}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className={styles.postFooter}>
          <div>
            {post.likes && post.likes.includes(localUser._id) ? (
              <FavoriteIcon
                onClick={() => {
                  unlikePost(post._id);
                }}
                className={styles.footerIcon}
                style={{ color: "#ED4956" }}
              />
            ) : (
              <FavoriteBorderIcon
                onClick={() => {
                  likePost(post._id);
                }}
                className={styles.footerIcon}
              />
            )}
            <ModeCommentOutlinedIcon
              style={{ paddinTop: "2px", marginLeft: "5px" }}
              className={styles.footerIcon}
              onClick={() => {
                document.getElementById("commenttextarea").focus();
              }}
            />
          </div>
          <p style={{ marginBottom: "10px" }}>
            <strong>
              {post.likes.length > 0 && post.likes.length}{" "}
              {post.likes.length === 0
                ? "Be the first one to like"
                : post.likes.length === 1
                ? "like"
                : "likes"}
            </strong>
          </p>

          <p style={{ color: "grey", marginTop: "10px", fontSize: "12px" }}>
            {post.createdAt}
          </p>
          <div className={styles.commentDiv}>
            <ModeCommentOutlinedIcon />
            <textarea
              id="commenttextarea"
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
                comment.length > 0 && postComment(comment, post._id);
              }}
              className={styles.postButton}
              disabled
            >
              Post
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
