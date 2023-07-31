import { Button, Grid, Stack, Typography } from "@mui/material";
import Image from "mui-image";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();
  return (
    <>
      <Stack>
        <Grid container>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid sx={{ width: { xs: "100%", md: "50rem" } }}>
              <Image src="../images/404.jpg" alt="404.jpg" />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid
              sx={{ width: { xs: "100%", md: "50rem" }, textAlign: "center" }}
            >
              <Typography variant="h1">404</Typography>
              <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
                This page could not be found
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  navigate("/");
                }}
              >
                Go to homepage
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

export default ErrorPage;
