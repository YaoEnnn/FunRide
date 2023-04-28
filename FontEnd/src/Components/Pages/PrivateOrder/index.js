import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component, useEffect, useState, createRef } from "react";
import axios from "axios";
import CustomInput from "../../CustomInput";
import { useNavigate, useOutlet } from "react-router-dom";

function PrivateOrder() {
  const [showPrivate, setShowPrivate] = useState([]);
  const [currentPrivate, setCurrentPrivate] = useState(null);
  const navigate = useNavigate();
  const searchRef = createRef();
  useEffect(() => {
    axios.post("admin/display-all/private-order").then((resp) => {
      setShowPrivate(resp.data.msg);
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
          <h1>--Order of Private Trip--</h1>
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

                .post("admin/search-private-order", {
                  user_data: searchRef.current.value,
                })
                .then((esp) => {
                  setShowPrivate(esp.data.msg);
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
                <label>Number of Guests</label>
                <label>Departure Day</label>
                <label>Round Trip</label>
                <label>Car Type</label>
              </div>
            </div>
            <div>
              {showPrivate.map((e, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      // axios.post(`admin/get/private-order/${e.id}`,)
                      navigate(`${e.id}`);
                    }}
                  >
                    <label>{e.name}</label>
                    <label>{e.number_guest}</label>
                    <label>{e.departure_day}</label>
                    {e.round_trip === true ? (
                      <label>Yes</label>
                    ) : (
                      <label>No</label>
                    )}
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
export default PrivateOrder;
