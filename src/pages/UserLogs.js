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
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PrintIcon from "@mui/icons-material/Print";

function UserLogs() {
  const [isLoading, setIsLoading] = useState(true);
  const [userLogs, setuserLogs] = useState([]);

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
      fetch("http://localhost:3031/api/get-all-logs")
        .then((response) => response.json())
        .then((data) => {
          setuserLogs(data);
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
      second: "2-digit",
    });

    var formattedDate = year + "-" + month + "-" + day + " " + hour;
    return formattedDate;
  };

  const [filteredList, setFilteredList] = new useState(userLogs);

  const filterBySearch = (e) => {
    const results = userLogs.filter((log) => {
      if (e.target.value === "") return userLogs;
      return log.username.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredList(results);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("User logs", 20, 10);
    doc.autoTable({ html: "#userLogsTable" });
    doc.save("user-logs.pdf");
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
            <Grid item xs={7}></Grid>
            <Grid item xs={5} display={"flex"} gap={1}>
              <TextField
                label="Search username"
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

          <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={3}>
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>USERNAME</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      EVENT INFO
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      DETECTION IP
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>PLATFORM</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      EVENT TIME
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
                      .map((log) => {
                        return (
                          <StyledTableRow
                            hover
                            // role="checkbox"
                            tabIndex={-1}
                            key={log.id}
                          >
                            <TableCell>{log.username}</TableCell>
                            <TableCell>{log.event_info}</TableCell>
                            <TableCell>{log.ip_address}</TableCell>
                            <TableCell>{log.platform}</TableCell>
                            <TableCell>{formatDate(log.event_time)}</TableCell>
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

            {/* PDF */}

            <TableContainer sx={{ maxHeight: 700, display: "none" }}>
              <Table stickyHeader aria-label="sticky table" id="userLogsTable">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>USERNAME</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      EVENT INFO
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      DETECTION IP
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>PLATFORM</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      EVENT TIME
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
                      .map((log) => {
                        return (
                          <StyledTableRow
                            hover
                            // role="checkbox"
                            tabIndex={-1}
                            key={log.id}
                          >
                            <TableCell>{log.username}</TableCell>
                            <TableCell>{log.event_info}</TableCell>
                            <TableCell>{log.ip_address}</TableCell>
                            <TableCell>{log.platform}</TableCell>
                            <TableCell>{formatDate(log.event_time)}</TableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Paper>
        </div>
      )}
    </>
  );
}

export default UserLogs;
