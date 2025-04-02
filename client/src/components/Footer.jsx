// import React from "react";
// import { FaGithub, FaFacebook, FaYoutube } from "react-icons/fa";

// function Footer() {
//     const currentYear = new Date().getFullYear();

//     return (
//         <footer className="bg-gray-800 text-white py-8 px-4 mt-12">
//             <div className="max-w-7xl mx-auto">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                     {/* Thông tin hệ thống */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">
//                             Smart Home System
//                         </h3>
//                         <p className="text-gray-400">
//                             Giải pháp quản lý nhà thông minh toàn diện, giúp
//                             kiểm soát và giám sát ngôi nhà từ xa.
//                         </p>
//                     </div>

//                     {/* Liên kết nhanh */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">Liên Kết</h3>
//                         <ul className="space-y-2">
//                             <li>
//                                 <a
//                                     href="#"
//                                     className="text-gray-400 hover:text-white"
//                                 >
//                                     Tài liệu
//                                 </a>
//                             </li>
//                             <li>
//                                 <a
//                                     href="#"
//                                     className="text-gray-400 hover:text-white"
//                                 >
//                                     API
//                                 </a>
//                             </li>
//                             <li>
//                                 <a
//                                     href="#"
//                                     className="text-gray-400 hover:text-white"
//                                 >
//                                     Hỗ trợ
//                                 </a>
//                             </li>
//                         </ul>
//                     </div>

//                     {/* Thông tin liên hệ */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
//                         <ul className="space-y-2 text-gray-400">
//                             <li>Email: contact@smarthome.com</li>
//                             <li>Điện thoại: (012) 345-6789</li>
//                             <li>Địa chỉ: 268 Lý Thường Kiệt, Q.10, TP.HCM</li>
//                         </ul>
//                     </div>

//                     {/* Mạng xã hội */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-4">Theo Dõi</h3>
//                         <div className="flex space-x-4">
//                             <a
//                                 href="https://github.com/transon15042003"
//                                 className="text-gray-400 hover:text-white"
//                             >
//                                 <FaGithub size={24} />
//                             </a>
//                             <a
//                                 href="https://www.facebook.com/transon15042003"
//                                 className="text-gray-400 hover:text-white"
//                             >
//                                 <FaFacebook size={24} />
//                             </a>
//                             <a
//                                 href="#"
//                                 className="text-gray-400 hover:text-white"
//                             >
//                                 <FaYoutube size={24} />
//                             </a>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Bản quyền */}
//                 <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
//                     <p>
//                         &copy; {currentYear} Smart Home System. Bảo lưu mọi
//                         quyền.
//                     </p>
//                     <p className="mt-2 text-sm">
//                         Phiên bản: 1.0.0 | Được phát triển bởi 2114672 - ĐH Bách
//                         Khoa
//                     </p>
//                 </div>
//             </div>
//         </footer>
//     );
// }

// export default Footer;

import React from "react";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { motion } from "framer-motion";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const links = [
        {
            title: "Giới thiệu",
            items: [
                { name: "Về chúng tôi", url: "/about" },
                { name: "Tính năng", url: "/features" },
            ],
        },
        {
            title: "Tài nguyên",
            items: [
                { name: "Tài liệu API", url: "/docs" },
                { name: "Hướng dẫn sử dụng", url: "/guides" },
                { name: "Câu hỏi thường gặp", url: "/faq" },
            ],
        },
        {
            title: "Pháp lý",
            items: [
                { name: "Điều khoản sử dụng", url: "/terms" },
                { name: "Chính sách bảo mật", url: "/privacy" },
                { name: "Chính sách cookie", url: "/cookies" },
            ],
        },
    ];

    const socialLinks = [
        {
            icon: <FaGithub size={20} />,
            url: "https://github.com/transon15042003",
        },
        {
            icon: <FaLinkedin size={20} />,
            url: "https://www.linkedin.com/in/transon15042003/",
        },
        {
            icon: <FaFacebook size={20} />,
            url: "https://facebook.com/transon15042003/",
        },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo và mô tả */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                            SmartHome IoT
                        </h2>
                        <p className="text-sm">
                            Giải pháp nhà thông minh tiên tiến với công nghệ
                            IoT, giúp bạn kiểm soát ngôi nhà từ bất cứ đâu.
                        </p>

                        {/* Newsletter */}
                        <div className="pt-4">
                            <h3 className="text-sm font-semibold mb-2">
                                ĐĂNG KÝ NHẬN TIN
                            </h3>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="px-3 py-2 bg-gray-800 text-sm rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md text-sm font-medium transition-colors">
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Các link */}
                    {links.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                        <a
                                            href={item.url}
                                            className="text-sm hover:text-blue-400 transition-colors"
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Liên hệ */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider">
                            Liên hệ
                        </h3>
                        <address className="not-italic text-sm space-y-2">
                            <p>Đại học Bách Khoa TPHCM</p>
                            <p>VRJ4+65C, Đông Hoà, Dĩ An, Bình Dương</p>
                            <div className="flex items-center space-x-2 pt-2">
                                <IoMdMail className="text-blue-400" />
                                <a
                                    href="mailto:transon15042003@gmail.com"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    transon15042003@gmail.com
                                </a>
                            </div>
                        </address>

                        {/* Mạng xã hội */}
                        <div className="pt-2">
                            <h3 className="text-sm font-semibold mb-2">
                                THEO DÕI CHÚNG TÔI
                            </h3>
                            <div className="flex space-x-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -2 }}
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-gray-500">
                        © {currentYear} SmartHome IoT. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a
                            href="/terms"
                            className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                        >
                            Điều khoản sử dụng
                        </a>
                        <a
                            href="/privacy"
                            className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                        >
                            Chính sách bảo mật
                        </a>
                        <a
                            href="/cookies"
                            className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                        >
                            Chính sách cookie
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
