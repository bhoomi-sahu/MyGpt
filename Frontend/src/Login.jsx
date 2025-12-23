// import React, { useState, useEffect } from "react";
// import "./Login.css";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [backendStatus, setBackendStatus] = useState("Checking...");

//   /* ---------------- BACKEND HEALTH CHECK ---------------- */
//   useEffect(() => {
//     checkBackend();
//   }, []);

//   const checkBackend = async () => {
//     try {
//       const res = await fetch("http://localhost:5001/test");
//       const text = await res.text(); // ✅ backend sends TEXT
//       setBackendStatus(`✅ ${text}`);
//     } catch (err) {
//       setBackendStatus("❌ Backend not reachable");
//       console.error("Backend check error:", err);
//     }
//   };

//   /* ---------------- LOGIN ---------------- */
//   const login = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5001/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ username, password })
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       // ✅ SAVE TOKEN
//       localStorage.setItem("token", data.token);

//       alert("Login successful ✅");
//       console.log("JWT Token:", data.token);

//       // TODO: redirect to chat page
//       // navigate("/chat");

//     } catch (err) {
//       console.error("Login error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={login}>
//         <h2>Login</h2>

//         <p className="backend-status">
//           <strong>Backend:</strong> {backendStatus}
//         </p>

//         {error && <div className="error-message">{error}</div>}

//         <div className="form-group">
//           <label>Username</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;



