import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/dashboard";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Users from "./components/Dashboard/Users";
import Astrologers from "./components/Dashboard/Astrologers";
import _ from "lodash";

const AppRoutes: React.FC = () => {
  const getCookie = (val:string) => {
    console.log(val)
  };

  return useRoutes([
    // {
    //   path: "",
    //   element:!_.isEmpty(getCookie('token'))? (
    //     <Navigate to="users" />
    //   ) : (
    //     <Navigate to="auth/login" />
    //   ),
    // },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "astrologers",
          element: <Astrologers />,
        },
      ],
    },
  ]);
};

export default AppRoutes;