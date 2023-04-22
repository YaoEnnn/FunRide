import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";

function Trips() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>Trips Page</div>
    </AnimatedOutlet>
  );
}
export default Trips;
