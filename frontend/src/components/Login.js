import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Welcome Back </h3>
        <p className="text-center text-muted mb-4">
          Login to manage your notes
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100 mt-2">
            Login
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-decoration-none">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
