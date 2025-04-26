import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import PowerConsumption from "./pages/PowerConsumption";
import Settings from "./pages/Settings";

function App() {
    return (
        <Router>
            <div className="app-container min-h-screen flex flex-col bg-gray-900">
                <Header />
                <main className="main-content flex-1 pt-16">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/features" element={<FeaturesPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/devices" element={<Devices />} />
                        <Route
                            path="/power-consumption"
                            element={<PowerConsumption />}
                        />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
