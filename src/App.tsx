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
import {EventAttendeesLayout} from "./pages/attendee/layout/EventAttendeesLayout.tsx";
import {Dashboard} from "./pages/attendee/Dashboard.tsx";
import {Tickets} from "./pages/attendee/Tickets.tsx";
import {Profile} from "./pages/attendee/Profile.tsx";
import {EventDetails} from "./pages/attendee/EventDetails.tsx";
import {Checkout} from "./pages/attendee/Checkout.tsx";
import {TicketDetails} from "./pages/attendee/TicketDetails.tsx";
import {AttendeeEvents} from "./pages/attendee/AttendeeEvents.tsx";

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

  //Event Attendees Routes
  {
    path: "/attendee",
    Component: EventAttendeeRoute,
    children: [
      {
        path: "",
        Component: EventAttendeesLayout,
        children: [
          { index: true, Component: Dashboard},
          { path: "My-tickets", Component: Tickets},
          { path: "profile", Component: Profile},
          { path: 'events', Component: AttendeeEvents},
          { path: 'events/:eventId', Component: EventDetails},
          { path: 'checkout', Component: Checkout},
          { path: 'tickets/:ticketId', Component: TicketDetails}
        ]
      }
    ]

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
