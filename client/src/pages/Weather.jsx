import React, { useEffect, useState } from "react";
import axios from "axios";
import temperatureIcon from "../assets/images/temp.png";
import humidityIcon from "../assets/images/humidity.png";
import lightIcon from "../assets/images/light.png";

const API_URL = import.meta.env.VITE_API_URL;

export default function Weather() {
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [light, setLight] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Weather - Smart Home Management System";

        const fetchData = async () => {
            try {
                const tempResponse = await axios.get(
                    `${API_URL}/api/temperature/temp`
                );
                setTemperature(tempResponse.data.temp);

                const humiResponse = await axios.get(
                    `${API_URL}/api/air-humidity/air-humi`
                );
                setHumidity(humiResponse.data.humi);

                const lightResponse = await axios.get(
                    `${API_URL}/api/light/lightEnergy`
                );
                setLight(lightResponse.data.LightEnergy);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex justify-between items-center w-full p-4 min-h-screen">
            <div className="flex-1 flex flex-col items-center justify-center">
                <img
                    src={temperatureIcon}
                    alt="Temperature"
                    className="w-32 h-32 object-contain"
                />
                <p
                    className="mt-2 text-xl"
                    dangerouslySetInnerHTML={{
                        __html:
                            temperature !== null
                                ? `${temperature} &deg;C`
                                : "Loading...",
                    }}
                />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <img
                    src={humidityIcon}
                    alt="Humidity"
                    className="w-32 h-32 object-contain"
                />
                <p className="mt-2 text-xl">
                    {humidity !== null ? `${humidity}%` : "Loading..."}
                </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <img
                    src={lightIcon}
                    alt="Light"
                    className="w-32 h-32 object-contain"
                />
                <p className="mt-2 text-xl">
                    {light !== null ? `${light} lux` : "Loading..."}
                </p>
            </div>
        </div>
    );
}
