import React from "react";
import {
    FiMonitor,
    FiSettings,
    FiBarChart2,
    FiShield,
    FiSmartphone,
} from "react-icons/fi";
import { FaFan, FaLightbulb, FaTemperatureHigh, FaTint } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <FiMonitor className="text-blue-500" size={24} />,
            title: "Giám sát thời gian thực",
            description:
                "Theo dõi các chỉ số môi trường như nhiệt độ, độ ẩm, ánh sáng ngay lập tức",
        },
        {
            icon: <FiSettings className="text-green-500" size={24} />,
            title: "Điều khiển thông minh",
            description:
                "Tự động hóa các thiết bị dựa trên ngưỡng cài đặt hoặc điều khiển thủ công",
        },
        {
            icon: <FiBarChart2 className="text-purple-500" size={24} />,
            title: "Phân tích dữ liệu",
            description:
                "Biểu đồ và báo cáo chi tiết giúp bạn hiểu rõ môi trường sống",
        },
        {
            icon: <FiShield className="text-yellow-500" size={24} />,
            title: "Bảo mật an toàn",
            description:
                "Hệ thống bảo mật đa lớp đảm bảo an toàn cho ngôi nhà của bạn",
        },
    ];

    const devices = [
        {
            icon: <FaFan size={32} />,
            name: "Quạt thông minh",
            description: "Điều chỉnh tốc độ từ 0-90W",
        },
        {
            icon: <FaLightbulb size={32} />,
            name: "Đèn LED",
            description: "Bật/tắt và điều chỉnh độ sáng",
        },
        {
            icon: <FaTemperatureHigh size={32} />,
            name: "Cảm biến nhiệt",
            description: "Giám sát nhiệt độ phòng",
        },
        {
            icon: <FaTint size={32} />,
            name: "Cảm biến ẩm",
            description: "Theo dõi độ ẩm không khí",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            {/* Hero Section */}
            <section className="py-20 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                        Smart Home IoT Platform
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
                        Giải pháp quản lý ngôi nhà thông minh với công nghệ IoT
                        tiên tiến
                    </p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-blue-500/30"
                    >
                        Bắt đầu ngay
                    </button>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-16">
                    Tính năng nổi bật
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-400 transition-all"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Devices Section */}
            <section className="py-16 px-4 bg-gray-800/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        Thiết bị hỗ trợ
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {devices.map((device, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gray-800 p-6 rounded-xl text-center"
                            >
                                <div className="text-blue-400 mb-4">
                                    {device.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {device.name}
                                </h3>
                                <p className="text-gray-400">
                                    {device.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/50 to-teal-900/50 p-8 rounded-2xl border border-gray-700"
                >
                    <h2 className="text-3xl font-bold mb-6">
                        Sẵn sàng trải nghiệm?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Đăng nhập ngay để bắt đầu kiểm soát ngôi nhà thông minh
                        của bạn từ bất cứ đâu
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="px-6 py-3 bg-blue-500 rounded-full font-semibold hover:bg-blue-600 transition-all"
                        >
                            Truy cập Dashboard
                        </button>
                        <button
                            onClick={() => navigate("/devices")}
                            className="px-6 py-3 bg-transparent border border-blue-400 rounded-full font-semibold hover:bg-blue-900/30 transition-all"
                        >
                            Điều khiển thiết bị
                        </button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default HomePage;
