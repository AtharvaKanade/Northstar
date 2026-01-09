import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Roadmap from './pages/Roadmap'; // Import the new page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/roadmap" element={<Roadmap />} />
    </Routes>
  );
}

export default App;