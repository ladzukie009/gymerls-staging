import * as React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import Chart from "../components/Chart";
// import BasicDateCalendar from "../components/Calendar";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

function Landing() {
  const [greet, setGreet] = useState("");
  const [currentUser, getCurrentUser] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // calendar - schedules
  const [firstBatch, setFirstBatch] = useState([]);
  const [secondBatch, setSecondBatch] = useState([]);
  const [thirdBatch, setThirdBatch] = useState([]);
  const [fourthBatch, setFourthBatch] = useState([]);
  const [fifthBatch, setFifthBatch] = useState([]);
  const [lastBatch, setLastBatch] = useState([]);

  const [reservationCount, setReservationCount] = useState(0);

  useEffect(() => {
    getTime();
    var formattedDate = formatDate(new Date());
    getReservationByDate(formattedDate);

    getCurrentUser(localStorage.getItem("username"));

    fetch("http://localhost:3031/api/all-user")
      .then((response) => response.json())
      .then((data) => {
        setUserCount(data.length);
      });

    fetch("http://localhost:3031/api/transactions")
      .then((response) => response.json())
      .then((data) => {
        setOrderCount(data.length);
      });

    fetch("http://localhost:3031/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProductCount(data.length);
      });
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  function getTime() {
    const date = new Date();
    const hours = date.getHours();
    if (hours < 12) setGreet("morning");
    else if (hours >= 12 && hours <= 17) setGreet("afternoon");
    else if (hours >= 17 && hours <= 24) setGreet("evening");
  }

  setInterval(function () {
    getTime();
  }, 300000);

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
    setThirdBatch([]);
    setFourthBatch([]);
    setFifthBatch([]);
    setLastBatch([]);

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
        console.log("data:", data);
        setReservationCount(data.length);
        var first_batch = [];
        var second_batch = [];
        var third_batch = [];
        var fourth_batch = [];
        var fifth_batch = [];
        var last_batch = [];

        for (let item of data) {
          if (item.time_slot === "7-9AM") {
            first_batch.push(item);
          } else if (item.time_slot === "9-11AM") {
            second_batch.push(item);
          } else if (item.time_slot === "1-3PM") {
            third_batch.push(item);
          } else if (item.time_slot === "3-5PM") {
            fourth_batch.push(item);
          } else if (item.time_slot === "5-7PM") {
            fifth_batch.push(item);
          } else {
            last_batch.push(item);
          }
        }

        setFirstBatch(first_batch);
        setSecondBatch(second_batch);
        setThirdBatch(third_batch);
        setFourthBatch(fourth_batch);
        setFifthBatch(fifth_batch);
        setLastBatch(last_batch);
      });
  };

  return (
    <>
      {isLoading ? (
        <div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      ) : (
        <div>
          <Typography variant="h5" component="h2">
            Good {greet}, <b>{currentUser}</b>
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              "& > :not(style)": {
                m: 1,
                width: "100%",
              },
            }}
          >
            <Grid container>
              <Grid
                item
                md={6}
                sm={12}
                xs={12}
                sx={{
                  position: "relative",
                  height: "auto",
                  width: "60vw",
                  padding: 1,
                }}
              >
                <Paper elevation={3} sx={{ height: "100%", padding: 2 }}>
                  <Typography variant="h6" component="h2">
                    Users
                  </Typography>
                  <Chart />
                </Paper>
              </Grid>

              <Grid item md={6} sm={12} xs={12} sx={{ padding: 1 }}>
                <Paper elevation={3} sx={{ height: "100%", padding: 2 }}>
                  <Typography variant="h6" component="h2">
                    Calendar
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      onChange={(e) => {
                        getReservationByDate(e.$d);
                      }}
                    />
                  </LocalizationProvider>
                </Paper>
              </Grid>

              <Grid item md={3} sm={6} xs={12} sx={{ padding: 1 }}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    padding: 4,
                    backgroundColor: "#ffac33",
                    color: "#fff",
                  }}
                >
                  <PermContactCalendarOutlinedIcon sx={{ fontSize: "4rem" }} />
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="button">USERS</Typography>
                    <Typography variant="h4">{userCount}</Typography>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item md={3} sm={6} xs={12} sx={{ padding: 1 }}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    padding: 4,
                    backgroundColor: "#8bc34a",
                    color: "#fff",
                  }}
                >
                  <Inventory2OutlinedIcon sx={{ fontSize: "4rem" }} />
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="button">PRODUCTS</Typography>
                    <Typography variant="h4">{productCount}</Typography>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item md={3} sm={6} xs={12} sx={{ padding: 1 }}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    padding: 4,
                    backgroundColor: "#ff3d00",
                    color: "#fff",
                  }}
                >
                  <EventAvailableOutlinedIcon sx={{ fontSize: "4rem" }} />
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="button">RESERVATIONS</Typography>
                    <Typography variant="h4">{reservationCount}</Typography>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item md={3} sm={6} xs={12} sx={{ padding: 1 }}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    padding: 4,
                    backgroundColor: "#651fff",
                    color: "#fff",
                  }}
                >
                  <LocalMallOutlinedIcon sx={{ fontSize: "4rem" }} />
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="button">ORDERS</Typography>
                    <Typography variant="h4">{orderCount}</Typography>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} sx={{ padding: 1 }}>
                <Paper elevation={3} sx={{ padding: 4 }}>
                  <Grid
                    sx={{ display: "flex", columnGap: 1, alignItems: "center" }}
                  >
                    <AccessTimeIcon sx={{ fontSize: "2rem" }} />
                    <Typography variant="h4">Schedules</Typography>
                  </Grid>

                  <Grid container>
                    <Typography variant="h6">7 - 9 AM</Typography>
                    <Box sx={{ width: "100%" }}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={firstBatch.length * 10}
                      />
                      <Typography sx={{ color: "gray", fontSize: 12 }}>
                        {10 - firstBatch.length + " slot(s) remaining"}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid container>
                    <Typography variant="h6">9 - 11 AM</Typography>
                    <Box sx={{ width: "100%" }}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={secondBatch.length * 10}
                      />
                      <Typography sx={{ color: "gray", fontSize: 12 }}>
                        {10 - secondBatch.length + " slot(s) remaining"}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid container>
                    <Typography variant="h6">1 - 3 PM</Typography>
                    <Box sx={{ width: "100%" }}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={thirdBatch.length * 10}
                      />
                      <Typography sx={{ color: "gray", fontSize: 12 }}>
                        {10 - thirdBatch.length + " slot(s) remaining"}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid container>
                    <Typography variant="h6">3 - 5 PM</Typography>
                    <Box sx={{ width: "100%" }}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={fourthBatch.length * 10}
                      />
                      <Typography sx={{ color: "gray", fontSize: 12 }}>
                        {10 - fourthBatch.length + " slot(s) remaining"}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid container>
                    <Typography variant="h6">5 - 7 PM</Typography>
                    <Box sx={{ width: "100%" }}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={fifthBatch.length * 10}
                      />
                      <Typography sx={{ color: "gray", fontSize: 12 }}>
                        {10 - fifthBatch.length + " slot(s) remaining"}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid container>
                    <Typography variant="h6">7 - 9 PM</Typography>
                    <Box sx={{ width: "100%" }}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={lastBatch.length * 10}
                      />
                      <Typography sx={{ color: "gray", fontSize: 12 }}>
                        {10 - lastBatch.length + " slot(s) remaining"}
                      </Typography>
                    </Box>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </div>
      )}
    </>
  );
}

export default Landing;
