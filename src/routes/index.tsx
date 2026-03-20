import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Loading from "../components/Loading";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const BookAppointment = lazy(() => import("../pages/BookAppointment"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Leads = lazy(() => import("../pages/Leads"));
const Pipeline = lazy(() => import("../pages/Pipeline"));
const LeadDetail = lazy(() => import("../pages/LeadDetail"));
const Appointments = lazy(() => import("../pages/Appointments"));
const Patients = lazy(() => import("../pages/Patients"));
const PatientDetail = lazy(() => import("../pages/PatientDetail"));
const Payments = lazy(() => import("../pages/Payments"));
const FollowUps = lazy(() => import("../pages/FollowUps"));
const Settings = lazy(() => import("../pages/Settings"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading />}><Home /></Suspense>,
      },
      {
        path: "book",
        element: <Suspense fallback={<Loading />}><BookAppointment /></Suspense>,
      },
      {
        path: "login",
        element: <Suspense fallback={<Loading />}><Login /></Suspense>,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>,
          },
          {
            path: "leads",
            element: <Suspense fallback={<Loading />}><Leads /></Suspense>,
          },
          {
            path: "pipeline",
            element: <Suspense fallback={<Loading />}><Pipeline /></Suspense>,
          },
          {
            path: "leads/:id",
            element: <Suspense fallback={<Loading />}><LeadDetail /></Suspense>,
          },
          {
            path: "appointments",
            element: <Suspense fallback={<Loading />}><Appointments /></Suspense>,
          },
          {
            path: "patients",
            element: <Suspense fallback={<Loading />}><Patients /></Suspense>,
          },
          {
            path: "patients/:id",
            element: <Suspense fallback={<Loading />}><PatientDetail /></Suspense>,
          },
          {
            path: "payments",
            element: <Suspense fallback={<Loading />}><Payments /></Suspense>,
          },
          {
            path: "follow-ups",
            element: <Suspense fallback={<Loading />}><FollowUps /></Suspense>,
          },
          {
            path: "settings",
            element: <Suspense fallback={<Loading />}><Settings /></Suspense>,
          },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
