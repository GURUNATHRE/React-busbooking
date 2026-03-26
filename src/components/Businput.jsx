import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Container, Typography, Grid,
    Card, Chip, IconButton, Link, Divider, Stack, Autocomplete, TextField, Button,
    Snackbar, Alert // Added these for the popup
} from "@mui/material";

import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import Navbar from "./Navbar";
import "../css/Businput.css";


function Businput({ onLoginClick }) {
    const navigate = useNavigate();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [searchTrigger, setSearchTrigger] = useState(false);
    const [cities, setCities] = useState([]);

    // Notification State
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); // New state

    const token = localStorage.getItem("access");
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    function handleSearch() {
        // 1. Check if fields are empty first
        if (!from || !to || !date) {
            setAlertMessage("Please fill all fields before searching");
            setOpenAlert(true);
            return;
        }

        // 2. Check if logged in
        if (!token) {
            setAlertMessage("Login required to search buses!");
            setOpenAlert(true);
            return;
        }

        // 3. If everything is fine, trigger search
        setSearchTrigger(true);
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenAlert(false);
    };


    useEffect(() => {
        fetch("https://countriesnow.space/api/v0.1/countries")
            .then(res => res.json())
            .then(data => {
                const india = data.data.find((country) => country.country === "India");
                if (india) setCities(india.cities);
            });
    }, []);

    const fetchBuses = async () => {
        try {
            const response = await fetch(`${BASE_URL}buses/`, {
                headers: {
                    "Authorization": `Token ${token}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch buses");
            const buses = await response.json();
            const filteredBuses = buses.filter(
                (bus) =>
                    bus.starting_point.toLowerCase() === from.toLowerCase() &&
                    bus.ending_points.toLowerCase() === to.toLowerCase()
            );
            if (filteredBuses.length > 0) {
                navigate("/buses", { state: { filteredBuses } });
            } else {
                alert("No buses found for selected route");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (searchTrigger) {
            fetchBuses();
            setSearchTrigger(false);
        }
    }, [searchTrigger]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
            {/* POPUP NOTIFICATION */}
            <Snackbar
                open={openAlert}
                autoHideDuration={4000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%', fontWeight: 'bold' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Navbar onLoginClick={onLoginClick} />

            <div id="total" className="d-flex flex-column">
                <div className="total">
                    <Box sx={{ py: 8.5, textAlign: 'center' }}>
                        <Container>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1E293B', mb: 2 }}>
                                India's <Box component="span" sx={{ color: '#a36532' }}>No. 1</Box> Bus Ticket Site
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#64748B' }}>
                                Safe, Secure and Comfortable Journeys
                            </Typography>
                        </Container>
                    </Box>

                    <Container
                        maxWidth="lg"
                        sx={{
                            mt: -4,
                            mb: 8,
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <Card
                            sx={{
                                width: "100%",
                                maxWidth: "900px",
                                p: { xs: 2, md: 2 },
                                borderRadius: 4,
                                boxShadow: 3
                            }}
                        >
                            <Grid container spacing={2} alignItems="center" justifyContent="center">
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', ml: 1, mb: 1, display: 'block', }}>FROM</Typography>
                                    <Autocomplete
                                        options={cities}
                                        value={from}
                                        onChange={(e, val) => setFrom(val || "")}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Starting City"
                                                size="small"   // 👈 important
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "60px",
                                                        width: "12vw",      // 🔥 increase height
                                                        fontSize: "1rem",     // text size
                                                        borderRadius: "10px"
                                                    },
                                                    "& input": {
                                                        padding: "14px"       // inner spacing
                                                    }
                                                }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <LocationOnIcon sx={{ color: '#383837', mr: 1, fontSize: "22px" }} />
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3.5}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', ml: 1, mb: 1, display: 'block' }}>TO</Typography>
                                    <Autocomplete
                                        options={cities}
                                        value={to}
                                        onChange={(e, val) => setTo(val || "")}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="End City"
                                                size="small"   // 👈 important
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        height: "60px",
                                                        width: "12vw",      // 🔥 increase height
                                                        fontSize: "1rem",     // text size
                                                        borderRadius: "10px"
                                                    },
                                                    "& input": {
                                                        padding: "14px"       // inner spacing
                                                    }
                                                }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <LocationOnIcon sx={{ color: '#383837', mr: 1, fontSize: "22px" }} />
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', ml: 1, mb: 1, display: 'block' }}>JOURNEY DATE</Typography>
                                    <TextField sx={{ borderRadius: 30 }} type="date" fullWidth value={date} onChange={(e) => setDate(e.target.value)} />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Button
                                        onClick={handleSearch}
                                        variant="contained"
                                        fullWidth
                                        sx={{ height: '50px', bgcolor: "#a36532", mt: 3, fontWeight: 'bold', '&:hover': { bgcolor: "#8b5529" } }}
                                    >
                                        <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '8px' }}></i> SEARCH
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Container>

                    {/* Offers... */}
                    <Container sx={{ mb: 5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B' }}>Exclusive Offers</Typography>
                            <Chip label="Current Promotions" color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
                        </Stack>
                        <Grid container spacing={3}>
                            {[
                                { title: "SAVE UP TO ₹250", code: "FIRSTBUS", color: "#3B82F6", label: "First Time Users" },
                                { title: "CASHBACK ₹150", code: "VISACARD", color: "#10B981", label: "Wallet Offer" },
                                { title: "GROUP BOOKING", code: "FLAT10", color: "#F59E0B", label: "4+ Seats" },
                                { title: "INDIVIDUAL PROMO", code: "FLAT30", color: "#64748B", label: "New Routes" }
                            ].map((offer, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card sx={{ p: 3, bgcolor: offer.color, color: 'white', borderRadius: 4, height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{offer.title}</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9, my: 1 }}>Use code: <strong>{offer.code}</strong></Typography>
                                        <Chip size="small" label={offer.label} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </div>

                {/* Footer... */}
                <Box component="footer" sx={{ bgcolor: '#0F172A', color: '#94A3B8', pt: 3, pb: 4, mt: 'auto' }}>
                    <Container>
                        <Grid container spacing={10}>
                            <Grid item xs={12} md={3}>
                                <Typography variant="h5" color="white" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <DirectionsBusIcon sx={{ mr: 1, color: '#a36532' }} /> BusTicket
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                                    The world's leading bus ticket booking platform. <br />We provide the best prices and travel options.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="h6" color="white" sx={{ fontWeight: 700, mb: 3 }}>Quick Links</Typography>
                                <Stack spacing={1}>
                                    {['About Us', 'Terms & Conditions', 'Privacy Policy'].map(link => (
                                        <Link key={link} href="#" color="inherit" underline="none" sx={{ '&:hover': { color: 'white' } }}>{link}</Link>
                                    ))}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="h6" color="white" sx={{ fontWeight: 700, mb: 3 }}>Support</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>Email: support@busticket.com</Typography>
                                <Stack direction="row" spacing={1} mt={2}>
                                    {[FacebookIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
                                        <IconButton key={i} sx={{ color: '#94A3B8', border: '1px solid #334155' }}><Icon fontSize="small" /></IconButton>
                                    ))}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Typography variant="h6" color="white" sx={{ fontWeight: 700, mb: 3 }}>Popular Features</Typography>
                                <Typography variant="body2">Secure Authorize.net Payments</Typography>
                                <Typography variant="body2">Refundable Bookings</Typography>
                                <Typography variant="body2">Privacy Protected</Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: 2, borderColor: '#1E293B' }} />
                        <Typography variant="body2" align="center">© 2026 BusTicket India.</Typography>
                    </Container>
                </Box>
            </div>
        </Box>
    );
}

export default Businput;