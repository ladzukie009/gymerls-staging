import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Alert, Grid, Menu, Snackbar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "mui-image";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;
const navItems = ["My Cart"];

function DrawerAppBar(props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [cartItemQuantity, setCartItemQuantity] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartButtonDisabled, setCartButtonDisabled] = useState(true);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        GYMERL'S STORE
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [items, setItems] = useState([]);
  useEffect(() => {
    const username = localStorage.getItem("username");

    if (username === null) {
      Swal.fire({
        icon: "warning",
        title: "No user detected!",
        text: "Please login using your credential to proceed",
        showCancelButton: false,
        confirmButtonText: "Ok",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      fetch("http://localhost:3031/api/products")
        .then((response) => response.json())
        .then((data) => {
          setItems(data);
        });

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
          setCartItems(result);
          objectLength(result);
        });
    }
  }, [cartItemQuantity, navigate]);

  const addToCart = (product_name, image_url, description, price) => {
    const addedDate = formatDate(new Date());
    setCartItemQuantity(cartItemQuantity + 1);
    setOpenSnackBar(true);

    fetch("http://localhost:3031/api/add-to-cart", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
        product_name: product_name,
        image_url: image_url,
        description: description,
        price: price,
        quantity: 1,
        sub_total: price,
        status: "cart",
        added_date: addedDate,
      }),
    })
      .then((res) => res.json())
      .then((result) => {});

    // cartItems.push(item);
    // if (cartItems.length !== 0) {
    //   setCartButtonDisabled(false);
    // } else {
    //   setCartButtonDisabled(true);
    // }
    // setCartItemQuantity(cartItems.length);
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
        setCartItemQuantity(cartItemQuantity - 1);
        alert("Cart item deleted");
      });
  };

  //   const incrementQuantity = (id) => {
  //     setCartItems((cartItems) =>
  //       cartItems.map((item) => {
  //         // id === item.id ? { ...item, item.quantity + 1)  } : item;
  //         if (id === item.id) {
  //           item.quantity++;
  //           item.total = item.quantity * item.price;
  //         }
  //         return item;
  //       })
  //     );
  //   };

  function objectLength(obj) {
    var count = 0;
    for (var k in obj) {
      // if the object has this property and it isn't a property
      // further up the prototype chain
      if (obj.hasOwnProperty(k)) count++;
    }
    setCartItemQuantity(count);
    if (count === 0) {
      setCartButtonDisabled(true);
    } else {
      setCartButtonDisabled(false);
    }
    return count;
  }

  const checkout = () => {
    Swal.fire({
      title: "Proceed to checkout?",
      text: "You can proceed and place your order.",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/user/cart");
      }
    });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  return (
    <>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={1000}
        onClose={handleCloseSnackBar}
      >
        <Alert severity="success" sx={{ width: "auto" }}>
          Item added in your cart!
        </Alert>
      </Snackbar>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Grid sx={{ width: "25rem", padding: 2 }}>
          <Stack sx={{ width: "100%" }}>
            <Stack>
              <Grid container>
                <Grid item xs={2}>
                  <Typography sx={{ fontWeight: "bold" }}>Image</Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography sx={{ fontWeight: "bold" }}>Item Name</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ fontWeight: "bold" }}>Price</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ fontWeight: "bold" }}>Action</Typography>
                </Grid>
              </Grid>
            </Stack>
            {cartItems.map((item) => {
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
                  <Grid item xs={5}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {item.product_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>{item.price}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>
                      <IconButton
                        aria-label="cart"
                        onClick={() => deleteCartItem(item.id)}
                      >
                        <DeleteForeverIcon color="error" />
                      </IconButton>
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Stack>

          <Stack>
            <Button
              variant="contained"
              sx={{ marginTop: 2 }}
              disabled={cartItemQuantity === 0}
              onClick={() => checkout()}
            >
              CHECKOUT
            </Button>
          </Stack>
        </Grid>
      </Menu>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              GYMERL'S STORE
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Grid key={item} sx={{ color: "#fff" }}>
                  <IconButton
                    aria-label="cart"
                    onClick={handleClick}
                    disabled={cartButtonDisabled}
                  >
                    <StyledBadge
                      badgeContent={cartItemQuantity}
                      color="secondary"
                    >
                      <ShoppingCartIcon color="#fff" />
                    </StyledBadge>
                  </IconButton>
                </Grid>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ padding: "0 2rem", width: "100vw", marginTop: "70px" }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Stack>
                <Grid container sx={{ gap: 2, padding: "2rem" }}>
                  <Grid
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      rowGap: "2rem",
                      columnGap: "2rem",
                    }}
                  >
                    {items.map((item) => {
                      return (
                        <Grid
                          key={item.id}
                          width={250}
                          sx={{
                            flexDirection: "column",
                            justifyContent: "space-between",
                            display: "flex",
                          }}
                        >
                          <Image
                            src={item.image_url}
                            alt="empty cart"
                            height={250}
                            width={250}
                          />
                          <Typography sx={{ fontWeight: "bold" }}>
                            {item.product_name}
                          </Typography>
                          <Typography>{item.description}</Typography>
                          <Typography>{item.price}</Typography>
                          <Button
                            variant="contained"
                            fullWidth
                            color="success"
                            onClick={(event) => {
                              event.target.disabled = true;
                              event.currentTarget.style.backgroundColor =
                                "#ada5a5";
                              event.currentTarget.textContent =
                                "ALREADY IN CART";
                              addToCart(
                                item.product_name,
                                item.image_url,
                                item.description,
                                item.price
                              );
                            }}
                          >
                            ADD TO CART
                          </Button>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
