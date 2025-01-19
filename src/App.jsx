import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import ReportDisaster from "./pages/ReportDisaster";
import Alerts from "./pages/Alerts";
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
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
