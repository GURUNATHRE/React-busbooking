import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Box, Paper, Typography, TextField, Button,
  IconButton, InputAdornment, Fade, Checkbox, FormControlLabel, CircularProgress, Divider
} from "@mui/material";
import bus from "../assets/bus.jpg";
import "../css/Login.css";

// Styles (unchanged)
const internalStyles = {
  leftPanel: {
    width: "45%",
    p: 6,
    background: "#aac7e2",
    backdropFilter: "blur(20px)",
    display: "flex",
    flexDirection: "column",
    color: "#1e293b",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "0.75rem",
    fontWeight: 600,
    mt: 0.5,
    ml: 1,
    display: "block"
  },
  indiaGradient: {
    background: "linear-gradient(to right, #FF9933 33%, white 33%, white 66%, #138808 66%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block",
    fontWeight: 900,
  }
};

function Login({ onClose, openRegister }) {
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ FIXED

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({ mode: "onBlur" });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await axios.post(`${BASE_URL}Loginview/`, data);
      if (res.status === 200) {
        localStorage.setItem("access", res.data.token);
        onClose();
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Invalid credentials. Please try again.";
      setServerError(msg);
      setError("password", { type: "manual" });
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          backdropFilter: "blur(8px)"
        }}
      >
        <Paper
          onClick={(e) => e.stopPropagation()}
          elevation={24}
          sx={{
            width: "950px",
            height: "600px",
            display: "flex",
            borderRadius: 6,
            overflow: "hidden"
          }}
        >

          {/* LEFT SIDE */}
          <Box sx={internalStyles.leftPanel}>
            <Typography variant="overline" sx={{ color: "#6366f1", fontWeight: 800 }}>
              TRIPORA TRAVELS
            </Typography>

            <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
              Welcome Back
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b", mb: 4 }}>
              Please enter your details to continue.
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>

              {/* EMAIL */}
              {/* EMAIL */}
              <TextField
                fullWidth
                size="small"
                placeholder="Email Address"
                className="login-input"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address"
                  }
                })}
                error={!!errors.email}
                sx={{ mb: errors.email ? 0.5 : 2 }}
              />
              {errors.email && (
                <Typography sx={internalStyles.errorText}>
                  {errors.email.message}
                </Typography>
              )}

              {/* PASSWORD */}
              <TextField
                fullWidth
                size="small"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="login-input"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                  onChange: () => setServerError("") // Clear server error when user types
                })}
                error={!!errors.password || !!serverError}
                sx={{ mb: (errors.password || serverError) ? 0.5 : 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)}>
                        <i className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {(errors.password || serverError) && (
                <Typography sx={internalStyles.errorText}>
                  {errors.password?.message || serverError}
                </Typography>
              )}

              {/* BUTTON */}
              <Button fullWidth type="submit" className="login-btn">
                Sign In
              </Button>
            </form>


            <Divider sx={{ mt: 3 }}>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                OR
              </Typography>
            </Divider>

            <Box display="flex" gap={2} mt={4}>
              <Button fullWidth variant="outlined">
                <i className="fa-brands fa-google" style={{ marginRight: 8 }} /> Google
              </Button>
              <Button fullWidth variant="outlined">
                <i className="fa-brands fa-apple" style={{ marginRight: 8 }} /> Apple
              </Button>
            </Box>

            {/* REGISTER WITH LOADER */}
            <Typography align="center" sx={{ mt: 3 }}>
              New here?{" "}
              <span
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    openRegister();
                  }, 800);
                }}
                style={{
                  color: "#6366f1",
                  cursor: "pointer",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center"
                }}
              >
                {loading ? (
                  <CircularProgress size={16} sx={{ color: "#6366f1" }} />
                ) : (
                  "Create Account"
                )}
              </span>
            </Typography>
          </Box>

          {/* RIGHT SIDE */}
          <Box sx={{ width: "55%", position: "relative" }}>
            <Box component="img" src={bus} sx={{ width: "100%", height: "100%" }} />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #1e293b, transparent)" }} />
            <Box sx={{ position: "absolute", bottom: 60, left: 50 }}>
              <Typography variant="h3" color="white">
                Explore<br />
                <span style={internalStyles.indiaGradient}>INDIA</span>
              </Typography>
            </Box>
          </Box>

        </Paper>
      </Box>
    </Fade>
  );
}

export default Login;