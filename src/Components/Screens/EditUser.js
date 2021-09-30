import React, { useState, useContext, useEffect } from "react";
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

  const deleteFromCloud = () => {
    const imageId = state.photoUrl.split("/");
    const imgId =
      imageId[imageId.length - 3] +
      "/" +
      imageId[imageId.length - 2] +
      "/" +
      imageId[imageId.length - 1];
    const imgPublicId = imgId.includes(".jpg")
      ? imgId.replace(".jpg", "")
      : imgId.replace(".jpeg", "");
    fetch("/delete", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        publicId: imgPublicId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        uploadNewPhoto();
      })
      .catch((err) => console.log(err));
  };

  const deletePhoto = () => {
    if (state.includes("no_image_h0h6lq")) {
      uploadNewPhoto();
    } else {
      history.goBack();
    }
  };
  console.log(state);

  const uploadNewPhoto = () => {};

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
                src={
                  result == null ? state.photoUrl : result
                }
              />
            </div>
          </div>
          <div>
            <p style={{ fontSize: "20px" }}>{state.username}</p>
            <div style={{ display: "flex" }}>
              {!state.photoUrl.includes("no_image_h0h6lq") && (
                <p
                  style={{
                    color: "#ed4956",
                    fontWeight: "bold",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    //deleteFromCloud();
                    // setLocalState((prevState) => {
                    //   return {
                    //     ...prevState,
                    //     photoUrl:
                    //       "https://res.cloudinary.com/aniketyadav/image/upload/v1632396298/no_image_h0h6lq.jpg",
                    //   };
                    // });
                  }}
                >
                  Remove Profile Photo
                </p>
              )}
              &nbsp;
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
          </div>
          <input
            id="select-file"
            type="file"
            accept="image/jpeg"
            onChange={(e) => {
              setImage(e.target.files[0]);
              image && setResult(URL.createObjectURL(e.target.files[0]));
              console.log(state);
              // image && deletePhoto();
            }}
            hidden="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default EditUser;
