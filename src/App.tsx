import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  export const AdminRoute = () => {
    const user = useSelector((state: RootState) => state.user.user);

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user.role !== 'admin') {
      return <Navigate to="/login" />;
    }

    return <Outlet />;
  };

  export const attendeeRoute = () => {
    const user = useSelector((state: RootState) => state.user.user);

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user.role !== 'user') {
      return <Navigate to="/login" />;
    }

    return <Outlet />;
  };

  export const checkInStaffRoute = () => {
    const user = useSelector((state: RootState) => state.user.user);

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user.role !== 'user') {
      return <Navigate to="/login" />;
    }

    return <Outlet />;
  }
  return (
    <>

    </>
  )
}

export default App
