import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Box,TextField,Button,Typography,Paper,InputAdornment,IconButton,Alert,CircularProgress,Container,} from "@mui/material";
import {Email,Lock,Visibility,VisibilityOff,LockReset,} from "@mui/icons-material";

function ResetPass() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  function handlelogin(){
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Fetch all users
      const usersResponse = await fetch("http://127.0.0.1:8000/list/users/");
      const usersData = await usersResponse.json();

      // 2️⃣ Find user ID by email
      const user = usersData.find((u) => u.email === email);
      if (!user) {
        setMessage({ type: "error", text: "Email address not found" });
        setLoading(false);
        return;
      }

      // 3️⃣ Send PATCH request to update password
      const patchResponse = await fetch(
        `http://127.0.0.1:8000/list/users/${user.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      if (patchResponse.ok) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const data = await patchResponse.json();
        setMessage({ type: "error", text: data.password || "Update failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
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
        <Paper
          elevation={10}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Icon and Title */}
          <Box
            sx={{
              display: "inline-flex",
              p: 2,
              borderRadius: "50%",
              bgcolor: "primary.light",
              color: "primary.main",
              mb: 2,
            }}
          >
            <LockReset fontSize="large" />
          </Box>
          <Typography variant="h4" fontWeight="700" gutterBottom color="textPrimary">
            Security Reset
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={4}>
            Please enter your account email and choose a strong new password.
          </Typography>

          {/* Feedback Message */}
          {message.text && (
            <Alert 
              severity={message.type} 
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Email Input */}
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Input */}
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm Password Input */}
              <TextField
                label="Confirm New Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  boxShadow: 3,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
              </Button>

              <Button onClick={handlelogin}
                variant="text" 
                color="primary" 
                sx={{ mt: 1, textTransform: "none" }}
              >
                Return to Login
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default ResetPass;