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
import {AdminEventAttendees} from "./pages/admin/AdminEventAttendees.tsx";
import {AdminPromotions} from "./pages/admin/AdminPromotions.tsx";
import {AdminScheduleCommunication} from "./pages/admin/AdminScheduleCommunication.tsx";
import {AdminPayouts} from "./pages/admin/AdminPayouts.tsx";
import {EventDetails} from "./pages/eventAttendees/EventDetails.tsx";
import {Checkout} from "./pages/eventAttendees/Checkout.tsx";
import {TicketDetails} from "./pages/eventAttendees/TicketDetails.tsx";
import {CheckInStaffLayout} from "./pages/CheckInStaff/layout/CheckInStaffLayout.tsx";
import {CheckInStaffDashboard} from "./pages/CheckInStaff/CheckInStaffDashboard.tsx";
import {CheckInStaffScan} from "./pages/CheckInStaff/CheckInStaffScan.tsx";
import {CheckInStaffProfile} from "./pages/CheckInStaff/CheckInStaffProfile.tsx";
import {CheckInStaffHelp} from "./pages/CheckInStaff/CheckInStaffHelp.tsx";
import {PlatformAdminLayout} from "./pages/plaformAdmin/layout/PlatformAdminLayout.tsx";
import UserManagement from "./pages/plaformAdmin/userStaffManagement/UserManagement.tsx";
import UserRoleManagement from "./pages/plaformAdmin/userStaffManagement/UserRoleManagement.tsx";
import CheckInStaffAssignment from "./pages/plaformAdmin/userStaffManagement/CheckInStaffAssignment.tsx";
import {Organizers} from "./pages/plaformAdmin/organizerManagement/Organizers.tsx";
import OrganizerVerificationRequests from "./pages/plaformAdmin/organizerManagement/OrganizerVerificationRequests.tsx";
import EventsManagement from "./pages/plaformAdmin/eventManagement/EventsManagement.tsx";
import CategoryManagement from "./pages/plaformAdmin/eventManagement/CategoryManagement.tsx";
import VenueManagement from "./pages/plaformAdmin/eventManagement/VenueManagement.tsx";
import PayoutRequests from "./pages/plaformAdmin/financials/PayoutRequests.tsx";
import PayoutHistory from "./pages/plaformAdmin/financials/PayoutHistory.tsx";
import PlatformFees from "./pages/plaformAdmin/financials/PlatformFees.tsx";
import RefundManagement from "./pages/plaformAdmin/financials/RefundManagement.tsx";
import {CommunicationTemplates} from "./pages/plaformAdmin/communication/CommunicationTemplates.tsx";
import {CommunicationLogs} from "./pages/plaformAdmin/communication/CommunicationLogs.tsx";
import {MassCommunication} from "./pages/plaformAdmin/communication/MassCommunication.tsx";
import {PromotionsDiscounts} from "./pages/plaformAdmin/marketing/PromotionsDiscounts.tsx";
import GeneralSettings from "./pages/plaformAdmin/system/GeneralSettings.tsx";
import PaymentGatewaySettings from "./pages/plaformAdmin/system/PaymentGatewaySettings.tsx";
import SmsConfiguration from "./pages/plaformAdmin/system/SmsConfiguration.tsx";
import AuditLog from "./pages/plaformAdmin/system/AuditLog.tsx";
import PlatformAdminProfile from "./pages/plaformAdmin/PlatformAdminProfile.tsx";
import {AttendeeEvents} from "./pages/eventAttendees/Events.tsx";
import {PlatformDashboard} from "./pages/plaformAdmin/dashboard/Dashboard.tsx";
import { EmailVerificationWrapper} from "./pages/general/EmailVerification.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "./redux/store.ts";

export const AdminRoute = () => {
    // const user = useSelector((state: RootState) => state.user.user);

    const user = {
        role: 'organizer'
    }
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

export const SuperAdminRoute = () => {
    const user = useSelector((state: RootState) => state.user.user);

    // const user = {
    //     role: 'platformAdmin'
    // }
    if (!user) {
        return <Navigate to="/auth" />;
    }

    if(user.role !== 'platformAdmin') {
        return <Navigate to="/auth" />;
    }

    return <Outlet />;
}
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
        Component: EmailVerificationWrapper
    },
    //Admin Routes
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
                    { path:"attendees", Component: AdminEventAttendees},
                    { path: "create-event", Component: AdminCreateEvent},
                    { path: "Event-Promotions", Component: AdminPromotions},
                    { path: "ScheduleCommunication", Component: AdminScheduleCommunication},
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
    {
        path: "/staff",
        Component: CheckInStaffRoute,
        children: [
            {
                path: "",
                Component: CheckInStaffLayout,
                children: [
                    { index: true, Component: CheckInStaffDashboard },
                    { path: "checkin/:eventId", Component: CheckInStaffScan},
                    { path: "profile", Component: CheckInStaffProfile},
                    { path: "help", Component: CheckInStaffHelp},
                ]
            }
        ]
    },

    // Platform Admin
    {
        path: "/platformAdmin",
        Component: SuperAdminRoute,
        children: [
            {
                path: "",
                Component: PlatformAdminLayout,
                children: [
                    { index: true, Component: PlatformDashboard},
                    { path: "userManagement", Component: UserManagement},
                    { path: "userRoleManagement", Component: UserRoleManagement},
                    { path: "checkInStaff", Component: CheckInStaffAssignment},
                    { path: "organizers", Component: Organizers},
                    { path: "organizers/verificationRequests", Component: OrganizerVerificationRequests},
                    { path: "events", Component: EventsManagement},
                    { path: "events/category", Component: CategoryManagement},
                    { path: "events/venue", Component: VenueManagement},
                    { path: "payout", Component: PayoutRequests},
                    { path: "payoutHistory", Component: PayoutHistory},
                    { path: "platformFees", Component: PlatformFees},
                    { path: "refundManagement", Component: RefundManagement},
                    { path: "communicationTemplate", Component: CommunicationTemplates},
                    { path: "communicationLogs", Component: CommunicationLogs},
                    { path: "massCommunication", Component: MassCommunication},
                    { path: "promotions", Component: PromotionsDiscounts},
                    { path: "settings", Component: GeneralSettings},
                    { path: "paymentGateway", Component: PaymentGatewaySettings},
                    { path: "smsGateway", Component: SmsConfiguration},
                    { path: "auditLog", Component: AuditLog},
                    { path: "profile", Component: PlatformAdminProfile}
                ]
            }
        ]
    }
])

function App() {
  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterProvider router={router} />
      </LocalizationProvider>
  )
}

export default App;

