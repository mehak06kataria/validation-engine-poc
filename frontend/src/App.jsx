import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
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
  
    // Call backend to parse resume
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
      console.log("Parsed text:", data.rawText);
  
      // Autofill form fields (basic logic using regex or simple string search)
      if (data.rawText) {
        const emailMatch = data.rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
        const phoneMatch = data.rawText.match(/(?:\+91[-\s]?)?\d{10}/);
        const nameMatch = data.rawText.split("\n").find((line) => line.trim().length > 4 && !line.includes("@"));
  
        setForm((prev) => ({
          ...prev,
          email: emailMatch ? emailMatch[0] : prev.email,
          phone: phoneMatch ? phoneMatch[0] : prev.phone,
          firstName: nameMatch ? nameMatch.split(" ")[0] : prev.firstName,
          lastName: nameMatch ? nameMatch.split(" ")[1] || "" : prev.lastName,
        }));
      }
  
    } catch (err) {
      setError("Resume parsing error: " + err.message);
    }
  };
  

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
  
    if (!resume) {
      setError("Please upload a resume (PDF file).");
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("resume", resume);
  
    try {
      // Step 1: Validate
      const res = await fetch("http://localhost:8080/api/validate", {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Something went wrong");
      }
  
      const data = await res.json();
      setResult(data);
  
      // Step 2: Parse Resume after validation success
      const parseRes = await fetch("http://localhost:8080/api/parse-resume", {
        method: "POST",
        body: formData,
      });
  
      if (!parseRes.ok) {
        console.warn("Resume parsing failed");
      } else {
        const parsed = await parseRes.json();
        console.log("Parsed Resume:", parsed);
        // you can now autofill the form or show this data on UI
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white text-black p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">👤 Profile Page</h1>

      <div className="w-full max-w-xl space-y-4">
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full"
        />

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Now"}
        </button>
      </div>

      {result?.results && (
        <div className="mt-6 w-full max-w-xl space-y-2">
          {result.results.map((r, idx) => (
            <div
              key={idx}
              className={`p-3 rounded text-sm font-medium ${
                r.valid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {r.valid ? "✅" : "❌"} {r.rule} → {r.valid ? "Passed" : "Failed"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
