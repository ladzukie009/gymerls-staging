import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useEffect, useState } from "react";
import "./App.css";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/user/UserDashboard";
import ErrorPage from "./pages/ErrorPage";
import ListOfUser from "./pages/ListOfUser";
import ListOfProduct from "./pages/ListOfProduct";
import Orders from "./pages/OrderLanding";
import Reservation from "./pages/ReservationLanding";
import Announcement from "./pages/AnnouncementLanding";
import UserLog from "./pages/UserLogsLanding";
import Database from "./pages/DatabaseLanding";
import ChangePass from "./pages/ChangePassLanding";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminListOfUser from "./pages/admin/ListOfUser";
import AdminListOfProduct from "./pages/admin/ListOfProduct";
import AdminOrders from "./pages/admin/OrderLanding";
import AdminReservation from "./pages/admin/ReservationLanding";
import AdminAnnouncement from "./pages/admin/AnnouncementLanding";
import AdminUserLog from "./pages/admin/UserLogsLanding";
import AdminDatabase from "./pages/admin/DatabaseLanding";
import AdminChangePass from "./pages/admin/ChangePassLanding";

import MealLanding from "./pages/user/MealLanding";
import CartLanding from "./pages/user/CartLanding";
import OrderLanding from "./pages/user/OrderLanding";
import SettingsLanding from "./pages/user/SettingsLanding";
import ScheduleLanding from "./pages/user/ScheduleLanding";
import Store from "./pages/Store";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/store" element={<Store />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/list-of-user" element={<ListOfUser />} />
        <Route path="/list-of-product" element={<ListOfProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/user-logs" element={<UserLog />} />
        <Route path="/database" element={<Database />} />
        <Route path="/change-password" element={<ChangePass />} />

        {/* admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/list-of-user" element={<AdminListOfUser />} />
        <Route path="/admin/list-of-product" element={<AdminListOfProduct />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/reservation" element={<AdminReservation />} />

        <Route path="/admin/announcement" element={<AdminAnnouncement />} />
        <Route path="/admin/user-logs" element={<AdminUserLog />} />
        <Route path="/admin/database" element={<AdminDatabase />} />
        <Route path="/admin/change-password" element={<AdminChangePass />} />

        {/* user routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/meal-plan" element={<MealLanding />} />
        <Route path="/user/cart" element={<CartLanding />} />
        <Route path="/user/order" element={<OrderLanding />} />
        <Route path="/user/settings" element={<SettingsLanding />} />
        <Route path="/user/schedules" element={<ScheduleLanding />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
