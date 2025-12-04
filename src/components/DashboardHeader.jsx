import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Menu } from 'lucide-react';
import {useDispatch} from "react-redux";
import {logout} from "../redux/reducers/userReducer";

export default function DashboardHeader({ currentUser, onLogout, onMenuClick }) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuRef]);

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            // Dispatch action để xóa dữ liệu user trong Redux store
            dispatch(logout());

            // Chuyển hướng về trang home
            navigate('/home');
        } catch (error) {
            console.error('Logout failed:', error);
            // Xử lý lỗi nếu cần
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30">
            <div className="flex items-center">
                <button onClick={onMenuClick} className="mr-4">
                    <Menu className="h-6 w-6" />
                </button>
                <Link to="/dashboard/home" className="text-xl font-semibold text-gray-900 mr-8">HTQ eCommerce</Link>

                <nav className="hidden md:flex space-x-4">
                    <Link to="/dashboard/home" className="text-sm font-medium text-gray-500 hover:text-gray-700">Trang chủ</Link>
                    <Link to="/dashboard/order" className="text-sm font-medium text-gray-500 hover:text-gray-700">Đơn hàng</Link>
                    <Link to="/dashboard/product" className="text-sm font-medium text-gray-500 hover:text-gray-700">Sản phẩm</Link>
                    <Link to="/dashboard/shopsection" className="text-sm font-medium text-gray-500 hover:text-gray-700">Danh mục</Link>
                    <Link to="/dashboard/coupons" className="text-sm font-medium text-gray-500 hover:text-gray-700">Phiếu giảm giá</Link>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="bg-gray-100 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                    <Bell className="h-5 w-5" />
                </button>
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={toggleUserMenu}
                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                    >
                        <User className="h-5 w-5" />
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <p className="px-4 py-2 text-sm text-gray-700">{currentUser?.email || 'admin@example.com'}</p>
                            <Link to="/dashboard/merchant/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                            <Link to="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
