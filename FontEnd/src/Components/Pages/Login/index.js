import CustomInput from "../../CustomInput";
import styles from "./styles.module.scss";
import { useState, createRef, useContext } from "react";
import { error, success } from "../../lib/toast";
import axios from "axios";
import { loginContext } from "../../../App";
import AuthContext from "../../../context/AuthProvider";
import { useNavigate, useOutlet } from "react-router-dom";
function Login() {
  const usernameRef = createRef();
  const passwordRef = createRef();
  const btnRef = createRef();
  const navigate = useNavigate();

  const outlet = useOutlet();
  if (outlet) {
    return outlet;
  }

  return (
    <div className={styles.base}>
      <h1>Login Page</h1>
      <div>
        <CustomInput
          custom_ref={usernameRef}
          type="text"
          placeholder={"Username"}
        ></CustomInput>
        <CustomInput
          custom_ref={passwordRef}
          type="password"
          placeholder={"Password"}
        ></CustomInput>

        <button
          ref={btnRef}
          onClick={() => {
            const username = usernameRef.current.value.trim();
            const password = passwordRef.current.value.trim();

            if (!username) {
              error("Please input your username");
              return;
            }
            if (!password) {
              error("Please input your password");
              return;
            }

            axios
              .post("admin/login", {
                user_name: username,
                password: password,
              })
              .then((resp) => {
                console.log(resp.data);
                if (resp.data.status === "OK") {
                  localStorage.setItem("token", resp.data.msg);
                  axios.defaults.headers.common["Authorization"] =
                    localStorage.getItem("token");
                  navigate("/");
                }
              });
          }}
        >
          Confirm
        </button>
        <p
          onClick={() => {
            navigate("ForgotPassword");
          }}
        >
          Forgot Password
        </p>
      </div>
    </div>
  );
}
export default Login;
