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
  TextField,
  MenuItem,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Swal from "sweetalert2";
import Axios from "axios";

function Product() {
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState([]);

  // data table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableHasNoData, setTableHasNoData] = useState(true);

  // Dialog
  const theme = useTheme();
  const modalWidth = useMediaQuery(theme.breakpoints.down("md"));
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const [userId, setUserId] = useState(0);
  const [uploadFile, setUploadFile] = useState("");
  const [status, setStatus] = useState("");

  const paymentStatus = [
    {
      name: "pending",
      value: "Pending",
    },
    {
      name: "completed",
      value: "Completed",
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
    const timer = setTimeout(() => {
      fetch("http://localhost:3031/api/transactions")
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
  }, [transaction]);

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const uploadImageToCloud = (callback) => {
    // IMAGE
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "React-cloudinary");

    Axios.post(
      "https://api.cloudinary.com/v1_1/dpruj7bhk/image/upload",
      formData
    )
      .then((response) => {
        callback(response.data.secure_url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateTransaction = (id) => {
    setUserId(id);
    setOpenModalUpdate(true);
  };

  const closeTransactionModal = () => {
    setOpenModalUpdate(false);
  };

  const handleUpdateTransaction = () => {
    setIsBtnLoading(true);
    Swal.fire({
      title: "Are you sure you want to update this transaction?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        uploadImageToCloud(function (callback) {
          fetch("http://localhost:3031/api/update-transaction", {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              status: status,
              receipt_url: callback,
              id: userId,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              Swal.fire({
                title: "Transaction successfully updated!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              }).then(function () {
                setIsBtnLoading(false);
                setOpenModalUpdate(false);
              });
            });
        });
      }
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
          <Dialog
            fullScreen={modalWidth}
            open={openModalUpdate}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              UPDATE TRANSACTION
            </DialogTitle>
            <DialogContent>
              <DialogContentText>Fill up all fields</DialogContentText>
              <div>
                <TextField
                  id="standard-select-status"
                  select
                  fullWidth
                  margin="normal"
                  label="Status"
                  value={status}
                  sx={{ marginBottom: "1rem" }}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  defaultValue={"Completed"}
                  helperText="Please select status"
                >
                  {paymentStatus.map((option) => (
                    <MenuItem key={option.name} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="image_url"
                  margin="dense"
                  fullWidth
                  sx={{ marginBottom: "1rem" }}
                  type="file"
                  onChange={(event) => {
                    setUploadFile(event.target.files[0]);
                  }}
                  required
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => closeTransactionModal()}
              >
                CANCEL
              </Button>
              <LoadingButton
                variant="contained"
                loading={isBtnLoading}
                onClick={() => handleUpdateTransaction()}
              >
                <span>UPDATE</span>
              </LoadingButton>
            </DialogActions>
          </Dialog>

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
                    <TableCell sx={{ fontWeight: "bold" }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                {tableHasNoData ? (
                  <TableBody>
                    <StyledTableRow>
                      <TableCell align="center" colSpan={8}>
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
                            <TableCell>
                              <Button
                                color="success"
                                onClick={() => updateTransaction(trans.id)}
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
