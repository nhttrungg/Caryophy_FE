import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function AddAccountModal({ isOpen, onClose, onAdd }) {
    const [newAccount, setNewAccount] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        name: '',
        password: '',
    });

    const handleChange = (e) => {
        setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(newAccount);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Thêm tài khoản mới</h3>
                    <form onSubmit={handleSubmit} className="mt-2">
                        <input
                            type="text"
                            name="username"
                            value={newAccount.username}
                            onChange={handleChange}
                            placeholder="Tên đăng nhập"
                            className="mt-2 p-2 w-full border rounded"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={newAccount.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="mt-2 p-2 w-full border rounded"
                            required
                        />
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={newAccount.phoneNumber}
                            onChange={handleChange}
                            placeholder="Số điện thoại"
                            className="mt-2 p-2 w-full border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="name"
                            value={newAccount.name}
                            onChange={handleChange}
                            placeholder="Họ tên"
                            className="mt-2 p-2 w-full border rounded"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={newAccount.password}
                            onChange={handleChange}
                            placeholder="Mật khẩu"
                            className="mt-2 p-2 w-full border rounded"
                            required
                        />
                        <div className="items-center px-4 py-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                Thêm tài khoản
                            </button>
                        </div>
                    </form>
                </div>
                <button onClick={onClose} className="absolute top-0 right-0 mt-4 mr-4">
                    <FiX className="text-gray-500 hover:text-gray-700" />
                </button>
            </div>
        </div>
    );
}