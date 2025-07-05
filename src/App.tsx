import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Index} from "../src/pages/general/Index.tsx"
import {Events} from "../src/pages/general/Events.tsx";
import {EventDetail} from "../src/pages/general/EventDetail.tsx";
import {HowItWorks} from "../src/pages/general/HowItWorks.tsx";
import {Contact} from "../src/pages/general/Contact.tsx";
import {About} from "../src/pages/general/About.tsx";
import {Legal} from "../src/pages/general/Legal.tsx";
import Auth from "../src/pages/general/Auth.tsx";
import {Navigate, Outlet} from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const AdminRoute = () => {
  // const user = useSelector((state: RootState) => state.user.user);

  const user = {
    role: 'admin'
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export const EventAttendeeRoute = () => {
  // const user = useSelector((state: RootState) => state.user.user);

  const user = {
    role: 'user'
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'user') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export const CheckInStaffRoute = () => {
  // const user = useSelector((state: RootState) => state.user.user);

  const user = {
    role: 'staff'
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'staff') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: Index
  },
  {
    path: "/how-it-works",
    Component: HowItWorks
  },
  {
    path: "/about",
    Component: About
  },
  {
    path: "/contact",
    Component: Contact
  },
  {
    path: "/legal",
    Component: Legal

  },
  {
    path: "/events",
    Component: Events
  },
  {
    path: "/events/:id",
    Component: EventDetail
  },
  {
    path: "/login",
    Component: Auth
  },

])

function App() {
  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
  )
}

export default App
