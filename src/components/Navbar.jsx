import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
    AppBar, Box, Toolbar, IconButton, Typography, Menu,
    Container, Avatar, Button, Tooltip, MenuItem, Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LockIcon from '@mui/icons-material/Lock'; // Added for visual cue

const pages = [
    { name: 'Home', path: '/' },
    { name: 'Buses', path: '/buses' },
    { name: 'My Bookings', path: '/mybookings' },
];

function Navbar({ onLoginClick }) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const usertoken = localStorage.getItem("access");

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleLogout = () => {
        localStorage.removeItem("access");
        handleCloseUserMenu();
        navigate('/');
        window.location.reload();
    };

    // Helper to determine if a link should be disabled
    const isPageDisabled = (path) => !usertoken && path !== '/';

    const getButtonStyle = (path) => {
        const isActive = location.pathname === path;
        const isDisabled = isPageDisabled(path);

        return {
            my: 2,
            color: 'white',
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: isActive ? 700 : 400,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            // Visual feedback for disabled/active states
            opacity: (isActive || isDisabled) ? 0.5 : 1,
            pointerEvents: (isActive || isDisabled) ? 'none' : 'auto',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            '&:hover': {
                backgroundColor: isDisabled ? 'transparent' : 'rgba(255,255,255,0.1)',
            }
        };
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#7c99b6e0', boxShadow: 'none' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Desktop Logo */}
                    <DirectionsBusIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 4,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 800,
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        BusTicket
                    </Typography>

                    {/* Mobile Menu Icon */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton onClick={handleOpenNavMenu} color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorElNav}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ mt: '5px' }}
                        >
                            {pages.map((page) => {
                                const disabled = isPageDisabled(page.path);
                                return (
                                    <MenuItem
                                        key={page.name}
                                        disabled={disabled}
                                        onClick={() => {
                                            navigate(page.path);
                                            handleCloseNavMenu();
                                        }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography>{page.name}</Typography>
                                            {disabled && <LockIcon sx={{ fontSize: '14px', color: 'text.disabled' }} />}
                                        </Stack>
                                    </MenuItem>
                                );
                            })}
                        </Menu>
                    </Box>

                    {/* Mobile Logo */}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                            fontWeight: 700,
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        BusTicket
                    </Typography>

                    {/* Desktop Navigation Links */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {pages.map((page) => {
                            const disabled = isPageDisabled(page.path);
                            return (
                                <Button
                                    key={page.name}
                                    sx={getButtonStyle(page.path)}
                                    onClick={() => navigate(page.path)}
                                >
                                    {page.name}
                                    {disabled && <LockIcon sx={{ fontSize: '16px' }} />}
                                </Button>
                            );
                        })}
                    </Box>

                    {/* User Profile / Login Section */}
                    <Box sx={{ flexGrow: 0 }}>
                        {usertoken ? (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar sx={{ bgcolor: '#4e4c49', width: 35, height: 35 }}>
                                            <i className="fa-regular fa-user" style={{ fontSize: '14px' }}></i>
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={() => { navigate('/profile'); handleCloseUserMenu(); }}>
                                        <Typography textAlign="center">Profile</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center" color="error">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={onLoginClick}
                                sx={{
                                    backgroundColor: '#4e4c49',
                                    borderRadius: '20px',
                                    px: 3,
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#333' }
                                }}
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;