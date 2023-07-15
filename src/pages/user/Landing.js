import * as React from "react";
import { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Typography,
  Stack,
  CircularProgress,
  Backdrop,
  Divider,
} from "@mui/material";
import { Image } from "mui-image";

function Landing() {
  const [greet, setGreet] = useState("");
  const [dateNow, setDateNow] = useState(new Date());
  const [currentUser, getCurrentUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // SCHEDULE

  const [todaySchedules, setTodaySchedules] = useState([]);

  const [hasSchedule, setHasSchedule] = useState(false);

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const getAllSchedule = (user) => {
    fetch("http://localhost:3031/api/get-reservation-by-username-and-date", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: user,
        reservation_date: formatDate(new Date()),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodaySchedules(data);
        if (data.length !== 0) {
          setHasSchedule(true);
        } else {
          setHasSchedule(false);
        }
      });
  };

  useEffect(() => {
    getTime();
    getAllSchedule(localStorage.getItem("username"));
    setDateNow(new Date());
    getCurrentUser(localStorage.getItem("username"));
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
          <Stack>
            <Grid
              container
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Grid item md={6}>
                <Typography variant="h3" sx={{}}>
                  Dashboard
                </Typography>
              </Grid>
              <Grid
                item
                md={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Typography variant="h5">
                  {dateNow.toLocaleDateString("en-us", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              </Grid>
            </Grid>
            <Grid sx={{ position: "relative" }}>
              <Grid
                sx={{
                  position: "absolute",
                  right: "12rem",
                  top: "-5rem",
                  height: "16rem",
                  display: { xs: "none", sm: "none", md: "block" },
                }}
              >
                <Image src="../images/biking.gif" alt="biking.gif" />
              </Grid>
            </Grid>
          </Stack>
          <Stack sx={{ marginY: 2 }}>
            <Paper
              elevation={3}
              sx={{
                padding: 5,
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: 1 }}>
                Good {greet}, <b>{currentUser}</b>
              </Typography>
              <Typography variant="h5">
                Today it's great day to be fit!
              </Typography>
            </Paper>
          </Stack>

          <Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <Typography variant="h4">My schedule today</Typography>
                <Stack>
                  {hasSchedule ? (
                    <Grid container>
                      {todaySchedules.map((sched) => {
                        return (
                          <Grid item key={sched.id} xs={3} m={1}>
                            <Paper
                              sx={
                                sched.status === "Pending"
                                  ? {
                                      backgroundColor: "#ed6c02",
                                      color: "#fff",
                                      p: 1,
                                      height: 150,
                                    }
                                  : sched.status === "Cancelled"
                                  ? {
                                      backgroundColor: "#d32f2f",
                                      color: "#fff",
                                      p: 1,
                                      height: 150,
                                    }
                                  : sched.status === "Declined"
                                  ? {
                                      backgroundColor: "#9c27b0",
                                      color: "#fff",
                                      p: 1,
                                      height: 150,
                                    }
                                  : sched.status === "Completed"
                                  ? {
                                      backgroundColor: "#1976d2",
                                      color: "#fff",
                                      p: 1,
                                      height: 150,
                                    }
                                  : {
                                      backgroundColor: "#2e7d32",
                                      color: "#fff",
                                      p: 1,
                                      height: 150,
                                    }
                              }
                            >
                              <Typography>{sched.time_slot}</Typography>
                              <Divider color="#fff" />
                              <Typography>{sched.status}</Typography>
                              <Divider color="#fff" sx={{ marginBottom: 1 }} />
                              <Typography>{sched.notes}</Typography>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <Grid container>
                      <Typography>No schedule today</Typography>
                    </Grid>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography variant="h4">Announcement</Typography>
                <Stack m={1}>
                  <Paper elevation={3}>
                    <Typography variant="h5">sample</Typography>
                  </Paper>
                </Stack>
                <Stack m={1}>
                  <Paper elevation={3}>
                    <Typography variant="h5">sample</Typography>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </div>
      )}
    </>
  );
}

export default Landing;
