import React from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const pages = [
    { name: 'Home', path: '/businput' },
    { name: 'Buses', path: '/buses' },
    { name: 'My Bookings', path: '/mybookings' },
];

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    
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
    };

    // Style logic for navigation buttons
    const getButtonStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            my: 2,
            color: 'white',
            display: 'block',
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: isActive ? 700 : 400,
            opacity: isActive ? 0.5 : 1, 
            pointerEvents: isActive ? 'none' : 'auto', 
            transition: 'opacity 0.3s ease',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
        };
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#6D4C41', boxShadow: 2 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Desktop Logo */}
                    <DirectionsBusIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white' }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/businput"
                        sx={{
                            mr: 4,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 800,
                            letterSpacing: '.1rem',
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        BusTicket
                    </Typography>

                    {/* Mobile Menu Icon */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorElNav}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem 
                                    key={page.name} 
                                    onClick={() => { navigate(page.path); handleCloseNavMenu(); }}
                                    disabled={location.pathname === page.path}
                                >
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Mobile Logo */}
                    <DirectionsBusIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/businput"
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BusTicket
                    </Typography>

                    {/* Desktop Navigation Links */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => navigate(page.path)}
                                sx={getButtonStyle(page.path)}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/* User Section */}
                    <Box sx={{ flexGrow: 0 }}>
                        {usertoken ? (
                            <>
                                <Tooltip title="User Settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar sx={{ bgcolor: '#8D6E63' }}><i class="fa-regular fa-user"></i></Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    anchorEl={anchorElUser}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={() => { navigate('/profile'); handleCloseUserMenu(); }}>Profile</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button 
                                variant="contained" 
                                onClick={() => navigate('/')}
                                sx={{ 
                                    backgroundColor: '#8D6E63', 
                                    color: 'white',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#5D4037' }
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