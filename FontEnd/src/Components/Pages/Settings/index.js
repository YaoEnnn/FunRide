import { createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../CustomInput";
import styles from "./styles.module.scss";
import axios from "axios";
import { error, success } from "../../lib/toast";
import Popup from "./PopUp/popup";
function Settings() {
  //For the Profile function//
  const [profile, setProfile] = useState([]);
  const userNameRef = createRef();
  const nameRef = createRef();
  const emailRef = createRef();
  const addRef = createRef();
  const phoneRef = createRef();
  const genderArray = ["Unknown", "Male", "Female"];
  const [gender, setGender] = useState("");
  const [defaultGender, setDefaultGender] = useState("");

  //For the Change password function//
  const oldPassRef = createRef();
  const newPassRef = createRef();
  const confirmPassRef = createRef();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  //For the Logout function//
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();
  const handleButtonClick = () => {
    setPopup(true);
  };
  const handleClosePopup = () => {
    setPopup(false);
  };
  const confbutton = () => {
    axios.post("admin/logout").then((resp) => {
      if (resp.data.status === "OK") {
        success("Logged out successfully");
        localStorage.clear();
        navigate("/");
      }
    });
  };
  const confButtonAll = () => {
    axios.post("admin/logout-all-devices").then((resp) => {
      if (resp.data.status === "OK") {
        success("Logged out on all devices successfully");
        localStorage.clear();
        navigate("/");
      }
    });
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  useEffect(() => {
    axios.post("admin/my-profile").then((resp) => {
      const temp = resp.data.msg;
      console.log(temp);
      setProfile(temp);
      setGender(temp.gender);
      setDefaultGender(temp.gender);
      console.log(gender);
      console.log(defaultGender);
    });
  }, []);

  return (
    <div className={styles.base}>
      <div className={styles.header}>
        <h1>--Profile--</h1>
      </div>
      <div className={styles.profile}>
        <div>
          <label>Name of the User:</label>
          <CustomInput
            type="text"
            custom_ref={nameRef}
            default_value={profile.name}
          ></CustomInput>
          <label>Phone Number:</label>
          <CustomInput
            type="text"
            custom_ref={phoneRef}
            default_value={profile.phone}
          ></CustomInput>
          <label>Address:</label>
          <CustomInput
            type="text"
            custom_ref={addRef}
            default_value={profile.address}
          ></CustomInput>
          <label>Email:</label>
          <CustomInput
            type="mail"
            variant="email"
            custom_ref={emailRef}
            default_value={profile.email}
          ></CustomInput>
          <label>Gender:</label>
          <select
            value={gender}
            onChange={handleGenderChange}
            defaultValue={defaultGender}
          >
            {genderArray.map((option) => (
              <option
                key={option}
                value={option}
                defaultValue={gender}
                onChange={handleGenderChange}
              >
                {option}
              </option>
            ))}
          </select>
          <label>Role:</label>
          <p>{profile.role}</p>
          <button
            onClick={() => {
              console.log(gender);
              axios
                .post("admin/update-info/", {
                  name: nameRef.current.value,
                  phone: phoneRef.current.value,
                  address: addRef.current.value,
                  email: emailRef.current.value,
                  gender: gender,
                })
                .then((resp) => {
                  console.log(resp);
                  if (resp.data.err) {
                    error("Your email is invalid");
                    return;
                  }
                  if (resp.data.status === "OK") {
                    success("Your information has been updated");
                  }
                });
            }}
          >
            Update
          </button>
        </div>
      </div>
      <div className={styles.passwordChange}>
        <h1>--Customize your Password--</h1>
        <div>
          <CustomInput
            custom_ref={oldPassRef}
            placeholder={"Your old password"}
            variant={oldPass}
            type="password"
            onClick={() => {
              setOldPass("");
            }}
          ></CustomInput>
          <CustomInput
            custom_ref={newPassRef}
            placeholder={"Your new password"}
            variant={newPass}
            type="password"
            onClick={() => {
              setNewPass("");
            }}
          ></CustomInput>
          <CustomInput
            custom_ref={confirmPassRef}
            placeholder={"Confirm your new password"}
            variant={confirmPass}
            type="password"
            onClick={() => {
              setConfirmPass("");
            }}
          ></CustomInput>
          <button
            onClick={() => {
              const oldpass = oldPassRef.current.value.trim();
              const newpass = newPassRef.current.value.trim();
              const confirmpass = confirmPassRef.current.value.trim();

              if (!oldpass) {
                error("Please enter your old password");
                setOldPass("error");
                return;
              }

              if (!newpass) {
                error("Please enter your new password");
                setNewPass("error");
                return;
              }
              if (!confirmpass) {
                error("Please enter the confirmed password");
                setConfirmPass("error");
                return;
              }

              axios
                .post("admin/change-password", {
                  old_password: oldpass,
                  new_password: newpass,
                  verify_password: confirmpass,
                })
                .then((resp) => {
                  console.log(resp);
                  if (resp.data.status === "FAIL") {
                    if (resp.data.err === "Wrong Old Password") {
                      error(resp.data.err);
                      setOldPass("error");
                      return;
                    }
                    if (
                      resp.data.err ===
                      "New Password is The Same To Old Password"
                    ) {
                      error(resp.data.err);
                      setNewPass("error");
                      return;
                    }
                    if (resp.data.err === "Double Check Password Failed") {
                      error(resp.data.err);
                      setConfirmPass("error");
                      return;
                    }
                  } else {
                    success("Password changed successfully");

                    oldPassRef.current.value = "";
                    newPassRef.current.value = "";
                    confirmPassRef.current.value = "";
                  }
                });
            }}
          >
            Change Password
          </button>
        </div>
      </div>
      <div className={styles.Logout}>
        <h1>--Log Out Session--</h1>
        <div>
          <button onClick={handleButtonClick}>Log Out</button>
          {popup && (
            <Popup
              handleClose={handleClosePopup}
              confbutton={confbutton}
              announcement={"Warning"}
              yousure={"Are your sure you want to log out?"}
              confirm={"Confirm"}
            ></Popup>
          )}

          <button onClick={handleButtonClick}>Log Out of All Devices</button>
          {popup && (
            <Popup
              handleClose={handleClosePopup}
              confbutton={confButtonAll}
              announcement={"Warning"}
              yousure={"Are your sure you want to log out on all devices?"}
              confirm={"Confirm"}
            ></Popup>
          )}
        </div>
      </div>
    </div>
  );
}
export default Settings;
