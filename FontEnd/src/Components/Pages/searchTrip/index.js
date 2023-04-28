import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import CustomInput from "../../CustomInput";
import { useState, useEffect } from "react";
import DropDown from "../../DropDown";
import axios from "axios";
import { error } from "../../lib/toast";
import Popup from "./PopUp/popup";

function SearchTrip() {
  const [date, setDate] = useState();
  const [currentTrip, setCurrentTrip] = useState(null);
  const [value, setvalue] = useState(null);
  const [end, setEnd] = useState("");
  const [trip, setTrip] = useState([]);
  const [booking, setBooking] = useState([]);
  const [count, setCount] = useState(20);
  const loadMore = () => {
    setCount(count + 20);
  };

  const [showPopUp, setShowPopUp] = useState(false);

  const handleClosePopUp = () => {
    setShowPopUp(false);
  };
  const confbutton = (a) => {};

  const sortArray = [
    "Not filterd",
    "Departure from District 1, HCMC",
    "Departure from Binh Tan District, HCMC",
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
    if (event.target.value === "Departure from District 1, HCMC") {
      axios
        .post("trip/order-by-user", {
          start: "District 1, HCMC",
          end: null,
          departure_time: null,
          price: null,
          car_type: null,
          departure_day: null,
        })
        .then((resp) => {
          console.log(resp.data.msg);
          setTrip(resp.data.msg);
        });
    }
    if (event.target.value === "Departure from Binh Tan District, HCMC") {
      axios
        .post("trip/order-by-user", {
          start: "BinhTan District, HCMC",
          end: null,
          departure_time: null,
          price: null,
          car_type: null,
          departure_day: null,
        })
        .then((resp) => {
          console.log(resp.data.msg);
          setTrip(resp.data.msg);
        });
    }
    if (event.target.value === "Order by Limousine") {
      axios
        .post("trip/order-by-user", {
          start: null,
          end: null,
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
          start: null,
          end: null,
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
          start: null,
          end: null,
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
          start: null,
          end: null,
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
          start: null,
          end: null,
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
          start: null,
          end: null,
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
          start: null,
          end: null,
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
  };

  const endArray = [
    "Unknown",
    "District 1, HCMC",
    "Binh Tan District, HCMC",
    "Bao Loc City",
    "VungTau City",
  ];
  const carType = [];

  const handleEndChange = (event) => {
    setEnd(event.target.value);
  };

  useEffect(() => {
    axios.post("trip/display-all").then((resp) => {
      setTrip(resp.data.msg);
    });
  }, []);

  useEffect(() => {}, [value]);

  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.searchBar}>
          <h1>--Search Bar--</h1>
          <section className={styles.mainInput}>
            <select
              value={end}
              onChange={handleEndChange}
              defaultValue={endArray[4]}
            >
              {endArray.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
            ></input>
            <button
              onClick={() => {
                if (end === "Unknown" || end === "") {
                  console.log("pleple");
                  error("Please input your desired destination");
                  return;
                }
                console.log(date);
                if (date === undefined) {
                  error("Please input your desired date");
                  return;
                } else {
                }
              }}
            >
              Confirm
            </button>
          </section>
        </div>
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
                          setCurrentTrip(e);
                          setShowPopUp(true);
                          console.log(e);
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
        {showPopUp && (
          <Popup
            handleClose={handleClosePopUp}
            announcement={"Warning"}
            confirm={"Confirm"}
            yousure={"Are you sure you want to delete this admin?"}
            confbutton={() => {
              confbutton(currentTrip);
            }}
          ></Popup>
        )}
      </div>
    </AnimatedOutlet>
  );
}
export default SearchTrip;
