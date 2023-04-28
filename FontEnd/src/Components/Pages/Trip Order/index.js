import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";

function TripOrder() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>Trip Order</div>
    </AnimatedOutlet>
  );
}
export default TripOrder;
