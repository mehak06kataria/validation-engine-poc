import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
} from "@mui/material";

function App() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    experience: "",
  });
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setResume(null);
      return;
    }

    setError("");
    setResume(file);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:8080/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Resume parsing failed");
      }

      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        email: data.email || prev.email,
        phone: data.phone || prev.phone,
        firstName: data.name?.split(" ")[0] || prev.firstName,
        lastName: data.name?.split(" ")[1] || prev.lastName,
        experience: data.experience || prev.experience,
      }));
    } catch (err) {
      setError("Resume parsing error: " + err.message);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8080/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          resumePath: resume?.name || "",
        }),
      });

      const data = await response.json();
      setLoading(false);
      setResult(data);
    } catch (err) {
      setLoading(false);
      setError("An error occurred while saving the profile.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Create Your Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={3}>
          Fill in your details to get started
        </Typography>

        <Box mb={2}>
          <label htmlFor="resume-upload" style={{ display: "block", marginBottom: 4 }}>
            Upload Resume
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ marginBottom: 8 }}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              label="First Name"
              fullWidth
              value={form.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              value={form.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label="Phone Number"
              fullWidth
              value={form.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="age"
              label="Age"
              type="number"
              fullWidth
              value={form.age}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="experience"
              label="Resume / Bio"
              fullWidth
              multiline
              rows={2}
              value={form.experience}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Box mt={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Profile"}
          </Button>
        </Box>

        {result?.results && (
          <Box mt={3}>
            {result.results.map((r, idx) => (
              <Alert key={idx} severity={r.valid ? "success" : "error"} sx={{ mb: 1 }}>
                {r.valid ? "✅" : "❌"} {r.rule}
              </Alert>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;
