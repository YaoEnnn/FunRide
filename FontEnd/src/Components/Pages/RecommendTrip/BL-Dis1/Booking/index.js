import styles from "./style.module.scss";
import AnimatedOutlet from "../../../AnimatedOutlet";
import React, { Component, useEffect } from "react";
import CustomInput from "../../../CustomInput";
import { createRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SeatPicker from "../../../SeatPicker";
import { error, success } from "../../../lib/toast";

function Booking() {
  const id = useParams();
  const nameRef = createRef();
  const emailRef = createRef();
  const addRef = createRef();
  const phoneRef = createRef();
  const discountRef = createRef();
  const genderArray = ["Unknown", "Male", "Female"];
  const [gender, setGender] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [add, setAdd] = useState("");
  const [phone, setPhone] = useState("");
  const [discount, setDiscount] = useState("");

  const [vehicle, setVehicle] = useState("");
  const [seat, SetSeat] = useState([]);

  const handleSetSeat = () => {};

  const handleGenderChange = (event) => {
    setGender(event.target.value);
    console.log(event.target.value);
  };
  useEffect(() => {
    axios.post(`trip/get/${id.id}`).then((resp) => {
      setVehicle(resp.data.msg.car_type);
    }, []);
  });

  // if (vehicle === "Limousine") {
  //   <SeatPicker
  //     onChange={(e) => {
  //       console.log(e);
  //     }}
  //     section1={[{ i: 1 }, { i: 2 }, { i: 3 }]}
  //     section2={[{ i: 1 }, { i: 2 }, { i: 3 }]}
  //   ></SeatPicker>;
  // }
  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.header}>
          <h1>--Book your ticket--</h1>
        </div>
        <div className={styles.allValue}>
          <label>Name:</label>
          <CustomInput
            type="text"
            variant={name}
            custom_ref={nameRef}
            onClick={() => {
              setName("");
            }}
          ></CustomInput>
          <label>Phone Number</label>
          <CustomInput
            type="number"
            variant={phone}
            custom_ref={phoneRef}
            onClick={() => {
              setPhone("");
            }}
          ></CustomInput>
          <label>Address:</label>
          <CustomInput
            type="text"
            variant={add}
            custom_ref={addRef}
            onClick={() => {
              setAdd("");
            }}
          ></CustomInput>
          <label>Email:</label>
          <CustomInput
            type="mail"
            variant={email}
            onClick={() => {
              setEmail("");
            }}
            custom_ref={emailRef}
          ></CustomInput>
          <label>Gender:</label>
          <select value={gender} onChange={handleGenderChange}>
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
          <label>Discount code:</label>
          <CustomInput
            type="text"
            variant={discount}
            custom_ref={discountRef}
            onClick={() => {
              setDiscount("");
            }}
          ></CustomInput>
        </div>
        <div className={styles.bookSeat}>
          <div>
            <h1>Please choose your seat</h1>
          </div>
          {vehicle === "Limousine" && (
            <SeatPicker
              onChange={(seatChange) => {
                let a = [];
                for (const i of seatChange) {
                  a.push(i.id);
                  console.log(a);
                }
                SetSeat(a);
                // console.log(seatChange);
              }}
              section1={[{ i: 1 }, { i: 2 }, { i: 3 }, { i: 4 }]}
              section2={[{ i: 5 }, { i: 6 }, { i: 7 }, { i: 8 }]}
            ></SeatPicker>
          )}
          {vehicle === "Bus" && (
            <SeatPicker
              onChange={(seatChange) => {
                let a = [];
                for (const i of seatChange) {
                  a.push(i.id);
                  console.log(a);
                }
                SetSeat(a);
                // console.log(seatChange);
              }}
              section1={[
                { i: 1 },
                { i: 2 },
                { i: 3 },
                { i: 4 },
                { i: 5 },
                { i: 6 },
                { i: 7 },
                { i: 8 },
                { i: 9 },
                { i: 10 },
                { i: 11 },
                { i: 12 },
                { i: 13 },
                { i: 14 },
              ]}
              section2={[
                { i: 15 },
                { i: 16 },
                { i: 17 },
                { i: 18 },
                { i: 19 },
                { i: 20 },
                { i: 21 },
                { i: 22 },
                { i: 23 },
                { i: 24 },
                { i: 25 },
                { i: 26 },
                { i: 27 },
                { i: 28 },
              ]}
            ></SeatPicker>
          )}
          {vehicle === "Sleeper-Bus" && (
            <SeatPicker
              onChange={(seatChange) => {
                let a = [];
                for (const i of seatChange) {
                  a.push(i.id);
                  console.log(a);
                }
                SetSeat(a);
                // console.log(seatChange);
              }}
              section1={[
                { i: 1 },
                { i: 2 },
                { i: 3 },
                { i: 4 },
                { i: 5 },
                { i: 6 },
                { i: 7 },
                { i: 8 },
              ]}
              section2={[
                { i: 9 },
                { i: 10 },
                { i: 11 },
                { i: 12 },
                { i: 13 },
                { i: 14 },
                { i: 15 },
                { i: 16 },
                { i: 17 },
              ]}
            ></SeatPicker>
          )}
          <button
            onClick={() => {
              console.log(seat);
              if (!nameRef.current.value) {
                error("Please enter your name");
                setName("error");
                return;
              }
              if (!phoneRef.current.value) {
                error("Please enter your phone number");
                setPhone("error");
                return;
              }
              if (!addRef.current.value) {
                error("Please enter your Address");
                setAdd("error");
                return;
              }
              if (!emailRef.current.value) {
                error("Please enter your mail");
                setEmail("error");
                return;
              }
              if (gender === "Unknown") {
                error("Please choose your gender");
                return;
              }
              axios
                .post(`trip/${id.id}/order`, {
                  name: nameRef.current.value,
                  gender: gender,
                  phone: phoneRef.current.value,
                  email: emailRef.current.value,
                  address: addRef.current.value,
                  offer: discountRef.current.value,
                  seat: seat,
                })
                .then((resp) => {
                  if (resp.data.status === "FAIL") {
                    error(resp.data.err);
                    return;
                  }
                  success("sucessfully book");
                  console.log(resp.data.msg);
                });
            }}
          >
            Book Ticket
          </button>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default Booking;
