import { useEffect, useState } from "react";
import {
  CircularProgress,
  Backdrop,
  Grid,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import SetMealIcon from "@mui/icons-material/SetMeal";
import NoMealsIcon from "@mui/icons-material/NoMeals";

function MealPlanning() {
  const [isLoading, setIsLoading] = useState(true);
  const [meal, setMeal] = useState([]);
  const [hasMeal, setHasMeal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      fetch("http://localhost:3031/api/meal-plan", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setMeal(result);
          console.log(result.length);
          if (result.length !== 0) {
            setHasMeal(false);
          } else {
            setHasMeal(true);
          }
        });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
          {hasMeal ? (
            <Grid container textAlign={"center"}>
              <Grid item xs={12}>
                <NoMealsIcon sx={{ fontSize: "10rem" }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3">No meal plan available</Typography>
              </Grid>
            </Grid>
          ) : (
            <div>
              {meal.map((m) => {
                return (
                  <Grid key={m.id} container spacing={2}>
                    <Grid item xs={12} md={6} sm={12}>
                      <Paper elevation={3} sx={{ borderRadius: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            backgroundColor: "#1769aa",
                            color: "#fff",
                            textAlign: "center",
                            padding: 1,
                          }}
                        >
                          SUNDAY
                        </Typography>
                        <Grid sx={{ margin: 2 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <FreeBreakfastIcon
                              sx={{ fontSize: "2rem", color: "#1769aa" }}
                            />
                            <Typography variant="h6" color={"#1769aa"}>
                              Breakfast
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.sun_bf_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <RamenDiningIcon
                              sx={{ fontSize: "2rem", color: "#1769aa" }}
                            />
                            <Typography variant="h6" color={"#1769aa"}>
                              Lunch
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.sun_lunch_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <SetMealIcon
                              sx={{ fontSize: "2rem", color: "#1769aa" }}
                            />
                            <Typography variant="h6" color={"#1769aa"}>
                              Dinner
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.sun_dinner_meal}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} sm={12}>
                      <Paper elevation={3} sx={{ borderRadius: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            backgroundColor: "#0276aa",
                            color: "#fff",
                            textAlign: "center",
                            padding: 1,
                          }}
                        >
                          MONDAY
                        </Typography>
                        <Grid sx={{ margin: 2 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <FreeBreakfastIcon
                              sx={{ fontSize: "2rem", color: "#0276aa" }}
                            />
                            <Typography variant="h6" color={"#0276aa"}>
                              Breakfast
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.mon_bf_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <RamenDiningIcon
                              sx={{ fontSize: "2rem", color: "#0276aa" }}
                            />
                            <Typography variant="h6" color={"#0276aa"}>
                              Lunch
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.mon_lunch_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <SetMealIcon
                              sx={{ fontSize: "2rem", color: "#0276aa" }}
                            />
                            <Typography variant="h6" color={"#0276aa"}>
                              Dinner
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.mon_dinner_meal}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} sm={12}>
                      <Paper elevation={3} sx={{ borderRadius: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            backgroundColor: "#2196f3",
                            color: "#fff",
                            textAlign: "center",
                            padding: 1,
                          }}
                        >
                          TUESDAY
                        </Typography>
                        <Grid sx={{ margin: 2 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <FreeBreakfastIcon
                              sx={{ fontSize: "2rem", color: "#2196f3" }}
                            />
                            <Typography variant="h6" color={"#2196f3"}>
                              Breakfast
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.tue_bf_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <RamenDiningIcon
                              sx={{ fontSize: "2rem", color: "#2196f3" }}
                            />
                            <Typography variant="h6" color={"#2196f3"}>
                              Lunch
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.tue_lunch_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <SetMealIcon
                              sx={{ fontSize: "2rem", color: "#2196f3" }}
                            />
                            <Typography variant="h6" color={"#2196f3"}>
                              Dinner
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.tue_dinner_meal}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} sm={12}>
                      <Paper elevation={3} sx={{ borderRadius: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            backgroundColor: "#03a9f4",
                            color: "#fff",
                            textAlign: "center",
                            padding: 1,
                          }}
                        >
                          WEDNESDAY
                        </Typography>
                        <Grid sx={{ margin: 2 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <FreeBreakfastIcon
                              sx={{ fontSize: "2rem", color: "#03a9f4" }}
                            />
                            <Typography variant="h6" color={"#03a9f4"}>
                              Breakfast
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.wed_bf_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <RamenDiningIcon
                              sx={{ fontSize: "2rem", color: "#03a9f4" }}
                            />
                            <Typography variant="h6" color={"#03a9f4"}>
                              Lunch
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.wed_lunch_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <SetMealIcon
                              sx={{ fontSize: "2rem", color: "#03a9f4" }}
                            />
                            <Typography variant="h6" color={"#03a9f4"}>
                              Dinner
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.wed_dinner_meal}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} sm={12}>
                      <Paper elevation={3} sx={{ borderRadius: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            backgroundColor: "#4dabf5",
                            color: "#fff",
                            textAlign: "center",
                            padding: 1,
                          }}
                        >
                          THURSDAY
                        </Typography>
                        <Grid sx={{ margin: 2 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <FreeBreakfastIcon
                              sx={{ fontSize: "2rem", color: "#4dabf5" }}
                            />
                            <Typography variant="h6" color={"#4dabf5"}>
                              Breakfast
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.thurs_bf_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <RamenDiningIcon
                              sx={{ fontSize: "2rem", color: "#4dabf5" }}
                            />
                            <Typography variant="h6" color={"#4dabf5"}>
                              Lunch
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.thurs_lunch_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <SetMealIcon
                              sx={{ fontSize: "2rem", color: "#4dabf5" }}
                            />
                            <Typography variant="h6" color={"#4dabf5"}>
                              Dinner
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.thurs_dinner_meal}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} sm={12}>
                      <Paper elevation={3} sx={{ borderRadius: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            backgroundColor: "#35baf6",
                            color: "#fff",
                            textAlign: "center",
                            padding: 1,
                          }}
                        >
                          FRIDAY
                        </Typography>
                        <Grid sx={{ margin: 2 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <FreeBreakfastIcon
                              sx={{ fontSize: "2rem", color: "#35baf6" }}
                            />
                            <Typography variant="h6" color={"#35baf6"}>
                              Breakfast
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.fri_bf_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <RamenDiningIcon
                              sx={{ fontSize: "2rem", color: "#35baf6" }}
                            />
                            <Typography variant="h6" color={"#35baf6"}>
                              Lunch
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.fri_lunch_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <SetMealIcon
                              sx={{ fontSize: "2rem", color: "#35baf6" }}
                            />
                            <Typography variant="h6" color={"#35baf6"}>
                              Dinner
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.fri_dinner_meal}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6} sm={12}>
                      <Paper elevation={3} sx={{ borderRadius: 0 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            backgroundColor: "#33c9dc",
                            color: "#fff",
                            textAlign: "center",
                            padding: 1,
                          }}
                        >
                          SATURDAY
                        </Typography>
                        <Grid sx={{ margin: 2 }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <FreeBreakfastIcon
                              sx={{ fontSize: "2rem", color: "#33c9dc" }}
                            />
                            <Typography variant="h6" color={"#33c9dc"}>
                              Breakfast
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.sat_bf_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <RamenDiningIcon
                              sx={{ fontSize: "2rem", color: "#33c9dc" }}
                            />
                            <Typography variant="h6" color={"#33c9dc"}>
                              Lunch
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.sat_lunch_meal}
                            </Typography>
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            marginTop={"1rem"}
                            gap={2}
                          >
                            <SetMealIcon
                              sx={{ fontSize: "2rem", color: "#33c9dc" }}
                            />
                            <Typography variant="h6" color={"#33c9dc"}>
                              Dinner
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="h6">
                              {m.sat_dinner_meal}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default MealPlanning;
