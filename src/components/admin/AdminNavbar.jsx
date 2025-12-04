import React from 'react';
import { FiUsers, FiCheckSquare, FiBarChart2, FiTag, FiLogOut, FiX } from 'react-icons/fi';

function AdminNavbar({ activeTab, setActiveTab, isOpen, onClose }) {
    const navItems = [
        { id: 'accounts', name: 'Tài khoản', icon: FiUsers },
        { id: 'approvals', name: 'Phê duyệt', icon: FiCheckSquare },
        { id: 'revenue', name: 'Doanh thu', icon: FiBarChart2 },
        { id: 'vouchers', name: 'Mã giảm giá', icon: FiTag },
        { id: 'logout', name: "Đăng xuất", icon: FiLogOut },
    ];

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>
            )}
            <nav className={`bg-blue-500 w-64 min-h-screen px-4 py-6 fixed md:static z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-white text-2xl font-semibold">HTQ eCommerce Admin Dashboard</h1>
                    <button onClick={onClose} className="text-white md:hidden">
                        <FiX size={24} />
                    </button>
                </div>
                <ul>
                    {navItems.map((item) => (
                        <li key={item.id} className="mb-4">
                            <button
                                onClick={() => {
                                    setActiveTab(item.id);
                                    onClose();
                                }}
                                className={`flex items-center w-full px-4 py-2 rounded transition-colors duration-200 ${
                                    activeTab === item.id
                                        ? 'bg-gray-700 text-white'
                                        : 'text-white-700 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <item.icon className="mr-3" />
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}

export default AdminNavbar;