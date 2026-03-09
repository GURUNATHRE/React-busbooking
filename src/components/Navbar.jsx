import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { useNavigate } from "react-router-dom";
function Navbar() {
    const usertoken = localStorage.getItem("access")
    const navigate = useNavigate()
    // Debugging line to check received props
    function handlelogout() {
        if (usertoken) {
            localStorage.removeItem("access")
        }
    }
    function handlelogin(){
        navigate('/')
    }
    return (
        <nav className="navbar navbar-expand-lg  sticky-top shadow-sm navcss">
            <div className="container">
                <a className="navbar-brand" href="/businput">
                    <i className="fa-solid fa-bus-simple me-2"></i>BusTicket
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/businput">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/buses">Buses</a>
                        </li>
                         <li className="nav-item">
                            <a className="nav-link" href="/mybookings">MyBookings</a>
                        </li>
                        {usertoken ? <li className="nav-item ms-lg-3">
                            <Link to="/"className="btn btn-outline-danger"onClick={handlelogout} style={{color:"white"}}>
                                <i className="fa-regular fa-circle-user me-1"style={{color:"white"}}></i>
                                Logout
                            </Link>
                        </li> :
                            <li className="nav-item ms-lg-3" style={{backgroundColor:"#cab5b5"}}>
                            <Link to="/"className="btn btn-outline-danger"onClick={handlelogin}>
                                <i className="fa-regular fa-circle-user me-1"></i>
                                Login
                            </Link>
                        </li>}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Navbar
// import * as React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import Container from '@mui/material/Container';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
// import MenuItem from '@mui/material/MenuItem';
// import AdbIcon from '@mui/icons-material/Adb';
// import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
// import { useNavigate } from 'react-router-dom';



// const settings = ['Profile', 'Dashboard', 'Logout'];

// function Navbar(props) {
//     const [anchorElNav, setAnchorElNav] = React.useState(null);
//     const [anchorElUser, setAnchorElUser] = React.useState(null);
//     const navigate = useNavigate()
//     console.log(props)

//     const handleOpenNavMenu = (event) => {
//         setAnchorElNav(event.currentTarget);
//     };
//     const handleOpenUserMenu = (event) => {
//         setAnchorElUser(event.currentTarget);
//     };

//     const handleCloseNavMenu = () => {
//         navigate(`/mybookings`);
//     };

//     const handleCloseUserMenu = () => {
//         setAnchorElUser(null);
//         localStorage.removeItem("access")
//         navigate(`/`);
//     };

//     return (
//         <AppBar position="static" sx={{
//             backgroundColor: "#6D4C41"
//         }}>
//             <Container maxWidth="xl">
//                 <Toolbar >
//                     {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
//                     <DirectionsBusIcon />
//                     <Typography
//                         variant="h6"
//                         noWrap
//                         component="a"
//                         href="/"
//                         sx={{
//                             mr: 2,
//                             display: { xs: 'none', md: 'flex' },
//                             fontFamily: 'monospace',
//                             fontWeight: 700,
//                             letterSpacing: '.3rem',
//                             color: 'inherit',
//                             textDecoration: 'none',
//                         }}
//                     >
//                         Booking
//                     </Typography>


//                     <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
//                         <IconButton
//                             size="large"
//                             aria-label="account of current user"
//                             aria-controls="menu-appbar"
//                             aria-haspopup="true"
//                             onClick={handleOpenNavMenu}
//                             color="inherit"
//                         >
//                             <MenuIcon />
//                         </IconButton>
//                         <Menu
//                             id="menu-appbar"
//                             anchorEl={anchorElNav}
//                             anchorOrigin={{
//                                 vertical: 'bottom',
//                                 horizontal: 'left',
//                             }}
//                             keepMounted
//                             transformOrigin={{
//                                 vertical: 'top',
//                                 horizontal: 'left',
//                             }}
//                             open={Boolean(anchorElNav)}
//                             sx={{ display: { xs: 'block', md: 'none' } }}
//                         >
//                             <MenuItem onClick={handleCloseNavMenu}>
//                                 <Typography sx={{ textAlign: 'center' }}>buses</Typography>
//                             </MenuItem>
//                         </Menu>
//                     </Box>
//                     <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
//                     <Typography
//                         variant="h5"
//                         noWrap
//                         component="a"
//                         href="#app-bar-with-responsive-menu"
//                         sx={{
//                             mr: 2,
//                             display: { xs: 'flex', md: 'none' },
//                             flexGrow: 1,
//                             fontFamily: 'monospace',
//                             fontWeight: 700,
//                             letterSpacing: '.3rem',
//                             color: 'inherit',
//                             textDecoration: 'none',
//                         }}
//                     >
//                         <DirectionsBusIcon /> LOGO
//                     </Typography>
//                     <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
//                         <Button
//                             onClick={handleCloseNavMenu}
//                             sx={{ my: 2, color: 'white', display: 'block' }}
//                         >
//                             mybookings
//                         </Button>
//                     </Box>
//                     <Box sx={{ flexGrow: 0 }}>
//                         <Tooltip title="Open settings">
//                             <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                                 <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
//                             </IconButton>
//                         </Tooltip>
//                         <Menu
//                             sx={{ mt: '45px' }}
//                             id="menu-appbar"
//                             anchorEl={anchorElUser}
//                             anchorOrigin={{
//                                 vertical: 'top',
//                                 horizontal: 'right',
//                             }}
//                             keepMounted
//                             transformOrigin={{
//                                 vertical: 'top',
//                                 horizontal: 'right',
//                             }}
//                             open={Boolean(anchorElUser)}
//                             onClose={handleCloseUserMenu}
//                         >
//                             {settings.map((setting) => (
//                                 <MenuItem key={setting} onClick={handleCloseUserMenu}>
//                                     <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
//                                 </MenuItem>
//                             ))}
//                         </Menu>
//                     </Box>
//                 </Toolbar>
//             </Container>
//         </AppBar>
//     );
// }
// export default Navbar;
