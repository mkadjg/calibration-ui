import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout.js"));
/****End Layouts*****/

/*****Pages******/
const Dashboard1 = lazy(() => import("../views/dashboards/Dashboard1"));
const Login = lazy(() => import("../views/login/Login"));
const Equipment = lazy(() => import("../views/equipment/Equipement"));
const CustomerCalibration = lazy(() => import("../views/calibration/CustomerCalibration"));
const AdminCalibration = lazy(() => import("../views/calibration/AdminCalibration"));
const TechnicianCalibration = lazy(() => import("../views/calibration/TechnicianCalibration"));
const TypewriterCalibration = lazy(() => import("../views/calibration/TypewriterCalibration"));
const CustomerComplain = lazy(() => import("../views/complain/CustomerComplain"));
const AdminComplain = lazy(() => import("../views/complain/AdminComplain"));
const TechnicianComplain = lazy(() => import("../views/complain/TechnicianComplain"));
const TypewriterComplain = lazy(() => import("../views/complain/TypewriterComplain"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="login" /> },
      { path: "/equipment", element: <Equipment /> },
      { path: "/customer/calibration", element: <CustomerCalibration /> },
      { path: "/admin/calibration", element: <AdminCalibration /> },
      { path: "/technician/calibration", element: <TechnicianCalibration /> },
      { path: "/typewriter/calibration", element: <TypewriterCalibration /> },
      { path: "/customer/complain", element: <CustomerComplain /> },
      { path: "/admin/complain", element: <AdminComplain /> },
      { path: "/technician/complain", element: <TechnicianComplain /> },
      { path: "/typewriter/complain", element: <TypewriterComplain /> },
      { path: "dashboards/dashboard1", exact: true, element: <Dashboard1 /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default ThemeRoutes;
