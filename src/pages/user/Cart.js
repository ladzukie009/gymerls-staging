import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  TextField,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Image from "mui-image";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Cart() {
  const [cart, setCart] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState("Delivery");
  const [address, setAddress] = useState("");
  const [isAddressDisable, setIsAddressDisable] = useState(true);
  const [fullname, setFullname] = useState("");
  const [contact, setContact] = useState("");
  // const [totalAmount, setTotalAmount] = useState(0);

  const [newCart, setNewCart] = useState([]);

  const [item, setItem] = useState("");

  const [grandTotal, setGrandTotal] = useState(0);

  // DIALOG BOX - CHECKOUT
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch("http://localhost:3031/api/get-cart-by-id", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
        status: "cart",
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setCart(result);
        objectLength(result);
        findSumUsingReduce(result);

        let t = 0;
        result.map(({ sub_total }) => (t = t + sub_total));
        setGrandTotal(t);
      });
  }, []);

  function findSumUsingReduce(result) {
    const s = result.reduce((s, { price }) => s + price, 0);
    return s;
  }

  function objectLength(obj) {
    var count = 0;
    for (var k in obj) {
      // if the object has this property and it isn't a property
      // further up the prototype chain
      if (obj.hasOwnProperty(k)) count++;
    }
    setCartItemCount(count);
    return count;
  }

  const incrementQuantity = (id) => {
    findSumUsingReduce(cart); //function

    setCart((cartItems) =>
      cartItems.map((item) => {
        if (id === item.id) {
          item.quantity++;
          item.sub_total = item.quantity * item.price;
        }

        setCart(item); //useState
        mappingPrice(); //function
        return item;
      })
    );
  };

  const mappingPrice = () => {
    let t = 0;
    cart.map(({ sub_total }) => (t = t + sub_total));
    setGrandTotal(t); //useState
    return t;
  };

  const decrementQuantity = (id) => {
    findSumUsingReduce(cart);
    setCart((cartItems) =>
      cartItems.map((item) => {
        // id === item.id ? { ...item, item.quantity + 1)  } : item;
        if (id === item.id) {
          item.quantity--;
          item.sub_total = item.quantity * item.price;
        }

        setCart(item);
        mappingPrice();
        return item;
      })
    );
  };

  const placeOrder = () => {
    setOpen(true);
  };

  const handleChangeMethod = (event) => {
    setPaymentMethod(event.target.value);
    if (event.target.value === "Pickup") {
      setAddress(
        "3rd Floor , Dona Pacita Building beside PureGold Paniqui, M. H Del Pilar Street, Paniqui, Tarlac, Paniqui, Philippines"
      );
      setIsAddressDisable(true);
    } else {
      setAddress("");
      setIsAddressDisable(false);
    }
  };

  const deleteCartItem = (id) => {
    fetch("http://localhost:3031/api/delete-cart", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        alert("Cart item deleted");
        window.location.reload();
      });
  };

  const deleteCartItemAfterCheckout = (id) => {
    fetch("http://localhost:3031/api/delete-cart", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {});
  };

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const confirmCheckOut = () => {
    Swal.fire({
      title: "Proceed to checkout?",
      text: "You can proceed and place your order.",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        for (let post of cart) {
          deleteCartItemAfterCheckout(post.id);
        }

        for (let item of cart) {
          newCart.push(item.product_name);
        }

        var newItem = JSON.stringify(newCart).replace(/\[|\]/g, "");
        var replaceItem = newItem.replace(/"/g, "");
        setItem(replaceItem);

        const transactionDate = formatDate(new Date());

        fetch("http://localhost:3031/api/transaction", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: localStorage.getItem("username"),
            fullname: fullname,
            contact: contact,
            method: paymentMethod,
            address: address,
            items: replaceItem,
            total: grandTotal,
            status: "Pending",
            receipt_url: "image.jpg",
            transaction_date: transactionDate,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            Swal.fire({
              title: "Transaction is successful!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(function () {
              setOpen(false);
              window.location.reload();
            });
          });
      }
    });
  };

  return (
    <>
      {cartItemCount === 0 ? (
        <Box>
          <Stack sx={{ display: "flex", alignItems: "center" }}>
            <Grid className="empty-cart">
              <Image
                src="../images/emptyCart.png"
                alt="empty cart"
                showLoading={false}
              />
            </Grid>
          </Stack>
          <Stack sx={{ textAlign: "center" }}>
            <Typography variant="h5">
              Looks like you have not added anything to your cart.
              <br />
              Go ahead and explore our products!
            </Typography>
          </Stack>
          <Stack alignItems={"center"}>
            <Button
              variant="contained"
              size="large"
              sx={{ width: "10rem" }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/store";
              }}
            >
              Explore
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box>
          <div>
            <Dialog fullScreen open={open} onClose={handleClose}>
              <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography
                    sx={{ ml: 2, flex: 1 }}
                    variant="h6"
                    component="div"
                  >
                    CHECKOUT
                  </Typography>
                  <Button
                    autoFocus
                    color="inherit"
                    onClick={() => confirmCheckOut()}
                  >
                    Confirm
                  </Button>
                </Toolbar>
              </AppBar>
              <Stack>
                <Grid container padding={3}>
                  <Grid item xs={7}>
                    <Stack>
                      <Typography variant="h5" marginBottom={2}>
                        Billing Details
                      </Typography>
                      <Box component="form" margin={2}>
                        <TextField
                          id="outlined-basic"
                          value={fullname}
                          label="Fullname"
                          variant="outlined"
                          margin="normal"
                          onChange={(e) => setFullname(e.target.value)}
                          fullWidth
                        />
                        <TextField
                          id="outlined-basic"
                          value={contact}
                          label="Contact no."
                          variant="outlined"
                          margin="normal"
                          onChange={(e) => setContact(e.target.value)}
                          fullWidth
                        />
                        <Radio
                          checked={paymentMethod === "Deliver"}
                          onChange={handleChangeMethod}
                          value="Deliver"
                          name="radio-buttons"
                        />{" "}
                        Deliver
                        <Radio
                          checked={paymentMethod === "Pickup"}
                          onChange={handleChangeMethod}
                          value="Pickup"
                          name="radio-buttons"
                        />
                        Pickup
                        <TextField
                          id="outlined-basic"
                          name="address"
                          label="Address"
                          disabled={isAddressDisable}
                          variant="outlined"
                          onChange={(e) => {
                            setAddress(e.target.value);
                          }}
                          value={address}
                          margin="normal"
                          multiline
                          rows={2}
                          fullWidth
                        />
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={5}>
                    <Paper elevation={3} sx={{ borderRadius: 0, padding: 2 }}>
                      <Typography variant="h6">CART SUMMARY</Typography>
                      <Stack padding={3}>
                        {cart.map((item) => {
                          return (
                            <Grid
                              container
                              key={item.id}
                              sx={{
                                borderBottom: "2px solid gray",
                                marginBottom: 2,
                              }}
                            >
                              <Grid item xs={9}>
                                <Typography>
                                  {item.quantity} x <b>{item.product_name}</b>
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                  Php {item.sub_total}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography sx={{ opacity: 0.5 }}>
                                  {item.description}
                                </Typography>
                              </Grid>
                            </Grid>
                          );
                        })}
                        <Grid container>
                          <Grid item xs={9}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Total:
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Php {grandTotal}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Stack>
            </Dialog>
          </div>
          <Typography variant="h4">My Cart</Typography>
          <Stack>
            <Grid container>
              <Grid item xs={12} md={12}>
                <Typography variant="h6">{cartItemCount} ITEMS</Typography>
                <Stack>
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      borderBottom: "1px solid gray",
                      paddingBottom: 1,
                      marginBottom: 1,
                    }}
                  >
                    <Grid item xs={2} fontWeight={"bold"}>
                      Image
                    </Grid>
                    <Grid item xs={3} fontWeight={"bold"}>
                      Product name
                    </Grid>
                    <Grid item xs={1} fontWeight={"bold"}>
                      Price
                    </Grid>
                    <Grid item xs={3} fontWeight={"bold"} textAlign={"center"}>
                      Quantity
                    </Grid>
                    <Grid item xs={2} fontWeight={"bold"}>
                      Total
                    </Grid>
                    <Grid item xs={1} fontWeight={"bold"}>
                      Action
                    </Grid>
                  </Grid>
                </Stack>
                <Stack sx={{ width: "100%" }}>
                  {cart.map((item) => {
                    return (
                      <Grid
                        container
                        key={item.id}
                        sx={{
                          display: "flex",
                          width: "100%",
                          alignItems: "center",
                          borderBottom: "1px solid gray",
                          paddingBottom: 1,
                        }}
                      >
                        <Grid item xs={2}>
                          <Image
                            src={item.image_url}
                            alt="empty cart"
                            height={50}
                            width={50}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>{item.product_name}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <Typography>{item.price}</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Button onClick={() => decrementQuantity(item.id)}>
                            -
                          </Button>
                          <Typography>{item.quantity}</Typography>
                          <Button onClick={() => incrementQuantity(item.id)}>
                            +
                          </Button>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography>{item.price * item.quantity}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            aria-label="cart"
                            onClick={() => deleteCartItem(item.id)}
                          >
                            <DeleteForeverIcon color="error" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Stack>
                <Stack>
                  <Grid container marginTop={2}>
                    <Grid item xs={10}>
                      <Typography variant="h5" fontWeight={"bold"}>
                        TOTAL:
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="h5" fontWeight={"bold"}>
                        {grandTotal}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
                <Stack marginTop={3}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ width: "15rem" }}
                    onClick={() => placeOrder()}
                  >
                    PLACE ORDER
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      )}
    </>
  );
}

export default Cart;
