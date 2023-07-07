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
} from "@mui/material";
import { styled } from "@mui/material/styles";

function Product() {
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState([]);

  // data table
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
      fetch("http://localhost:3031/api/get-transaction-by-username", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTransaction(data);
          if (data.length === 0) {
            setTableHasNoData(true);
          } else {
            setTableHasNoData(false);
          }
        });
      setIsLoading(false);
    }, 3000);
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
          <Paper
            sx={{ width: "100%", overflow: "hidden", marginTop: "2rem" }}
            elevation={3}
          >
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>NAME</TableCell>
                    {/* <TableCell sx={{ fontWeight: "bold" }}>ADDRESS</TableCell> */}
                    <TableCell sx={{ fontWeight: "bold" }}>CONTACT</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ITEMS</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>METHOD</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>TOTAL</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      TRANSACTION DATE
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
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
                    {transaction
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((trans) => {
                        return (
                          <StyledTableRow
                            hover
                            // role="checkbox"
                            tabIndex={-1}
                            key={trans.id}
                          >
                            <TableCell>{trans.fullname}</TableCell>
                            {/* <TableCell>{trans.address}</TableCell> */}
                            <TableCell>{trans.contact}</TableCell>
                            <TableCell>{trans.items}</TableCell>
                            <TableCell>{trans.method}</TableCell>
                            <TableCell>{trans.total}</TableCell>
                            <TableCell>
                              {formatDate(trans.transaction_date)}
                            </TableCell>
                            <TableCell>
                              {trans.status === "Pending" ? (
                                <Chip label="Pending" color="warning" />
                              ) : (
                                <Chip label="Completed" color="success" />
                              )}
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
              count={transaction.length}
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
