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
    <>
      <div className={styles.profileMain}>
        <div className={styles.profile}>
          <div>
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
                  <strong>1126</strong> posts &emsp;&emsp;{" "}
                  <strong>{user.followers.length}</strong> followers
                  &emsp;&emsp; <strong>{user.following.length}</strong>{" "}
                  following
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
            <img
              alt="pic"
              src="https://image.shutterstock.com/z/stock-vector-original-grunge-brush-paint-texture-design-acrylic-stroke-poster-over-square-frame-vector-original-369533519.jpg"
            />
            <img
              alt="pic"
              src="https://image.shutterstock.com/z/stock-vector-original-grunge-brush-paint-texture-design-acrylic-stroke-poster-over-square-frame-vector-original-369533519.jpg"
            />
            <img
              alt="pic"
              src="https://image.shutterstock.com/z/stock-vector-original-grunge-brush-paint-texture-design-acrylic-stroke-poster-over-square-frame-vector-original-369533519.jpg"
            />
            <img
              alt="pic"
              src="https://image.shutterstock.com/z/stock-vector-original-grunge-brush-paint-texture-design-acrylic-stroke-poster-over-square-frame-vector-original-369533519.jpg"
            />
            <img
              alt="pic"
              src="https://image.shutterstock.com/z/stock-vector-original-grunge-brush-paint-texture-design-acrylic-stroke-poster-over-square-frame-vector-original-369533519.jpg"
            />
          </div>
        </div>
      </div>
      <div className={styles.smallScreenStats}>
        <div className={styles.spanText}>
          <strong>1126</strong>
          <p>posts</p>
        </div>
        <div className={styles.spanText}>
          <strong>{user.followers.length}</strong>
          <p>followers</p>
        </div>
        <div className={styles.spanText}>
          <strong>{user.following.length}</strong>
          <p>following</p>
        </div>
      </div>
      <div className={styles.smallScreenGallery}>
        <img
          alt="pic"
          src="https://image.shutterstock.com/z/stock-vector-original-grunge-brush-paint-texture-design-acrylic-stroke-poster-over-square-frame-vector-original-369533519.jpg"
        />
        <img
          alt="pic"
          src="https://image.shutterstock.com/z/stock-vector-original-grunge-brush-paint-texture-design-acrylic-stroke-poster-over-square-frame-vector-original-369533519.jpg"
        />
        <img
          alt="pic"
          src="https://image.shutterstock.com/z/stock-vector-original-grunge-brush-paint-texture-design-acrylic-stroke-poster-over-square-frame-vector-original-369533519.jpg"
        />
        <img
          alt="pic"
          src="https://image.shutterstock.com/z/stock-vector-original-grunge-brush-paint-texture-design-acrylic-stroke-poster-over-square-frame-vector-original-369533519.jpg"
        />
        <img
          alt="pic"
          src="https://image.shutterstock.com/z/stock-vector-original-grunge-brush-paint-texture-design-acrylic-stroke-poster-over-square-frame-vector-original-369533519.jpg"
        />
      </div>
    </>
  );
};

export default Profile;
