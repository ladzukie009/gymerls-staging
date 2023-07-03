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
import BasicDateCalendar from "../components/Calendar";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";

function Landing() {
  const [greet, setGreet] = useState("");
  const [currentUser, getCurrentUser] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTime();
    getCurrentUser(localStorage.getItem("username"));

    fetch("https://gymerls-api-staging.cyclic.app/api/all-user")
      .then((response) => response.json())
      .then((data) => {
        setUserCount(data.length);
      });

    fetch("https://gymerls-api-staging.cyclic.app/api/transactions")
      .then((response) => response.json())
      .then((data) => {
        setOrderCount(data.length);
      });

    fetch("https://gymerls-api-staging.cyclic.app/api/products")
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
                height: 300,
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid
                item
                md={6}
                sm={12}
                xs={12}
                sx={{ position: "relative", height: "auto", width: "60vw" }}
              >
                <Paper elevation={3} sx={{ height: "100%", padding: 2 }}>
                  <Typography variant="h6" component="h2">
                    Users
                  </Typography>
                  <Chart />
                </Paper>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <Paper elevation={3} sx={{ height: "100%", padding: 2 }}>
                  <Typography variant="h6" component="h2">
                    Calendar
                  </Typography>
                  <BasicDateCalendar />
                </Paper>
              </Grid>

              <Grid item md={3} sm={6} xs={12}>
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

              <Grid item md={3} sm={6} xs={12}>
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

              <Grid item md={3} sm={6} xs={12}>
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
                    <Typography variant="h4">0</Typography>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item md={3} sm={6} xs={12}>
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
            </Grid>
          </Box>
        </div>
      )}
    </>
  );
}

export default Landing;
