import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App";
import DashboardLayout from "./layouts/dashboard";
import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";
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
import Coupons from "./components/Dashboard/Coupons/Coupons";
// import Profile from "./components/Profile/Profile";
import Subscription from "./components/Dashboard/Subscription/Subscription";
import Consultations from "./components/Dashboard/Consultations/Consultations";
import NewCoupon from "./components/Dashboard/Coupons/AddCoupons";
import NewSubscription from "./components/Dashboard/Subscription/AddSubscription";
import ConsultationView from "./components/Dashboard/Consultations/ViewConsultations";
import Analytics from "./components/Dashboard/Analytics/Analytics";

// Notification Components
import SendNotification from "./components/Dashboard/Notifications/SendNotification";
import NotificationsLog from "./components/Dashboard/Notifications/NotificationsLog";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <Login />,
          },
          // {
          //   path: "register",
          //   element: <Register />
          // }
        ],
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
            ],
          },
          {
            path: "astrologers",
            children: [
              { index: true, element: <Astrologers /> },
              { path: "new", element: <NewAstroUser mode="new" /> },
              { path: "edit/:userId", element: <NewAstroUser mode="edit" /> },
              { path: "view/:userId", element: <AstroUserView mode="view" /> },
            ],
          },
          {
            path: "services",
            children: [
              { index: true, element: <Services /> },
              { path: "new", element: <NewService mode="new" /> },
              { path: "edit/:userId", element: <NewService mode="edit" /> },
            ],
          },
          {
            path: "faqs",
            children: [
              { index: true, element: <FAQs /> },
              { path: "new", element: <NewFAQ mode="new" /> },
              { path: "edit/:userId", element: <NewFAQ mode="edit" /> },
            ],
          },
          {
            path: "coupons",
            children: [
              { index: true, element: <Coupons /> },
              { path: "new", element: <NewCoupon mode="new" /> },
              { path: "edit/:userId", element: <NewCoupon mode="edit" /> },
            ],
          },
          {
            path: "subscription",
            children: [
              { index: true, element: <Subscription /> },
              { path: "new", element: <NewSubscription mode="new" /> },
              {
                path: "edit/:userId",
                element: <NewSubscription mode="edit" />,
              },
            ],
          },
          {
            path: "consultations",
            children: [
              { index: true, element: <Consultations /> },
              {
                path: "view/:consultationId",
                element: <ConsultationView mode="view" />,
              },
            ],
          },
          {
            path: "analytics",
            element: <Analytics />,
          },
          // {
          //   path: "profile",
          //   element: <Profile />,
          // },
          {
            path: "notifications",
            children: [
              {
                path: "send",
                element: <SendNotification />,
              },
              {
                path: "log",
                element: <NotificationsLog />,
              },
              // Redirect to send notifications as default
              {
                index: true,
                element: <Navigate to="send" replace />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },
]);
