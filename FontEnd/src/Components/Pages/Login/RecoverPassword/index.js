import styles from "./style.module.scss";
import AnimatedOutlet from "../../../AnimatedOutlet";
import React, { Component, createRef, useState } from "react";
import CustomInput from "../../../CustomInput";
import { error, success } from "../../../lib/toast";
import axios from "axios";
import { useOutlet, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const emailRef = createRef();
  const [email, setEmail] = useState("");

  const outlet = useOutlet();
  if (outlet) {
    return outlet;
  }

  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <h1>Enter your email</h1>
        <CustomInput
          custom_ref={emailRef}
          variant={email}
          type="email"
          onClick={() => {
            setEmail("");
          }}
        ></CustomInput>
        <button
          onClick={() => {
            if (!emailRef.current.value) {
              error("Please enter your email");
              setEmail("error");
            }
            axios
              .post("admin/forgot-password", {
                email: emailRef.current.value,
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
          Check mail
        </button>
      </div>
    </AnimatedOutlet>
  );
}
export default ForgotPassword;
