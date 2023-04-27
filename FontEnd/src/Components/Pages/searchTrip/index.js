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

  const endArray = [
    "Unknown",
    "District 1, HCMC",
    "Binh Tan District, HCMC",
    "Bao Loc City",
    "VungTau City",
  ];

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
                    <img src="https://img1.oto.com.vn/2023/03/20/20230320105242-d942_wm.jpg "></img>
                  </div>
                  <label>{e.id}</label>
                  <label>{e.start}</label>
                  <label>{e.end}</label>
                  <label>{e.departure_time}</label>
                  <label>{e.arrived_time}</label>
                  <label>{e.price}</label>
                  <label>{e.departure_day}</label>
                  <label>{e.car_id}</label>
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
