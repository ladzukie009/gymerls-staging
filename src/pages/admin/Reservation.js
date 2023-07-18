import { useEffect, useState } from "react";
import {
  CircularProgress,
  Backdrop,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Swal from "sweetalert2";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function Reservation() {
  const [isLoading, setIsLoading] = useState(true);
  const [reservationData, setReservationData] = useState([]);

  // data table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableHasNoData, setTableHasNoData] = useState(true);

  // Dialog
  const theme = useTheme();
  const modalWidth = useMediaQuery(theme.breakpoints.down("md"));
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const [filterByDate, setFilterByDate] = useState(dayjs(new Date()));
  const [selectStatus, setSelectStatus] = useState("");
  const status = [
    {
      name: "All",
      value: "All",
      color: "",
    },
    {
      name: "Pending",
      value: "Pending",
      color: "#ed6c02",
    },
    {
      name: "Confirmed",
      value: "Confirmed",
      color: "#2e7d32",
    },
    {
      name: "Cancelled",
      value: "Cancelled",
      color: "#d32f2f",
    },
    {
      name: "Declined",
      value: "Declined",
      color: "#9c27b0",
    },
    {
      name: "Completed",
      value: "Completed",
      color: "#1976d2",
    },
  ];

  const selectedStatus = [
    {
      name: "Pending",
      value: "Pending",
      color: "#ed6c02",
    },
    {
      name: "Confirmed",
      value: "Confirmed",
      color: "#2e7d32",
    },
    {
      name: "Cancelled",
      value: "Cancelled",
      color: "#d32f2f",
    },
    {
      name: "Declined",
      value: "Declined",
      color: "#9c27b0",
    },
    {
      name: "Completed",
      value: "Completed",
      color: "#1976d2",
    },
  ];

  // CREATE NEW RESERVATION
  const [selectedUser, setSelectedUser] = useState("");
  const [reservationDate, setReservationDate] = useState(filterByDate);
  const [reservationNotes, setReservationNotes] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [coachName, setCoachName] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");

  const [listOfUser, setListOfUser] = useState([]);

  const [firstBatchIsDisabled, setFirstBatchIsDisabled] = useState(true);
  const [secondBatchIsDisabled, setSecondBatchIsDisabled] = useState(true);
  const [thirdBatchIsDisabled, setThirdBatchIsDisabled] = useState(true);
  const [fourthBatchIsDisabled, setFourthBatchIsDisabled] = useState(true);
  const [fifthBatchIsDisabled, setFifthBatchIsDisabled] = useState(true);
  const [lastBatchIsDisabled, setLastBatchIsDisabled] = useState(true);

  const timeSlot = [
    {
      name: "7-9AM",
      value: "7-9AM",
      disabled: firstBatchIsDisabled,
    },
    {
      name: "9-11AM",
      value: "9-11AM",
      disabled: secondBatchIsDisabled,
    },
    {
      name: "1-3PM",
      value: "1-3PM",
      disabled: thirdBatchIsDisabled,
    },
    {
      name: "3-5PM",
      value: "3-5PM",
      disabled: fourthBatchIsDisabled,
    },
    {
      name: "5-7PM",
      value: "5-7PM",
      disabled: fifthBatchIsDisabled,
    },
    {
      name: "7-9PM",
      value: "7-9PM",
      disabled: lastBatchIsDisabled,
    },
  ];

  // UPDATE RESERVATION
  const [updateUsername, setUpdateUsername] = useState("");
  const [updateResDate, setUpdateResDate] = useState(null);
  const [updateResNotes, setUpdateResNotes] = useState("");
  const [updateSelectedTimeSlot, setUpdateSelectedTimeSlot] = useState("");
  const [updateCoachName, setUpdateCoachName] = useState("");
  const [updateResStatus, setUpdateResStatus] = useState("");
  const [currentUserId, setCurrentUserId] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenModalCreateReservation = () => {
    getReservationByDate(reservationDate);

    setOpenCreateModal(true);
    fetch("http://localhost:3031/api/user-role-membership")
      .then((response) => response.json())
      .then((data) => {
        setListOfUser(data);
      });
  };

  const getReservationByDate = (date) => {
    var formattedDate = formatDate(date);

    fetch(
      "http://localhost:3031/api/get-reservation-by-date-and-status-is-confirmed",
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

        first_batch.length === 10
          ? setFirstBatchIsDisabled(true)
          : setFirstBatchIsDisabled(false);

        second_batch.length === 10
          ? setSecondBatchIsDisabled(true)
          : setSecondBatchIsDisabled(false);

        third_batch.length === 10
          ? setThirdBatchIsDisabled(true)
          : setThirdBatchIsDisabled(false);

        fourth_batch.length === 10
          ? setFourthBatchIsDisabled(true)
          : setFourthBatchIsDisabled(false);

        fifth_batch.length === 10
          ? setFifthBatchIsDisabled(true)
          : setFifthBatchIsDisabled(false);

        last_batch.length === 10
          ? setLastBatchIsDisabled(true)
          : setLastBatchIsDisabled(false);
      });
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      var formattedDate = formatDate(new Date());
      fetch("http://localhost:3031/api/get-reservation-by-date", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          reservation_date: formattedDate,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setReservationData(data);
          setFilteredList(data);
          if (data.length === 0) {
            setTableHasNoData(true);
          } else {
            setTableHasNoData(false);
          }
        });

      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const closeReservationModalCreate = () => {
    setOpenCreateModal(false);
  };

  const closeReservationModalUpdate = () => {
    setOpenModalUpdate(false);
  };

  const filteredDataByDate = (date) => {
    setFilterByDate(date);
    setSearchName("");
    setPage(0);
    setSelectStatus("All");
    var formattedDate = formatDate(date);

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
        if (data.length === 0) {
          setTableHasNoData(true);
        } else {
          setTableHasNoData(false);
          setReservationData(data);
          setFilteredList(data);
        }
      });
  };

  const filteredDataByStatusAndDate = (status) => {
    setPage(0);
    setSelectStatus(status);

    if (status === "All") {
      // filteredDataByDate(filterByDate === null ? new Date() : filterByDate);
      window.location.reload(false);
    } else {
      fetch("http://localhost:3031/api/get-reservation-by-date-and-status", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          reservation_date:
            filterByDate === null
              ? formatDate(new Date())
              : formatDate(filterByDate),
          status: status,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) {
            setTableHasNoData(true);
          } else {
            setTableHasNoData(false);
            setReservationData(data);
            setFilteredList(data);
          }
        });
    }
  };

  const createReservation = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const user_name = data.get("user_name");
    const status = data.get("reservation-status");

    Swal.fire({
      icon: "info",
      title: "Are you sure you want to proceed?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:3031/api/create-reservation", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: data.get("user_name"),
            notes: data.get("reservation_notes"),
            reservation_date: formatDate(reservationDate),
            status: data.get("reservation-status"),
            time_slot: data.get("time_slot"),
            coach_name: data.get("coach_name"),
            added_date: formatDate(new Date()),
          }),
        })
          .then((res) => res.json())
          .then((result) => {});

        userLog(
          localStorage.getItem("username"),
          "Create",
          "new reservation for",
          user_name,
          `with status = "${status}"`
        );

        Swal.fire({
          title: "Reservation successfully created!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(function () {
          setIsBtnLoading(false);
          setIsLoading(true);
          window.location.reload(false);
        });
      } else {
        setIsBtnLoading(false);
      }
    });
  };

  const updateReservation = (id, date) => {
    setCurrentUserId(id);
    getReservationByDate(date);
    setOpenModalUpdate(true);
    fetch("http://localhost:3031/api/get-reservation-by-id", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUpdateUsername(data[0].username);
        setUpdateResNotes(data[0].notes);
        setUpdateResDate(date);
        setUpdateResStatus(data[0].status);
        setUpdateSelectedTimeSlot(data[0].time_slot);
        setUpdateCoachName(data[0].coach_name);
      });
  };

  const handleUpdateReservation = (event) => {
    event.preventDefault();

    Swal.fire({
      icon: "info",
      title: "Are you sure you want to update this reservation?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:3031/api/update-reservation", {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            reservation_date: formatDate(updateResDate),
            notes: updateResNotes,
            time_slot: updateSelectedTimeSlot,
            coach_name: updateCoachName,
            status: updateResStatus,
            username: updateUsername,
            id: currentUserId,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            userLog(
              localStorage.getItem("username"),
              "Update",
              "reservation for",
              updateUsername,
              `with status = "${updateResStatus}"`
            );

            Swal.fire({
              title: "Reservation successfully updated!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(function () {
              setOpenModalUpdate(false);
              setIsBtnLoading(false);
              window.location.reload(false);
            });
          });
      } else {
        setIsBtnLoading(false);
      }
    });
  };

  const [searchName, setSearchName] = useState("");
  const [filteredList, setFilteredList] = new useState(reservationData);

  const filterBySearch = (e) => {
    setSearchName(e.target.value);
    const results = reservationData.filter((user) => {
      if (e.target.value === "") return reservationData;
      return user.username.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredList(results);
  };

  const getIpAddress = (callback) => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => callback(data.ip))
      .catch((error) => console.log(error));
  };

  const userLog = (author, action, event, user, status) => {
    getIpAddress(function (callback) {
      fetch("http://localhost:3031/api/insert-log", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: author,
          event_info: `${action} - ${event} "${user}" ${status}`,
          ip_address: callback,
          platform: window.navigator.userAgentData.platform,
        }),
      }).catch((error) => console.log(error));
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
          {/* CREATE RESERVATION */}
          <Dialog
            fullScreen={modalWidth}
            open={openCreateModal}
            aria-labelledby="responsive-dialog-title"
          >
            <form onSubmit={createReservation}>
              <DialogTitle id="responsive-dialog-title">
                CREATE NEW RESERVATION
              </DialogTitle>
              <DialogContent>
                <DialogContentText>Fill up all fields</DialogContentText>
                <div>
                  <TextField
                    id="standard-select-slot"
                    select
                    fullWidth
                    margin="normal"
                    name="user_name"
                    label="User"
                    value={selectedUser}
                    onChange={(e) => {
                      setSelectedUser(e.target.value);
                    }}
                    // defaultValue={"7-9AM"}
                    helperText="Please select user"
                    required
                  >
                    {listOfUser.map((option) => (
                      <MenuItem key={option.id} value={option.username}>
                        {option.username}
                      </MenuItem>
                    ))}
                  </TextField>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Reservation date"
                      name="reservation_date"
                      margin="dense"
                      format="YYYY-MM-DD"
                      sx={{ width: "100%" }}
                      value={reservationDate}
                      onChange={(newValue) => {
                        setReservationDate(newValue);
                        getReservationByDate(newValue);
                        setSelectedTimeSlot("");
                      }}
                      required
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <TextField
                    id="notes"
                    name="reservation_notes"
                    label="Note"
                    margin="dense"
                    fullWidth
                    value={reservationNotes}
                    multiline
                    rows={2}
                    onChange={(e) => {
                      setReservationNotes(e.target.value);
                    }}
                    required
                  />
                  <TextField
                    id="standard-select-slot"
                    select
                    fullWidth
                    margin="dense"
                    name="time_slot"
                    label="Time slot"
                    value={selectedTimeSlot}
                    onChange={(e) => {
                      setSelectedTimeSlot(e.target.value);
                    }}
                    defaultValue={"7-9AM"}
                    helperText="Please select time slot"
                    required
                  >
                    {timeSlot.map((option) => (
                      <MenuItem
                        key={option.name}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    id="coachName"
                    label="Coach"
                    margin="dense"
                    name="coach_name"
                    value={coachName}
                    onChange={(e) => {
                      setCoachName(e.target.value);
                    }}
                    autoFocus
                    required
                    fullWidth
                  />
                  <TextField
                    id="standard-select-status"
                    select
                    name="reservation-status"
                    fullWidth
                    margin="normal"
                    label="Status"
                    value={reservationStatus}
                    onChange={(e) => {
                      setReservationStatus(e.target.value);
                    }}
                    defaultValue={"Pending"}
                  >
                    {selectedStatus.map((option) => (
                      <MenuItem
                        key={option.name}
                        value={option.value}
                        sx={{ color: option.color }}
                      >
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => closeReservationModalCreate()}
                >
                  CANCEL
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isBtnLoading}
                >
                  <span>CREATE</span>
                </LoadingButton>
              </DialogActions>
            </form>
          </Dialog>

          {/* UPDATE RESERVATION */}
          <Dialog
            fullScreen={modalWidth}
            open={openModalUpdate}
            aria-labelledby="responsive-dialog-title"
          >
            <form onSubmit={handleUpdateReservation}>
              <DialogTitle id="responsive-dialog-title">
                UPDATE RESERVATION
              </DialogTitle>
              <DialogContent>
                <DialogContentText>Fill up all fields</DialogContentText>
                <div>
                  <TextField
                    label="Username"
                    margin="normal"
                    name="update_username"
                    value={updateUsername}
                    autoFocus
                    disabled
                    fullWidth
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Reservation date"
                      name="update_reservation_date"
                      margin="normal"
                      format="YYYY-MM-DD"
                      sx={{ width: "100%" }}
                      value={dayjs(updateResDate)}
                      onChange={(newValue) => {
                        setUpdateResDate(newValue);
                        getReservationByDate(newValue);
                      }}
                      required
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <TextField
                    name="update_reservation_notes"
                    label="Note"
                    margin="dense"
                    fullWidth
                    value={updateResNotes}
                    multiline
                    rows={2}
                    onChange={(e) => {
                      setUpdateResNotes(e.target.value);
                    }}
                    required
                  />
                  <TextField
                    select
                    fullWidth
                    margin="dense"
                    name="update_time_slot"
                    label="Time slot"
                    value={updateSelectedTimeSlot}
                    onChange={(e) => {
                      setUpdateSelectedTimeSlot(e.target.value);
                    }}
                    defaultValue={updateSelectedTimeSlot}
                    helperText="Please select time slot"
                    required
                  >
                    {timeSlot.map((option) => (
                      <MenuItem
                        key={option.name}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Coach"
                    margin="dense"
                    name="update_coach_name"
                    value={updateCoachName}
                    onChange={(e) => {
                      setUpdateCoachName(e.target.value);
                    }}
                    autoFocus
                    required
                    fullWidth
                  />

                  <TextField
                    select
                    fullWidth
                    margin="dense"
                    name="update_status"
                    label="Status"
                    value={updateResStatus}
                    onChange={(e) => {
                      setUpdateResStatus(e.target.value);
                    }}
                    defaultValue={updateResStatus}
                    required
                  >
                    {selectedStatus.map((option) => (
                      <MenuItem
                        key={option.name}
                        value={option.value}
                        sx={{ color: option.color }}
                      >
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => closeReservationModalUpdate()}
                >
                  CANCEL
                </Button>

                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isBtnLoading}
                >
                  <span>UPDATE</span>
                </LoadingButton>
              </DialogActions>
            </form>
          </Dialog>

          <Stack>
            {/* <Typography variant="h3">Reservation</Typography> */}
            <Grid
              container
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid item xs={4}>
                <Grid>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModalCreateReservation()}
                  >
                    Add new reservation
                  </Button>
                </Grid>
              </Grid>
              <Grid
                item
                xs={8}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: 2,
                }}
              >
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    value={searchName}
                    sx={{ margin: 0 }}
                    onChange={filterBySearch}
                    label="Search username"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    id="standard-select-status"
                    select
                    fullWidth
                    margin="normal"
                    label="Status"
                    value={selectStatus}
                    sx={{ marginBottom: "1rem" }}
                    onChange={(e) => {
                      filteredDataByStatusAndDate(e.target.value);
                    }}
                    defaultValue={"All"}
                  >
                    {status.map((option) => (
                      <MenuItem
                        key={option.name}
                        value={option.value}
                        sx={{ color: option.color }}
                      >
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      format="YYYY-MM-DD"
                      sx={{ width: "100%" }}
                      value={filterByDate}
                      onChange={(newValue) => {
                        filteredDataByDate(newValue.$d);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
          </Stack>
          <Paper
            sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}
            elevation={3}
          >
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>USERNAME</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>NOTES</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      RESERVATION DATE
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>TIME SLOT</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>COACH</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                {tableHasNoData ? (
                  <TableBody>
                    <StyledTableRow>
                      <TableCell align="center" colSpan={7}>
                        {"No data available"}
                      </TableCell>
                    </StyledTableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {filteredList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((res) => {
                        return (
                          <StyledTableRow
                            hover
                            // role="checkbox"
                            tabIndex={-1}
                            key={res.id}
                          >
                            <TableCell>{res.username}</TableCell>
                            <TableCell>{res.notes}</TableCell>
                            <TableCell>
                              {formatDate(res.reservation_date)}
                            </TableCell>
                            {/* <TableCell>{res.status}</TableCell> */}
                            <TableCell>
                              {res.status === "Pending" ? (
                                <Chip
                                  label="Pending"
                                  color="warning"
                                  sx={{ width: "6rem" }}
                                />
                              ) : res.status === "Confirmed" ? (
                                <Chip
                                  label="Confirmed"
                                  color="success"
                                  sx={{ width: "6rem" }}
                                />
                              ) : res.status === "Cancelled" ? (
                                <Chip
                                  label="Cancelled"
                                  color="error"
                                  sx={{ width: "6rem" }}
                                />
                              ) : res.status === "Declined" ? (
                                <Chip
                                  label="Declined"
                                  color="secondary"
                                  sx={{ width: "6rem" }}
                                />
                              ) : (
                                <Chip
                                  label="Completed"
                                  color="primary"
                                  sx={{ width: "6rem" }}
                                />
                              )}
                            </TableCell>
                            <TableCell>{res.time_slot}</TableCell>
                            <TableCell>{res.coach_name}</TableCell>

                            <TableCell>
                              <Button
                                color="success"
                                onClick={() =>
                                  updateReservation(
                                    res.id,
                                    formatDate(res.reservation_date)
                                  )
                                }
                              >
                                UPDATE
                              </Button>
                            </TableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 15, 20]}
              component="div"
              count={filteredList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      )}
    </>
  );
}

export default Reservation;
