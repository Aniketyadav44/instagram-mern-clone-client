import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import styles from "./Profile.module.css";

const Profile = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const token = localStorage.getItem("jwt");
  if (!token) {
    history.push("/signin");
  }
  return <>
    <div className={styles.profile}>
        <div className={styles.profilePic}>
            <img alt="profile_pic" src={state.photoUrl}/>
        </div>
    </div>
    <div className={styles.stats}></div>
    <div className={styles.gallery}></div>
  </>;
};

export default Profile;
