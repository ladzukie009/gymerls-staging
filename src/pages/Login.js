import * as React from "react";
import {
  Avatar,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Box,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography variant="body2" align="center" {...props}>
      {"Copyright © "}
      <Link to="/">Gym Management System</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const getIpAddress = (callback) => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => callback(data.ip))
      .catch((error) => console.log(error));
  };

  const userLog = (username, event) => {
    getIpAddress(function (callback) {
      fetch("https://gymerls-api-v2.vercel.app/api/insert-log", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          event_info: `Logon - ${event}`,
          ip_address: callback,
          platform: window.navigator.userAgentData.platform,
        }),
      }).catch((error) => console.log(error));
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const currentUsername = data.get("username");

    fetch("https://gymerls-api-v2.vercel.app/api/get-user", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: data.get("username"),
        password: data.get("password"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length <= 0) {
          Swal.fire({
            title: "Authentication Failed",
            icon: "error",
            text: "Check your login credentials!",
          }).then(function () {
            userLog(currentUsername, "failed");
            setIsLoading(false);
          });
        } else {
          Swal.fire({
            title: "Login Successful",
            icon: "success",
            text: `Welcome to Gym Management System`,
          }).then(function () {
            localStorage.setItem("username", data[0].username);
            localStorage.setItem("role", data[0].role);
            userLog(data[0].username, "success");
            if (data[0].role === "super_admin") {
              navigate("/dashboard");
            } else if (data[0].role === "admin") {
              navigate("/admin/dashboard");
            } else {
              navigate("/user/dashboard");
            }
            setIsLoading(false);
          });
        }
      })
      .catch((rejected) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        }).then(function () {
          setIsLoading(false);
        });
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          lg={8}
          sx={{
            backgroundImage: "url(../images/login-bg.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          lg={4}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <LoadingButton
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={isLoading}
              >
                <span>Sign in</span>
              </LoadingButton>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
