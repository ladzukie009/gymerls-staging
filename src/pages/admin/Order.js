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
  Grid,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Swal from "sweetalert2";
import Axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PrintIcon from "@mui/icons-material/Print";
import Image from "mui-image";

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
    {
      name: "out-of-stock",
      value: "Out-Of-Stock",
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
      fetch("https://gymerls-api-v2.vercel.app/api/transactions")
        .then((response) => response.json())
        .then((data) => {
          setTransaction(data);
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

  const statusFilter = [
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
      name: "Completed",
      value: "Completed",
      color: "#1976d2",
    },
    {
      name: "Out-Of-Stock",
      value: "Out-Of-Stock",
      color: "#d32f2f",
    },
  ];

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
        if (imageFieldVisible) {
          uploadImageToCloud(function (callback) {
            fetch("https://gymerls-api-v2.vercel.app/api/update-transaction", {
              method: "PATCH",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                status: status,
                receipt_url: imageFieldVisible ? callback : "image.jpg",
                id: userId,
              }),
            })
              .then((res) => res.json())
              .then((result) => {
                userLog(
                  localStorage.getItem("username"),
                  "Update",
                  "transaction as",
                  status
                );

                Swal.fire({
                  title: "Transaction successfully updated!",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(function () {
                  setIsBtnLoading(false);
                  setOpenModalUpdate(false);
                  window.location.reload(false);
                });
              });
          });
        } else {
          fetch("https://gymerls-api-v2.vercel.app/api/update-transaction", {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              status: status,
              receipt_url: "image.jpg",
              id: userId,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              userLog(
                localStorage.getItem("username"),
                "Update",
                "transaction as",
                status
              );

              Swal.fire({
                title: "Transaction successfully updated!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              }).then(function () {
                setIsBtnLoading(false);
                setOpenModalUpdate(false);
                window.location.reload(false);
              });
            });
        }
      }
    });
  };

  const [filteredList, setFilteredList] = new useState(transaction);

  const filterBySearch = (e) => {
    const results = transaction.filter((trans) => {
      if (e.target.value === "") return transaction;
      return trans.fullname
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setFilteredList(results);
  };

  const filterByStatus = (e) => {
    const results = transaction.filter((trans) => {
      if (e.target.value === "All") return transaction;
      return trans.status.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredList(results);
  };

  const getIpAddress = (callback) => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => callback(data.ip))
      .catch((error) => console.log(error));
  };

  const userLog = (author, action, event, status) => {
    getIpAddress(function (callback) {
      fetch("https://gymerls-api-v2.vercel.app/api/insert-log", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: author,
          event_info: `${action} - ${event} "${status}"`,
          ip_address: callback,
          platform: window.navigator.userAgentData.platform,
        }),
      }).catch((error) => console.log(error));
    });
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Orders", 20, 10);
    doc.autoTable({ html: "#orderTable" });
    doc.save("orders.pdf");
  };

  const [imageFieldVisible, setImageFieldVisible] = useState(true);
  const [openModalReceipt, setOpenModalReceipt] = useState(false);
  const [currentReceiptSelected, setCurrentReceiptSelected] = useState("");

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
                    if (e.target.value === "Pending") {
                      setImageFieldVisible(false);
                    } else if (e.target.value === "Out-Of-Stock") {
                      setImageFieldVisible(false);
                    } else {
                      setImageFieldVisible(true);
                    }
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
                {imageFieldVisible ? (
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
                ) : (
                  <TextField
                    name="image_url"
                    margin="dense"
                    fullWidth
                    disabled
                    sx={{ marginBottom: "1rem" }}
                    type="file"
                    required
                  />
                )}
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

          {/* DIALOG FOR RECEIPT */}
          <Dialog
            fullScreen={modalWidth}
            open={openModalReceipt}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogContent>
              <Image
                src={currentReceiptSelected}
                alt="receipt.jpg"
                onClick={() => setOpenModalReceipt(true)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenModalReceipt(false)}
              >
                CLOSE
              </Button>
            </DialogActions>
          </Dialog>

          <Grid container>
            <Grid item md={5}></Grid>
            <Grid
              item
              md={7}
              sx={{ display: "flex", alignItems: "center", columnGap: "1rem" }}
            >
              <TextField
                label="Search name"
                onChange={filterBySearch}
                fullWidth
              />
              <TextField
                id="standard-select-status"
                select
                fullWidth
                margin="normal"
                label="Status"
                sx={{ marginBottom: "1rem" }}
                onChange={filterByStatus}
                defaultValue={"All"}
              >
                {statusFilter.map((option) => (
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
                    <TableCell sx={{ fontWeight: "bold" }}>NAME</TableCell>
                    {/* <TableCell sx={{ fontWeight: "bold" }}>ADDRESS</TableCell> */}
                    <TableCell sx={{ fontWeight: "bold" }}>CONTACT</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ITEMS</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>METHOD</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>QUANTITY</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>TOTAL</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      TRANSACTION DATE
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>RECEIPT</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                {tableHasNoData ? (
                  <TableBody>
                    <StyledTableRow>
                      <TableCell align="center" colSpan={10}>
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
                            <TableCell>{trans.total_quantity}</TableCell>
                            <TableCell>{trans.total}</TableCell>
                            <TableCell>
                              {formatDate(trans.transaction_date)}
                            </TableCell>
                            <TableCell>
                              {trans.receipt_url === "image.jpg" ? (
                                <>No receipt</>
                              ) : (
                                <Image
                                  src={trans.receipt_url}
                                  alt="receipt.jpg"
                                  onClick={() => {
                                    setOpenModalReceipt(true);
                                    setCurrentReceiptSelected(
                                      trans.receipt_url
                                    );
                                  }}
                                  height={50}
                                  width={50}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {trans.status === "Pending" ? (
                                <Chip
                                  label="Pending"
                                  color="warning"
                                  sx={{ width: "8rem" }}
                                />
                              ) : trans.status === "Completed" ? (
                                <Chip
                                  label="Completed"
                                  color="success"
                                  sx={{ width: "8rem" }}
                                />
                              ) : (
                                <Chip
                                  label="Out-Of-Stock"
                                  color="error"
                                  sx={{ width: "8rem" }}
                                />
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
              count={filteredList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* PDF */}
            <TableContainer sx={{ maxHeight: 700, display: "none" }}>
              <Table stickyHeader aria-label="sticky table" id="orderTable">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>NAME</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>CONTACT</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ITEMS</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>METHOD</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>QUANTITY</TableCell>
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
                      <TableCell align="center" colSpan={8}>
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
                      .map((trans) => {
                        return (
                          <StyledTableRow hover tabIndex={-1} key={trans.id}>
                            <TableCell>{trans.fullname}</TableCell>
                            <TableCell>{trans.contact}</TableCell>
                            <TableCell>{trans.items}</TableCell>
                            <TableCell>{trans.method}</TableCell>
                            <TableCell>{trans.total_quantity}</TableCell>
                            <TableCell>{trans.total}</TableCell>
                            <TableCell>
                              {formatDate(trans.transaction_date)}
                            </TableCell>
                            <TableCell>
                              {trans.status === "Pending" ? (
                                <Chip
                                  label="Pending"
                                  color="warning"
                                  sx={{ width: "6rem" }}
                                />
                              ) : (
                                <Chip
                                  label="Completed"
                                  color="success"
                                  sx={{ width: "6rem" }}
                                />
                              )}
                            </TableCell>
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

export default Product;
