import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState } from "react";

export default function BasicDateCalendar() {
  const [firstBatch, setFirstBatch] = useState([]);
  const [secondBatch, setSecondBatch] = useState([]);

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const getReservationByDate = (date) => {
    var formattedDate = formatDate(date);
    setFirstBatch([]);
    setSecondBatch([]);

    fetch("http://localhost:3031/api/get-reservation-by-date", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        reservation_date: formattedDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        for (let item of data) {
          if (item.time_slot === "7-9AM") {
            firstBatch.push(item);
          } else {
            secondBatch.push(item);
          }
        }
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        onChange={(e) => {
          getReservationByDate(e.$d);
        }}
      />
    </LocalizationProvider>
  );
}
