import React from "react";
import { FaGithub, FaFacebook, FaYoutube } from "react-icons/fa";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white py-8 px-4 mt-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Thông tin hệ thống */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Smart Home System
                        </h3>
                        <p className="text-gray-400">
                            Giải pháp quản lý nhà thông minh toàn diện, giúp
                            kiểm soát và giám sát ngôi nhà từ xa.
                        </p>
                    </div>

                    {/* Liên kết nhanh */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liên Kết</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Tài liệu
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    API
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Hỗ trợ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: contact@smarthome.com</li>
                            <li>Điện thoại: (012) 345-6789</li>
                            <li>Địa chỉ: 268 Lý Thường Kiệt, Q.10, TP.HCM</li>
                        </ul>
                    </div>

                    {/* Mạng xã hội */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Theo Dõi</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/transon15042003"
                                className="text-gray-400 hover:text-white"
                            >
                                <FaGithub size={24} />
                            </a>
                            <a
                                href="https://www.facebook.com/transon15042003"
                                className="text-gray-400 hover:text-white"
                            >
                                <FaFacebook size={24} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                <FaYoutube size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bản quyền */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                    <p>
                        &copy; {currentYear} Smart Home System. Bảo lưu mọi
                        quyền.
                    </p>
                    <p className="mt-2 text-sm">
                        Phiên bản: 1.0.0 | Được phát triển bởi 2114672 - ĐH Bách
                        Khoa
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
