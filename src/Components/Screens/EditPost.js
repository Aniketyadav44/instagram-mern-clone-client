import React, { useState, useEffect } from "react";
import styles from "./EditPost.module.css";
import { useHistory, useParams } from "react-router-dom";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const EditPost = () => {
  const { postId } = useParams();
  const history = useHistory();
  const token = localStorage.getItem("jwt");
  if (!token) {
    history.push("/signin");
  }

  const [post, setPost] = useState([]);
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    fetch(`/p/${postId}`, {
      method: "get",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPost(result);
        setLocation(result.location);
        setCaption(result.caption);
      })
      .catch((err) => console.log(err));
  }, []);

  const update = () => {
    fetch("/editpost", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: postId,
        newCaption: caption,
        newLocation: location,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        history.push(`/post/${postId}`);
      })
      .catch((err) => console.log(err));
  };

  return (
      <div className={styles.mainBody}>
        <div className={styles.mainDiv}>
          {post && (
            <div className={styles.captionDiv}>
              <p style={{ textAlign: "center" }}>
                <strong>Edit Post</strong>
              </p>
              <img className={styles.preview} src={post.photoUrl} alt="Post" />
              {location && (
                <>
                  <div className={styles.locationTextDiv}>
                    <LocationOnOutlinedIcon />
                    <p>{location}</p>
                  </div>
                </>
              )}
              <input
                type="text"
                className={styles.caption}
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
                placeholder="Enter location..."
              />
              <textarea
                className={styles.caption}
                rows="10"
                value={caption}
                onChange={(e) => {
                  setCaption(e.target.value);
                }}
                placeholder="Enter caption..."
              ></textarea>
              <div className={styles.cropPageArroDiv}>
                <ArrowBackOutlinedIcon
                  className={styles.arrow}
                  onClick={() => {
                    history.goBack();
                  }}
                />
                <AutorenewOutlinedIcon
                  className={styles.arrow}
                  onClick={() => {
                    setCaption("");
                    setLocation("");
                  }}
                />
                <ArrowForwardOutlinedIcon
                  className={styles.arrow}
                  onClick={() => {
                    if (
                      caption === post.caption &&
                      location === post.location
                    ) {
                      history.push(`/post/${postId}`);
                    } else {
                      update();
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default EditPost;
