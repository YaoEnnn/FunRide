import styles from "./style.module.scss";
import AnimatedOutlet from "../../../../AnimatedOutlet";
import React, { Component, createRef, useState } from "react";
import CustomInput from "../../../../CustomInput";
import { error, success } from "../../../../lib/toast";
import axios from "axios";
import { useNavigate, useOutlet } from "react-router-dom";

function EnterCode() {
  const emailRef = createRef();
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const newPasswordRef = createRef();
  const confirmPasswordRef = createRef();

  const outlet = useOutlet();
  if (outlet) {
    return outlet;
  }

  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <h1>Enter your recovery code</h1>
        <CustomInput
          custom_ref={emailRef}
          type="number"
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
              .post("admin/verify-code", {
                code: emailRef.current.value,
              })
              .then((resp) => {
                console.log(resp.data.msg);
                if (resp.data.status === "FAIL") {
                  error(resp.data.err);
                }
                if (resp.data.status === "OK") {
                  success("You can now enter your new password");
                  setId(resp.data.msg);
                  console.log(id);
                }
              });
          }}
        >
          Proceed
        </button>

        <h1>Enter your new password</h1>
        <label>New Password</label>
        <CustomInput
          custom_ref={newPasswordRef}
          type="password"
          variant={email}
          onClick={() => {}}
        ></CustomInput>
        <label>Enter password again</label>
        <CustomInput
          custom_ref={confirmPasswordRef}
          type="password"
          variant={email}
          onClick={() => {}}
        ></CustomInput>
        <button
          onClick={() => {
            console.log(id);
            if (!newPasswordRef.current.value) {
              error("Please enter your new password");
              return;
            }
            if (!confirmPasswordRef.current.value) {
              error("Please reenter your new password");
              return;
            }
            axios
              .post(`admin/update-forgot-password/${id}`, {
                new_password: newPasswordRef.current.value,
                verify_password: confirmPasswordRef.current.value,
              })
              .then((resp) => {
                console.log(resp.data.msg);
                if (resp.data.status === "FAIL") {
                  error(resp.data.err);
                }
                if (resp.data.status === "OK") {
                  success("Congrats you successfully updated your password");
                  navigate("/login");
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
export default EnterCode;
