import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";

function Contact() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>Contact Page</div>
    </AnimatedOutlet>
  );
}
export default Contact;
