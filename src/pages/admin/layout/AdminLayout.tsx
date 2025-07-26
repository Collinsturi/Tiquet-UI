import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    InputBase,
    Collapse,
    Menu,
    MenuItem,
    Badge,
    CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HowToRegIcon from '@mui/icons-material/HowToReg'; // New icon for CheckIn Staff
import EventNoteIcon from '@mui/icons-material/EventNote'; // New icon for My Events
import BarChartIcon from '@mui/icons-material/BarChart';
import PaymentsIcon from '@mui/icons-material/Payments'; // New icon for Payout
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // New icon for Profile
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Redux imports for data fetching
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";
import { useGetAdminDashboardSummaryQuery } from '../../../queries/admin/adminQuery.ts';


const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'var(--color-my-base-100)', // Use custom theme variable
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-my-base-content)', // Use custom theme variable
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'var(--color-my-base-content)', // Use custom theme variable
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
    },
}));

export const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme(); // Access the theme object
    const [mobileOpen, setMobileOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(true); // Initial state for desktop drawer
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // State for notification dropdown
    const [profileAnchorEl, setProfileAnchorEl] = useState(null); // State for profile dropdown

    // Fetch user and dashboard summary data
    const user = useSelector((state: RootState) => state.user.user);
    const { data: dashboardSummary, isLoading: isSummaryLoading, error: summaryError } = useGetAdminDashboardSummaryQuery(user?.email, {
        skip: !user?.email, // Skip query if user email is not available
    });

    // Extract recent activity, limiting to the most recent 5
    const recentActivities = dashboardSummary?.recentActivity?.slice(0, 5) || [];

    const handleMobileToggle = () => setMobileOpen(!mobileOpen);
    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

    const handleNotificationClick = (event) => setNotificationAnchorEl(event.currentTarget);
    const handleNotificationClose = () => setNotificationAnchorEl(null);

    const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);
    const handleProfileClose = () => setProfileAnchorEl(null);

    const handleLogout = () => {
        // Implement your logout logic here
        console.log('Logging out...');
        navigate('/auth'); // Example: navigate to login page
        handleProfileClose();
    };

    const sections = [
        { kind: 'header', title: 'Main Menu' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/organizer' },
        { text: 'CheckIn Staff', icon: <HowToRegIcon />, path: '/organizer/CheckIn-Staff' }, // Updated icon
        { text: 'My Events', icon: <EventNoteIcon />, path: '/organizer/My-Events' }, // Updated icon
        { kind: 'divider' },
        { kind: 'header', title: 'Analytics' },
        { text: 'Reports', icon: <BarChartIcon />, path: '/organizer/Reports' },
        { text: 'Payout', icon: <PaymentsIcon />, path: "/organizer/Payout"}, // Updated icon
        { text: 'Profile', icon: <AccountCircleIcon />, path: '/organizer/profile' }, // Updated icon
    ];

    const drawer = (
        <div>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--color-my-neutral)' }}> {/* Bolder color for Toolbar in drawer */}
                {drawerOpen && (
                    <img
                        src={"src/assets/tiquet-logo-no-background.png"}
                        alt={"Logo"}
                        className={`h-8 w-20 ml-3 filter brightness-200'}`}
                    />
                )}
                <IconButton onClick={handleDrawerToggle} sx={{ color: 'var(--color-my-neutral-content)' }}> {/* Text color for icons on bolder background */}
                    {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </Toolbar>

            <Divider sx={{ borderColor: 'var(--color-my-base-300)' }} />

            {/* Mobile-specific content: Search & Avatar */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', px: 2, mb: 2, backgroundColor: 'var(--color-my-neutral)' }}> {/* Bolder color for mobile drawer header */}
                <div className={"flex flex-row gap-3 pt-2"}>
                    <Avatar
                        alt="organizer"
                        src={user?.profilePicture ? user.profilePicture : "https://i.pravatar.cc/300"}
                        sx={{ border: '2px solid var(--color-my-primary)' }}
                    />
                    <Typography className={"pt-2"} sx={{ color: 'var(--color-my-neutral-content)' }}>{user.firstName}</Typography> {/* Text color on bolder background */}
                </div>
                <Search sx={{ mt: 2 }}>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                </Search>
            </Box>

            <List sx={{ backgroundColor: 'var(--color-my-neutral)' }}> {/* Bolder color for drawer list background */}
                {sections.map((item, index) => {
                    if (item.kind === 'header') {
                        return drawerOpen ? (
                            <Typography key={index} variant="caption" sx={{ px: 2, py: 1, fontWeight: 'bold', color: 'var(--color-my-neutral-content)' }}> {/* Text color on bolder background */}
                                {item.title}
                            </Typography>
                        ) : null;
                    }

                    if (item.kind === 'divider') {
                        return <Divider key={index} sx={{ my: 1, borderColor: 'var(--color-my-base-300)' }} />;
                    }

                    return (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: drawerOpen ? 'initial' : 'center',
                                    px: 2.5,
                                    backgroundColor: location.pathname === item.path ? 'var(--color-my-primary-focus)' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'var(--color-my-base-300)', // Adjusted hover for list items on darker background
                                    },
                                }}
                                onClick={() => navigate(item.path)}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: drawerOpen ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: location.pathname === item.path ? 'var(--color-my-primary-content)' : 'var(--color-my-neutral-content)', // Text color on bolder background
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <Collapse in={drawerOpen} orientation="horizontal">
                                    <ListItemText primary={item.text} sx={{ color: location.pathname === item.path ? 'var(--color-my-primary-content)' : 'var(--color-my-neutral-content)' }} /> {/* Text color on bolder background */}
                                </Collapse>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'var(--color-my-neutral)', color: 'var(--color-my-primary-content)' }}>
                <Toolbar>
                    {/* Hamburger button for mobile screens */}
                    <IconButton
                        color="inherit"
                        aria-label="open mobile drawer"
                        edge="start"
                        onClick={handleMobileToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>

                    {/* Hamburger button for large screens to collapse the permanent drawer */}
                    <IconButton
                        color="inherit"
                        aria-label="toggle desktop drawer"
                        edge="start"
                        onClick={handleDrawerToggle} // This now toggles drawerOpen state
                        sx={{mr: 2, display: {xs: 'none', sm: 'block'}}} // Only show on large screens
                    >
                        <MenuIcon/>
                    </IconButton>

                    <img
                        src={"src/assets/tiquet-logo-no-background.png"}
                        alt={"Logo"}
                        className={`h-8 w-20 ml-3 filter brightness-200'}`}
                    />

                    {/* Hide on small screens */}
                    <Box sx={{
                        display: {xs: 'none', sm: 'flex'},
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexGrow: 1
                    }}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase placeholder="Search…" inputProps={{'aria-label': 'search'}}/>
                        </Search>
                    </Box>

                    {/* Notification Dropdown */}
                    <IconButton
                        color="inherit"
                        onClick={handleNotificationClick}
                        aria-controls="notification-menu"
                        aria-haspopup="true"
                    >
                        {isSummaryLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <Badge badgeContent={recentActivities.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        )}
                    </IconButton>
                    <Menu
                        id="notification-menu"
                        anchorEl={notificationAnchorEl}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleNotificationClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        PaperProps={{
                            sx: {
                                backgroundColor: 'var(--color-my-base-100)',
                                color: 'var(--color-my-base-content)',
                            }
                        }}
                    >
                        <Typography variant="h6" sx={{ px: 2, py: 1, color: 'var(--color-my-primary)' }}>Notifications</Typography>
                        <Divider sx={{ borderColor: 'var(--color-my-base-300)' }} />
                        {isSummaryLoading ? (
                            <MenuItem disabled sx={{ color: 'var(--color-my-base-content)' }}>
                                <CircularProgress size={20} sx={{ mr: 2, color: 'var(--color-my-primary)' }} /> Loading notifications...
                            </MenuItem>
                        ) : summaryError ? (
                            <MenuItem disabled sx={{ color: 'var(--color-my-error)' }}>Error loading notifications.</MenuItem>
                        ) : recentActivities.length > 0 ? (
                            recentActivities.map((activity, index) => (
                                <MenuItem key={index} onClick={handleNotificationClose} sx={{ color: 'var(--color-my-base-content)' }}>
                                    <Typography variant="body2">
                                        User {activity.user} purchased {activity.ticketType} ticket for "{activity.eventTitle}" ({new Date(activity.createdAt).toLocaleString()})
                                    </Typography>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem onClick={handleNotificationClose} sx={{ color: 'var(--color-my-base-content)' }}>No new notifications</MenuItem>
                        )}
                    </Menu>

                    {/* Profile Dropdown */}
                    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                        <IconButton
                            onClick={handleProfileClick}
                            aria-controls="profile-menu"
                            aria-haspopup="true"
                        >
                            <Avatar
                                alt="AdminUser"
                                src={user?.profilePicture ? user.profilePicture : "https://i.pravatar.cc/300"}
                                sx={{ border: '2px solid var(--color-my-primary-content)' }}
                            />
                        </IconButton>
                        <Menu
                            id="profile-menu"
                            anchorEl={profileAnchorEl}
                            open={Boolean(profileAnchorEl)}
                            onClose={handleProfileClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            PaperProps={{
                                sx: {
                                    backgroundColor: 'var(--color-my-base-100)',
                                    color: 'var(--color-my-base-content)',
                                }
                            }}
                        >
                            <MenuItem onClick={handleLogout} sx={{ color: 'var(--color-my-base-content)' }}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerOpen ? drawerWidth : 60 }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleMobileToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'var(--color-my-neutral)' }, // Bolder color for mobile drawer background
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    open={drawerOpen}
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerOpen ? drawerWidth : 60,
                            transition: 'width 0.3s',
                            overflowX: 'hidden',
                            backgroundColor: 'var(--color-my-neutral)' // Bolder color for desktop drawer background
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'var(--color-my-base-200)' }}>
                <Toolbar /> {/* This Toolbar is crucial for pushing content below the AppBar */}
                <Outlet />
            </Box>
        </Box>
    );
};
