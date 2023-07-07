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
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Swal from "sweetalert2";
import Axios from "axios";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function Product() {
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
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const [filterByDate, setFilterByDate] = useState(null);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
        if (data.length === 0) {
          setTableHasNoData(true);
        } else {
          setTableHasNoData(false);
        }
      });

    setIsLoading(false);
  }, []);

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const closeTransactionModal = () => {
    setOpenModalUpdate(false);
  };

  const filteredDataByDate = (date) => {
    setFilterByDate(date);
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
        }
      });
  };

  const filteredDataByStatusAndDate = (status) => {
    setSelectStatus(status);

    if (status === "All") {
      filteredDataByDate(filterByDate === null ? new Date() : filterByDate);
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
          }
        });
    }
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
          <Dialog
            fullScreen={modalWidth}
            open={openModalUpdate}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              UPDATE RESERVATION
            </DialogTitle>
            <DialogContent>
              <DialogContentText>Fill up all fields</DialogContentText>
              <div></div>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => closeTransactionModal()}
              >
                CANCEL
              </Button>
              <LoadingButton variant="contained" loading={isBtnLoading}>
                <span>UPDATE</span>
              </LoadingButton>
            </DialogActions>
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
              <Grid item xs={6}>
                <Grid>
                  <Button variant="outlined">Add new reservation</Button>
                </Grid>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: 2,
                }}
              >
                <Grid item xs={6}>
                  {tableHasNoData ? (
                    ""
                  ) : (
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
                  )}
                </Grid>
                <Grid item xs={6}>
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
                    <TableCell sx={{ fontWeight: "bold" }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                {tableHasNoData ? (
                  <TableBody>
                    <StyledTableRow>
                      <TableCell align="center" colSpan={6}>
                        {"No data available"}
                      </TableCell>
                    </StyledTableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {reservationData
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
                            {/* <TableCell>
                              {res.status === "Pending" ? (
                                <Chip label="Pending" color="warning" />
                              ) : (
                                <Chip label="Completed" color="success" />
                              )}
                            </TableCell> */}
                            <TableCell>
                              <Button color="success">UPDATE</Button>
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
              count={reservationData.length}
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

export default Product;
