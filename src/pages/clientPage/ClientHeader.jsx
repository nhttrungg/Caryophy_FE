import React, { useState, useRef, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import useAxiosSupport from "../../hooks/useAxiosSupport";
import {FaHeart, FaShoppingCart} from "react-icons/fa";
import {logout} from "../../redux/reducers/userReducer";
import {useDispatch} from "react-redux";
import {Fan, FileText, FolderKanban, HelpCircle, Home, LogOut, Pointer, User, Users, X} from "lucide-react";

export default function ClientHeader({ currentUser, onMenuClick }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user,setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const userMenuRef = useRef(null);
  const axiosSupport = useAxiosSupport();
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { to: '/client/home', label: 'Trang chủ', icon: Home },
    { to: '/client/products', label: 'Sản phẩm', icon: FileText },
    { to: '/dashboard/bestseller', label: "Bestseller", icon: Pointer },
    { to: '/dashboard/bestseller', label: "Dịch vụ", icon:  Fan},
    { to: '/client/user/profile', label: "Người dùng", icon: User},
    { to: '/login', label: "Đăng xuất", icon: LogOut},
  ];
  useEffect(() => {
    const fetchUser = async () => {
      const updatedUser = await axiosSupport.getUserById(currentUser);
      setCurrentUser(updatedUser);
    };
    if(currentUser){
      fetchUser();
    }
  }, []);

  const handleCartClick = () => {
    navigate('/client/cart');
  };

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

  const onLogout = async () => {
    try {
      navigate('/home');
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderNavItem = (item) => {
    const Icon = item.icon;
    return (
        <Link
            key={item.to}
            to={item.to}
            className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                path === item.to ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setSidebarOpen(false)}
        >
          <Icon className="h-5 w-5" />
          <span className="ml-3 text-sm font-medium">{item.label}</span>
        </Link>
    );
  };

  return (
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4">
            <FiMenu className="h-6 w-6" />
            {
                sidebarOpen && <>
                  {sidebarOpen && (
                      <div
                          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
                          onClick={() => setSidebarOpen(false)}
                      ></div>
                  )}
                  <div className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
                      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  }`}>
                    <div className="flex justify-between items-center p-4">
                      <h2 className="text-xl font-semibold">Menu</h2>
                      <button onClick={() => setSidebarOpen(false)}>
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                      {navItems.map(renderNavItem)}
                    </nav>
                    <Link
                        to="/help"
                        className="flex items-center py-2 px-4 rounded-md m-2 bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors duration-200"
                        onClick={() => setSidebarOpen(false)}
                    >
                      <HelpCircle className="h-5 w-5 mr-3" />
                      <span className="text-sm font-medium">Trợ giúp</span>
                    </Link>
                  </div>
                </>
            }
          </button>
          <Link to="/client" className="text-xl font-semibold text-gray-900 mr-8">HTQ eCommerce</Link>
          <div className="flex space-x-4">
            <nav className="hidden md:block">
              <ul className="flex space-x-4 lg:space-x-6">
                <li><a href="/client/products" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">Sản phẩm</a></li>
                <li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">BestSeller</a>
                </li><li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">Dịch vụ</a></li>
                <li><a href="#" className="hover:text-[#f2a429] transition-colors text-sm lg:text-base">Giới thiệu</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <div className="relative">
              <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-gray-100 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <FiBell className="h-5 w-5"/>
          </button>

          <button onClick={handleCartClick} className="text-gray hover:text-[#f2a429] transition-colors">
            <FaShoppingCart className="h-6 w-6"/>
          </button>
          <button onClick={()=>{navigate('/client/wishlist')}} className="text-gray hover:text-[#f2a429] transition-colors">
            <FaHeart className="h-6 w-6"/>
          </button>
          <div className="relative" ref={userMenuRef}>
            <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <FiUser className="h-5 w-5"/>
            </button>
            {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <p className="px-4 py-2 text-sm text-gray-700">{currentUser?.email || 'user@example.com'}</p>
                  <Link to="/client/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hồ
                    sơ</Link>
                  <Link to="/client/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cài
                    đặt</Link>
                  <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FiLogOut className="h-4 w-4 mr-2"/>
                    Đăng xuất
                  </button>
                </div>
            )}
          </div>
        </div>
      </header>
  );
}
