import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component, createRef, useState } from "react";
import CustomInput from "../../CustomInput";
import { error, success } from "../../../Components/lib/toast";
import axios from "axios";

function PrivateTrip() {
  const [date, setDate] = useState();
  const [backDate, setBackDate] = useState();
  const guestRef = createRef();
  const nameRef = createRef();
  const emailRef = createRef();
  const addRef = createRef();
  const phoneRef = createRef();
  const departureTimeRef = createRef();
  const departLocatoinRef = createRef();
  const desinationRef = createRef();
  const backTimeRef = createRef();
  const noteRef = createRef();
  const genderArray = ["Unknown", "Male", "Female"];
  const carArray = ["Limousine", "Sleeper-Bus", "Bus"];
  const [gender, setGender] = useState("");
  const [car, setCar] = useState("");
  const [end, setEnd] = useState("");
  const [start, setStart] = useState("");

  const [isChecked, setchecked] = useState(false);
  const handleCheckBox = (e) => {
    console.log(e.target.checked);

    setchecked(e.target.checked);
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [add, setAdd] = useState("");
  const [phone, setPhone] = useState("");
  const [guestNumber, setGuestNumber] = useState("");
  const [time, setTime] = useState("");
  const [departLocation, setDepartLocation] = useState("");
  const [destination, setDestination] = useState("");

  const handleGenderChange = (event) => {
    setGender(event.target.value);
    console.log(event.target.value);
  };

  const handleCarChange = (event) => {
    setCar(event.target.value);
    console.log(event.target.value);
  };
  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.container}>
          <h1>Private Trip</h1>
          <label>Name</label>
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
          <label>Number of guests</label>
          <CustomInput
            type="number"
            variant={guestNumber}
            custom_ref={guestRef}
            onClick={() => {
              setGuestNumber("");
            }}
          ></CustomInput>
          <section>
            <div>
              <label>Departure day</label>
              <input
                type="date"
                onChange={(e) => {
                  setDate(e.target.value);
                  console.log(e.target.value);
                }}
              ></input>
            </div>
            <div>
              <label>Departure time</label>
              <CustomInput
                type="text"
                variant={time}
                custom_ref={departureTimeRef}
                onClick={() => {
                  setTime("");
                }}
              ></CustomInput>
            </div>
          </section>
          <section>
            <div>
              <label>Departure location</label>
              <CustomInput
                type="text"
                variant={departLocation}
                custom_ref={departLocatoinRef}
                onClick={() => {
                  setDepartLocation("");
                }}
              ></CustomInput>
            </div>
            <div>
              <label>Destination</label>
              <CustomInput
                type="text"
                variant={destination}
                custom_ref={desinationRef}
                onClick={() => {
                  setDestination("");
                }}
              ></CustomInput>
            </div>
          </section>
          <div>
            <label>Round Trip</label>
            <input
              className={styles.checkbox}
              onChange={handleCheckBox}
              type="checkbox"
            ></input>
            {isChecked === true && (
              <>
                <label>Back Day</label>
                <input
                  type="date"
                  onChange={(e) => {
                    setBackDate(e.target.value);
                    console.log(e.target.value);
                  }}
                ></input>
                <label>Back Time</label>
                <CustomInput
                  type="number"
                  custom_ref={backTimeRef}
                ></CustomInput>
              </>
            )}
          </div>
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
          <label>Note</label>
          <CustomInput type="text" custom_ref={noteRef}></CustomInput>
          <button
            onClick={() => {
              if (!nameRef.current.value) {
                error("Enter your name");
                setName("error");
              }
              if (!phoneRef.current.value) {
                error("Enter your phone");
                setPhone("error");
              }
              if (!emailRef.current.value) {
                error("Enter your email");
                setEmail("error");
                return;
              }
              if (gender === "Unknown" || gender === "") {
                error("Choose your gender");
                return;
              }
              if (!departLocatoinRef.current.value) {
                error("Please enter departure location");
                setDepartLocation("error");
                return;
              }
              if (!desinationRef.current.value) {
                error("Please enter your destination");
                setDestination("error");
                return;
              }
              const a =
                backTimeRef.current != null ? backTimeRef.current.value : null;
              const b = backDate != null ? backDate : null;
              console.log(b);
              axios
                .post("private-trip/order", {
                  name: nameRef.current.value,
                  phone: phoneRef.current.value,
                  email: emailRef.current.value,
                  gender: gender,
                  number_guest: guestRef.current.value,
                  departure_day: date,
                  departure_time: departureTimeRef.current.value,
                  start: departLocatoinRef.current.value,
                  end: desinationRef.current.value,
                  round_trip: isChecked,
                  car_type: car,
                  back_day: b,
                  back_time: a,
                  note: noteRef.current.value,
                })
                .then((resp) => {
                  console.log(resp);
                  if (resp.data.status === "FAIL") {
                    error(resp.data.err);
                    return;
                  }
                  success("Private trip successfully added");
                });
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default PrivateTrip;
