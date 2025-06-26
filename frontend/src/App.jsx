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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setResume(null);
    } else {
      setError("");
      setResume(file);
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
    } catch (err) {
      setError("Error validating: " + err.message);
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
