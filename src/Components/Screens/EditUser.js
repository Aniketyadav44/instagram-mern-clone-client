import React, { useState, useContext, useEffect } from "react";
import styles from "./EditUser.module.css";
import { Link, useParams, useHistory } from "react-router-dom";
import { UserContext } from "../../App";

const EditUser = () => {
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const localUser = JSON.parse(localStorage.getItem("user"));

  const history = useHistory();
  const token = localStorage.getItem("jwt");

  if (!token) {
    history.push("/signin");
  }

  const selectImage = () => {
    document.getElementById("select-file").click();
  };

  const deleteFromCloud = () => {
    setLoading(true);
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
        console.log("delete success");
        fetch("/updatephoto", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            userId: state ? state._id : localUser._id,
            photoUrl:
              "https://res.cloudinary.com/aniketyadav/image/upload/v1632396298/no_image_h0h6lq.jpg",
          }),
        });
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const uploadToCloud = (file) => {
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "insta-clone-profilepic");
    data.append("cloud_name", "aniketyadav");
    fetch("https://api.cloudinary.com/v1_1/aniketyadav/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((responseData) => {
        setUrl(responseData.url);
        console.log(url);
        if (responseData) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, photoUrl: responseData.url })
          );
          dispatch({
            type: "UPDATEPHOTO",
            payload: responseData.url,
          });
          fetch("/updatephoto", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              userId: state ? state._id : localUser._id,
              photoUrl: responseData.url,
            }),
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removePhoto = () => {
    deleteFromCloud();
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...state,
        photoUrl:
          "https://res.cloudinary.com/aniketyadav/image/upload/v1632396298/no_image_h0h6lq.jpg",
      })
    );
    dispatch({
      type: "UPDATEPHOTO",
      payload:
        "https://res.cloudinary.com/aniketyadav/image/upload/v1632396298/no_image_h0h6lq.jpg",
    });
  };

  const updatePhoto = (file) => {
    if (state.photoUrl.includes("no_image_h0h6lq")) {
      uploadToCloud(file);
    } else {
      uploadToCloud(file);
      deleteFromCloud();
    }
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
                src={state ? state.photoUrl : localUser.photoUrl}
              />
            </div>
          </div>
          <div>
            <p style={{ fontSize: "20px" }}>
              {state ? state.username : localUser.username}
            </p>
            <div style={{ display: "flex" }}>
              {state && !state.photoUrl.includes("no_image_h0h6lq") && (
                <p
                  style={{
                    color: "#ed4956",
                    fontWeight: "bold",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    removePhoto();
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
                onClick={() => {
                  selectImage();
                }}
              >
                Change Profile Photo
              </p>
            </div>
          </div>
          <input
            id="select-file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                updatePhoto(e.target.files[0]);
              }
            }}
            hidden="hidden"
          />
        </div>
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default EditUser;
