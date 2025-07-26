import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles'; // Import useTheme
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
    Menu, // Import Menu for dropdowns
    MenuItem, // Import MenuItem for dropdown items
    Badge, // Import Badge for notification count
    CircularProgress // Import CircularProgress for loading indicator
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger icon
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; // Icon for My tickets
import EventIcon from '@mui/icons-material/Event'; // Icon for Events
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icon for Profile
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store.ts";
import { useGetUserNotificationsQuery } from '../../../queries/general/AuthQuery.ts'; // Assuming this is the correct path for notification query

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

export const EventAttendeesLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme(); // Access the theme object
    const [mobileOpen, setMobileOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(true); // Initial state for desktop drawer
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // State for notification dropdown
    const [profileAnchorEl, setProfileAnchorEl] = useState(null); // State for profile dropdown
    const user = useSelector((state: RootState) => state.user.user);

    // Fetch user notifications
    const {
        data: notificationsData,
        isLoading: isNotificationsLoading,
        isError: isNotificationsError,
        error: notificationsError,
        refetch: refetchNotifications // Allows manual refetching
    } = useGetUserNotificationsQuery(user?.email, {
        skip: !user?.email, // Skip query if user email is not available
    });

    const notifications = notificationsData || [];

    const handleMobileToggle = () => setMobileOpen(!mobileOpen);

    // This function will now be responsible for toggling the desktop drawer
    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
        refetchNotifications(); // Refetch notifications when the dropdown is opened
    };
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
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/attendee' },
        { text: 'My tickets', icon: <ConfirmationNumberIcon />, path: '/attendee/My-tickets' }, // Updated icon
        { text: 'Events', icon: <EventIcon />, path: '/attendee/events'}, // Updated icon
        { text: 'Profile', icon: <AccountCircleIcon />, path: '/attendee/profile' }, // Updated icon
    ];

    const drawer = (
        <div>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--color-my-neutral)' }}> {/* Bolder color for Toolbar in drawer */}
                {drawerOpen && (
                    <img
                        src={"/src/assets/tiquet-logo-no-background.png"}
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
                    <Avatar alt="AdminUser"
                            src={user?.profilePicture ? user.profilePicture : "https://i.pravatar.cc/300"}
                            sx={{ border: '2px solid var(--color-my-primary)' }} />
                    <Typography className={"pt-2"} sx={{ color: 'var(--color-my-neutral-content)' }}>{user?.firstName || 'User'}</Typography> {/* Text color on bolder background */}
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
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1,  backgroundColor: 'var(--color-my-primary)', color: 'var(--color-my-primary-content)' }}>
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
                        src={"/src/assets/tiquet-logo-no-background.png"}
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
                                <SearchIcon/>
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
                        {isNotificationsLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <Badge badgeContent={notifications.length} color="error">
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
                        {isNotificationsLoading ? (
                            <MenuItem disabled sx={{ color: 'var(--color-my-base-content)' }}>
                                <CircularProgress size={20} sx={{ mr: 2, color: 'var(--color-my-primary)' }} /> Loading notifications...
                            </MenuItem>
                        ) : isNotificationsError ? (
                            <MenuItem disabled sx={{ color: 'var(--color-my-error)' }}>Error loading notifications.</MenuItem>
                        ) : notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <MenuItem key={index} onClick={handleNotificationClose} sx={{ color: 'var(--color-my-base-content)' }}>
                                    <Typography variant="body2">{notification}</Typography> {/* Assuming notification object has a 'message' property */}
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
