import React, { useState, useContext, useEffect } from "react";
import styles from "./CreatePost.module.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const CreatePost = () => {
  const { state, dispatch } = useContext(UserContext);
  const [src, setSrc] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [result, setResult] = useState(null);

  const [showCrop, setShowCrop] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [error, setError] = useState(false);
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");

  const [url, setUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const history = useHistory();
  const token = localStorage.getItem("jwt");
  if (!token) {
    history.push("/signin");
  }

  const handleFileChange = (e) => {
    setSrc(URL.createObjectURL(e.target.files[0]));
    setResult(src);
    setShowCrop(true);
  };

  const handlePageRouting = () => {
    if (showCaption) {
      setShowCaption(false);
      setShowCrop(true);
    }
    if (showCrop) {
      setShowCrop(false);
      setShowCaption(true);
    }
  };

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          photoUrl: url,
          location: location,
          caption: caption,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setErrorMsg(data.error);
          } else {
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  function getCroppedImg() {
    setError(false);
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    // New lines to be added
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    const base64Image = canvas.toDataURL("image/jpeg");
    if (base64Image.includes("image/")) {
      setResult(base64Image);
      handlePageRouting();
    } else {
      setError(true);
      return;
    }
  }

  const resetCanvas = () => {
    setSrc(null);
  };

  const selectImage = () => {
    document.getElementById("select-file").click();
  };

  const upload = () => {
    const data = new FormData();
    data.append("file", result);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "aniketyadav");
    fetch("https://api.cloudinary.com/v1_1/aniketyadav/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((responseData) => {
        setUrl(responseData.url);
        console.log(url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.mainBody}>
      <div className={styles.mainDiv}>
        <div>
          {!src && (
            <div className={styles.selectFile}>
              <p>Please select a file to upload</p>
              <div className={styles.border}>
                <div className={styles.selectFileButton} onClick={selectImage}>
                  <UploadFileOutlinedIcon style={{ fontSize: "100px" }} />
                </div>
              </div>
              <input
                id="select-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden="hidden"
              />
            </div>
          )}
        </div>
        <div>
          {showCrop && src && (
            <div className={styles.cropDiv}>
              <h3 style={{ fontWeight: "bold", textAlign: "center" }}>
                <strong>Crop Image</strong>
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                <strong>Drag over image to Crop</strong>
              </p>
              <ReactCrop
                className={styles.croppingPreview}
                src={src}
                onImageLoaded={setImage}
                crop={crop}
                onChange={setCrop}
              />
              {error && (
                <div>
                  <p className={styles.error}>
                    Image must be cropped in 1:1 aspect ratio
                  </p>
                </div>
              )}
              <div className={styles.cropPageArroDiv}>
                <ArrowBackOutlinedIcon
                  className={styles.arrow}
                  onClick={resetCanvas}
                />
                <ArrowForwardOutlinedIcon
                  className={styles.arrow}
                  onClick={getCroppedImg}
                />
              </div>
            </div>
          )}
          {showCaption && (
            <div className={styles.captionDiv}>
              <p style={{ textAlign: "center" }}>
                <strong>Review Post</strong>
              </p>
              <img className={styles.preview} src={result} alt="cropped" />
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
              {errorMsg && (
                <div>
                  <p className={styles.error}>{errorMsg}</p>
                </div>
              )}
              <div className={styles.cropPageArroDiv}>
                <ArrowBackOutlinedIcon
                  className={styles.arrow}
                  onClick={handlePageRouting}
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
                  onClick={upload}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
