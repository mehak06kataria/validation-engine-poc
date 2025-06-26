import { useState } from "react";

function App() {
  const [data, setData] = useState('{\n  "energyUsed": 420,\n  "email": "abc@gmail.com",\n  "name": "Mehak"\n}');
  const [rules, setRules] = useState(["energyUsed < 500", "email isEmail"]);
  const [newRule, setNewRule] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: JSON.parse(data),
          rules: rules.filter((r) => r.trim() !== "")
        })
      });

      const res = await response.json();
      setResult(res);
    } catch (err) {
      setResult({ error: "Validation error: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = () => {
    if (newRule.trim() !== "") {
      setRules([...rules, newRule.trim()]);
      setNewRule("");
    }
  };

  const handleRemoveRule = (index) => {
    const updated = [...rules];
    updated.splice(index, 1);
    setRules(updated);
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">
        🧪 Validation Rules Tester
      </h1>

      <textarea
        rows={6}
        className="w-full max-w-xl p-3 border rounded mb-4 font-mono text-sm bg-gray-100 text-black"
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder='Enter JSON data'
      />

      <div className="w-full max-w-xl mb-4">
        <label className="block mb-2 font-medium">Validation Rules</label>
        {rules.map((rule, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              value={rule}
              readOnly
              className="flex-1 p-2 border rounded mr-2 text-sm bg-gray-100 text-black"
            />
            <button
              onClick={() => handleRemoveRule(index)}
              className="text-red-600 hover:underline text-sm"
            >
              ✖
            </button>
          </div>
        ))}
        <div className="flex mt-2">
          <input
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder='e.g. email isEmail'
            className="flex-1 p-2 border rounded text-sm bg-white text-black"
          />
          <button
            onClick={handleAddRule}
            className="ml-2 bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Add Rule
          </button>
        </div>
      </div>

      <button
        onClick={handleValidate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
      >
        {loading ? "Validating..." : "Run Validation"}
      </button>

      {result?.results && (
        <div className="mt-6 w-full max-w-xl space-y-2">
          {result.results.map((r, idx) => (
            <div
              key={idx}
              className={`p-3 rounded text-sm font-medium ${
                r.valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              ✅ {r.rule} → {r.valid ? "Passed" : "Failed"}
            </div>
          ))}
        </div>
      )}

      {result?.error && (
        <div className="mt-6 bg-red-100 text-red-700 p-3 rounded text-sm font-medium">
          {result.error}
        </div>
      )}
    </div>
  );
}

export default App;
