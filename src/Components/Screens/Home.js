import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../App";
import styles from "./Home.module.css";
import { useHistory } from "react-router-dom";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";

const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);

  const [comment, setComment] = useState("");
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
        setData(result.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const commentHandler = (e) => {
    setComment(e.target.value);
  };
  return (
    <>
      {data.map((item) => {
        return (
          <div key={item._id} className={styles.mainPostDiv}>
            <div className={styles.postHeader}>
              <img alt="profile_pic" src={item.owner.photoUrl} />
              <div>
                <h5>{item.owner.username}</h5>
                {item.location && <p>{item.location}</p>}
              </div>
              <MoreHorizIcon className={styles.moreIcon} />
            </div>
            <img src={item.photoUrl} alt="post" />
            <div className={styles.postFooter}>
              <div>
                {item.likes.includes(state._id) ? (
                  <FavoriteIcon
                    className={styles.footerIcon}
                    style={{ color: "#ED4956" }}
                  />
                ) : (
                  <FavoriteBorderIcon className={styles.footerIcon} />
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
              {item.comments &&
                item.comments.map((commentItem) => {
                  return (
                    <div key={commentItem._id}>
                      <p>
                        <strong>{commentItem.postedBy.username}</strong> &nbsp;
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
                onChange={commentHandler}
                placeholder="Add a comment..."
                autoCorrect="off"
                spellCheck="false"
              />
              <div id="postB" className={styles.postButton} disabled>
                Post
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Home;
