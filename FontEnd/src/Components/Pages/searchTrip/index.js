import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import CustomInput from "../../CustomInput";
import { useState, useEffect } from "react";
import DropDown from "../../DropDown";
import axios from "axios";
import { error } from "../../lib/toast";

function SearchTrip() {
  const [date, setDate] = useState();
  const [value, setvalue] = useState(null);
  const [end, setEnd] = useState("");
  const [trip, setTrip] = useState([]);
  const [booking, setBooking] = useState([]);

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
      console.log(resp.data.msg);
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
            <select></select>
          </section>
          <section className={styles.cardview}>
            {trip.map((e) => {
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
                      <button>Confirm</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default SearchTrip;
