import * as React from "react";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function TemporaryDrawer() {
  const [userProfile, setUserProfile] = useState([]);
  const [birthdate, setBirthdate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

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
        const formattedBirthdate = formatDate(result[0].birthdate);
        const formattedStartDate = formatDate(result[0].mem_start_date);
        const formattedEndDate = formatDate(result[0].mem_end_date);
        setBirthdate(formattedBirthdate);
        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
      });
  }, []);

  const [state, setState] = React.useState({
    top: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const ariaLabel = { "aria-label": "description" };

  const list = (anchor) => (
    <Box
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      marginTop={"63.9px"}
      padding={2}
      width={"350px"}
    >
      <Stack>
        <Typography variant="h5" fontWeight="bold">
          Personal information
        </Typography>
      </Stack>
      {userProfile.map((user) => {
        return (
          <div key={user.id}>
            <Stack marginTop={1}>
              <Typography variant="h6">Fullname</Typography>
              {/* <Typography color="#616161">{user.name}</Typography> */}
              <Input disabled defaultValue={user.name} inputProps={ariaLabel} />
            </Stack>
            <Stack>
              <Typography variant="h6">Address</Typography>
              {/* <Typography color="#616161">{user.address}</Typography> */}
              <Input
                disabled
                defaultValue={user.address}
                inputProps={ariaLabel}
              />
            </Stack>
            <Stack>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="h6">Birthdate</Typography>
                  {/* <Typography color="#616161">{birthdate}</Typography> */}
                  <Input
                    disabled
                    defaultValue={birthdate}
                    inputProps={ariaLabel}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6">Age</Typography>
                  {/* <Typography color="#616161">{user.age}</Typography> */}
                  <Input
                    disabled
                    defaultValue={user.age}
                    inputProps={ariaLabel}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6">Gender</Typography>
                  {/* <Typography color="#616161">{user.gender}</Typography> */}
                  <Input
                    disabled
                    defaultValue={user.gender}
                    inputProps={ariaLabel}
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack marginBottom="2rem">
              <Typography variant="h6">Contact no.</Typography>
              {/* <Typography color="#616161">{user.contact}</Typography> */}
              <Input
                disabled
                defaultValue={user.contact}
                inputProps={ariaLabel}
              />
            </Stack>

            <Stack>
              <Typography variant="h5" fontWeight="bold">
                Medical records
              </Typography>
            </Stack>
            <Stack marginTop={1}>
              <Typography variant="h6">Condition</Typography>
              {/* <Typography color="#616161">{user.medical_conditions}</Typography> */}
              <Input
                disabled
                defaultValue={user.medical_conditions}
                inputProps={ariaLabel}
              />
            </Stack>
            <Stack>
              <Typography variant="h6">Allergies</Typography>
              {/* <Typography color="#616161">{user.allergies}</Typography> */}
              <Input
                disabled
                defaultValue={user.allergies}
                inputProps={ariaLabel}
              />
            </Stack>
            <Stack>
              <Typography variant="h6">Medication</Typography>
              {/* <Typography color="#616161">{user.current_medication}</Typography> */}
              <Input
                disabled
                defaultValue={user.current_medication}
                inputProps={ariaLabel}
              />
            </Stack>
            <Stack>
              <Typography variant="h6">Doctor's name</Typography>
              {/* <Typography color="#616161">{user.family_doctor}</Typography> */}
              <Input
                disabled
                defaultValue={user.family_doctor}
                inputProps={ariaLabel}
              />
            </Stack>
            <Stack marginBottom="2rem">
              <Typography variant="h6">Contact no.</Typography>
              {/* <Typography color="#616161">{user.doctor_contact}</Typography> */}
              <Input
                disabled
                defaultValue={user.doctor_contact}
                inputProps={ariaLabel}
              />
            </Stack>

            <Stack>
              <Typography variant="h5" fontWeight="bold">
                In case of emergency
              </Typography>
            </Stack>
            <Stack marginTop={1}>
              <Typography variant="h6">Guardian's name</Typography>
              {/* <Typography color="#616161">{user.parent_name}</Typography> */}
              <Input
                disabled
                defaultValue={user.parent_name}
                inputProps={ariaLabel}
              />
            </Stack>
            <Stack>
              <Typography variant="h6">Address</Typography>
              {/* <Typography color="#616161">{user.parent_address}</Typography> */}
              <Input
                disabled
                defaultValue={user.parent_address}
                inputProps={ariaLabel}
              />
            </Stack>
            <Stack marginBottom="2rem">
              <Typography variant="h6">Contact no.</Typography>
              {/* <Typography color="#616161">{user.parent_contact}</Typography> */}
              <Input
                disabled
                defaultValue={user.parent_contact}
                inputProps={ariaLabel}
              />
            </Stack>

            <Stack>
              <Typography variant="h5" fontWeight="bold">
                Membership
              </Typography>
            </Stack>
            <Stack marginTop={1}>
              <Typography variant="h6">Type</Typography>
              {/* <Typography color="#616161">{user.membership_type}</Typography> */}
              <Input
                disabled
                defaultValue={user.membership_type}
                inputProps={ariaLabel}
              />
            </Stack>
            <Stack>
              <Typography variant="h6">Start date</Typography>
              {/* <Typography color="#616161">{startDate}</Typography> */}
              <Input disabled defaultValue={startDate} inputProps={ariaLabel} />
            </Stack>
            <Stack>
              <Typography variant="h6">End date</Typography>
              {/* <Typography color="#616161">{endDate}</Typography> */}
              <Input disabled defaultValue={endDate} inputProps={ariaLabel} />
            </Stack>
          </div>
        );
      })}
    </Box>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={toggleDrawer("right", true)}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>

        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
