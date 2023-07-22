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
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Swal from "sweetalert2";
import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

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

  const [filteredList, setFilteredList] = new useState(announcement);

  const filterBySearch = (e) => {
    const results = announcement.filter((log) => {
      if (e.target.value === "") return announcement;
      return log.username.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredList(results);
  };

  //Dialog
  const modalWidth = useMediaQuery(theme.breakpoints.down("md"));
  const [openModalCreateAnnouncement, setOpenModalCreateAnnouncement] =
    useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const handleOpenAnnouncementModal = (e) => {
    e.preventDefault();
    setOpenModalCreateAnnouncement(true);
    setIsBtnLoading(false);
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

  const [eventDate, setEventDate] = useState(null);

  const createAnnouncement = (e) => {
    e.preventDefault();
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
      }),
    })
      .then((res) => res.json())
      .then((result) => {});
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
                label="Search username"
                onChange={filterBySearch}
                fullWidth
              />
            </Grid>
          </Grid>

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
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        label="Basic date time picker"
                        onChange={(e) => {
                          setEventDate(e.$d);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
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

          <Paper
            sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}
            elevation={3}
          >
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>TITLE</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      DESCRIPTION
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ADDED BY</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      DATE / TIME
                    </TableCell>
                  </TableRow>
                </TableHead>
                {tableHasNoData ? (
                  <TableBody>
                    <StyledTableRow>
                      <TableCell align="center" colSpan={5}>
                        {"No logs available"}
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
                            <TableCell>
                              {event.status ? "Active" : "Inactive"}
                            </TableCell>
                            <TableCell>{event.added_by}</TableCell>
                            <TableCell>
                              {formatDate(event.event_date)}
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
        </div>
      )}
    </>
  );
}

export default Announcement;
