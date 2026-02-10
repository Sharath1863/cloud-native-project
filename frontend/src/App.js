import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [health, setHealth] = useState("Checking...");
  const [statusColor, setStatusColor] = useState("gray");

  useEffect(() => {
    fetch("http://localhost:5000/health")
      .then(res => res.json())
      .then(data => {
        if (data.status === "healthy") {
          setHealth("HEALTHY");
          setStatusColor("green");
        } else {
          setHealth("UNHEALTHY");
          setStatusColor("red");
        }
      })
      .catch(() => {
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

        <div className="status-row">
          <span>Version</span>
          <span className="badge blue">v1.0.0</span>
        </div>

        <div className="status-row">
          <span>API Connectivity</span>
          <span className={`badge ${statusColor}`}>
            {health === "HEALTHY" ? "OK" : "FAILED"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
