import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState("Checking...");

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks'); // Routed via Nginx
      const data = await res.json();
      setTasks(data);
      setStatus("ALIVE");
    } catch (err) {
      setStatus("OFFLINE");
    }
  };

  const addTask = async () => {
    if (!input) return;
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input })
    });
    setInput('');
    fetchTasks(); // This triggers the "waves" in Grafana!
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">CloudNative<span>Ops</span></div>
        <div className={`status-pill ${status.toLowerCase()}`}>
          ● System: {status}
        </div>
      </nav>

      <div className="main-grid">
        <section className="panel task-panel">
          <h2>Task Control Center</h2>
          <div className="input-group">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Deploy new production goal..." 
            />
            <button onClick={addTask}>Add Task</button>
          </div>
          <div className="task-list">
            {tasks.map(t => (
              <div key={t.id} className="task-item">{t.title}</div>
            ))}
          </div>
        </section>

        <section className="panel stats-panel">
          <h3>Infrastructure Stack</h3>
          <div className="stack-list">
            <div className="stack-item"><span>Runtime</span> <strong>Docker</strong></div>
            <div className="stack-item"><span>CI/CD</span> <strong>Jenkins</strong></div>
            <div className="stack-item"><span>Metrics</span> <strong>Prometheus</strong></div>
          </div>
          <hr />
          <a href="http://44.221.51.56:3001" className="grafana-link" target="_blank" rel="noreferrer">
            View Live Grafana Metrics
          </a>
        </section>
      </div>
    </div>
  );
}

export default App;