// ResetPassParent.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Alert, Container } from "@mui/material";
import axios from "axios";
import ResetPasswordChild from "./ResetPasswordChild"; // Child component import

function ResetPassParent() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email) {
      setMessage({ type: "error", text: "Email is required" });
      return;
    }

    setLoading(true);
    try {
      const usersResponse = await fetch("http://127.0.0.1:8000/list/users/");
      const usersData = await usersResponse.json();

      const user = usersData.find((u) => u.email === email);
      if (!user) {
        setMessage({ type: "error", text: "Email address not found" });
        setLoading(false);
        return;
      }

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
        setMessage({ type: "error", text: res.data.message });
      }
    } catch (err) {
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
        {!submittedEmail ? (
          <Paper elevation={10} sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>
            <Typography variant="h5" mb={2}>
              Enter your email to reset password
            </Typography>

            {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? "Checking..." : "Submit"}
              </Button>
            </form>
          </Paper>
        ) : (
          <ResetPasswordChild email={submittedEmail} />
        )}
      </Container>
    </Box>
  );
}

export default ResetPassParent;