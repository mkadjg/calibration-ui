import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout.js"));
/****End Layouts*****/

/*****Pages******/
const Dashboard1 = lazy(() => import("../views/dashboards/Dashboard1"));
const Login = lazy(() => import("../views/login/Login"));
const Equipment = lazy(() => import("../views/equipment/Equipement"));
const Employee = lazy(() => import("../views/employee/Employee"));
const CustomerCalibration = lazy(() => import("../views/calibration/CustomerCalibration"));
const AdminCalibration = lazy(() => import("../views/calibration/AdminCalibration"));
const TechnicianCalibration = lazy(() => import("../views/calibration/TechnicianCalibration"));
const TypewriterCalibration = lazy(() => import("../views/calibration/TypewriterCalibration"));
const CustomerComplain = lazy(() => import("../views/complain/CustomerComplain"));
const QualityComplain = lazy(() => import("../views/complain/QualityComplain.js"));
const TechnicianComplain = lazy(() => import("../views/complain/TechnicianComplain"));
const TypewriterComplain = lazy(() => import("../views/complain/TypewriterComplain"));
const Register = lazy(() => import("../views/register/Register"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "",
    element: <Navigate to="login" /> 
  },
  {
    path: "/main",
    element: <FullLayout />,
    children: [
      { path: "/main/equipment", element: <Equipment /> },
      { path: "/main/employee", element: <Employee /> },
      { path: "/main/customer/calibration", element: <CustomerCalibration /> },
      { path: "/main/admin/calibration", element: <AdminCalibration /> },
      { path: "/main/technician/calibration", element: <TechnicianCalibration /> },
      { path: "/main/typewriter/calibration", element: <TypewriterCalibration /> },
      { path: "/main/customer/complain", element: <CustomerComplain /> },
      { path: "/main/quality/complain", element: <QualityComplain /> },
      { path: "/main/technician/complain", element: <TechnicianComplain /> },
      { path: "/main/typewriter/complain", element: <TypewriterComplain /> },
      { path: "/main/dashboards/dashboard1", exact: true, element: <Dashboard1 /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];

export default ThemeRoutes;
