import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Paper,
  Alert, Container, InputAdornment, IconButton, CircularProgress,
} from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

function ResetPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  // Step 1: verify email exists
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email.trim()) {
      setMessage({ type: "error", text: "Email is required." });
      return;
    }

    setLoading(true);
    try {
      const { data: users } = await axios.get(`${API_BASE}/list/users/`);
      const user = users.find((u) => u.email === email.trim());

      if (!user) {
        setMessage({ type: "error", text: "Email address not found." });
        return;
      }

      setUserId(user.id);
      setStep(2);
      setMessage({ type: "", text: "" });
    } catch {
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: update password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!password || !confirmPassword) {
      setMessage({ type: "error", text: "Password fields cannot be empty." });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.patch(
        `${API_BASE}/list/users/${userId}/`,
        { password }
      );

      if (data.status === "success") {
        setMessage({ type: "success", text: "Password updated! Redirecting..." });
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage({ type: "error", text: data.message || "Password update failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #c59a8d 0%, #ccd4d8 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="sm">

        {/* Back Button + Heading */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 3,
            mb: 4,
            px: { xs: 2, md: 0 },
          }}
        >
          <button
            onClick={() => navigate("/")}
            className="btn shadow-sm d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "#e67e22",
              color: "white",
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              transition: "0.3s",
              marginLeft: "3%",
            }}
          >
            <i className="fa fa-arrow-left"></i>
          </button>

          <h2
            className="fw-bold m-0"
            style={{
              color: "white",
              letterSpacing: "-0.5px",
              fontSize: "2rem",
              lineHeight: 1,
            }}
          >
            Reset Your Password
          </h2>
        </Box>

        <Paper elevation={10} sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>

          {/* Step 1: email form */}
          {step === 1 && (
            <>
              <Typography variant="h5" mb={2}>
                Enter your email to reset password
              </Typography>

              {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                  {message.text}
                </Alert>
              )}

              <form onSubmit={handleEmailSubmit}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3 }}
                />
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </form>
            </>
          )}

          {/* Step 2: password reset form */}
          {step === 2 && (
            <>
              <Typography variant="h5" mb={2}>
                Reset Password for {email}
              </Typography>

              {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                  {message.text}
                </Alert>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((v) => !v)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Update Password"}
                  </Button>
                </Box>
              </form>
            </>
          )}

        </Paper>
      </Container>
    </Box>
  );
}

export default ResetPassword;