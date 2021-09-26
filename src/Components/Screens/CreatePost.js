import React, { useContext} from "react";
import styles from "./CreatePost.module.css";
import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const token = localStorage.getItem("jwt");
  console.log(state);
  if (!token) {
    history.push("/signin");
  }
  return <div>Create Post Page</div>;
};

export default CreatePost;
