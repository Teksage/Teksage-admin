// import React from "react";
// import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
// import DashboardLayout from "./layouts/dashboard";
// import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";
// import Users from "./components/Dashboard/Users/Users";
// import NewUser from "./components/Dashboard/Users/NewUser";
// import UserView from "./components/Dashboard/Users/ViewUser";
// import Astrologers from "./components/Dashboard/Astrologers";
// import Services from "./components/Dashboard/Services";
// import Faqs from "./components/Dashboard/Faqs";
// import Analytics from "./components/Dashboard/Analytics";
// import Coupons from "./components/Dashboard/Plans/Coupons";

// // Auth guard component
// const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   // const token = localStorage.getItem('token');
  
//   // if (!token) {
//   //   return <Navigate to="/auth/login" replace />;
//   // }

//   return <>{children}</>;
// };

// // Auth redirect component for login/register pages
// const RequireUnauth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   // const token = localStorage.getItem('token');
  
//   // if (token) {
//   //   return <Navigate to="/dashboard/users" replace />;
//   // }

//   return <>{children}</>;
// };

// // Root redirect based on auth status
// const RootRedirect: React.FC = () => {
//   // const token = localStorage.getItem('token');
  
//   // if (token) {
//   //   return <Navigate to="/dashboard/users" replace />;
//   // }
//   return <Navigate to="/auth/login" replace />;
// };

// // Router configuration
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootRedirect />,
//     index: true,
//   },
//   {
//     path: "/auth",
//     children: [
//       {
//         path: "login",
//         element: (
//           <RequireUnauth>
//             <Login />
//           </RequireUnauth>
//         ),
//       },
//       {
//         path: "register",
//         element: (
//           <RequireUnauth>
//             <Register />
//           </RequireUnauth>
//         ),
//       },
//     ],
//   },
//   {
//     path: "/dashboard",
//     element: (
//       <RequireAuth>
//         <DashboardLayout />
//       </RequireAuth>
//     ),
//     children: [
//       {
//         path: "users",
//         children: [
//           { index: true, element: <Users /> },
//           { path: "new", element: <NewUser mode="new" /> },
//           { path: ":userId/edit", element: <NewUser mode="edit" /> },
//           { path: ":userId", element: <UserView mode="view" /> },
//         ],
//       },
//       {
//         path: "astrologers",
//         element: <Astrologers />,
//       },
//       {
//         path: "services",
//         element: <Services />,
//       },
//       {
//         path: "faqs",
//         element: <Faqs />,
//       },
//       {
//         path: "analytics",
//         element: <Analytics />,
//       },
//       {
//         path: "plans/coupons",
//         element: <Coupons />,
//       },
//     ],
//   },
//   {
//     path: "*",
//     element: <Navigate to="/auth/login" replace />,
//   },
// ]);

// // App Routes component
// const AppRoutes: React.FC = () => {
//   return <RouterProvider router={router} />;
// };

// export default AppRoutes;

import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { useSelector } from 'react-redux';
import App from "./App";
import DashboardLayout from "./layouts/dashboard";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Users from "./components/Dashboard/Users/Users";
import NewUser from "./components/Dashboard/Users/NewUser";
import UserView from "./components/Dashboard/Users/ViewUser";
import Astrologers from "./components/Dashboard/Astrologers/Astrologers";
import NewAstroUser from "./components/Dashboard/Astrologers/NewAstroUser";
import AstroUserView from "./components/Dashboard/Astrologers/ViewAstroUser";
import Services from "./components/Dashboard/Services/Services";
import NewService from "./components/Dashboard/Services/AddService";
import FAQs from "./components/Dashboard/FAQS/FAQs";
import NewFAQ from "./components/Dashboard/FAQS/AddFaqs";
import Analytics from "./components/Dashboard/Analytics";
import Coupons from "./components/Dashboard/Plans/Coupons";
import Profile from "./components/Profile/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // {
      //   index: true,
      //   element: <Navigate to="/auth/login" replace />
      // },
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <Login />
          },
          // {
          //   path: "register",
          //   element: <Register />
          // }
        ]
      },
      // {
      //   path: "profile",
      //   element: <Profile />,
      // },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "users",
            children: [
              { index: true, element: <Users /> },
              { path: "new", element: <NewUser mode="new" /> },
              { path: "edit/:userId", element: <NewUser mode="edit" /> },
              { path: "view/:userId", element: <UserView mode="view" /> },
            ]
          },
          {
            path: "astrologers",
            children: [
              { index: true, element: <Astrologers /> },
              { path: "new", element: <NewAstroUser mode="new" /> },
              { path: "edit/:userId", element: <NewAstroUser mode="edit" /> },
              { path: "view/:userId", element: <AstroUserView mode="view" /> },
            ]
          },
          {
            path: "services",
            children: [
              { index: true, element: <Services /> },
              { path: "new", element: <NewService mode="new" /> },
              { path: "edit/:userId", element: <NewService mode="edit" /> },
            ]
          },
          {
            path: "faqs",
            children: [
              { index: true, element: <FAQs /> },
              { path: "new", element: <NewFAQ mode="new" /> },
              { path: "edit/:userId", element: <NewFAQ mode="edit" /> },
            ]
          },
          {
            path: "analytics",
            element: <Analytics />,
          },
          {
            path: "plans",
            element: <Coupons />,
          },
          {
            path: "coupons",
            element: <Coupons />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ]
      },
      {
        path: "*",
        element: <Navigate to="/auth/login" replace />,
      },
    ]
  }
]);