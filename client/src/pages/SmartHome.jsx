import React, { useEffect } from "react";

const SmartHome = () => {
    useEffect(() => {
        document.title = "Smart Home - Smart Home Management System";
    }, []);

    return (
        <div>
            <h1>Smart Home</h1>
        </div>
    );
};

export default SmartHome;
