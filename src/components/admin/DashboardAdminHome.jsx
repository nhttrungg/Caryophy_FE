import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import AccountManagement from './AccountManagement';
import ApprovalManagement from './ApprovalManagement';
import RevenueAnalytics from './RevenueAnalytics';
import { useNavigate } from "react-router-dom";
import VoucherAdminDashboard from "./VoucherAdminDashboard";
import { FiMenu } from 'react-icons/fi'; // Import icon menu

export default function DashboardAdminHome() {
    const [activeTab, setActiveTab] = useState('accounts');
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminNavbar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                isOpen={isNavbarOpen}
                onClose={() => setIsNavbarOpen(false)}
            />
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-md p-4 md:hidden">
                    <button onClick={toggleNavbar} className="text-gray-500 focus:outline-none">
                        <FiMenu size={24} />
                    </button>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        {activeTab === 'accounts' && <AccountManagement />}
                        {activeTab === 'approvals' && <ApprovalManagement />}
                        {activeTab === 'revenue' && <RevenueAnalytics />}
                        {activeTab === 'vouchers' && <VoucherAdminDashboard/>}
                        {activeTab === 'logout' && navigate('/login')}
                    </div>
                </main>
            </div>
        </div>
    );
}