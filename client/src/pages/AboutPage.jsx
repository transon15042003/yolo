import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiCode, FiServer, FiGlobe } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
    useEffect(() => {
        document.title = "About Us - Smart Home IoT Platform";
    }, []);

    const navigate = useNavigate();

    const stats = [
        { icon: <FiUsers size={24} />, value: "1000+", label: "Người dùng" },
        // { icon: <FiCode size={24} />, value: "50K+", label: "Dòng code" },
        { icon: <FiServer size={24} />, value: "24/7", label: "Hoạt động" },
        { icon: <FiGlobe size={24} />, value: "10+", label: "Quốc gia" },
    ];

    const team = [
        {
            name: "Nguyễn Văn A",
            role: "IoT",
            bio: "IoT",
        },
        {
            name: "Trần Thị B",
            role: "Full-stack Developer",
            bio: "Full-stack",
        },
        {
            name: "Ank Linh",
            role: "UI/UX Designer",
            bio: "Siêu trí tuệ Việt Nam",
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
                        Về Chúng Tôi
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        Giải pháp nhà thông minh tiên tiến với công nghệ IoT đột
                        phá
                    </p>
                </motion.div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 max-w-6xl mx-auto">
                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
                    <h2 className="text-3xl font-bold mb-6 text-center">
                        Sứ Mệnh Của Chúng Tôi
                    </h2>
                    <p className="text-lg text-gray-300 mb-8 text-center">
                        "Mang lại giải pháp nhà thông minh dễ sử dụng, an toàn
                        và tiết kiệm năng lượng cho mọi gia đình Việt"
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gray-800 p-6 rounded-lg text-center"
                            >
                                <div className="text-blue-400 mb-2">
                                    {stat.icon}
                                </div>
                                <p className="text-2xl font-bold">
                                    {stat.value}
                                </p>
                                <p className="text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-4 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center">
                    Đội Ngũ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center"
                        >
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-teal-400"></div>
                            <h3 className="text-xl font-semibold">
                                {member.name}
                            </h3>
                            <p className="text-blue-400 mb-2">{member.role}</p>
                            <p className="text-gray-400">{member.bio}</p>
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
                        Bạn muốn trở thành đối tác?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Liên hệ với chúng tôi để cùng phát triển hệ sinh thái
                        nhà thông minh
                    </p>
                    <button
                        onClick={() => navigate("/contact")}
                        className="px-6 py-3 bg-blue-500 rounded-full font-semibold hover:bg-blue-600 transition-all"
                    >
                        Liên hệ ngay
                    </button>
                </motion.div>
            </section>
        </div>
    );
};

export default AboutPage;
