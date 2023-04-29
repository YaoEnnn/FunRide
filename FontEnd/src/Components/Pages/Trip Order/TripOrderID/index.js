import styles from "./style.module.scss";
import AnimatedOutlet from "../../../AnimatedOutlet";
import React, { Component, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PopUp from "./PopUp/popup";
import { success, error } from "../../../lib/toast";
import { useNavigate } from "react-router-dom";

function TripOrderID() {
  const id = useParams();
  const navigate = useNavigate();
  const [TripDetail, setTripDetail] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [isChecked, setchecked] = useState(false);

  const handleCheckBox = (e) => {
    console.log(e.target.checked);

    setchecked(e.target.checked);
  };
  const handleClosePopUp = () => {
    setShowPopUp(false);
  };
  const confbutton = () => {
    console.log(isChecked);
    console.log(id);
    axios
      .post(`admin/delete/order/${id.id}`, {
        send_mail: isChecked,
      })
      .then((resp) => {
        console.log(resp.data);
        success("Trip deleted successfully");
        navigate("../");
      });
  };

  useEffect(() => {
    axios.post(`admin/get/order/${id.id}`).then((resp) => {
      setTripDetail(resp.data.msg);
      console.log(resp.data.msg);
    });
  }, []);
  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.header}>
          <h1>Trip Detail</h1>
        </div>
        <div className={styles.details}>
          <div>
            <label>Name: {TripDetail.name}</label>
            <label>Type of Car: {TripDetail.car_type}</label>
            <label>Departure Day: {TripDetail.departure_day}</label>
            <label>Email: {TripDetail.email}</label>
            <label>Gender: {TripDetail.gender}</label>
            <label>Address: {TripDetail.address}</label>
            <label>Arriving at: {TripDetail.arrived_time}</label>
          </div>
          <div>
            <label>Phone: {TripDetail.phone}</label>
            <label>Discount Code {TripDetail.offer_code}</label>
            <label>Departure Time: {TripDetail.departure_time}</label>
            <label>From: {TripDetail.start}</label>
            <label>To: {TripDetail.end}</label>
            <label>Recepit: {TripDetail.receipt}</label>
            <label>Price: {TripDetail.price} VND</label>
          </div>
        </div>
        <button
          onClick={() => {
            setShowPopUp(true);
          }}
        >
          Delete Trip
        </button>
      </div>
      {showPopUp && (
        <PopUp
          handleClose={handleClosePopUp}
          announcement={"Notice"}
          confirm={"Confirm"}
          confbutton={confbutton}
          yousure={
            "Are you sure you want to delete this trip. If you want to send an email to the customer, check this checkbox"
          }
          handlecheckbox={handleCheckBox}
        ></PopUp>
      )}
      ;
    </AnimatedOutlet>
  );
}
export default TripOrderID;
