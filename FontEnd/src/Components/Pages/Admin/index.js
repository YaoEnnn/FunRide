import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import axios from "axios";
import AnimatedOutlet from "../../AnimatedOutlet";
import Popup from "./PopUp/popup";
import { success } from "../../lib/toast";
import { useOutlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [showAdmin, setShowAdmin] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [count, setCount] = useState(0);
  const handleButtonClick = () => {
    setShowPopUp(true);
  };
  const handleClosePopUp = () => {
    setShowPopUp(false);
  };
  const confbutton = (a) => {
    axios.delete(`manager/delete-admin/${a.id}`).then((resp) => {
      console.log(resp.data);
      if (resp.data.status === "OK") {
        success("Successfully deleted user");
        setCount(count + 1);
      }
    });
    setShowPopUp(false);
  };

  useEffect(() => {
    axios.post("manager/display-all-admin").then((resp) => {
      console.log(resp.data.msg);
      setShowAdmin(resp.data.msg);
    });
  }, []);

  const outlet = useOutlet();
  if (outlet) {
    return outlet;
  }

  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.header}>
          <h1>--Display Admin--</h1>
          <button
            onClick={() => {
              navigate("add");
            }}
          >
            Add a new admin
          </button>
        </div>
        <div className={styles.table}>
          <div>
            <div>
              <div>
                <label>Name</label>
                <label>Email</label>
                <label>Actions</label>
              </div>
            </div>
            <div>
              {showAdmin.map((e, i) => {
                return (
                  <div key={i}>
                    <label>{e.name}</label>
                    <label>{e.email}</label>
                    <label
                      onClick={() => {
                        setCurrentAdmin(e);
                        setShowPopUp(true);
                        console.log(e);
                      }}
                    >
                      Delete
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {showPopUp && (
          <Popup
            handleClose={handleClosePopUp}
            announcement={"Warning"}
            confirm={"Confirm"}
            yousure={"Are you sure you want to delete this admin?"}
            confbutton={() => {
              confbutton(currentAdmin);
            }}
          ></Popup>
        )}
      </div>
    </AnimatedOutlet>
  );
};
export default Admin;
