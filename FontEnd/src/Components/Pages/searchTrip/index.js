import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";
import CustomInput from "../../CustomInput";
import DatePicker from "../../DatePicker";
function SearchTrip() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <section className={styles.mainInput}>
          <CustomInput
            className={styles.customInput}
            type="text"
            placeholder={"From"}
          ></CustomInput>
          <CustomInput
            className={styles.customInput}
            type="text"
            placeholder={"To"}
          ></CustomInput>
          <DatePicker></DatePicker>
        </section>
      </div>
    </AnimatedOutlet>
  );
}
export default SearchTrip;
