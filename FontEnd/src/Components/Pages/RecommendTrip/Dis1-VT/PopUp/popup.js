import classNames from "classnames";
import React, { createRef, useState } from "react";
import styles from "./popup.module.scss";
import CustomInput from "../../../CustomInput";

function Popup({ handleClose, confbutton }) {
  const guestRef = createRef();
  const phoneRef = createRef();
  const emailRef = createRef();
  const addressRef = createRef();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [add, setAdd] = useState("");

  return (
    <div className={styles.popupcontainer}>
      <div className={styles.popup}>
        <button className={styles.closebutton} onClick={handleClose}>
          X
        </button>
        <div>
          <label>Name</label>
          <CustomInput></CustomInput>
          <label>Gender</label>
          <select></select>
          <label>Phone</label>
          <CustomInput></CustomInput>
          <label>Email</label>
          <CustomInput></CustomInput>
          <label>Address</label>
          <CustomInput></CustomInput>
          <button onClick={confbutton}>Book</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
