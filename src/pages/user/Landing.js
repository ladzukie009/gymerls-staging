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
  Box,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Image } from "mui-image";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CampaignIcon from "@mui/icons-material/Campaign";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";

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
  const [dateNow, setDateNow] = useState(new Date());
  const [currentUser, setCurrentUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // calendar - schedules
  const [firstBatch, setFirstBatch] = useState([]);
  const [secondBatch, setSecondBatch] = useState([]);
  const [thirdBatch, setThirdBatch] = useState([]);
  const [fourthBatch, setFourthBatch] = useState([]);
  const [fifthBatch, setFifthBatch] = useState([]);
  const [lastBatch, setLastBatch] = useState([]);

  // SCHEDULE
  const [todaySchedules, setTodaySchedules] = useState([]);

  const [hasSchedule, setHasSchedule] = useState(false);

  // MEAL PLANNING
  const [hasMealPlan, setHasMealPlan] = useState(true);
  const [meal, setMeal] = useState([]);

  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");

  const [mealDay, setMealDay] = useState("");

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = month + "/" + day + "/" + year;
    return formattedDate;
  };

  const getAllSchedule = (user) => {
    fetch(
      "https://gymerls-api-v2.vercel.app/api/get-reservation-by-username-and-date",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: user,
          reservation_date: formatDate(new Date()),
        }),
      }
    )
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

  const [currentUserMembership, setCurrentUserMembership] = useState("");
  const getCurrentUserInfo = (user) => {
    fetch("https://gymerls-api-v2.vercel.app/api/get-user-by-username", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: user,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentUserMembership(data[0].membership_type);
      });
  };

  const getDaysDifference = (end_date) => {
    var date1 = new Date(formatDate(dateNow));
    var date2 = new Date(formatDate(end_date));

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var result = Difference_In_Time / (1000 * 3600 * 24);

    //the final no. of days (result)
    setMembershipEnd(result);
  };

  const getMealPlan = (user, day) => {
    fetch("https://gymerls-api-v2.vercel.app/api/meal-plan", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: user,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setMeal(result);
        if (result.length !== 0) {
          setHasMealPlan(true);
        } else {
          setHasMealPlan(false);
        }
        for (let meal of result) {
          if (day === "Sunday") {
            setBreakfast(meal.sun_bf_meal);
            setLunch(meal.sun_lunch_meal);
            setDinner(meal.sun_dinner_meal);
          } else if (day === "Monday") {
            setBreakfast(meal.mon_bf_meal);
            setLunch(meal.mon_lunch_meal);
            setDinner(meal.mon_dinner_meal);
          } else if (day === "Tuesday") {
            setBreakfast(meal.tue_bf_meal);
            setLunch(meal.tue_lunch_meal);
            setDinner(meal.tue_dinner_meal);
          } else if (day === "Wednesday") {
            setBreakfast(meal.wed_bf_meal);
            setLunch(meal.wed_lunch_meal);
            setDinner(meal.wed_dinner_meal);
          } else if (day === "Thursday") {
            setBreakfast(meal.thurs_bf_meal);
            setLunch(meal.thurs_lunch_meal);
            setDinner(meal.thurs_dinner_meal);
          } else if (day === "Friday") {
            setBreakfast(meal.fri_bf_meal);
            setLunch(meal.fri_lunch_meal);
            setDinner(meal.fri_dinner_meal);
          } else {
            setBreakfast(meal.sat_bf_meal);
            setLunch(meal.sat_lunch_meal);
            setDinner(meal.sat_dinner_meal);
          }
        }
      });
  };

  const [membershipEnd, setMembershipEnd] = useState(0);

  useEffect(() => {
    getAnnouncement();
    fetch("https://gymerls-api-v2.vercel.app/api/get-user-by-username", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        getDaysDifference(result[0].mem_end_date);
      });

    var dayOfWeek = dateNow.toLocaleDateString("en-us", {
      weekday: "long",
    });
    setMealDay(dayOfWeek);
    getTime();
    var formattedDate = formatDate(new Date());
    getReservationByDate(formattedDate);

    getAllSchedule(localStorage.getItem("username"));
    getMealPlan(localStorage.getItem("username"), dayOfWeek);
    getCurrentUserInfo(localStorage.getItem("username"));
    setDateNow(new Date());
    setCurrentUser(localStorage.getItem("username"));
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const [announcements, setAnnouncements] = useState([]);
  const getAnnouncement = () => {
    fetch("https://gymerls-api-v2.vercel.app/api/get-all-announcement", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(data);
      });
  };

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

  const getReservationByDate = (date) => {
    var formattedDate = formatDate(date);
    setFirstBatch([]);
    setSecondBatch([]);
    setThirdBatch([]);
    setFourthBatch([]);
    setFifthBatch([]);
    setLastBatch([]);

    fetch(
      "https://gymerls-api-v2.vercel.app/api/get-reservation-by-date-and-status-is-confirmed",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          reservation_date: formattedDate,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
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

  const dateFormatter = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = month + "/" + day + "/" + year;
    return formattedDate;
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
            {membershipEnd <= 10 ? (
              <Stack sx={{ width: "100%" }}>
                <Alert severity="warning">
                  <AlertTitle>Warning</AlertTitle>
                  Your account is about to expire in {membershipEnd} day(s).
                  <strong> Please contact the administrator!</strong>
                </Alert>
              </Stack>
            ) : (
              <></>
            )}
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

          {currentUserMembership !== "Premium" ? (
            <Stack></Stack>
          ) : (
            <Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h4">Today schedule</Typography>
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
                                <Divider
                                  color="#fff"
                                  sx={{ marginBottom: 1 }}
                                />
                                <Typography>{sched.notes}</Typography>
                              </Paper>
                            </Grid>
                          );
                        })}
                      </Grid>
                    ) : (
                      <Grid container marginLeft={2}>
                        <Typography>No schedule today</Typography>
                      </Grid>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={5} sx={{ padding: 1 }}>
                  <Paper elevation={3} sx={{ padding: 4 }}>
                    <Grid
                      sx={{
                        display: "flex",
                        columnGap: 1,
                        alignItems: "center",
                      }}
                    >
                      <AccessTimeIcon sx={{ fontSize: "2rem" }} />
                      <Typography variant="h4">Time slot</Typography>
                      <Typography variant="h5">(Today)</Typography>
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
            </Stack>
          )}

          <Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <Stack>
                  {hasMealPlan ? (
                    <Grid container>
                      <Paper
                        elevation={3}
                        sx={{ width: "100%", p: 3, height: "100%" }}
                      >
                        <Typography variant="h4">Today's meal</Typography>

                        <Stack>
                          <Typography variant="h5">Breakfast</Typography>
                          <Typography>{breakfast}</Typography>
                        </Stack>
                        <Stack>
                          <Typography variant="h5">Lunch</Typography>
                          <Typography>{lunch}</Typography>
                        </Stack>
                        <Stack>
                          <Typography variant="h5">Dinner</Typography>
                          <Typography>{dinner}</Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  ) : (
                    <Grid container marginLeft={2}>
                      <Grid item xs={12}>
                        <Typography variant="h4">Today's meal</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>
                          No meal planning yet, please contact your coach.
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={5} pr={1}>
                <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
                  <Grid sx={{ display: "flex" }}>
                    <CampaignIcon sx={{ fontSize: "2.5rem", marginRight: 1 }} />
                    <Typography variant="h4">Announcement</Typography>
                  </Grid>
                  {announcements.map((announcement) => {
                    return (
                      <Stack m={1} key={announcement.id}>
                        <Paper elevation={3} sx={{ padding: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={2}>
                              <CalendarMonthIcon />
                            </Grid>
                            <Grid item xs={10}>
                              {dateFormatter(announcement.event_date)}
                            </Grid>
                            <Grid item xs={2}>
                              <AccessTimeIcon />
                            </Grid>
                            <Grid item xs={10}>
                              {announcement.event_time}
                            </Grid>
                            <Grid item xs={2}>
                              <TitleIcon />
                            </Grid>
                            <Grid item xs={10}>
                              <Typography variant="body1">
                                <b>{announcement.title}</b>
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <DescriptionIcon />
                            </Grid>
                            <Grid item xs={10}>
                              <Typography variant="subtitle1">
                                {announcement.description}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Stack>
                    );
                  })}
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </div>
      )}
    </>
  );
}

export default Landing;
