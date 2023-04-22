import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";

function News() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>News Page</div>
    </AnimatedOutlet>
  );
}
export default News;
