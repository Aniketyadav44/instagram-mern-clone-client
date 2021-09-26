import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import styles from "./Profile.module.css";
import verifiedIcon from "../../Assets/verified.png";

const Profile = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const token = localStorage.getItem("jwt");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || !user) {
    history.push("/signin");
  }
  return (
    <div className={styles.profileMain}>
      <div className={styles.profile}>
        <img
          className={styles.profilePic}
          alt="profile_pic"
          src={user.photoUrl}
        />
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
            <button className={styles.button}>Follow</button>
          </div>
          <div className={styles.bigScreenStats}>
            <p>
              <strong>1126</strong> posts &emsp;&emsp; <strong>{user.followers.length}</strong>{" "}
              followers &emsp;&emsp; <strong>{user.following.length}</strong> following
            </p>
          </div>
          <p className={styles.name}><strong>{user.name}</strong></p>
          <p className={styles.bio}>This is the bio of the user</p>
        </div>
      </div>
      <div className={styles.smallScreenStats}></div>
      <div className={styles.gallery}></div>
    </div>
  );
};

export default Profile;
