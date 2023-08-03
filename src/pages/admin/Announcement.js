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
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Swal from "sweetalert2";
import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PrintIcon from "@mui/icons-material/Print";

function Announcement() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [announcement, setAnnouncement] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableHasNoData, setTableHasNoData] = useState(true);

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
    const timer = setTimeout(() => {
      fetch("http://localhost:3031/api/get-all-announcement")
        .then((response) => response.json())
        .then((data) => {
          setAnnouncement(data);
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
    var hour = dateToFormat.toLocaleString("default", {
      hour: "2-digit",
      minute: "2-digit",
    });

    var formattedDate = year + "-" + month + "-" + day + " " + hour;
    return formattedDate;
  };

  const formatTime = (time) => {
    var dateToFormat = new Date(time);

    var hour = dateToFormat.toLocaleString("default", {
      hour: "2-digit",
      minute: "2-digit",
    });

    var formattedDate = hour;
    return formattedDate;
  };

  const dateFormatter = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const [filteredList, setFilteredList] = new useState(announcement);

  const filterBySearch = (e) => {
    const results = announcement.filter((log) => {
      if (e.target.value === "") return announcement;
      return log.title.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredList(results);
  };

  //Dialog
  const modalWidth = useMediaQuery(theme.breakpoints.down("md"));
  const [openModalCreateAnnouncement, setOpenModalCreateAnnouncement] =
    useState(false);
  const [openModalUpdateAnnouncement, setOpenModalUpdateAnnouncement] =
    useState(false);

  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const handleOpenAnnouncementModal = (e) => {
    e.preventDefault();
    setOpenModalCreateAnnouncement(true);
    setIsBtnLoading(false);
  };

  const [selectedUserId, setSelectedUserId] = useState(0);
  const handleOpenUpdateAnnouncementModal = (id) => {
    setOpenModalUpdateAnnouncement(true);
    getAnnouncementById(id);
    setSelectedUserId(id);
    setIsBtnLoading(false);
  };

  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateEventDate, setUpdateEventDate] = useState(null);
  const [updateEventTime, setUpdateEventTime] = useState("");

  const getAnnouncementById = (id) => {
    fetch("http://localhost:3031/api/get-announcement-by-id", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setUpdateTitle(result[0].title);
        setUpdateDescription(result[0].description);
        setUpdateEventDate(result[0].event_date);
        setUpdateEventTime(result[0].event_time);
      });
  };

  const handleCloseModalProduct = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setOpenModalCreateAnnouncement(false);
      }
    });
  };

  const handleCloseUpdateModalProduct = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setOpenModalUpdateAnnouncement(false);
      }
    });
  };

  const handleUpdateAnnouncement = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure you want to update this announcement?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:3031/api/update-announcement", {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            title: updateTitle,
            description: updateDescription,
            event_date: updateEventDate,
            event_time: updateEventTime,
            id: selectedUserId,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            userLog(localStorage.getItem("username"), "Update", "announcement");

            Swal.fire({
              title: "Announcement successfully updated!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(function () {
              setOpenModalUpdateAnnouncement(false);
              setIsBtnLoading(false);
              window.location.reload(false);
            });
          });
      }
    });
  };

  const [eventDate, setEventDate] = useState(null);
  const createAnnouncement = (e) => {
    e.preventDefault();
    setIsBtnLoading(true);
    const data = new FormData(e.currentTarget);

    fetch("http://localhost:3031/api/create-announcement", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: data.get("title"),
        description: data.get("description"),
        status: 1,
        added_by: localStorage.getItem("username"),
        event_date: eventDate,
        event_time: data.get("event_time"),
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        userLog(localStorage.getItem("username"), "Create", "announcement");

        Swal.fire({
          title: "Announcement successfully created!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(function () {
          setIsBtnLoading(false);
          setIsLoading(true);
          window.location.reload(false);
        });
      });
  };

  const deleteAnnouncement = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure you want to delete this announcement?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        userLog(localStorage.getItem("username"), "Delete", "announcement");

        // DELETE IN ANNOUNCEMENT TABLE
        fetch("http://localhost:3031/api/delete-announcement", {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        }).then((res) => res.json());

        Swal.fire({
          title: "Announcement successfully deleted!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(function () {
          window.location.reload(false);
        });
      } else {
        setIsBtnLoading(false);
      }
    });
  };

  const getIpAddress = (callback) => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => callback(data.ip))
      .catch((error) => console.log(error));
  };

  const userLog = (author, action, event) => {
    getIpAddress(function (callback) {
      fetch("http://localhost:3031/api/insert-log", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: author,
          event_info: `${action} - ${event}`,
          ip_address: callback,
          platform: window.navigator.userAgentData.platform,
        }),
      }).catch((error) => console.log(error));
    });
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Announcement", 20, 10);
    doc.autoTable({ html: "#AnnouncementTable" });
    doc.save("announcement.pdf");
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
          <Grid container>
            <Grid item xs={7}>
              <Button variant="outlined" onClick={handleOpenAnnouncementModal}>
                ADD ANNOUNCEMENT
              </Button>
            </Grid>
            <Grid item xs={5} display={"flex"} gap={1}>
              <TextField
                label="Search event title"
                onChange={filterBySearch}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} display={"flex"}>
              <Grid>
                <Button onClick={() => downloadPdf()} startIcon={<PrintIcon />}>
                  Export as PDF
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* CREATE ANNOUNCEMENT */}
          <Dialog
            fullScreen={modalWidth}
            open={openModalCreateAnnouncement}
            aria-labelledby="responsive-dialog-title"
          >
            <form onSubmit={createAnnouncement}>
              <DialogTitle id="responsive-dialog-title">
                ADD ANNOUNCEMENT
              </DialogTitle>
              <DialogContent>
                <DialogContentText>Fill up all fields</DialogContentText>
                <div>
                  <TextField
                    name="title"
                    label="Title"
                    margin="dense"
                    fullWidth
                    sx={{ marginBottom: "1rem" }}
                    required
                  />

                  <TextField
                    name="description"
                    label="Description"
                    margin="dense"
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ marginBottom: "1rem" }}
                    required
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Event date *"
                      format="YYYY-MM-DD"
                      margin="normal"
                      sx={{ width: "100%" }}
                      value={eventDate}
                      onChange={(newValue) => {
                        setEventDate(dateFormatter(newValue));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <TextField
                    name="event_time"
                    label="Time"
                    margin="dense"
                    fullWidth
                    sx={{ marginBottom: "1rem" }}
                    required
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCloseModalProduct}
                >
                  CANCEL
                </Button>
                <LoadingButton
                  variant="contained"
                  loading={isBtnLoading}
                  type="submit"
                >
                  <span>CREATE</span>
                </LoadingButton>
              </DialogActions>
            </form>
          </Dialog>

          {/* EDIT ANNOUNCEMENT */}
          <Dialog
            fullScreen={modalWidth}
            open={openModalUpdateAnnouncement}
            aria-labelledby="responsive-dialog-title"
          >
            <form onSubmit={handleUpdateAnnouncement}>
              <DialogTitle id="responsive-dialog-title">
                EDIT ANNOUNCEMENT
              </DialogTitle>
              <DialogContent>
                <DialogContentText>Fill up all fields</DialogContentText>
                <div>
                  <TextField
                    name="update_title"
                    label="Title"
                    margin="dense"
                    value={updateTitle}
                    onChange={(e) => {
                      setUpdateTitle(e.target.value);
                    }}
                    fullWidth
                    sx={{ marginBottom: "1rem" }}
                    required
                  />

                  <TextField
                    name="update_description"
                    label="Description"
                    margin="dense"
                    value={updateDescription}
                    onChange={(e) => {
                      setUpdateDescription(e.target.value);
                    }}
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ marginBottom: "1rem" }}
                    required
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Event date *"
                      format="YYYY-MM-DD"
                      margin="normal"
                      sx={{ width: "100%" }}
                      value={dayjs(updateEventDate)}
                      onChange={(newValue) => {
                        setUpdateEventDate(dateFormatter(newValue));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <TextField
                    name="update_event_time"
                    label="Title"
                    margin="dense"
                    value={updateEventTime}
                    onChange={(e) => {
                      setUpdateEventTime(e.target.value);
                    }}
                    fullWidth
                    sx={{ marginBottom: "1rem" }}
                    required
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCloseUpdateModalProduct}
                >
                  CANCEL
                </Button>
                <LoadingButton
                  variant="contained"
                  loading={isBtnLoading}
                  type="submit"
                >
                  <span>UPDATE</span>
                </LoadingButton>
              </DialogActions>
            </form>
          </Dialog>

          <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={3}>
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>TITLE</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      DESCRIPTION
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ADDED BY</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>TIME</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>DATE</TableCell>
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
                    {filteredList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((event) => {
                        return (
                          <StyledTableRow
                            hover
                            // role="checkbox"
                            tabIndex={-1}
                            key={event.id}
                          >
                            <TableCell>{event.title}</TableCell>
                            <TableCell>{event.description}</TableCell>
                            <TableCell>{event.added_by}</TableCell>
                            <TableCell>{event.event_time}</TableCell>
                            <TableCell>
                              {dateFormatter(event.event_date)}
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() =>
                                  handleOpenUpdateAnnouncementModal(event.id)
                                }
                              >
                                Update
                              </Button>
                              <IconButton
                                aria-label="cart"
                                onClick={() => deleteAnnouncement(event.id)}
                              >
                                <DeleteForeverIcon color="error" />
                              </IconButton>
                            </TableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 15, 20, 50, 100, 1000]}
              component="div"
              count={filteredList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          {/* PDF */}
          <TableContainer sx={{ maxHeight: 700, display: "none" }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              id="AnnouncementTable"
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>TITLE</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>DESCRIPTION</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>ADDED BY</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>TIME</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>DATE</TableCell>
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
                  {filteredList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((event) => {
                      return (
                        <StyledTableRow
                          hover
                          // role="checkbox"
                          tabIndex={-1}
                          key={event.id}
                        >
                          <TableCell>{event.title}</TableCell>
                          <TableCell>{event.description}</TableCell>
                          <TableCell>{event.added_by}</TableCell>
                          <TableCell>{event.event_time}</TableCell>
                          <TableCell>
                            {dateFormatter(event.event_date)}
                          </TableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
}

export default Announcement;
