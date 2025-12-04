import React, {useEffect, useState} from 'react';
import {FiUser, FiUsers, FiShoppingBag, FiToggleLeft, FiEdit, FiPlus, FiSearch, FiMenu} from 'react-icons/fi';
import EditAccountModal from "../EditAccountModal";
import useAxiosSupport from "../../hooks/useAxiosSupport";
import AddAccountModal from "../AddAccountModal";

export default function AccountManagement() {
    const [activeAccountType, setActiveAccountType] = useState('user');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isToolboxOpen, setIsToolboxOpen] = useState(false);
    const [accounts, setAccounts] = useState({
        user: [],
        merchant: [],
        admin: []
    });

    const axiosSupport = useAxiosSupport();

    const accountTypes = [
        { id: 'user', name: 'Tài khoản người dùng', icon: FiUser },
        { id: 'merchant', name: 'Tài khoản người bán', icon: FiShoppingBag },
        { id: 'admin', name: 'Tài khoản quản lí', icon: FiUsers },
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const allUsers = await axiosSupport.getAllUser();

            const categorizedAccounts = {
                user: [],
                merchant: [],
                admin: []
            };

            allUsers.forEach(user => {
                console.log(user)
                if (user.roles[0].name.includes('ROLE_ADMIN')) {
                    categorizedAccounts.admin.push(user);
                } else if (user.roles[0].name.includes('ROLE_MERCHANT')) {
                    categorizedAccounts.merchant.push(user);
                } else {
                    categorizedAccounts.user.push(user);
                }
            });

            setAccounts(categorizedAccounts);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    const handleAccountClick = (account) => {
        setSelectedAccount(account);
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEdit = () => {
        if (selectedAccount) {
            setIsEditModalOpen(true);
        }
    };

    const handleSaveEdit = (editedAccount) => {
        setAccounts(prevAccounts => ({
            ...prevAccounts,
            [activeAccountType]: prevAccounts[activeAccountType].map(account =>
                account.id === editedAccount.id ? editedAccount : account
            )
        }));
        setSelectedAccount(editedAccount);
    };

    const handleDisable = () => {
        if (selectedAccount) {
            setAccounts(prevAccounts => ({
                ...prevAccounts,
                [activeAccountType]: prevAccounts[activeAccountType].map(account =>
                    account.id === selectedAccount.id ? {...account, enabled: !account.enabled} : account
                )
            }));
            setSelectedAccount(prev => ({...prev, enabled: !prev.enabled}));
        }
    };

    const handleAddNewAccount = (newAccount) => {

        setAccounts(prevAccounts => ({
            ...prevAccounts,
            admin: [...prevAccounts.admin, { ...newAccount, id: Date.now(), enabled: true }]
        }));
    };

    return (
        <div className="relative">
            <h2 className="text-2xl font-semibold mb-4">Quản lý tài khoản</h2>
            <div className="mb-4">
                {/* Dropdown cho màn hình nhỏ */}
                <select
                    value={activeAccountType}
                    onChange={(e) => setActiveAccountType(e.target.value)}
                    className="w-full p-2 border rounded-lg md:hidden"
                >
                    {accountTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>

                {/* Buttons cho màn hình lớn hơn */}
                <div className="hidden md:flex md:flex-wrap md:space-x-2 md:space-y-0">
                    {accountTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActiveAccountType(type.id)}
                            className={`flex items-center px-4 py-2 rounded ${
                                activeAccountType === type.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            <type.icon className="mr-2"/>
                            {type.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* Bảng tài khoản */}
                <div className="flex-grow overflow-x-auto">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên
                                    đăng nhập
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số
                                    điện thoại
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ
                                    tên
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng
                                    thái
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {accounts[activeAccountType]
                                .filter(account =>
                                    account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    account.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((account) => (
                                    <tr
                                        key={account.id}
                                        onClick={() => handleAccountClick(account)}
                                        className={`cursor-pointer ${selectedAccount?.id === account.id ? 'bg-blue-100' : ''}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">{account.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{account.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{account.phoneNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{account.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {account.enabled ? 'Hoạt động' : 'Vô hiệu hóa'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Toolbox */}
                <div className="md:w-64">
                    <button
                        className="md:hidden w-full bg-blue-500 text-white px-4 py-2 rounded-lg mb-2"
                        onClick={() => setIsToolboxOpen(!isToolboxOpen)}
                    >
                        <FiMenu className="inline-block mr-2"/> Công cụ
                    </button>
                    <div className={`bg-white shadow rounded-lg p-4 ${isToolboxOpen ? 'block' : 'hidden md:block'}`}>
                        <h3 className="text-lg font-semibold mb-4">Công cụ</h3>
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tài khoản..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                            </div>
                            <button
                                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                                onClick={() => {
                                    activeAccountType === 'admin' && setIsAddModalOpen(true)
                                }}
                            >
                                <FiPlus className="mr-2"/> Thêm
                            </button>
                            <button
                                className={`w-full ${selectedAccount ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'} text-white px-4 py-2 rounded-lg flex items-center justify-center`}
                                onClick={handleEdit}
                                disabled={!selectedAccount}
                            >
                                <FiEdit className="mr-2"/> Sửa
                            </button>
                            <button
                                className={`w-full ${
                                    selectedAccount
                                        ? selectedAccount.enabled
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-green-500 hover:bg-green-600'
                                        : 'bg-gray-300 cursor-not-allowed'
                                } text-white px-4 py-2 rounded-lg flex items-center justify-center`}
                                onClick={handleDisable}
                                disabled={!selectedAccount}
                            >
                                <FiToggleLeft className="mr-2"/>
                                {selectedAccount?.enabled ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <EditAccountModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                account={selectedAccount}
                onSave={handleSaveEdit}
            />
            <AddAccountModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddNewAccount}
            />
        </div>
    );
}