import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../AuthContext'; // Adjust the path as needed
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext); // Ensure this context is set up properly
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token); // Save token and user info as needed
        navigate("/todos"); // Redirect to the main page
      } else {
        const err = await response.json();
        setError(err.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Create one</a>
      </p>
    </div>
  );
};

export default Login;
