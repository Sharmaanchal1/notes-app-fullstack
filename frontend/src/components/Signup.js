import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Create Account </h3>
        <p className="text-center text-muted mb-4">
          Start managing your notes
        </p>

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              placeholder="Enter your name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Create a password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-success w-100 mt-2">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/" className="text-decoration-none">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
