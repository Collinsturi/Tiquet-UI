import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
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

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
  )
}

export default App
