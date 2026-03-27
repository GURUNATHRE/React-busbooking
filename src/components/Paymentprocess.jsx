import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import '../css/Paymentprocess.css';
import {
    Box, Grid, Card, CardContent, Typography, Button,
    TextField, MenuItem, IconButton, Container
} from "@mui/material";
import { BusAlert, LocalOffer, Timer } from "@mui/icons-material";
import { Divider, Chip, Stack } from "@mui/material";
import { Person, Badge, Transgender, Edit, CheckCircle } from "@mui/icons-material";
import { InputAdornment, Fade } from "@mui/material";

function Paymentprocess() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { selectedSeatIds, selectedSeatNos, Price, busId } = location.state || {};
    const token = localStorage.getItem("access");

    const [coupons, setCoupons] = useState([]);
    const [travelers, setTravelers] = useState([]);
    const [businfo, setbusinfo] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [couponInput, setCouponInput] = useState("");

    // ... (Keep your existing useEffects and handleInputChange here) ...
    useEffect(() => {
        const fetchbus = async () => {
            try {
                const response = await axios.get(`buses/${id}`, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setbusinfo(response.data);
            } catch (error) {
                console.error("Error fetching bus:", error);
            }
        };
        fetchbus();
    }, [id, token]);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get(`coupons/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setCoupons(response.data);
            } catch (error) {
                console.error("Error fetching coupons:", error);
            }
        };
        fetchCoupons();
    }, [token]);

    useEffect(() => {
        if (selectedSeatIds && selectedSeatIds.length > 0) {
            setTravelers(selectedSeatIds.map(() => ({ name: "", age: "", gender: "" })));
        }
    }, [selectedSeatIds]);

    const handleInputChange = (index, field, value) => {
        const updated = [...travelers];
        updated[index][field] = value;
        setTravelers(updated);
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert("Coupon copied: " + code);
    };

    const appliedCoupon = coupons.find((c) => c.Couponcode === couponInput);
    const finalPrice = Price - Number(appliedCoupon?.amount || 0) + 10;

    const handleProceedToPayment = () => {
        navigate(`/bus/${id}/journeydetails/payment/`, {
            state: { selectedSeatIds, selectedSeatNos, travelers, Price, finalPrice, busId }
        });
    };

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: "#f8efe8", minHeight: "100vh" }}>
                <Container maxWidth="lg" sx={{ py: 2, height: "100%" }}>
                    {/* Back Button */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start", // Change to "center" if you want the whole row centered
                            gap: 3,                       // Adds space between the button and text
                            mb: 4,                        // Bottom margin for the whole row
                            px: { xs: 2, md: 0 }          // Responsive padding
                        }}
                    >
                        {/* 🔙 Back Button */}
                        <button
                            onClick={() => navigate("/")}
                            className="btn shadow-sm d-flex align-items-center justify-content-center"
                            style={{
                                backgroundColor: '#e67e22',
                                color: "white",
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                border: "none",
                                transition: "0.3s",
                                marginLeft: "3%"
                            }}
                        >
                            <i className="fa fa-arrow-left"></i>
                        </button>

                        {/* 📝 Heading */}
                        <h2
                            className="fw-bold m-0"
                            style={{
                                color: "black",
                                letterSpacing: "-0.5px",
                                fontSize: "2rem",
                                lineHeight: 1 // Ensures the text aligns perfectly with the button height
                            }}
                        >
                            Check all the details
                        </h2>
                    </Box>

                    <Grid container
                        spacing={4}
                        justifyContent="center"
                        sx={{
                            height: "calc(100vh - 120px)" 
                        }}>
                        {/* LEFT SIDE: Summaries and Forms */}
                        <Grid item xs={12} md={7}>

                            {/* 1️⃣ Journey Summary Card */}
                            {businfo && (
                                <Card
                                    sx={{
                                        mb: 4,
                                        borderRadius: 4,
                                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                                        border: "1px solid #ebb96f",
                                        overflow: "hidden",
                                        background: "#fff",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.12)",
                                            borderColor: "#e67e22"
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        {/* Header: Label and Dynamic Status */}
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                            <Typography
                                                variant="overline"
                                                fontWeight="800"
                                                sx={{ letterSpacing: "1.5px", color: "#888", fontSize: "0.75rem" }}
                                            >
                                                Journey Summary
                                            </Typography>
                                            <Chip
                                                label="Instant Booking"
                                                size="small"
                                                icon={<LocalOffer style={{ fontSize: '14px', color: '#e67e22' }} />}
                                                sx={{ bgcolor: "#fff3e0", color: "#e67e22", fontWeight: "bold", border: "1px solid #ffe0b2" }}
                                            />
                                        </Stack>

                                        <Grid container spacing={4} alignItems="center">
                                            {/* Left Side: Bus Identity */}
                                            <Grid item xs={12} md={5}>
                                                <Typography
                                                    variant="h4"
                                                    fontWeight="800"
                                                    sx={{ color: "#e67e22", mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                                                >
                                                    {businfo.bus_name}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <BusAlert sx={{ fontSize: 18 }} /> {businfo.features}
                                                </Typography>
                                            </Grid>

                                            {/* Right Side: Timeline and Route */}
                                            <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                                <Typography variant="h4" fontWeight="800" color="#2c3e50">
                                                    {businfo.start_time} <span style={{ color: "#bdc3c7", fontWeight: 300 }}>—</span> {businfo.reach_time}
                                                </Typography>

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    justifyContent={{ xs: "flex-start", md: "flex-end" }}
                                                    alignItems="center"
                                                    mt={1}
                                                >
                                                    <Typography variant="h6" fontWeight="600" color="#34495e">
                                                        {businfo.starting_point}
                                                    </Typography>
                                                    <Typography sx={{ color: "#e67e22", fontWeight: "bold" }}>→</Typography>
                                                    <Typography variant="h6" fontWeight="600" color="#34495e">
                                                        {businfo.ending_points}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

                                        {/* Bottom Footer: More Details */}
                                        <Grid container justifyContent="space-between" alignItems="center">
                                            <Grid item>
                                                <Stack direction="row" spacing={3}>
                                                    <Box>
                                                        <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                                                            DURATION
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Timer sx={{ fontSize: 16, color: '#7f8c8d' }} /> {businfo.duration || "6h 30m"}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>

                                            <Grid item>
                                                <Typography variant="caption" display="block" color="text.secondary" textAlign="right">
                                                    PER PASSENGER
                                                </Typography>
                                                <Typography variant="h5" fontWeight="900" color="#27ae60">
                                                    ₹{businfo.price || "850"}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}

                            {/* 2️⃣ Traveler Card */}
                            <Card sx={{ borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", border: "1px solid #f0f0f0" }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                        <Typography variant="h6" fontWeight="800" sx={{ color: "#2c3e50" }}>
                                            Traveler Details
                                        </Typography>
                                        <Chip
                                            label={`${travelers.length} Passenger${travelers.length > 1 ? 's' : ''}`}
                                            size="small"
                                            sx={{ fontWeight: "bold", bgcolor: "#f8f9fa" }}
                                        />
                                    </Stack>

                                    {!submitted ? (
                                        <Fade in={!submitted}>
                                            <Box>
                                                {travelers.map((traveler, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            mb: 3,
                                                            p: 3,
                                                            bgcolor: "#fff",
                                                            border: "1px solid #e0e0e0",
                                                            borderRadius: 3,
                                                            position: 'relative',
                                                            transition: "0.3s",
                                                            "&:hover": { borderColor: "#e67e22" }
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: -10,
                                                                left: 20,
                                                                bgcolor: "#e67e22",
                                                                color: "white",
                                                                px: 1.5,
                                                                borderRadius: 1,
                                                                fontWeight: "bold"
                                                            }}
                                                        >
                                                            SEAT {selectedSeatNos?.[index]}
                                                        </Typography>

                                                        <Grid container spacing={2} mt={0.5}>
                                                            <Grid item xs={12} sm={6}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Full Name"
                                                                    placeholder="As per Govt. ID"
                                                                    value={traveler.name}
                                                                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <Person sx={{ color: "#bdc3c7" }} />
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6} sm={3}>
                                                                <TextField
                                                                    fullWidth
                                                                    type="number"
                                                                    label="Age"
                                                                    value={traveler.age}
                                                                    onChange={(e) => handleInputChange(index, "age", e.target.value)}
                                                                    InputProps={{
                                                                        startAdornment: <InputAdornment position="start"><Badge sx={{ color: "#bdc3c7", fontSize: 20 }} /></InputAdornment>,
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6} sm={3}>
                                                                <TextField
                                                                    select
                                                                    fullWidth
                                                                    label="Gender"
                                                                    value={traveler.gender}
                                                                    onChange={(e) => handleInputChange(index, "gender", e.target.value)}
                                                                    InputProps={{
                                                                        startAdornment: <InputAdornment position="start"><Transgender sx={{ color: "#bdc3c7", fontSize: 20 }} /></InputAdornment>,
                                                                    }}
                                                                    SelectProps={{ native: true }} // Faster for mobile users
                                                                >
                                                                    <option value="Male" >Male</option>
                                                                    <option value="Female">Female</option>
                                                                    <option value="Other">Other</option>
                                                                </TextField>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                ))}

                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    size="large"
                                                    onClick={() => setSubmitted(true)}
                                                    sx={{
                                                        mt: 2,
                                                        py: 2,
                                                        borderRadius: 3,
                                                        fontWeight: '800',
                                                        bgcolor: "#e67e22",
                                                        "&:hover": { bgcolor: "#e98731" }
                                                    }}
                                                >
                                                    Review & Confirm
                                                </Button>
                                            </Box>
                                        </Fade>
                                    ) : (
                                        <Fade in={submitted}>
                                            <Box>
                                                {travelers.map((t, i) => (
                                                    <Box
                                                        key={i}
                                                        sx={{
                                                            mb: 2,
                                                            p: 2.5,
                                                            border: "1px dashed #27ae60",
                                                            bgcolor: "#fafffb",
                                                            borderRadius: 3,
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <CheckCircle sx={{ color: "#27ae60" }} />
                                                            <Box>
                                                                <Typography fontWeight="bold" sx={{ color: "#2c3e50" }}>{t.name}</Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {t.age} yrs • {t.gender} • <strong>Seat {selectedSeatNos?.[i]}</strong>
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <IconButton onClick={() => setSubmitted(false)} size="small">
                                                            <Edit sx={{ fontSize: 18, color: "#7f8c8d" }} />
                                                        </IconButton>
                                                    </Box>
                                                ))}

                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    fullWidth
                                                    size="large"
                                                    onClick={handleProceedToPayment}
                                                    sx={{
                                                        mt: 2,
                                                        py: 2,
                                                        borderRadius: 3,
                                                        fontWeight: '800',
                                                        boxShadow: "0 6px 20px rgba(39, 174, 96, 0.3)"
                                                    }}
                                                >
                                                    Proceed to Payment
                                                </Button>
                                            </Box>
                                        </Fade>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* RIGHT SIDE: Fare and Offers */}
                        <Grid item xs={12} md={4}>
                            {/* 3️⃣ Fare Card - Refined for "Receipt" feel */}
                            <Card sx={{
                                borderRadius: 4,
                                mb: 2,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                                border: "1px solid #363636",
                                overflow: 'visible'
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="800" mb={3} color="text.primary">
                                        Fare Summary
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography color="text.secondary">Seats Selected</Typography>
                                            <Typography fontWeight="700">{selectedSeatNos?.length > 0 ? selectedSeatNos.join(", ") : "—"}</Typography>
                                        </Box>

                                        <Box display="flex" justifyContent="space-between">
                                            <Typography color="text.secondary">Base Fare</Typography>
                                            <Typography fontWeight="700">₹{Price}</Typography>
                                        </Box>

                                        <Box display="flex" justifyContent="space-between">
                                            <Typography color="text.secondary">Taxes & Fees</Typography>
                                            <Typography fontWeight="700" color="success.main">Free</Typography>
                                        </Box>

                                        {/* Coupon Input Area */}
                                        <Box sx={{ mt: 1 }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Have a Coupon?"
                                                placeholder="Enter code"
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value)}
                                                InputProps={{
                                                    sx: { borderRadius: 2, bgcolor: '#f9f9f9' }
                                                }}
                                            />
                                        </Box>

                                        {appliedCoupon && (
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                sx={{
                                                    p: 1.5,
                                                    bgcolor: "success.lighter",
                                                    borderRadius: 2,
                                                    border: "1px dashed",
                                                    borderColor: "success.main",
                                                    animation: "fadeIn 0.5s ease-in"
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="caption" display="block" color="success.dark" fontWeight="bold">COUPON APPLIED</Typography>
                                                    <Typography variant="body2" color="success.dark">{appliedCoupon.Couponcode}</Typography>
                                                </Box>
                                                <Typography fontWeight="bold" color="success.dark">-₹{appliedCoupon.amount}</Typography>
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 1, borderStyle: 'dashed', borderWidth: 1 }} />

                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">Total Payable</Typography>
                                                <Typography variant="h5" fontWeight="900" color="primary.main">
                                                    ₹{finalPrice}
                                                </Typography>
                                            </Box>

                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card sx={{
                                height: 380,
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 4,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                                border: "1px solid #f0f0f0"
                            }}>
                                <Box sx={{
                                    p: 2,
                                    background:"#db9252",
                                    color: "#000",
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Typography variant="subtitle1" fontWeight="800">Available Offers</Typography>
                                </Box>

                                <CardContent sx={{
                                    overflowY: "auto",
                                    flex: 1,
                                    p: 2,
                                    bgcolor: "#fff",
                                    '&::-webkit-scrollbar': { width: '4px' },
                                    '&::-webkit-scrollbar-thumb': { bgcolor: '#e0e0e0', borderRadius: '10px' }
                                }}>
                                    {coupons.map((coupon) => (
                                        <Box
                                            key={coupon.id}
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                position: 'relative',
                                                border: "1.5px solid #f0f0f0",
                                                borderRadius: 3,
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    borderColor: "primary.main",
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                                                }
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="overline"
                                                    fontWeight="900"
                                                    sx={{ color: 'primary.main', letterSpacing: 1 }}
                                                >
                                                    {coupon.Couponcode}
                                                </Typography>
                                                <Typography variant="body2" fontWeight="700" color="text.primary">
                                                    Save ₹{coupon.amount}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    On your current booking
                                                </Typography>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                onClick={() => copyToClipboard(coupon.Couponcode)}
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    height: 32,
                                                    minWidth: 60
                                                }}
                                            >
                                                Copy
                                            </Button>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}

export default Paymentprocess;