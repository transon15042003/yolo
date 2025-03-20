import React, { useEffect } from "react";

const Homepage = () => {
    useEffect(() => {
        document.title = "Homepage - Smart Home Management System";
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* <div className="absolute inset-0 z-0 bg-[url('../assets/images/smartHome.jpg')] bg-cover bg-center opacity-60" /> */}
            <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-4xl font-bold mb-6 text-primary-900">
                    Smart Home Management System
                </h1>

                <div className="max-w-3xl mx-auto mb-8">
                    <p className="text-xl text-gray-800 mb-6">
                        The intelligent solution for monitoring and managing
                        your home remotely
                    </p>
                    <p className="text-lg text-gray-700">
                        Take complete control of your home with just a few
                        simple clicks
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white/80 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">
                            Environment Monitoring
                        </h3>
                        <ul className="text-left">
                            <li>• Indoor Temperature</li>
                            <li>• Humidity Levels</li>
                            <li>• Light Intensity</li>
                            <li>• Air Quality</li>
                        </ul>
                    </div>

                    <div className="bg-white/80 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">
                            Device Management
                        </h3>
                        <ul className="text-left">
                            <li>• Lighting Control</li>
                            <li>• Air Conditioning</li>
                            <li>• Ventilation Fans</li>
                            <li>• Other Appliances</li>
                        </ul>
                    </div>

                    <div className="bg-white/80 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">
                            Smart Features
                        </h3>
                        <ul className="text-left">
                            <li>• Automated Scheduling</li>
                            <li>• Anomaly Alerts</li>
                            <li>• Energy Statistics</li>
                            <li>• Remote Control</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
