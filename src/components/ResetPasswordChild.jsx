// ResetPasswordChild.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Alert, InputAdornment, IconButton, CircularProgress, Paper, Typography } from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPasswordChild({ email }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/"); // navigate to login page
  };


  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!password || !confirmPassword) {
      setMessage({ type: "error", text: "Password fields cannot be empty" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      // Get all users to find user ID
      const usersRes = await axios.get("http://127.0.0.1:8000/list/users/");
      const user = usersRes.data.find((u) => u.email === email);

      if (!user) {
        setMessage({ type: "error", text: "User not found" });
        setLoading(false);
        return;
      }

      // Update password via PATCH
      const patchRes = await axios.patch(`http://127.0.0.1:8000/list/users/${user.id}`, { password });

      if (patchRes.data.status === "success") {
        setMessage({ type: "success", text: patchRes.data.message });
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: patchRes.data.message || "Password update failed" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={10} sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>
      <Typography variant="h5" mb={2}>
        Reset Password for {email}
      </Typography>

      {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

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
              startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
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
            InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Update Password"}
          </Button>
          <Button
            variant="contained"
            fullWidth
            
            onClick={handleNavigate} // navigate on click
          >
            login
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default ResetPasswordChild;