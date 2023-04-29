import styles from "./style.module.scss";
import AnimatedOutlet from "../../../AnimatedOutlet";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { error } from "../../../lib/toast";
import { useNavigate } from "react-router-dom";
import { useOutlet } from "react-router-dom";
import { loginContext } from "../../../../App";
import Popup from "./";

function VTDis1() {
  const isBigRole = useContext(loginContext);
  const [showPopUp, setShowPopUp] = useState(false);
  const handleClosePopUp = () => {
    setShowPopUp(false);
  };

  const [date, setDate] = useState();
  const [currentTrip, setCurrentTrip] = useState(null);
  const [value, setvalue] = useState(null);
  const [end, setEnd] = useState("");
  const [trip, setTrip] = useState([]);
  const [booking, setBooking] = useState([]);
  const [count, setCount] = useState(20);
  const navigate = useNavigate();
  const loadMore = () => {
    setCount(count + 20);
  };

  const sortArray = [
    "Not filtered",
    "Order by Limousine",
    "Order by Bus",
    "Order by Sleeper Bus",
    "Low - High Price",
    "High - Low Price",
    "Earliest - Latest",
    "Latest - Earliest",
  ];
  const [sort, setSort] = useState("");
  const handleSortChange = (event) => {
    setSort(event.target.value);
    console.log(event.target.value);
    if (event.target.value === "Order by Limousine") {
      axios
        .post("trip/order-by-user", {
          start: "VungTau City",
          end: "District 1, HCMC",
          departure_time: null,
          price: null,
          car_type: "Limousine",
          departure_day: null,
        })
        .then((resp) => {
          console.log(resp.data.msg);
          setTrip(resp.data.msg);
        });
    }
    if (event.target.value === "Order by Bus") {
      axios
        .post("trip/order-by-user", {
          start: "VungTau City",
          end: "District 1, HCMC",
          departure_time: null,
          price: null,
          car_type: "Bus",
          departure_day: null,
        })
        .then((resp) => {
          console.log(resp.data.msg);
          setTrip(resp.data.msg);
        });
    }
    if (event.target.value === "Order by Sleeper Bus") {
      axios
        .post("trip/order-by-user", {
          start: "VungTau City",
          end: "District 1, HCMC",
          departure_time: null,
          price: null,
          car_type: "Sleeper-Bus",
          departure_day: null,
        })
        .then((resp) => {
          console.log(resp.data.msg);
          setTrip(resp.data.msg);
        });
    }
    if (event.target.value === "Low - High Price") {
      axios
        .post("trip/order-by-user", {
          start: "VungTau City",
          end: "District 1, HCMC",
          departure_time: null,
          price: "Price Ascend",
          car_type: null,
          departure_day: null,
        })
        .then((resp) => {
          console.log(resp.data.msg);
          setTrip(resp.data.msg);
        });
    }
    if (event.target.value === "High - Low Price") {
      axios
        .post("trip/order-by-user", {
          start: "VungTau City",
          end: "District 1, HCMC",
          departure_time: null,
          price: "Price Descend",
          car_type: null,
          departure_day: null,
        })
        .then((resp) => {
          console.log(resp.data.msg);
          setTrip(resp.data.msg);
        });
    }
    if (event.target.value === "Earliest - Latest") {
      axios
        .post("trip/order-by-user", {
          start: "VungTau City",
          end: "District 1, HCMC",
          departure_time: "Earliest",
          price: null,
          car_type: null,
          departure_day: null,
        })
        .then((resp) => {
          console.log(resp.data.msg);
          setTrip(resp.data.msg);
        });
    }
    if (event.target.value === "Latest - Earliest") {
      axios
        .post("trip/order-by-user", {
          start: "VungTau City",
          end: "District 1, HCMC",
          departure_time: "Latest",
          price: null,
          car_type: null,
          departure_day: null,
        })
        .then((resp) => {
          console.log(resp.data.msg);
          setTrip(resp.data.msg);
        });
    }
    if (event.target.value === "Not filtered") {
      axios.post("recommend-trip/VT-Q1").then((resp) => {
        setTrip(resp.data.msg);
        console.log(resp.data.msg);
      });
    }
  };

  const carType = [];

  useEffect(() => {
    axios.post("recommend-trip/VT-Q1").then((resp) => {
      setTrip(resp.data.msg);
      console.log(resp.data.msg);
    });
  }, []);

  useEffect(() => {}, [value]);

  const outlet = useOutlet();
  if (outlet) {
    return outlet;
  }

  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        {(isBigRole.isAdmin === true || isBigRole.isManager === true) && (
          <button
            className={styles.addtrip}
            onClick={() => {
              setShowPopUp(true);
            }}
          >
            Add Trip
          </button>
        )}
        {showPopUp && <Popup handleClose={handleClosePopUp}></Popup>}
        <div className={styles.listView}>
          <section className={styles.sort}>
            <h1>--Sorting--</h1>
            <select
              value={sort}
              onChange={handleSortChange}
              defaultValue={sortArray}
            >
              {sortArray.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </section>
          <section className={styles.cardview}>
            {trip.slice(0, count).map((e) => {
              return (
                <div className={styles.doc} key={e.id}>
                  <div>
                    {e.car_type === "Limousine" && (
                      <img src="https://vielimousine.com/wp-content/uploads/2021/12/DSC6090.jpg"></img>
                    )}
                    {e.car_type === "Bus" && (
                      <img src="https://motortrip.vn/wp-content/uploads/2021/07/xe-khach-ha-noi-da-nang-3.jpg"></img>
                    )}
                    {e.car_type === "Sleeper-Bus" && (
                      <img src="https://saigonstartravel.com/wp-content/uploads/2018/09/cho-thue-xe-giuong-nam-cao-cap.jpg"></img>
                    )}

                    <div>
                      <div>
                        <label>Trip of: {e.departure_day}</label>
                      </div>
                      <div>
                        <label>Time: </label>
                        <label>{e.departure_time}</label>
                        <label> ---- </label>
                        <label>{e.arrived_time}</label>
                      </div>
                      <div>
                        <label>{e.car_type}</label>
                      </div>
                      <div>
                        <label>From {e.start} </label>
                        <label>----- </label>
                        <label>{e.end}</label>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label>Price: {e.price} vnđ</label>
                      </div>
                      <button
                        onClick={() => {
                          navigate(`${e.id}`);
                        }}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {count < trip.length && (
              <button onClick={loadMore}>Load More</button>
            )}
          </section>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default VTDis1;
