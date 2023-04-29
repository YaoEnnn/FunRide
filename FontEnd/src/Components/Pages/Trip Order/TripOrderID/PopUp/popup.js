import classNames from "classnames";
import React from "react";
import styles from "./popup.module.scss";

function Popup({
  handleClose,
  confbutton,
  announcement,
  confirm,
  yousure,
  handlecheckbox,
}) {
  return (
    <div className={styles.popupcontainer}>
      <div className={styles.popup}>
        <button className={styles.closebutton} onClick={handleClose}>
          X
        </button>
        <div>
          <div>{announcement}</div>
          <label>{yousure}</label>
          <input type="checkbox" onChange={handlecheckbox}></input>
          <button onClick={confbutton}>{confirm}</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
