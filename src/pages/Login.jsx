import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/login", { email, password });
      login(res.data);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Welcome Back</h2>

        {error && <p className="error-text">{error}</p>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-primary full-width">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;