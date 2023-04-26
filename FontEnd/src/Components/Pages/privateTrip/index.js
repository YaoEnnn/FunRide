import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";

function PrivateTrip() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>Private Trip Page</div>
    </AnimatedOutlet>
  );
}
export default PrivateTrip;
