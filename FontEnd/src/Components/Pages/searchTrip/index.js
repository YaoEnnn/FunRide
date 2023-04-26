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
      const temp = [];
      const data = resp.data.msg;
      console.log(resp.data.msg);
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
        <div className={styles.listView}></div>
      </div>
    </AnimatedOutlet>
  );
}
export default SearchTrip;
