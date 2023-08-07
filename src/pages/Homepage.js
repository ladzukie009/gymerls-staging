import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
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

import { useNavigate } from "react-router-dom";
import { Grid, Paper, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { useEffect, useState } from "react";
import Image from "mui-image";

const drawerWidth = 240;

function DrawerAppBar(props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [noItems, setNoItems] = useState(true);
  useEffect(() => {
    fetch("https://gymerls-api-v2.vercel.app/api/top-products")
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setNoItems(true);
        } else {
          setNoItems(false);
          setItems(data);
        }
      });
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}></Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "center" }}
            href="https://www.facebook.com/GYMERL/"
            target="_blank"
          >
            <ListItemText primary={"About"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "center" }}
            href="https://jfkpanim.wixsite.com/gymerlsfitnessgym20?fbclid=IwAR1AXnzKRmJKL_4-jysmuj9cIQ5ofH1GBi-4zJ3WKfuzn1UhbTg5qaOQAGI"
            target="_blank"
          >
            <ListItemText primary={"Contact"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "center" }}
            onClick={(e) => {
              e.preventDefault();

              const currentUser = localStorage.getItem("username");
              const currentUserRole = localStorage.getItem("role");
              if (currentUser !== null && currentUserRole === "super_admin") {
                navigate("/dashboard");
              } else if (currentUser !== null && currentUserRole === "admin") {
                navigate("/admin/dashboard");
              } else if (currentUser !== null && currentUserRole === "user") {
                navigate("/user/dashboard");
              } else {
                navigate("/login");
              }
            }}
          >
            <ListItemText primary={"Login"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
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
            GYMERL`s Fitness Gym
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button
              sx={{ color: "#fff" }}
              href="https://www.facebook.com/GYMERL/"
              target="_blank"
            >
              About
            </Button>
            <Button
              sx={{ color: "#fff" }}
              href="https://jfkpanim.wixsite.com/gymerlsfitnessgym20?fbclid=IwAR1AXnzKRmJKL_4-jysmuj9cIQ5ofH1GBi-4zJ3WKfuzn1UhbTg5qaOQAGI"
              target="_blank"
            >
              Contact
            </Button>
            <Button
              sx={{ color: "#fff" }}
              onClick={(e) => {
                e.preventDefault();

                const currentUser = localStorage.getItem("username");
                const currentUserRole = localStorage.getItem("role");
                if (currentUser !== null && currentUserRole === "super_admin") {
                  navigate("/dashboard");
                } else if (
                  currentUser !== null &&
                  currentUserRole === "admin"
                ) {
                  navigate("/admin/dashboard");
                } else if (currentUser !== null && currentUserRole === "user") {
                  navigate("/user/dashboard");
                } else {
                  navigate("/login");
                }
              }}
            >
              Login
            </Button>
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
        sx={{
          width: "100%",
          backgroundImage: "url(../images/homepage-bg.jpg)",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
      >
        <Toolbar />
        <Stack
          sx={{
            height: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "70%",
              height: "50%",
              borderRadius: 0,
              padding: "2rem",
              textAlign: "left",
              opacity: 0.7,
            }}
          >
            <Stack>
              <Grid paddingLeft={"2rem"} borderLeft={"5px solid orange"}>
                <Typography sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}>
                  ARE YOU READY TO
                </Typography>
              </Grid>
            </Stack>
            <Stack>
              <Typography sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
                GET FIT, STRONG <br />& MOTIVATED!
              </Typography>
            </Stack>
          </Paper>
        </Stack>

        {/* PRODUCTS */}
        {noItems ? (
          <></>
        ) : (
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 0,
                textAlign: "left",
                padding: 1,
                paddingY: 5,
                minWidth: { xs: "100%", md: "70%" },
                opacity: 0.9,
              }}
            >
              <Grid container>
                <Grid item xs={12}>
                  <Stack>
                    <Typography variant="h3" alignSelf={"center"} marginTop={2}>
                      Our products
                    </Typography>
                  </Stack>
                  <Stack>
                    <Grid
                      container
                      sx={{ gap: 2, padding: "2rem", justifyContent: "center" }}
                    >
                      <Grid
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          rowGap: "2rem",
                          columnGap: "2rem",
                          justifyContent: "center",
                        }}
                      >
                        {items.map((item) => {
                          return (
                            <Grid
                              key={item.id}
                              sx={{
                                flexDirection: "column",
                                display: "flex",
                                padding: 1,
                                border: "1px solid gray",
                              }}
                            >
                              <Image
                                src={item.image_url}
                                alt="empty cart"
                                height={250}
                                width={250}
                                sx={{ backgroundColor: "#fff" }}
                              />
                              <Typography sx={{ fontWeight: "bold" }}>
                                {item.product_name}
                              </Typography>
                              <Typography>{item.description}</Typography>
                              <Typography>{item.price}</Typography>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        width: "10rem",
                        alignItems: "center",
                      }}
                      onClick={(e) => {
                        e.preventDefault();

                        const currentUser = localStorage.getItem("username");
                        const currentUserRole = localStorage.getItem("role");
                        if (
                          currentUser !== null &&
                          currentUserRole === "super_admin"
                        ) {
                          navigate("/dashboard");
                        } else if (
                          currentUser !== null &&
                          currentUserRole === "admin"
                        ) {
                          navigate("/admin/dashboard");
                        } else if (
                          currentUser !== null &&
                          currentUserRole === "user"
                        ) {
                          navigate("/store");
                        } else {
                          navigate("/login");
                        }
                      }}
                    >
                      EXPLORE SHOP
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        )}

        {/* END OF PRODUCTS */}

        <Stack>
          <Paper
            sx={{
              height: "50%",
              borderRadius: 0,
              padding: "2rem",
              textAlign: "left",
              opacity: 0.9,
            }}
          >
            <Grid container sx={{ maxWidth: "1080px", margin: "0 auto" }}>
              <Grid item xs={12} md={4}>
                <Stack marginBottom={"2rem"}>
                  <Typography variant="h5">GET IN TOUCH</Typography>
                </Stack>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "1.5rem",
                  }}
                  gap={2}
                >
                  <LocationOnIcon sx={{ fontSize: "2rem" }} />
                  <Typography fontSize={"1.2rem"}>
                    3rd Floor , Dona Pacita Building beside PureGold <br />
                    M. H Del Pilar Street, Paniqui, Tarlac, Philippines
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "1.5rem",
                  }}
                  gap={2}
                >
                  <CallIcon sx={{ fontSize: "2rem" }} />
                  <Typography fontSize={"1.2rem"}>(045) 800 6638</Typography>
                </Stack>

                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "1.5rem",
                  }}
                  gap={2}
                >
                  <EmailIcon sx={{ fontSize: "2rem" }} />
                  <Typography fontSize={"1.2rem"}>
                    jfk_panim@yahoo.com
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack marginBottom={"2rem"}>
                  <Typography variant="h5">OPERATING HOURS</Typography>
                </Stack>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "1.5rem",
                  }}
                  gap={2}
                >
                  <WatchLaterIcon sx={{ fontSize: "2rem" }} />
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography
                        display="block"
                        gutterBottom
                        fontSize={"1.2rem"}
                      >
                        Monday to Saturday
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography fontSize={"1.2rem"}>
                        7 AM to 9:30 PM
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Stack marginBottom={"2rem"}>
                  <Typography variant="h5">
                    SCAN THE QR CODE <br />
                    TO DOWNLOAD THE APP
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    maxWidth: "15rem",
                  }}
                >
                  <Image src="../images/qr-code.jpg" alt="qr-code.jpg" />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Box>
    </Box>
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
