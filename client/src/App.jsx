import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import SmartHome from "./pages/SmartHome";
import Weather from "./pages/Weather";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/smartHome" element={<SmartHome />} />
                        <Route path="/weather" element={<Weather />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
