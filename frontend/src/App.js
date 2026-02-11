import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [health, setHealth] = useState("Checking...");
  const [statusColor, setStatusColor] = useState("gray");

  useEffect(() => {
    // FIX: Removed "http://localhost:5000" and used "/api/health"
    // This tells the browser: "Go to the same server I am on, but look for the /api route"
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error("API not reachable");
        return res.json();
      })
      .then((data) => {
        if (data.status === "healthy") {
          setHealth("HEALTHY");
          setStatusColor("green");
        } else {
          setHealth("UNHEALTHY");
          setStatusColor("red");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setHealth("DOWN");
        setStatusColor("red");
      });
  }, []);

  return (
    <div className="dashboard">
      <h1 className="title">Cloud Native Platform</h1>

      <div className="card">
        <h2>System Status</h2>

        <div className="status-row">
          <span>Backend Service</span>
          <span className={`badge ${statusColor}`}>
            {health}
          </span>
        </div>

        <div className={`status-row ${health !== "HEALTHY" ? "error-text" : ""}`}>
          <span>API Connectivity</span>
          <span className={`badge ${statusColor}`}>
            {health === "HEALTHY" ? "OK" : "FAILED"}
          </span>
        </div>

        <div className="status-row">
          <span>Version</span>
          <span className="badge blue">v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

export default App;