import React, {useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FaBars, FaShoppingCart} from 'react-icons/fa';
import {useSelector} from "react-redux";

const HomeHeader = () => {
    const navigate = useNavigate();

    const handleCartClick = () => {
        navigate('/cart');
    };

    const [dropDownBar, setDropdownBar] = useState(false);
    return (
        <header className="bg-[#0b328f] text-white sticky top-0 z-50 shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <a href="/home" className="flex items-center space-x-2">
                        <span className="text-lg sm:text-2xl">HTQ eCommerce</span>
                    </a>
                    <nav className="hidden md:block">
                        <ul className="flex space-x-4 lg:space-x-6">
                            <li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">Trang chủ</a></li>
                            <li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">Danh mục</a></li>
                            <li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">BestSeller</a></li>
                            <li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">Dịch vụ</a></li>
                            <li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">Giới thiệu</a></li>
                            <li>
                                <Link to="/login" className="border-2 border-[#ffce46] bg-[#f2a429] hover:bg-[#ffce46] hover:text-white transition-colors text-sm lg:text-base rounded-full px-4 py-2">
                                    Đăng Nhập
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleCartClick}
                                        className="text-white hover:text-[#f2a429] transition-colors">
                                    <FaShoppingCart className="h-6 w-6"/>
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <button className="md:hidden bg-transparent border-none text-white">
                        <FaBars className="h-6 w-6" onClick={()=>setDropdownBar(!dropDownBar)}/>
                        {
                            <div>

                            </div>
                        }
                    </button>
                </div>
            </div>
        </header>
    );
};

export default HomeHeader;