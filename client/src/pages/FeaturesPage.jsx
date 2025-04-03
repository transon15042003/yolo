import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiMonitor,
    FiZap,
    FiBarChart2,
    FiShield,
    FiSmartphone,
    FiHome,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const FeaturesPage = () => {
    useEffect(() => {
        document.title = "Features - Smart Home IoT Platform";
    }, []);

    const navigate = useNavigate();

    const features = [
        {
            icon: <FiMonitor className="text-blue-500" size={24} />,
            title: "Giám sát thời gian thực",
            description:
                "Theo dõi các chỉ số môi trường như nhiệt độ, độ ẩm, ánh sáng ngay lập tức",
            details: [
                "Cập nhật dữ liệu mỗi 5 giây",
                "Biểu đồ trực quan",
                "Cảnh báo ngưỡng an toàn",
            ],
        },
        {
            icon: <FiZap className="text-green-500" size={24} />,
            title: "Điều khiển tự động",
            description: "Tự động hóa các thiết bị dựa trên ngưỡng cài đặt",
            details: [
                "Kịch bản thông minh",
                "Lịch trình hoạt động",
                "Điều khiển theo thời tiết",
            ],
        },
        {
            icon: <FiBarChart2 className="text-purple-500" size={24} />,
            title: "Phân tích dữ liệu",
            description: "Báo cáo chi tiết giúp bạn hiểu rõ môi trường sống",
            details: [
                "Xuất báo cáo hàng tháng",
                "Phân tích tiêu thụ điện",
                "Gợi ý tối ưu hóa",
            ],
        },
        {
            icon: <FiShield className="text-yellow-500" size={24} />,
            title: "Bảo mật đa lớp",
            description: "Hệ thống bảo mật đảm bảo an toàn cho ngôi nhà",
            details: [
                "Mã hóa dữ liệu đầu cuối",
                "Xác thực 2 yếu tố",
                "Cảnh báo xâm nhập",
            ],
        },
        {
            icon: <FiSmartphone className="text-pink-500" size={24} />,
            title: "Điều khiển từ xa",
            description: "Kiểm soát ngôi nhà từ bất cứ đâu",
            details: [
                "Ứng dụng di động",
                "Tương thích đa nền tảng",
                "Thông báo real-time",
            ],
        },
        {
            icon: <FiHome className="text-teal-500" size={24} />,
            title: "Tích hợp đa thiết bị",
            description: "Hỗ trợ hàng trăm thiết bị thông minh",
            details: [
                "Kết nối không dây",
                "Hỗ trợ nhiều giao thức",
                "Dễ dàng mở rộng",
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            {/* Hero Section */}
            <section className="py-20 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                        Tính Năng Nổi Bật
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        Khám phá những tính năng đột phá của hệ thống SmartHome
                        IoT
                    </p>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-4 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-400 transition-all"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 mb-4">
                                {feature.description}
                            </p>
                            <ul className="space-y-2">
                                {feature.details.map((detail, i) => (
                                    <li key={i} className="flex items-start">
                                        <span className="text-blue-400 mr-2">
                                            •
                                        </span>
                                        <span className="text-gray-300">
                                            {detail}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
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
                        Đăng ký ngay để nhận bản demo miễn phí và tư vấn từ
                        chuyên gia
                    </p>
                    <button
                        onClick={() => navigate("/signup")}
                        className="px-6 py-3 bg-blue-500 rounded-full font-semibold hover:bg-blue-600 transition-all"
                    >
                        Đăng ký ngay
                    </button>
                </motion.div>
            </section>
        </div>
    );
};

export default FeaturesPage;
