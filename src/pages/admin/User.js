import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Grid,
  Divider,
  Typography,
  Radio,
  CircularProgress,
  Backdrop,
  Switch,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PrintIcon from "@mui/icons-material/Print";

function User() {
  const relativeTime = require("dayjs/plugin/relativeTime");
  const [open, setOpen] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalMealPlanning, setOpenModalMealPlanning] = useState(false);
  const [openModalUpdatePassword, setOpenModalUpdatePassword] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const modalWidth = useMediaQuery(theme.breakpoints.down("md"));

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("Male");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedication, setCurrentMedication] = useState("");
  const [familyDoctor, setFamilyDoctor] = useState("");
  const [doctorContact, setDoctorContact] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [parentAddress, setParentAddress] = useState("");
  const [membershipType, setMembershipType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndtDate] = useState(null);

  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [usernameIsValid, setUsernameIsValid] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [updateBirthdate, setUpdateBirthdate] = useState(null);
  const [updateStartDate, setUpdateStartDate] = useState(null);
  const [updateEndDate, setUpdateEndDate] = useState(null);

  const [mealPlanUser, setMealPlanUser] = useState();
  const [hasMealPlan, setHasMealPlan] = useState(false);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserPassword, setSelectedUserPassword] = useState("");
  const [passwordButton, setPasswordButton] = useState(false);

  const [createButtonIsDisabled, setcreateButtonIsDisabled] = useState(true);

  // MEAL DATA
  const [sundayBreakfast, setSundayBreakfast] = useState("");
  const [sundayLunch, setSundayLunch] = useState("");
  const [sundayDinner, setSundayDinner] = useState("");

  const [mondayBreakfast, setMondayBreakfast] = useState("");
  const [mondayLunch, setMondayLunch] = useState("");
  const [mondayDinner, setMondayDinner] = useState("");

  const [tuesdayBreakfast, setTuesdayBreakfast] = useState("");
  const [tuesdayLunch, setTuesdayLunch] = useState("");
  const [tuesdayDinner, setTuesdayDinner] = useState("");

  const [wednesdayBreakfast, setWednesdayBreakfast] = useState("");
  const [wednesdayLunch, setWednesdayLunch] = useState("");
  const [wednesdayDinner, setWednesdayDinner] = useState("");

  const [thursdayBreakfast, setThursdayBreakfast] = useState("");
  const [thursdayLunch, setThursdayLunch] = useState("");
  const [thursdayDinner, setThursdayDinner] = useState("");

  const [fridayBreakfast, setFridayBreakfast] = useState("");
  const [fridayLunch, setFridayLunch] = useState("");
  const [fridayDinner, setFridayDinner] = useState("");

  const [saturdayBreakfast, setSaturdayBreakfast] = useState("");
  const [saturdayLunch, setSaturdayLunch] = useState("");
  const [saturdayDinner, setSaturdayDinner] = useState("");

  const membership = [
    {
      name: "premium",
      value: "Premium",
    },
    {
      name: "monthly",
      value: "Monthly",
    },
  ];

  const dietType = [
    {
      name: "bulking",
      value: "Bulking",
    },
    {
      name: "cutting",
      value: "Cutting",
    },
    {
      name: "Body recomposition",
      value: "Body recomposition",
    },
  ];
  const [typeDiet, setTypeDiet] = useState("");
  const [totalCalories, setTotalCalories] = useState("");

  // data table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableHasNoData, setTableHasNoData] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = () => {
    setAge(0);
    setOpen(true);
    populateRoleInput();
  };

  const handleClose = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setOpen(false);
        setAge(0);
      }
    });
  };

  const handleCloseUpdateModal = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setOpenModalUpdate(false);
      }
    });
  };

  // GENDER
  const handleChangeGender = (event) => {
    setGender(event.target.value);
  };

  const populateRoleInput = () => {
    fetch("https://gymerls-api-v2.vercel.app/api/roles")
      .then((response) => response.json())
      .then((data) => {
        const newData = data.filter((object) => {
          return object.id === 4;
        });
        setRoles(newData);
      });
  };

  const createUser = (e) => {
    e.preventDefault();
    setIsBtnLoading(true);

    Swal.fire({
      icon: "info",
      title: "Are you sure you want to create new account?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("https://gymerls-api-v2.vercel.app/api/register", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            name: fullname,
            username: username,
            role: selectedRole,
            isActive: 1,
            password: (Math.random() + 1).toString(36).substring(4),
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            createUserProfile();
            userLog(
              localStorage.getItem("username"),
              "Create",
              "new user",
              username
            );
          });
        Swal.fire({
          title: "User successfully created!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(function () {
          setIsBtnLoading(false);
          setOpen(false);
          setIsLoading(true);
          window.location.reload(false);
        });
      } else {
        setIsBtnLoading(false);
      }
    });
  };

  const formatDate = (date) => {
    var dateToFormat = new Date(date);
    var year = dateToFormat.toLocaleString("default", { year: "numeric" });
    var month = dateToFormat.toLocaleString("default", { month: "2-digit" });
    var day = dateToFormat.toLocaleString("default", { day: "2-digit" });

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const validateUser = (username) => {
    setUsernameIsValid(true);
    setcreateButtonIsDisabled(true);
    setIsVisible(true);
    if (username.length >= 5) {
      fetch("https://gymerls-api-v2.vercel.app/api/validate-user", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.length === 0) {
            setUsernameIsValid(true);
            setcreateButtonIsDisabled(false);
            setIsVisible(false);
          } else {
            setUsernameIsValid(false);
            setcreateButtonIsDisabled(true);
            setIsVisible(false);
          }
        });
    }
  };

  const createUserProfile = () => {
    const formattedBirthdate = formatDate(birthdate);
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    fetch("https://gymerls-api-v2.vercel.app/api/create-user-profile", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        birthdate: formattedBirthdate,
        age: age,
        gender: gender,
        contact: contact,
        address: address,
        medical_conditions: medicalConditions,
        allergies: allergies,
        current_medication: currentMedication,
        family_doctor: familyDoctor,
        doctor_contact: doctorContact,
        parent_name: parentName,
        parent_contact: parentContact,
        parent_address: parentAddress,
        membership_type: membershipType,
        mem_start_date: formattedStartDate,
        mem_end_date: formattedEndDate,
        added_by: localStorage.getItem("username"),
      }),
    })
      .then((res) => res.json())
      .then((result) => {});
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("https://gymerls-api-v2.vercel.app/api/get-user-by-role", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          added_by: localStorage.getItem("username"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === 0) {
            setTableHasNoData(false);
          } else {
            setFilteredList(data);
            setUsers(data);
            setIsLoading(false);
            setTableHasNoData(true);
          }
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const handleClickOpenModalUpdate = (user_name) => {
    setOpenModalUpdate(true);
    fetch("https://gymerls-api-v2.vercel.app/api/get-user-by-username", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: user_name,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const bdate = formatDate(result[0].birthdate);
        const startDate = formatDate(result[0].mem_start_date);
        const endDate = formatDate(result[0].mem_end_date);

        setFullname(result[0].name);
        setUpdateBirthdate(bdate);
        setAge(result[0].age);
        setContact(result[0].contact);
        setGender(result[0].gender);
        setAddress(result[0].address);

        setMedicalConditions(result[0].medical_conditions);
        setAllergies(result[0].allergies);
        setCurrentMedication(result[0].current_medication);
        setFamilyDoctor(result[0].family_doctor);
        setDoctorContact(result[0].doctor_contact);

        setParentName(result[0].parent_name);
        setParentContact(result[0].parent_contact);
        setParentAddress(result[0].parent_address);

        setMembershipType(result[0].membership_type);
        setUpdateStartDate(startDate);
        setUpdateEndDate(endDate);

        setUsername(result[0].username);
      });
  };

  const updateUser = () => {
    setIsBtnLoading(true);
    const birthdateFormatted = formatDate(updateBirthdate);
    const startDateFormatted = formatDate(updateStartDate);
    const endDateFormatted = formatDate(updateEndDate);

    Swal.fire({
      icon: "info",
      title: "Are you sure you want to update this account?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("https://gymerls-api-v2.vercel.app/api/update-user", {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            name: fullname,
            birthdate: birthdateFormatted,
            age: age,
            contact: contact,
            gender: gender,
            address: address,
            medical_conditions: medicalConditions,
            allergies: allergies,
            current_medication: currentMedication,
            family_doctor: familyDoctor,
            doctor_contact: doctorContact,
            parent_name: parentName,
            parent_contact: parentContact,
            parent_address: parentAddress,
            membership_type: membershipType,
            mem_start_date: startDateFormatted,
            mem_end_date: endDateFormatted,
            username: username,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            userLog(
              localStorage.getItem("username"),
              "Update",
              "user",
              username
            );
            Swal.fire({
              title: "User successfully updated!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(function () {
              setOpenModalUpdate(false);
              setIsBtnLoading(false);
              window.location.reload(false);
            });
          });
      } else {
        setIsBtnLoading(false);
      }
    });
  };

  const handleOpenModalMealPlanning = (username) => {
    setMealPlanUser(username);
    setOpenModalMealPlanning(true);

    fetch("https://gymerls-api-v2.vercel.app/api/meal-plan", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length !== 0) {
          setHasMealPlan(true);

          setTypeDiet(data[0].diet_type);
          setTotalCalories(data[0].calories);

          setSundayBreakfast(data[0].sun_bf_meal);
          setSundayLunch(data[0].sun_lunch_meal);
          setSundayDinner(data[0].sun_dinner_meal);

          setMondayBreakfast(data[0].mon_bf_meal);
          setMondayLunch(data[0].mon_lunch_meal);
          setMondayDinner(data[0].mon_dinner_meal);

          setTuesdayBreakfast(data[0].tue_bf_meal);
          setTuesdayLunch(data[0].tue_lunch_meal);
          setTuesdayDinner(data[0].tue_dinner_meal);

          setWednesdayBreakfast(data[0].wed_bf_meal);
          setWednesdayLunch(data[0].wed_lunch_meal);
          setWednesdayDinner(data[0].wed_dinner_meal);

          setThursdayBreakfast(data[0].thurs_bf_meal);
          setThursdayLunch(data[0].thurs_lunch_meal);
          setThursdayDinner(data[0].thurs_dinner_meal);

          setFridayBreakfast(data[0].fri_bf_meal);
          setFridayLunch(data[0].fri_lunch_meal);
          setFridayDinner(data[0].fri_dinner_meal);

          setSaturdayBreakfast(data[0].sat_bf_meal);
          setSaturdayLunch(data[0].sat_lunch_meal);
          setSaturdayDinner(data[0].sat_dinner_meal);
        } else {
          setHasMealPlan(false);
        }
      });
  };

  const handleCloseModalMealPlanning = () => {
    setTypeDiet("");
    setTotalCalories("");
    setSundayBreakfast("");
    setSundayLunch("");
    setSundayDinner("");
    setMondayBreakfast("");
    setMondayLunch("");
    setMondayDinner("");
    setTuesdayBreakfast("");
    setTuesdayLunch("");
    setTuesdayDinner("");
    setWednesdayBreakfast("");
    setWednesdayLunch("");
    setWednesdayDinner("");
    setThursdayBreakfast("");
    setThursdayLunch("");
    setThursdayDinner("");
    setFridayBreakfast("");
    setFridayLunch("");
    setFridayDinner("");
    setSaturdayBreakfast("");
    setSaturdayLunch("");
    setSaturdayDinner("");
    setOpenModalMealPlanning(false);
  };

  const createMealPlan = (event) => {
    event.preventDefault();
    setIsBtnLoading(true);
    const data = new FormData(event.currentTarget);

    fetch("https://gymerls-api-v2.vercel.app/api/create-meal-planning", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: mealPlanUser,
        diet_type: data.get("diet_type"),
        calories: data.get("total_calories"),
        sun_bf_meal: data.get("sunday_breakfast"),
        sun_lunch_meal: data.get("sunday_lunch"),
        sun_dinner_meal: data.get("sunday_dinner"),
        mon_bf_meal: data.get("monday_breakfast"),
        mon_lunch_meal: data.get("monday_lunch"),
        mon_dinner_meal: data.get("monday_dinner"),
        tue_bf_meal: data.get("tuesday_breakfast"),
        tue_lunch_meal: data.get("tuesday_lunch"),
        tue_dinner_meal: data.get("tuesday_dinner"),
        wed_bf_meal: data.get("wednesday_breakfast"),
        wed_lunch_meal: data.get("wednesday_lunch"),
        wed_dinner_meal: data.get("wednesday_dinner"),
        thurs_bf_meal: data.get("thursday_breakfast"),
        thurs_lunch_meal: data.get("thursday_lunch"),
        thurs_dinner_meal: data.get("thursday_dinner"),
        fri_bf_meal: data.get("friday_breakfast"),
        fri_lunch_meal: data.get("friday_lunch"),
        fri_dinner_meal: data.get("friday_dinner"),
        sat_bf_meal: data.get("saturday_breakfast"),
        sat_lunch_meal: data.get("saturday_lunch"),
        sat_dinner_meal: data.get("saturday_dinner"),
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        userLog(
          localStorage.getItem("username"),
          "Create",
          "meal plan for",
          mealPlanUser
        );
        Swal.fire({
          title: "Meal plan successfully created!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(function () {
          setOpenModalMealPlanning(false);
          setIsBtnLoading(false);
          window.location.reload(false);
        });
      });
  };

  const updateMealPlan = (event) => {
    event.preventDefault();
    setIsBtnLoading(true);
    const data = new FormData(event.currentTarget);
    Swal.fire({
      icon: "info",
      title: "Are you sure you want to update this account?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("https://gymerls-api-v2.vercel.app/api/update-meal-planning", {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            diet_type: data.get("diet_type"),
            calories: data.get("total_calories"),
            sun_bf_meal: data.get("sunday_breakfast"),
            sun_lunch_meal: data.get("sunday_lunch"),
            sun_dinner_meal: data.get("sunday_dinner"),
            mon_bf_meal: data.get("monday_breakfast"),
            mon_lunch_meal: data.get("monday_lunch"),
            mon_dinner_meal: data.get("monday_dinner"),
            tue_bf_meal: data.get("tuesday_breakfast"),
            tue_lunch_meal: data.get("tuesday_lunch"),
            tue_dinner_meal: data.get("tuesday_dinner"),
            wed_bf_meal: data.get("wednesday_breakfast"),
            wed_lunch_meal: data.get("wednesday_lunch"),
            wed_dinner_meal: data.get("wednesday_dinner"),
            thurs_bf_meal: data.get("thursday_breakfast"),
            thurs_lunch_meal: data.get("thursday_lunch"),
            thurs_dinner_meal: data.get("thursday_dinner"),
            fri_bf_meal: data.get("friday_breakfast"),
            fri_lunch_meal: data.get("friday_lunch"),
            fri_dinner_meal: data.get("friday_dinner"),
            sat_bf_meal: data.get("saturday_breakfast"),
            sat_lunch_meal: data.get("saturday_lunch"),
            sat_dinner_meal: data.get("saturday_dinner"),
            username: mealPlanUser,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            userLog(
              localStorage.getItem("username"),
              "Update",
              "meal plan for",
              mealPlanUser
            );
            Swal.fire({
              title: "Meal plan successfully updated!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(function () {
              setOpenModalMealPlanning(false);
              setIsBtnLoading(false);
              window.location.reload(false);
            });
          });
      } else {
      }
    });
  };

  const handleOpenModalUpdatePassword = (username, password) => {
    setPasswordButton(true);
    setSelectedUser(username);
    setSelectedUserPassword(password);
    setOpenModalUpdatePassword(true);
  };

  const updatePassword = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIsBtnLoading(true);

    Swal.fire({
      icon: "info",
      title: "Are you sure you want to update the password to this user?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("https://gymerls-api-v2.vercel.app/api/update-password", {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            password: data.get("newPassword"),
            username: selectedUser,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            userLog(
              localStorage.getItem("username"),
              "Update",
              "password of user",
              selectedUser
            );

            Swal.fire({
              title: "Password successfully updated!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(function () {
              setOpenModalUpdatePassword(false);
              setIsBtnLoading(false);
              window.location.reload(false);
            });
          });
      } else {
        setIsBtnLoading(false);
      }
    });
  };

  const changeUserStatus = (status, username) => {
    Swal.fire({
      icon: "info",
      title: "Are you sure you want to update the status to this user?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsBtnLoading(true);
        handleUserStatus(status, username);
      } else {
        window.location.reload(false);
      }
    });
  };

  const handleUserStatus = (status, username) => {
    fetch("https://gymerls-api-v2.vercel.app/api/update-user-status", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        isActive: status ? 1 : 0,
        username: username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        userLog(
          localStorage.getItem("username"),
          "Change",
          "status of user",
          username
        );

        Swal.fire({
          title: "User status successfully updated!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(function () {
          setIsBtnLoading(false);
          window.location.reload(false);
        });
      });
  };
  const [filteredList, setFilteredList] = new useState(users);

  const filterBySearch = (e) => {
    const results = users.filter((user) => {
      if (e.target.value === "") return users;
      return user.username.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredList(results);
  };

  const getIpAddress = (callback) => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => callback(data.ip))
      .catch((error) => console.log(error));
  };

  const userLog = (author, action, event, user) => {
    getIpAddress(function (callback) {
      fetch("https://gymerls-api-v2.vercel.app/api/insert-log", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: author,
          event_info: `${action} - ${event} "${user}"`,
          ip_address: callback,
          platform: window.navigator.userAgentData.platform,
        }),
      }).catch((error) => console.log(error));
    });
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("List of users", 20, 10);
    doc.autoTable({ html: "#usersTable" });
    doc.save("users.pdf");
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
            <Grid item xs={12} md={7}>
              <Button variant="outlined" onClick={handleClickOpen}>
                Create new user
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
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

          {/* CREATE NEW USER */}
          <Dialog
            fullScreen={fullScreen}
            open={open}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"CREATE NEW USER"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Fill up all fields, type <strong>n/a</strong> if not applicable.
              </DialogContentText>
              <Typography variant="h6">Personal information</Typography>
              <TextField
                id="name"
                label="Name"
                margin="normal"
                onChange={(e) => {
                  setFullname(e.target.value);
                }}
                autoFocus
                required
                fullWidth
              />
              <TextField
                id="username"
                label="Username"
                margin="dense"
                helperText="Username must be 5 characters and above"
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUser(e.target.value);
                }}
                required
                fullWidth
              />

              {usernameIsValid ? (
                <Typography
                  variant="caption"
                  margin="normal"
                  hidden={isVisible}
                  sx={{ fontSize: "0.8rem", color: "green" }}
                >
                  Username is available
                </Typography>
              ) : (
                <Typography
                  variant="caption"
                  margin="normal"
                  hidden={isVisible}
                  sx={{ fontSize: "0.8rem", color: "#ae1919" }}
                >
                  Username is taken
                </Typography>
              )}

              <TextField
                id="standard-select-role"
                select
                fullWidth
                margin="normal"
                label="Role"
                value={selectedRole}
                sx={{ marginBottom: "1rem" }}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                }}
                defaultValue={"user"}
                helperText="Please select role"
              >
                {roles.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Birthdate *"
                  format="YYYY-MM-DD"
                  sx={{ width: "100%" }}
                  value={birthdate}
                  onChange={(newValue) => {
                    setBirthdate(newValue);
                    const formatBdate = formatDate(newValue);
                    dayjs.extend(relativeTime);

                    var newDate = dayjs(formatBdate).fromNow(true);

                    let firstWord = newDate.split(" ")[0];
                    var age = parseFloat(firstWord);
                    setAge(age);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="age"
                    label="Age"
                    margin="normal"
                    type="number"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                    }}
                    required
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div sx={{ color: "#a4a4a4" }}>{"Gender:"}</div>
                  <Radio
                    checked={gender === "Male"}
                    onChange={handleChangeGender}
                    value="Male"
                    name="radio-buttons"
                  />
                  <Radio
                    checked={gender === "Female"}
                    onChange={handleChangeGender}
                    value="Female"
                    name="radio-buttons"
                    sx={{
                      color: "pink",
                      "&.Mui-checked": {
                        color: "pink",
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <TextField
                id="contact"
                label="Contact no."
                margin="normal"
                onChange={(e) => {
                  setContact(e.target.value);
                }}
                required
                fullWidth
              />
              <TextField
                id="address"
                label="Address"
                margin="normal"
                fullWidth
                multiline
                rows={2}
                sx={{ marginBottom: "1rem" }}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
              <Divider />
              <Typography sx={{ marginTop: "1rem" }} variant="h6">
                Medical information
              </Typography>
              <TextField
                id="medical_conditions"
                label="Medical conditions"
                margin="normal"
                fullWidth
                multiline
                rows={2}
                onChange={(e) => {
                  setMedicalConditions(e.target.value);
                }}
              />
              <TextField
                id="allergies"
                label="Allergies"
                margin="normal"
                fullWidth
                multiline
                rows={2}
                onChange={(e) => {
                  setAllergies(e.target.value);
                }}
              />
              <TextField
                id="current_medications"
                label="Current medications"
                margin="normal"
                fullWidth
                multiline
                rows={2}
                onChange={(e) => {
                  setCurrentMedication(e.target.value);
                }}
              />
              <TextField
                id="doctor_name"
                label="Doctor's name"
                margin="normal"
                onChange={(e) => {
                  setFamilyDoctor(e.target.value);
                }}
                required
                fullWidth
              />
              <TextField
                sx={{ marginBottom: "1rem" }}
                id="doctor_contact"
                label="Contact no."
                margin="normal"
                onChange={(e) => {
                  setDoctorContact(e.target.value);
                }}
                required
                fullWidth
              />
              <Divider />
              <Typography sx={{ marginTop: "1rem" }} variant="h6">
                In case of emergency
              </Typography>
              <TextField
                id="parent_name"
                label="Parent's name"
                margin="normal"
                onChange={(e) => {
                  setParentName(e.target.value);
                }}
                required
                fullWidth
              />
              <TextField
                id="parent_contact"
                label="Contact no."
                margin="normal"
                onChange={(e) => {
                  setParentContact(e.target.value);
                }}
                required
                fullWidth
              />
              <TextField
                id="parent_address"
                label="Address"
                margin="normal"
                fullWidth
                multiline
                rows={2}
                sx={{ marginBottom: "1rem" }}
                onChange={(e) => {
                  setParentAddress(e.target.value);
                }}
              />
              <Divider />
              <Typography sx={{ marginTop: "1rem" }} variant="h6">
                Membership
              </Typography>
              <TextField
                id="standard-select-membership"
                select
                fullWidth
                margin="normal"
                label="Membership"
                value={membershipType}
                sx={{ marginBottom: "1rem" }}
                onChange={(e) => {
                  setMembershipType(e.target.value);
                }}
                defaultValue={"Monthly"}
                helperText="Please select membership"
              >
                {membership.map((option) => (
                  <MenuItem key={option.name} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start date"
                      format="YYYY-MM-DD"
                      sx={{ width: "100%" }}
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End date *"
                      format="YYYY-MM-DD"
                      sx={{ width: "100%" }}
                      value={endDate}
                      onChange={(newValue) => {
                        setEndtDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="error" onClick={handleClose}>
                CANCEL
              </Button>
              <LoadingButton
                onClick={createUser}
                variant="contained"
                disabled={createButtonIsDisabled}
                loading={isBtnLoading}
              >
                <span>CREATE</span>
              </LoadingButton>
            </DialogActions>
          </Dialog>

          {/* UPDATE USER */}
          <Dialog
            fullScreen={modalWidth}
            open={openModalUpdate}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {"UPDATE USER"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Fill up all fields, type <strong>n/a</strong> if not applicable.
              </DialogContentText>
              <Typography variant="h6">Personal information</Typography>

              <div>
                <TextField
                  id="name"
                  label="Name"
                  margin="normal"
                  value={fullname}
                  onChange={(e) => {
                    setFullname(e.target.value);
                  }}
                  autoFocus
                  required
                  fullWidth
                />
                <Grid container spacing={2}>
                  <Grid item xs={8} sx={{ marginTop: "1rem" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Birthdate *"
                        format="YYYY-MM-DD"
                        sx={{ width: "100%" }}
                        value={dayjs(updateBirthdate)}
                        onChange={(newValue) => {
                          setUpdateBirthdate(newValue);
                          const formatBdate = formatDate(newValue);
                          dayjs.extend(relativeTime);

                          var newDate = dayjs(formatBdate).fromNow(true);

                          let firstWord = newDate.split(" ")[0];
                          var age = parseFloat(firstWord);
                          setAge(age);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="age"
                      label="Age"
                      margin="normal"
                      type="number"
                      disabled
                      value={age}
                      onChange={(e) => {
                        setAge(e.target.value);
                      }}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      id="contact"
                      label="Contact no."
                      margin="normal"
                      value={contact}
                      onChange={(e) => {
                        setContact(e.target.value);
                      }}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div sx={{ color: "#a4a4a4" }}>{"Gender:"}</div>
                    <Radio
                      checked={gender === "Male"}
                      onChange={handleChangeGender}
                      value="Male"
                      name="radio-buttons"
                    />
                    <Radio
                      checked={gender === "Female"}
                      onChange={handleChangeGender}
                      value="Female"
                      name="radio-buttons"
                      sx={{
                        color: "pink",
                        "&.Mui-checked": {
                          color: "pink",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  id="address"
                  label="Address"
                  margin="normal"
                  fullWidth
                  multiline
                  rows={2}
                  value={address}
                  sx={{ marginBottom: "1rem" }}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
                <Divider />
                <Typography sx={{ marginTop: "1rem" }} variant="h6">
                  Medical information
                </Typography>
                <TextField
                  id="medical_conditions"
                  label="Medical conditions"
                  margin="normal"
                  fullWidth
                  multiline
                  rows={2}
                  value={medicalConditions}
                  onChange={(e) => {
                    setMedicalConditions(e.target.value);
                  }}
                />
                <TextField
                  id="allergies"
                  label="Allergies"
                  margin="normal"
                  fullWidth
                  multiline
                  value={allergies}
                  rows={2}
                  onChange={(e) => {
                    setAllergies(e.target.value);
                  }}
                />
                <TextField
                  id="current_medications"
                  label="Current medications"
                  margin="normal"
                  fullWidth
                  multiline
                  rows={2}
                  value={currentMedication}
                  onChange={(e) => {
                    setCurrentMedication(e.target.value);
                  }}
                />
                <TextField
                  id="doctor_name"
                  label="Doctor's name"
                  margin="normal"
                  value={familyDoctor}
                  onChange={(e) => {
                    setFamilyDoctor(e.target.value);
                  }}
                  required
                  fullWidth
                />
                <TextField
                  sx={{ marginBottom: "1rem" }}
                  id="doctor_contact"
                  label="Contact no."
                  margin="normal"
                  value={doctorContact}
                  onChange={(e) => {
                    setDoctorContact(e.target.value);
                  }}
                  required
                  fullWidth
                />
                <Divider />
                <Typography sx={{ marginTop: "1rem" }} variant="h6">
                  In case of emergency
                </Typography>
                <TextField
                  id="parent_name"
                  label="Parent's name"
                  margin="normal"
                  value={parentName}
                  onChange={(e) => {
                    setParentName(e.target.value);
                  }}
                  required
                  fullWidth
                />
                <TextField
                  id="parent_contact"
                  label="Contact no."
                  margin="normal"
                  value={parentContact}
                  onChange={(e) => {
                    setParentContact(e.target.value);
                  }}
                  required
                  fullWidth
                />
                <TextField
                  id="parent_address"
                  label="Address"
                  margin="normal"
                  fullWidth
                  multiline
                  rows={2}
                  value={parentAddress}
                  sx={{ marginBottom: "1rem" }}
                  onChange={(e) => {
                    setParentAddress(e.target.value);
                  }}
                />
                <Divider />
                <Typography sx={{ marginTop: "1rem" }} variant="h6">
                  Membership
                </Typography>
                <TextField
                  id="standard-select-membership"
                  select
                  fullWidth
                  margin="normal"
                  label="Membership"
                  value={membershipType}
                  sx={{ marginBottom: "1rem" }}
                  onChange={(e) => {
                    setMembershipType(e.target.value);
                  }}
                  helperText="Please select membership"
                >
                  {membership.map((option) => (
                    <MenuItem key={option.name} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start date"
                        format="YYYY-MM-DD"
                        sx={{ width: "100%" }}
                        value={dayjs(updateStartDate)}
                        onChange={(newValue) => {
                          setUpdateStartDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="End date *"
                        format="YYYY-MM-DD"
                        sx={{ width: "100%" }}
                        value={dayjs(updateEndDate)}
                        onChange={(newValue) => {
                          setUpdateEndDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleCloseUpdateModal()}
              >
                CANCEL
              </Button>
              <LoadingButton
                variant="contained"
                onClick={updateUser}
                loading={isBtnLoading}
              >
                <span>UPDATE</span>
              </LoadingButton>
            </DialogActions>
          </Dialog>

          {/* MEAL PLANNING */}
          <Dialog
            fullScreen={modalWidth}
            open={openModalMealPlanning}
            aria-labelledby="responsive-dialog-title"
          >
            {hasMealPlan ? (
              <form onSubmit={updateMealPlan}>
                <DialogTitle id="responsive-dialog-title">
                  UPDATE MEAL PLANNING FOR: <b>{mealPlanUser}</b>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Fill up all fields, type <strong>n/a</strong> if not
                    applicable.
                  </DialogContentText>
                  <Divider />
                  <TextField
                    id="standard-select-diet"
                    select
                    fullWidth
                    margin="normal"
                    label="Diet type"
                    name="diet_type"
                    defaultValue={"Body recomposition"}
                    value={typeDiet || ""}
                    sx={{ marginBottom: "1rem" }}
                    onChange={(e) => {
                      setTypeDiet(e.target.value);
                    }}
                    helperText="Please select diet type"
                  >
                    {dietType.map((option) => (
                      <MenuItem key={option.name} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    name="total_calories"
                    label="Total calories"
                    margin="normal"
                    fullWidth
                    value={totalCalories}
                    onChange={(e) => {
                      setTotalCalories(e.target.value);
                    }}
                  />

                  <Divider />
                  <Typography variant="h6">SUNDAY</Typography>

                  <div>
                    <TextField
                      name="sunday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={sundayBreakfast}
                      onChange={(e) => {
                        setSundayBreakfast(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="sunday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={sundayLunch}
                      onChange={(e) => {
                        setSundayLunch(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="sunday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      value={sundayDinner}
                      sx={{ marginBottom: "1rem" }}
                      onChange={(e) => {
                        setSundayDinner(e.target.value);
                      }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">MONDAY</Typography>
                  <div>
                    <TextField
                      name="monday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      value={mondayBreakfast}
                      sx={{ marginBottom: "1rem" }}
                      onChange={(e) => {
                        setMondayBreakfast(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="monday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      value={mondayLunch}
                      sx={{ marginBottom: "1rem" }}
                      onChange={(e) => {
                        setMondayLunch(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="monday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      value={mondayDinner}
                      sx={{ marginBottom: "1rem" }}
                      onChange={(e) => {
                        setMondayDinner(e.target.value);
                      }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">TUESDAY</Typography>
                  <div>
                    <TextField
                      name="tuesday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={tuesdayBreakfast}
                      onChange={(e) => {
                        setTuesdayBreakfast(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="tuesday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={tuesdayLunch}
                      onChange={(e) => {
                        setTuesdayLunch(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="tuesday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={tuesdayDinner}
                      onChange={(e) => {
                        setTuesdayDinner(e.target.value);
                      }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">WEDNESDAY</Typography>
                  <div>
                    <TextField
                      name="wednesday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={wednesdayBreakfast}
                      onChange={(e) => {
                        setWednesdayBreakfast(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="wednesday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={wednesdayLunch}
                      onChange={(e) => {
                        setWednesdayLunch(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="wednesday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={wednesdayDinner}
                      onChange={(e) => {
                        setWednesdayDinner(e.target.value);
                      }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">THURSDAY</Typography>
                  <div>
                    <TextField
                      name="thursday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={thursdayBreakfast}
                      onChange={(e) => {
                        setThursdayBreakfast(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="thursday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={thursdayLunch}
                      onChange={(e) => {
                        setThursdayLunch(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="thursday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={thursdayDinner}
                      onChange={(e) => {
                        setThursdayDinner(e.target.value);
                      }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">FRIDAY</Typography>
                  <div>
                    <TextField
                      name="friday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={fridayBreakfast}
                      onChange={(e) => {
                        setFridayBreakfast(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="friday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={fridayLunch}
                      onChange={(e) => {
                        setFridayLunch(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="friday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={fridayDinner}
                      onChange={(e) => {
                        setFridayDinner(e.target.value);
                      }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">SATURDAY</Typography>
                  <div>
                    <TextField
                      name="saturday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={saturdayBreakfast}
                      onChange={(e) => {
                        setSaturdayBreakfast(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="saturday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={saturdayLunch}
                      onChange={(e) => {
                        setSaturdayLunch(e.target.value);
                      }}
                      required
                    />
                    <TextField
                      name="saturday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      value={saturdayDinner}
                      onChange={(e) => {
                        setSaturdayDinner(e.target.value);
                      }}
                      required
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCloseModalMealPlanning()}
                  >
                    CANCEL
                  </Button>
                  <LoadingButton
                    variant="contained"
                    loading={isBtnLoading}
                    type="submit"
                  >
                    <span>UPDATE</span>
                  </LoadingButton>
                </DialogActions>
              </form>
            ) : (
              <form onSubmit={createMealPlan}>
                <DialogTitle id="responsive-dialog-title">
                  CREATE MEAL PLANNING FOR: <b>{mealPlanUser}</b>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Fill up all fields, type <strong>n/a</strong> if not
                    applicable.
                  </DialogContentText>
                  <Divider />
                  <TextField
                    id="standard-select-diet"
                    select
                    fullWidth
                    name="diet_type"
                    margin="normal"
                    value={typeDiet}
                    label="Diet type"
                    sx={{ marginBottom: "1rem" }}
                    onChange={(e) => {
                      setTypeDiet(e.target.value);
                    }}
                    defaultValue={"Bulking" || ""}
                    helperText="Please select diet type"
                  >
                    {dietType.map((option) => (
                      <MenuItem key={option.name} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    name="total_calories"
                    label="Total calories"
                    margin="normal"
                    fullWidth
                    onChange={(e) => {
                      setTotalCalories(e.target.value);
                    }}
                  />
                  <Divider />
                  <Typography variant="h6">SUNDAY</Typography>
                  <div>
                    <TextField
                      name="sunday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="sunday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="sunday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">MONDAY</Typography>
                  <div>
                    <TextField
                      name="monday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="monday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="monday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">TUESDAY</Typography>
                  <div>
                    <TextField
                      name="tuesday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="tuesday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="tuesday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">WEDNESDAY</Typography>
                  <div>
                    <TextField
                      name="wednesday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="wednesday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="wednesday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">THURSDAY</Typography>
                  <div>
                    <TextField
                      name="thursday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="thursday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="thursday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">FRIDAY</Typography>
                  <div>
                    <TextField
                      name="friday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="friday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="friday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                  </div>

                  <Divider />
                  <Typography variant="h6">SATURDAY</Typography>
                  <div>
                    <TextField
                      name="saturday_breakfast"
                      label="Breakfast"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="saturday_lunch"
                      label="Lunch"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                    <TextField
                      name="saturday_dinner"
                      label="Dinner"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ marginBottom: "1rem" }}
                      required
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCloseModalMealPlanning()}
                  >
                    CANCEL
                  </Button>
                  <LoadingButton
                    variant="contained"
                    loading={isBtnLoading}
                    type="submit"
                  >
                    <span>CREATE</span>
                  </LoadingButton>
                </DialogActions>
              </form>
            )}
          </Dialog>

          {/* UPDATE PASSWORD */}

          <Dialog
            fullScreen={modalWidth}
            open={openModalUpdatePassword}
            aria-labelledby="responsive-dialog-title"
          >
            <form onSubmit={updatePassword}>
              <DialogTitle id="responsive-dialog-title">
                UPDATE PASSWORD
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Update password for: <strong>{selectedUser}</strong>
                </DialogContentText>
                <Divider />
                <Typography>Old password: {selectedUserPassword}</Typography>
                <div>
                  <TextField
                    name="newPassword"
                    label="Type new password here"
                    margin="dense"
                    fullWidth
                    sx={{ marginBottom: "1rem" }}
                    onChange={(e) => {
                      e.preventDefault();
                      if (e.target.value.length <= 5) {
                        setPasswordButton(true);
                      } else {
                        setPasswordButton(false);
                      }
                    }}
                    required
                  />
                  <span>Password must be at least 6 or more characters</span>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setOpenModalUpdatePassword(false);
                  }}
                >
                  CANCEL
                </Button>
                <LoadingButton
                  variant="contained"
                  disabled={passwordButton}
                  loading={isBtnLoading}
                  type="submit"
                >
                  <span>UPDATE</span>
                </LoadingButton>
              </DialogActions>
            </form>
          </Dialog>

          <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={3}>
            <TableContainer sx={{ maxHeight: 700 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>USERNAME</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ROLE</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>NAME</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ACTIVE</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>
                {tableHasNoData ? (
                  <TableBody>
                    {filteredList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user) => {
                        return (
                          <StyledTableRow
                            hover
                            // role="checkbox"
                            tabIndex={-1}
                            key={user.id}
                          >
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>
                              <Switch
                                onChange={(e) => {
                                  changeUserStatus(
                                    e.target.checked,
                                    user.username
                                  );
                                }}
                                defaultChecked={user.isActive ? true : false}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={() =>
                                  handleClickOpenModalUpdate(user.username)
                                }
                                variant="text"
                                color="success"
                                sx={{ marginRight: ".5rem" }}
                              >
                                Update
                              </Button>
                              {user.role === "admin" ? (
                                <Button
                                  variant="text"
                                  disabled
                                  color="warning"
                                  onClick={() =>
                                    handleOpenModalMealPlanning(user.username)
                                  }
                                >
                                  Meal plan
                                </Button>
                              ) : (
                                <Button
                                  variant="text"
                                  color="warning"
                                  onClick={() =>
                                    handleOpenModalMealPlanning(user.username)
                                  }
                                >
                                  Meal plan
                                </Button>
                              )}
                              <Button
                                variant="text"
                                color="success"
                                sx={{ marginRight: ".5rem" }}
                                onClick={() =>
                                  handleOpenModalUpdatePassword(
                                    user.username,
                                    user.password
                                  )
                                }
                              >
                                Update Password
                              </Button>
                            </TableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                ) : (
                  <TableBody>
                    <StyledTableRow>
                      <TableCell align="center" colSpan={5}>
                        {"No data available"}
                      </TableCell>
                    </StyledTableRow>
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
              <Table stickyHeader aria-label="sticky table" id="usersTable">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>USERNAME</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ROLE</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>NAME</TableCell>
                  </TableRow>
                </TableHead>
                {tableHasNoData ? (
                  <TableBody>
                    {filteredList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user) => {
                        return (
                          <StyledTableRow
                            hover
                            // role="checkbox"
                            tabIndex={-1}
                            key={user.id}
                          >
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.name}</TableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                ) : (
                  <TableBody>
                    <StyledTableRow>
                      <TableCell align="center" colSpan={3}>
                        {"No data available"}
                      </TableCell>
                    </StyledTableRow>
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

export default User;
