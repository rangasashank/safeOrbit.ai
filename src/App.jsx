import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import ReportDisaster from "./pages/ReportDisaster";

import Chat from "./pages/Chat";
import "./index.css"; 

function App() {
  return (
    <Router>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/report" element={<ReportDisaster />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
