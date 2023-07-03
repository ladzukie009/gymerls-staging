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

import { useNavigate } from "react-router-dom";
import { Grid, Paper, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import WatchLaterIcon from "@mui/icons-material/WatchLater";

const drawerWidth = 240;

function DrawerAppBar(props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}></Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary={"About"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary={"Opening Hours"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary={"Our Classes"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary={"Training"} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
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
            <Button sx={{ color: "#fff" }}>Home</Button>
            <Button sx={{ color: "#fff" }}>About</Button>
            <Button sx={{ color: "#fff" }}>Opening Hours</Button>
            <Button sx={{ color: "#fff" }}>Our Classes </Button>
            <Button sx={{ color: "#fff" }}>Training</Button>
            <Button sx={{ color: "#fff" }}>Contact</Button>
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
          backgroundImage:
            "url(https://www.technogym.com/wpress/wp-content/uploads/2019/02/technogym_run_hero.jpg)",
          backgroundAttachment: "fixed",
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
                <Typography variant="h4">ARE YOU READY TO</Typography>
              </Grid>
            </Stack>
            <Stack>
              <Typography variant="h3">
                GET FIT, STRONG <br />& MOTIVATED!
              </Typography>
            </Stack>
          </Paper>
        </Stack>

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
            <Grid container>
              <Grid item xs={6}>
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
                    Paniqui, M. H Del Pilar Street, Paniqui, Tarlac, <br />
                    Paniqui, Philippines
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
              <Grid item xs={6}>
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
                  <Stack>
                    <Typography
                      display="block"
                      gutterBottom
                      fontSize={"1.2rem"}
                    >
                      Monday to Saturday
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography fontSize={"1.2rem"}>7 AM to 9:30 PM</Typography>
                  </Stack>
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
