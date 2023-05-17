import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component, createRef, useState, useEffect } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import axios from "axios";
import CustomInput from "../../CustomInput";

function TripOrder() {
  const [showTrip, setShowTrip] = useState([]);
  const navigate = useNavigate();
  const searchRef = createRef();

  useEffect(() => {
    axios.post("admin/display-all/order").then((resp) => {
      setShowTrip(resp.data.msg);
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
          <h1>--Order of Trip--</h1>
          <CustomInput
            className={styles.Custominput}
            type="text"
            custom_ref={searchRef}
            placeholder={"Search trip"}
          ></CustomInput>
          <button
            onClick={() => {
              console.log(searchRef.current.value);
              axios

                .post("admin/search-order", {
                  user_data: searchRef.current.value,
                })
                .then((esp) => {
                  setShowTrip(esp.data.msg);
                });
            }}
          >
            Search
          </button>
        </div>
        <div className={styles.privateOrder}>
          <div>
            <div>
              <div>
                <label>Name</label>
                <label>Email</label>
                <label>Departure Day</label>
                <label>Phone</label>
                <label>Car Type</label>
              </div>
            </div>
            <div>
              {showTrip?.map((e, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      // axios.post(`admin/get/private-order/${e.id}`,)
                      navigate(`${e.id}`);
                    }}
                  >
                    <label>{e.name}</label>
                    <label>{e.email}</label>
                    <label>{e.departure_day}</label>
                    <label>{e.phone}</label>
                    <label>{e.car_type}</label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default TripOrder;
