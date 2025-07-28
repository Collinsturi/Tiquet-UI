import "./App.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Index} from "./pages/general/Index.tsx";
import {Events} from "./pages/general/Events.tsx";
import {EventDetail} from "./pages/general/EventDetail.tsx";
import {HowItWorks} from "./pages/general/HowItWorks.tsx";
import {Contact} from "./pages/general/Contact.tsx";
import {About} from "./pages/general/About.tsx";
import {Legal} from "./pages/general/Legal.tsx";
import Auth from "./pages/general/Auth.tsx";
import {Navigate, Outlet} from "react-router-dom";
import {EventAttendeesLayout} from "./pages/eventAttendees/layout/EventAttendeesLayout.tsx";
import {Dashboard} from "./pages/eventAttendees/Dashboard.tsx";
import {Tickets} from "./pages/eventAttendees/Tickets.tsx";
import {Profile} from "./pages/eventAttendees/Profile.tsx";
import {AdminLayout} from "./pages/admin/layout/AdminLayout.tsx";
import {AdminEvents} from "./pages/admin/AdminEvents.tsx";
import {AdminCheckInStaff} from "./pages/admin/AdminCheckInStaff.tsx";
import {AdminReports} from "./pages/admin/AdminReports.tsx";
import {AdminProfile} from "./pages/admin/AdminProfile.tsx";
import {AdminDashboard} from "./pages/admin/AdminDashboard.tsx";
import {AdminEventDetails} from "./pages/admin/AdminEventDetails.tsx";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {AdminCreateEvent} from "./pages/admin/AdminCreateEvent.tsx";
import {AdminPayouts} from "./pages/admin/AdminPayouts.tsx";
import {EventDetails} from "./pages/eventAttendees/EventDetails.tsx";
import {Checkout} from "./pages/eventAttendees/Checkout.tsx";
import {TicketDetails} from "./pages/eventAttendees/TicketDetails.tsx";
// import {CheckInStaffLayout} from "./pages/CheckInStaff/layout/CheckInStaffLayout.tsx";
// import {CheckInStaffDashboard} from "./pages/CheckInStaff/CheckInStaffDashboard.tsx";
// import {CheckInStaffScan} from "./pages/CheckInStaff/CheckInStaffScan.tsx";
// import {CheckInStaffProfile} from "./pages/CheckInStaff/CheckInStaffProfile.tsx";
// import {CheckInStaffHelp} from "./pages/CheckInStaff/CheckInStaffHelp.tsx";
import {AttendeeEvents} from "./pages/eventAttendees/Events.tsx";
import {EmailVerification} from "./pages/general/EmailVerification.tsx"
import {useSelector} from "react-redux";
import type {RootState} from "./redux/store.ts";

export const AdminRoute = () => {
    const user = useSelector((state: RootState) => state.user.user);

    // const user = {
    //     role: 'organizer'
    // }
    if (!user) {
        return <Navigate to="/auth" />;
    }

    if (user.role !== 'organizer') {
        return <Navigate to="/auth" />;
    }

    return <Outlet />;
};

export const EventAttendeeRoute = () => {
    const user = useSelector((state: RootState) => state.user.user);

    // const user = {
    //     role: 'event_attendee'
    // }

    if (!user) {
        return <Navigate to="/auth" />;
    }

    if (user.role !== 'event_attendee') {
        return <Navigate to="/auth" />;
    }

    return <Outlet />;
};

export const CheckInStaffRoute = () => {
    const user = useSelector((state: RootState) => state.user.user);

    // const user = {
    //     role: 'check_in_staff'
    // }

    if (!user) {
        return <Navigate to="/auth" />;
    }

    if (user.role !== 'check_in_staff') {
        return <Navigate to="/auth" />;
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
        path: "/auth",
        Component: Auth
    },
    {
        path: "/verify-email",
        Component: EmailVerification
    },
    //organizer Routes
    {
        path: "/organizer",
        Component: AdminRoute,
        children: [
            {
                path: "",
                Component: AdminLayout,
                children: [
                    { index: true, Component: AdminDashboard },
                    { path: "CheckIn-Staff", Component: AdminCheckInStaff},
                    { path: "My-Events", Component: AdminEvents},
                    { path: "Reports", Component: AdminReports },
                    { path: "profile", Component: AdminProfile},
                    { path: "My-events/:eventId", Component: AdminEventDetails},
                    { path: "create-event", Component: AdminCreateEvent},
                    { path: "Payout", Component: AdminPayouts}
                ]
            }
        ]
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

    //Check in staff route
    // {
    //     path: "/staff",
    //     Component: CheckInStaffRoute,
    //     children: [
    //         {
    //             path: "",
    //             Component: CheckInStaffLayout,
    //             children: [
    //                 { index: true, Component: CheckInStaffDashboard },
    //                 { path: "checkin/:eventId", Component: CheckInStaffScan},
    //                 { path: "profile", Component: CheckInStaffProfile},
    //                 { path: "help", Component: CheckInStaffHelp},
    //             ]
    //         }
    //     ]
    // },
])

function App() {
  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterProvider router={router} />
      </LocalizationProvider>
  )
}

export default App;

