import classNames from "classnames";
import React, { createRef, useState } from "react";
import styles from "./popup.module.scss";
import CustomInput from "../../../CustomInput";
import { error, success } from "../../../lib/toast";
import axios from "axios";

function Popup({ handleClose, confbutton }) {
  const [date, setDate] = useState();
  const departTimeRef = createRef();
  const arrivedTimeRef = createRef();
  const priceRef = createRef();
  const carArray = ["Limousine", "Sleeper-Bus", "Bus"];
  const [car, setCar] = useState("");
  const [end, setEnd] = useState("");
  const [start, setStart] = useState("");

  const placeArray = [
    "District 1, HCMC",
    "BinhTan District, HCMC",
    "BaoLoc City",
    "VungTau City",
  ];

  const handleEndChange = (event) => {
    setEnd(event.target.value);
    console.log(event.target.value);
  };
  const handleStartChange = (event) => {
    setStart(event.target.value);
    console.log(event.target.value);
  };
  const handleCarChange = (event) => {
    setCar(event.target.value);
    console.log(event.target.value);
  };

  return (
    <div className={styles.popupcontainer}>
      <div className={styles.popup}>
        <button className={styles.closebutton} onClick={handleClose}>
          X
        </button>
        <div>
          <label>Start</label>
          <select
            value={start}
            onChange={handleStartChange}
            defaultValue={placeArray}
          >
            {placeArray.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label>End</label>
          <select
            value={end}
            onChange={handleEndChange}
            defaultValue={placeArray}
          >
            {placeArray.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label>Departure time</label>
          <CustomInput type="text" custom_ref={departTimeRef}></CustomInput>
          <label>Arrived Time</label>
          <CustomInput type="text" custom_ref={arrivedTimeRef}></CustomInput>
          <label>Price</label>
          <CustomInput type="number" custom_ref={priceRef}></CustomInput>
          <label>Departure Day</label>
          <input
            type="date"
            onChange={(e) => {
              setDate(e.target.value);
              console.log(e.target.value);
            }}
          ></input>
          <label>Type of Car</label>
          <select value={car} onChange={handleCarChange}>
            {carArray.map((option) => (
              <option
                key={option}
                value={option}
                defaultValue={car}
                onChange={handleCarChange}
              >
                {option}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (!departTimeRef.current.value) {
                error("Please enter a departure time");
                return;
              }
              if (!arrivedTimeRef.current.value) {
                error("Please enter the arrived time");
                return;
              }
              if (!priceRef.current.value) {
                error("Please enter a price for the trip");
                return;
              }
              if (date === null) {
                error("please enter a date for the departure");
                return;
              }
              axios
                .post("admin/add-trip", {
                  start: start,
                  end: end,
                  departure_time: departTimeRef.current.value,
                  arrived_time: arrivedTimeRef.current.value,
                  price: priceRef.current.value,
                  departure_day: date,
                  car_type: car,
                })
                .then((resp) => {
                  if (resp.data.status === "FAIL") {
                    error("resp.data.err");
                  }
                  success("Trip added successfully");
                });
            }}
          >
            Add Trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
