import React, { useEffect, useState } from "react";

function App() {
  const [health, setHealth] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/health")
      .then(res => res.json())
      .then(data => setHealth(data.status))
      .catch(() => setHealth("Backend not reachable"));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Cloud Native Platform</h1>
      <h2>Backend Health: {health}</h2>
    </div>
  );
}

export default App;
