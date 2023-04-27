import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";
import Q1_VT from "../../../Img/Q1 - VT.png";
import Q1_BL from "../../../Img/Q1 - BL.png";
import BT_VT from "../../../Img/BT - VT.png";
import BT_BL from "../../../Img/BT - BL.png";

function Trips() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.heading}>
          <h1>
            ---------------------------------------- All Routes
            ----------------------------------------
          </h1>
        </div>
        <div className={styles.routes}>
          <div>
            <div>
              <img src={Q1_VT}></img>
            </div>
            <div>
              <img src={Q1_BL}></img>
            </div>
          </div>
          <div>
            <div>
              <img src={BT_VT}></img>
            </div>
            <div>
              <img src={BT_BL}></img>
            </div>
          </div>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default Trips;
