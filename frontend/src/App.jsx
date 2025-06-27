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
  const [error, setError] = useState([]); // changed to array

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setError(["Only PDF files are allowed."]);
      setResume(null);
      return;
    }

    setError([]);
    setResume(file);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:8000/api/parse-resume", {
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
      setError(["Resume parsing error: " + err.message]);
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    let errors = [];

    if (!form.firstName.trim()) errors.push("First name is required.");
    if (!form.lastName.trim()) errors.push("Last name is required.");
    if (!emailRegex.test(form.email)) errors.push("Invalid email format.");
    if (!phoneRegex.test(form.phone)) errors.push("Phone number must be 10 digits.");
    if (!form.age || isNaN(form.age) || parseInt(form.age) <= 18)
      errors.push("Age must be a number greater than 18.");
    if (!resume) errors.push("Resume upload is required.");

    if (errors.length > 0) {
      setError(errors);
      return false;
    }

    setError([]);
    return true;
  };

  const toSnakeCase = (obj) => {
    const snakeCaseObj = {};
    for (const key in obj) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      snakeCaseObj[snakeKey] = obj[key];
    }
    return snakeCaseObj;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setResult(null);

    const payload = {
      ...form,
      resumePath: resume?.name || "",
    };

    const snakeCasePayload = toSnakeCase(payload);

    try {
      const response = await fetch("http://localhost:8000/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snakeCasePayload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(["An error occurred while saving the profile."]);
    } finally {
      setLoading(false);
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

        {/* ✅ Display all errors */}
        {error?.length > 0 && (
          <Box mt={2}>
            {error.map((e, idx) => (
              <Alert key={idx} severity="error" sx={{ mb: 1 }}>
                ❌ {e}
              </Alert>
            ))}
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

        {/* ✅ Display backend rule validation result */}
        {result?.results && (
  <Box mt={3}>
    {result.results.some((r) => !r.valid) ? (
      result.results.map(
        (r, idx) =>
          !r.valid && (
            <Alert key={idx} severity="error" sx={{ mb: 1 }}>
              ❌ {r.rule}
            </Alert>
          )
      )
    ) : (
      <Alert severity="success">✅ Profile saved successfully</Alert>
    )}
  </Box>
)}

      </Paper>
    </Container>
  );
}

export default App;
