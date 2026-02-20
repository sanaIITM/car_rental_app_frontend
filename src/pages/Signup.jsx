import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/api/auth/signup", form);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setError("Signup failed. Email may already exist.");
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create Account</h2>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit" className="btn-primary full-width">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;