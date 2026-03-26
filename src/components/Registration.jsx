import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box, Paper, Typography, TextField, Button,
  IconButton, InputAdornment, Fade, Divider, CircularProgress
} from "@mui/material";
import taj from "../assets/taj.jpg";

const internalStyles = {
  leftPanel: {
    width: "45%",
    p: 6,
    background: "#aac7e2",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  inputField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      marginTop: "10px",
      backgroundColor: "#f8fafc",
      "& fieldset": { border: "none" },
      "&:hover fieldset": { border: "none" },
      "&.Mui-focused fieldset": { border: "1.5px solid #6366f1" },
    },
    mb: 0.5,
  },
  errorText: {
    color: "#ef4444",
    fontSize: "0.75rem",
    fontWeight: 600,
    mb: 1.5,
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

function Registration({ onClose, openLogin }) {
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Registering:", data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Box onClick={onClose} sx={{ position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, backdropFilter: "blur(12px)" }}>
        <Paper onClick={(e) => e.stopPropagation()} elevation={0} sx={{ width: "1000px", height: "650px", display: "flex", borderRadius: "32px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>

          {/* LEFT SIDE */}
          <Box sx={internalStyles.leftPanel}>
            <Typography variant="overline" sx={{ color: "#6366f1", fontWeight: 900, letterSpacing: 1.5 }}>
              TRIPORA TRAVELS
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mt: 1 }}>
              Create Account
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b", mb: 4, mt: 0.5 }}>
              Join us to discover the hidden gems of India.
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 2 }}>
              <TextField
                fullWidth size="small" placeholder="Full Name"
                sx={internalStyles.inputField}
                {...register("username", { required: "Username is required" })}
                error={!!errors.username}
              />
              {errors.username && <Typography sx={internalStyles.errorText}>{errors.username.message}</Typography>}

              <TextField
                fullWidth size="small" placeholder="Email Address"
                sx={internalStyles.inputField}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" }
                })}
                error={!!errors.email}
              />
              {errors.email && <Typography sx={internalStyles.errorText}>{errors.email.message}</Typography>}

              <TextField
                fullWidth size="small" type={showPass ? "text" : "password"} placeholder="Password"
                sx={internalStyles.inputField}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Use 8+ characters" }
                })}
                error={!!errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} size="small">
                        <i className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`} style={{ color: '#94a3b8', fontSize: '1rem' }} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {errors.password && <Typography sx={internalStyles.errorText}>{errors.password.message}</Typography>}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  py: 1.5, mt: 1, borderRadius: "12px", fontWeight: 700,
                  textTransform: "none", fontSize: "1rem",
                  bgcolor: "#6366f1",
                  '&:hover': { bgcolor: '#4f46e5' }
                }}
              >
                {isSubmitting ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create Account"}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                OR
              </Typography>
            </Divider>

            <Box display="flex" gap={2}>
              <Button fullWidth variant="outlined">
                <i className="fa-brands fa-google" style={{ marginRight: 8 }} /> Google
              </Button>
              <Button fullWidth variant="outlined">
                <i className="fa-brands fa-apple" style={{ marginRight: 8 }} /> Apple
              </Button>
            </Box>

            {/* ✅ FIXED LOADER */}
            <Typography variant="body2" align="center" sx={{ mt: 4, color: "#64748b" }}>
              Already a member?{" "}
              <span
                onClick={() => {
                  setIsSwitching(true);
                  setTimeout(() => {
                    setIsSwitching(false);
                    openLogin();
                  }, 800);
                }}
                style={{
                  color: "#6366f1",
                  cursor: "pointer",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {isSwitching ? (
                  <CircularProgress size={14} sx={{ color: "#6366f1" }} />
                ) : (
                  "Login here"
                )}
              </span>
            </Typography>
          </Box>

          {/* RIGHT SIDE */}
          <Box sx={{ width: "55%", position: "relative" }}>
            <Box component="img" src={taj} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(20deg, #1e293b 0%, transparent 60%)", opacity: 0.8 }} />
            <Box sx={{ position: "absolute", bottom: 60, left: 50 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "white" }}>
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

export default Registration;