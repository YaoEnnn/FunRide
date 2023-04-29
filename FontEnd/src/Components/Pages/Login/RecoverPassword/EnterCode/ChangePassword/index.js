import styles from "./style.module.scss";
import AnimatedOutlet from "../../../../../AnimatedOutlet";
import React, { Component, createRef, useState } from "react";
import CustomInput from "../../../../../CustomInput";
import { error, success } from "../../../../../lib/toast";
import axios from "axios";
import { useNavigate, useOutlet } from "react-router-dom";

function ChangePassword() {
  const emailRef = createRef();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const outlet = useOutlet();
  if (outlet) {
    return outlet;
  }

  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <h1>Enter your recovery codel</h1>
        <CustomInput
          custom_ref={emailRef}
          type="text"
          variant={email}
          onClick={() => {
            setEmail("");
          }}
        ></CustomInput>
        <button
          onClick={() => {
            if (!emailRef.current.value) {
              error("Please enter your recovery code");
              setEmail("error");
            }
            axios
              .post("admin/verfiy-code", {
                code: emailRef.current.value,
              })
              .then((resp) => {
                console.log(resp.data.msg);
                if (resp.data.status === "FAIL") {
                  error(resp.data.err);
                }
                if (resp.data.status === "OK") {
                  navigate("EnterCode");
                }
              });
          }}
        >
          Proceed
        </button>
      </div>
    </AnimatedOutlet>
  );
}
export default ChangePassword;
