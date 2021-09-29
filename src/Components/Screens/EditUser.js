import React, { useState, useContext } from "react";
import styles from "./EditUser.module.css";
import { Link, useParams, useHistory } from "react-router-dom";
import { UserContext } from "../../App";

const EditUser = () => {
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const history = useHistory();
  const token = localStorage.getItem("jwt");
  const localUser = JSON.parse(localStorage.getItem("user"));
  const { userId } = useParams();

  if (!token) {
    history.push("/signin");
  }

  const selectImage = () => {
    document.getElementById("select-file").click();
  };

  return (
    <div>
      <div className={styles.mainDiv}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "32px 0 0",
            justifyContent: "flex-start",
          }}
        >
          <div style={{ margin: "2px 32px 0px 124px" }}>
            <div className={styles.profilePic}>
              <img
                alt="profile_pic"
                src={result == null ? localUser.photoUrl : result}
              />
            </div>
          </div>
          <div>
            <p style={{ fontSize: "20px" }}>{localUser.username}</p>
            <p
              style={{
                color: "#0095f6",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={selectImage}
            >
              Change Profile Photo
            </p>
          </div>
          <input
            id="select-file"
            type="file"
            accept="image/jpeg"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setResult(URL.createObjectURL(e.target.files[0]));
            }}
            hidden="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default EditUser;
