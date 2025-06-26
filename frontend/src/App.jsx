import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    education: "",
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
      console.log("Parsed data:", data);

      setForm((prev) => ({
        ...prev,
        email: data.email || prev.email,
        phone: data.phone || prev.phone,
        firstName: data.name?.split(" ")[0] || prev.firstName,
        lastName: data.name?.split(" ")[1] || prev.lastName,
        education: data.education || prev.education,
        experience: data.experience || prev.experience,
      }));
    } catch (err) {
      setError("Resume parsing error: " + err.message);
    }
  };

  const handleSubmit = async () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      age,
      education,
      experience,
    } = form;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8080/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          age,
          education,
          experience,
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
          name="education"
          placeholder="Education"
          value={form.education}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="experience"
          placeholder="Experience"
          value={form.experience}
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
                r.valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {r.valid ? "✅" : "❌"} {r.rule}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
