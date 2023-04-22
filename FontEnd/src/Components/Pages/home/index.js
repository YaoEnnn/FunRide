import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";

function Home() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.header}></div>
      </div>
    </AnimatedOutlet>
  );
}
export default Home;
