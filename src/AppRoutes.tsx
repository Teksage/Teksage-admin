import React from "react";
import { useRoutes } from "react-router-dom";
import DashboardLayout from "./layouts/dashboard";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Users from "./components/Dashboard/Users/Users";
import Astrologers from "./components/Dashboard/Astrologers";
import Services from "./components/Dashboard/Services";
import Faqs from "./components/Dashboard/Faqs";
import Analytics from "./components/Dashboard/Analytics";
import Coupons from "./components/Dashboard/Plans/Coupons";
import _ from "lodash";

const AppRoutes: React.FC = () => {
  // const getCookie = (val:string) => {
  //   console.log(val)
  // };

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
        {
          path: "services",
          element: <Services />,
        },
        {
          path: "faqs",
          element: <Faqs />,
        },
        {
          path: "analytics",
          element: <Analytics />,
        },
        {
          path: "plans/coupons",
          element: <Coupons />,
        },
      ],
    },
  ]);
};

export default AppRoutes;