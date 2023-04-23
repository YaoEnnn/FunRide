import React, { useState } from "react";

function DatePicker() {
  const [date, setDate] = useState();
  console.log("Date", date);

  return (
    <>
      <h1>Selected Date: {date}</h1>
      <input type="date" onChange={(e) => setDate(e.target.value)}></input>
    </>
  );
}
export default DatePicker;
