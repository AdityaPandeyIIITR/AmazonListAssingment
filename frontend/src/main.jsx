import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import Home from './pages/Home.jsx';
import Compare from './pages/Compare.jsx';
import History from './pages/History.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-6xl mx-auto p-4">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Amazon Listing Optimizer</h1>
          <nav className="flex gap-4 text-blue-600">
            <Link to="/">Home</Link>
            <Link to="/compare">Compare</Link>
            <Link to="/history">History</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);



