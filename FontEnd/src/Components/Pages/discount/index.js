import { useEffect, useState } from "react";
import AnimatedOutlet from "../../AnimatedOutlet";
import styles from "./styles.module.scss";
import axios from "axios";
import { success, error } from "../../lib/toast";
import { useContext } from "react";
import { loginContext } from "../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Popup from "../Settings/PopUp/popup";
import { useNavigate } from "react-router-dom";
import { useOutlet } from "react-router-dom";

function Discount() {
  const [showDiscount, setShowDiscount] = useState([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const isBigRole = useContext(loginContext);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  const [count, setCount] = useState(0);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const confbutton = (a) => {
    axios.delete(`manager/delete-discount/${a.id}`).then((resp) => {
      console.log(resp.data);
      if (resp.data.status === "OK") {
        success("Successfully deleted the discount");
        setCount(count + 1);
      }
    });

    console.log(count);
    setShowPopup(false);
  };

  useEffect(() => {
    axios.post("admin/display-all-discount").then((resp) => {
      console.log(resp.data.msg);
      setShowDiscount(resp.data.msg);
    });
  }, [count]);

  const outlet = useOutlet();
  if (outlet) {
    return outlet;
  }
  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.header}>
          <h1>--Discount--</h1>
          <button
            onClick={() => {
              navigate("add");
            }}
          >
            Create a new discount
          </button>
        </div>
        <div className={styles.table}>
          <div>
            <div>
              <div>
                <label>Code</label>
                <label>Discount</label>
                <label>Available</label>
                <label>Created on</label>
                {isBigRole.isManager === true && <label>Actions</label>}
              </div>
            </div>
            <div>
              {showDiscount.map((e, i) => {
                return (
                  <div key={i}>
                    <label>{e.code}</label>
                    <label>{e.discount}</label>
                    <label>{e.available}</label>
                    <label>{e.created_on}</label>
                    {isBigRole.isManager === true && (
                      <FontAwesomeIcon
                        title="Delete discount"
                        icon={faTrash}
                        onClick={() => {
                          setCurrentDiscount(e);
                          setShowPopup(true);
                          console.log(currentDiscount);
                        }}
                      ></FontAwesomeIcon>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {showPopup && (
          <Popup
            handleClose={handleClosePopup}
            announcement={"Warning"}
            yousure={"Are you sure you want to delete this code"}
            confirm={"Confirm"}
            confbutton={() => {
              confbutton(currentDiscount);
            }}
          ></Popup>
        )}
      </div>
    </AnimatedOutlet>
  );
}
export default Discount;
