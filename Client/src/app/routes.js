import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Subjects from "./pages/Subjects";
import Pomodoro from "./pages/Pomodoro";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from './pages/Login';
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
    },
    {
    path: "/Signup",
    Component: Signup,
    },
    {
      path:"/ForgotPassword",
      Component: ForgotPassword,
    },
    {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "tasks", Component: Tasks },
      { path: "calendar", Component: Calendar },
      { path: "subjects", Component: Subjects },
      { path: "pomodoro", Component: Pomodoro },
      { path: "analytics", Component: Analytics },
      { path: "profile", Component: Profile },
      { path: "settings", Component: Settings },
    ],
  },
]);
