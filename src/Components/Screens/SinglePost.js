import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import PostComponent from "../PostComponent";
import styles from "./SinglePost.module.css";

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState("");
  const history = useHistory();
  const token = localStorage.getItem("jwt");
  if (!token) {
    history.push("/signin");
  }

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
      })
      .catch((err) => console.log(err));
  }, []);
  return <div className={styles.mainDiv}>{post && <PostComponent data={post} />}</div>;
};

export default SinglePost;
