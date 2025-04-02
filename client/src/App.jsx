import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/features" element={<FeaturesPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/devices" element={<Devices />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
