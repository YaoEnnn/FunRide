import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";

function SearchTrip() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>Search Trip Page</div>
    </AnimatedOutlet>
  );
}
export default SearchTrip;
