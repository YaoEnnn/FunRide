import { createRef, useState } from "react";
import AnimatedOutlet from "../../../AnimatedOutlet";
import CustomInput from "../../../CustomInput";
import styles from "./styles.module.scss";
import { error, success } from "../../../lib/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddAdmin() {
  const userNameRef = createRef();
  const passwordRef = createRef();
  const emailRef = createRef();
  const nameRef = createRef();
  const phoneRef = createRef();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.header}>
          <h1>--Add a new admin--</h1>
        </div>
        <div className={styles.addnew}>
          <label>Username:</label>
          <CustomInput
            type="text"
            custom_ref={userNameRef}
            placeholder={"username"}
            variant={username}
          ></CustomInput>
          <label>Password: </label>
          <CustomInput
            custom_ref={passwordRef}
            type="password"
            placeholder={"Password"}
            variant={password}
          ></CustomInput>
          <label>Email:</label>
          <CustomInput
            custom_ref={emailRef}
            placeholder={"example@gmail.com"}
            type="email"
          ></CustomInput>
          <label>Name:</label>
          <CustomInput
            type="text"
            custom_ref={nameRef}
            placeholder={"Bob"}
          ></CustomInput>
          <label>Phone:</label>
          <CustomInput
            type="text"
            custom_ref={phoneRef}
            placeholder={"0123456789"}
          ></CustomInput>
          <button
            onClick={() => {
              console.log(userNameRef.current.value);
              if (!userNameRef.current.value) {
                error("Please enter the username");
                return;
              }
              if (!passwordRef.current.value) {
                error("Please enter a password");
                return;
              }
              axios
                .post("manager/add-admin", {
                  user_name: userNameRef.current.value.trim(),
                  password: passwordRef.current.value.trim(),
                  email: emailRef.current.value.trim(),
                  name: nameRef.current.value.trim(),
                  phone: phoneRef.current.value.trim(),
                })
                .then((resp) => {
                  console.log(resp.data);
                  if (resp.data.status === "FAIL") {
                    if (resp.data.err === "Unvalid Email") {
                      error(resp.data.err);
                      return;
                    }
                    if (resp.data.err === "User Has Already Existed") {
                      error(resp.data.err);
                      return;
                    }
                  } else {
                    success(resp.data.msg);
                    navigate("../");
                  }
                });
            }}
          >
            Create a new admin
          </button>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default AddAdmin;
