import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
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
    Badge // Import Badge for notification count
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger icon
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Import NotificationsIcon

const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f1f1f1',
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
    color: 'black',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'black',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
    },
}));

export const EventAttendeesLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(true); // Initial state for desktop drawer
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // State for notification dropdown
    const [profileAnchorEl, setProfileAnchorEl] = useState(null); // State for profile dropdown

    const handleMobileToggle = () => setMobileOpen(!mobileOpen);

    // This function will now be responsible for toggling the desktop drawer
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

    // Dummy notifications for demonstration
    const notifications = [
        'New event "Tech Summit" created.',
        'Your report for May is ready.',
        'User John Doe checked in for "Marketing Meetup".',
    ];

    const sections = [
        { kind: 'header', title: 'Main Menu' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/attendee' },
        { text: 'My tickets', icon: <ShoppingCartIcon />, path: '/attendee/My-tickets' },
        { text: 'Events', icon: <LayersIcon />, path: '/attendee/events'},
        { text: 'Profile', icon: <LayersIcon />, path: '/attendee/profile' },
    ];

    const drawer = (
        <div>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {drawerOpen && (
                    <img
                        src={"/src/assets/tiquet-logo-no-background.png"}
                        alt={"Logo"}
                        className={`h-8 w-20 ml-3 filter brightness-200'}`} // Example: make logo brighter when not scrolled, normal when scrolled
                    />
                )}
                {/* The chevron button for closing/opening the drawer, only visible when drawer is open on large screens */}
                {/* On large screens, the hamburger in AppBar will handle the initial toggle */}
                {/* We can keep this for fine-tuning the close if needed, but it's redundant if AppBar handles all toggling */}
                {/* For consistency, we might remove this and solely rely on the AppBar hamburger for desktop too */}
                {/* For now, let's keep it but note its redundancy if AppBar's hamburger controls everything */}
                <IconButton onClick={handleDrawerToggle}>
                    {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </Toolbar>

            <Divider />

            {/* Mobile-specific content: Search & Avatar */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', px: 2, mb: 2 }}>
                <div className={"flex flex-row gap-3"}>
                    <Avatar alt="AdminUser" src="https://i.pravatar.cc/300" />
                    <Typography className={"pt-2"}>AdminUser Name</Typography>
                </div>
                <Search >
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                </Search>
            </Box>

            <List>
                {sections.map((item, index) => {
                    if (item.kind === 'header') {
                        return drawerOpen ? (
                            <Typography key={index} variant="caption" sx={{ px: 2, py: 1, fontWeight: 'bold', color: 'gray' }}>
                                {item.title}
                            </Typography>
                        ) : null;
                    }

                    if (item.kind === 'divider') {
                        return <Divider key={index} sx={{ my: 1 }} />;
                    }

                    return (
                        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: drawerOpen ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => navigate(item.path)}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: drawerOpen ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <Collapse in={drawerOpen} orientation="horizontal">
                                    <ListItemText primary={item.text} />
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
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1,  backgroundColor: 'var(--color-my-primary)',}}>
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
                        className={`h-8 w-20 ml-3 filter brightness-200'}`} // Example: make logo brighter when not scrolled, normal when scrolled
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
                        <Badge badgeContent={notifications.length} color="error">
                            <NotificationsIcon />
                        </Badge>
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
                    >
                        <Typography variant="h6" sx={{ px: 2, py: 1 }}>Notifications</Typography>
                        <Divider />
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <MenuItem key={index} onClick={handleNotificationClose}>
                                    <Typography variant="body2">{notification}</Typography>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem onClick={handleNotificationClose}>No new notifications</MenuItem>
                        )}
                    </Menu>

                    {/* Profile Dropdown */}
                    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                        <IconButton
                            onClick={handleProfileClick}
                            aria-controls="profile-menu"
                            aria-haspopup="true"
                        >
                            <Avatar alt="AdminUser" src="https://i.pravatar.cc/300"/>
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
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
                            backgroundColor: 'var(--color-my-primary)'
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1 }}>
                <Toolbar /> {/* This Toolbar is crucial for pushing content below the AppBar */}
                <Outlet />
            </Box>
        </Box>
    );
};