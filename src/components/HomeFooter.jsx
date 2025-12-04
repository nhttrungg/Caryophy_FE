import React from 'react';
import { FaFacebookF, FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

const HomeFooter = () => {
    return (
        <footer className="bg-[#0b328f] text-white py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Thông tin liên hệ */}
                    <div className="space-y-2">
                        <p className="font-semibold text-lg">HTQ eCommerce</p>
                        <p>Địa chỉ: 123 Đường ABC, Quận XYZ, Hà Nội, Việt Nam</p>
                        <p>Email: support@htqecommerce.com</p>
                        <p>Điện thoại: (84-24)12345678</p>
                        <p>Hotline: 1900 1234</p>
                        <div className="flex justify-center md:justify-start space-x-4 mt-3">
                            <a href="#" className="text-white hover:text-gray-300">
                                <FaFacebookF className="fa-lg"/>
                            </a>
                            <a href="#" className="text-white hover:text-gray-300">
                                <FaYoutube className="fa-lg"/>
                            </a>
                            <a href="#" className="text-white hover:text-gray-300">
                                <FaInstagram className="fa-lg"/>
                            </a>
                            <a href="#" className="text-white hover:text-gray-300">
                                <FaTwitter className="fa-lg"/>
                            </a>
                            <a href="#" className="text-white hover:text-gray-300">
                                <SiZalo className="fa-lg"/>
                            </a>
                        </div>
                    </div>
                    {/* Danh mục sản phẩm */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg mb-3">Danh mục sản phẩm</h3>
                        <ul>
                            <li><a href="#" className="hover:underline">Điện thoại</a></li>
                            <li><a href="#" className="hover:underline">Laptop</a></li>
                            <li><a href="#" className="hover:underline">Máy tính bảng</a></li>
                            <li><a href="#" className="hover:underline">Phụ kiện</a></li>
                            <li><a href="#" className="hover:underline">Đồng hồ thông minh</a></li>
                        </ul>
                    </div>
                    {/* Hỗ trợ khách hàng */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg mb-3">Hỗ trợ khách hàng</h3>
                        <ul>
                            <li><a href="#" className="hover:underline">Hướng dẫn mua hàng</a></li>
                            <li><a href="#" className="hover:underline">Chính sách đổi trả</a></li>
                            <li><a href="#" className="hover:underline">Chính sách bảo hành</a></li>
                            <li><a href="#" className="hover:underline">Phương thức thanh toán</a></li>
                            <li><a href="#" className="hover:underline">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>
                </div>
                {/* Thống kê */}
                <div className="text-center mt-8">
                    <p>Số lượng sản phẩm: 10,000+ | Khách hàng: 1,000,000+ | Đơn hàng hôm nay: 5,000+</p>
                </div>
                {/* Copyright */}
                <div className="text-center mt-8">
                    <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} HTQ eCommerce. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;