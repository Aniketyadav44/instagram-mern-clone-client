import React from "react";
import styles from "./Modal.module.css";

const Modal = (props) => {
  const closeModal = (e) => {
    if (e.target.id !== "modal-bg") {
      return;
    }
    props.closeModal(false);
  };

  return (
    <div id="modal-bg" onClick={closeModal} className={styles.modalBackground}>
      <div className={styles.cancelDiv}></div>
      <div
        className={
          props.type === "popup"
            ? styles.modalContainer2
            : styles.modalContainer
        }
      >
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
