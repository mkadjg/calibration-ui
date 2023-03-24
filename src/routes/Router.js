import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout.js"));
/****End Layouts*****/

/*****Pages******/
const Dashboard1 = lazy(() => import("../views/dashboards/Dashboard1"));
const Login = lazy(() => import("../views/login/Login"));
const Equipment = lazy(() => import("../views/equipment/Equipement"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="login" /> },
      { path: "/equipment", element: <Equipment /> },
      { path: "dashboards/dashboard1", exact: true, element: <Dashboard1 /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default ThemeRoutes;
