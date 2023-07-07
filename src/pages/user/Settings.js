import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userProfile, setUserProfile] = useState([]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [password, setPassword] = useState("");
  const [changePassButtonDisabled, setChangePassButtonDisabled] =
    useState(true);

  useEffect(() => {
    fetch("http://localhost:3031/api/get-user-by-username", {
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
        setUserProfile(result);
      });
  }, []);

  const updatePassword = (event) => {
    event.preventDefault();

    Swal.fire({
      icon: "info",
      title: "Are you sure you want to update the password to this user?",
      text: "You're account will automatically logout after confirming this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:3031/api/update-password", {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            password: password,
            username: localStorage.getItem("username"),
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            Swal.fire({
              title: "Password successfully updated!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            navigate("/login");
          });
      }
    });
  };

  return (
    <>
      <Stack>
        <Typography variant="h5">Change password</Typography>
      </Stack>
      <Stack>
        <Paper elevation={3} sx={{ padding: 5 }}>
          <Stack>
            {userProfile.map((user) => {
              return (
                <div key={user.id}>
                  <Typography variant="h6">
                    Old password: {user.password}
                  </Typography>
                </div>
              );
            })}
          </Stack>
          <Grid container>
            <Grid item xs={12} md={7}>
              <TextField
                margin="normal"
                required
                name="password"
                fullWidth
                label="New password"
                helperText="Password length should be at least 6 or more than characters"
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value.length >= 6) {
                    setChangePassButtonDisabled(false);
                  } else {
                    setChangePassButtonDisabled(true);
                  }
                }}
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
            </Grid>
          </Grid>
          <Stack>
            <Grid container>
              <Grid item xs={12} md={7}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth={false}
                  sx={{
                    fontWeight: "bold",
                  }}
                  onClick={updatePassword}
                  disabled={changePassButtonDisabled}
                >
                  Change password
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </Stack>
    </>
  );
}

export default Settings;
