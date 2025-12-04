import React, { useState } from 'react';
import AddressRow from './AddressRow';
import { FaPlus, FaTimes } from 'react-icons/fa';

const AddressModal = ({ addresses, onClose, onSelectAddress, onAddNewAddress }) => {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newAddress, setNewAddress] = useState({ address: '', province: '', district: '', ward: '' });
    const [selectedAddressId, setSelectedAddressId] = useState(addresses.find(address => address.isDefault)?.id);

    const handleAddNewAddress = () => {
        onAddNewAddress(newAddress);
        setIsAddingNew(false);
        setNewAddress({ address: '', district: '', province: '', ward: '' });
    };

    const handleSelectAddress = () => {
        const selectedAddress = addresses.find(address => address.id === selectedAddressId);
        if (selectedAddress) {
            onSelectAddress(selectedAddress);
        }
        onClose();
    };
    console.log(addresses)
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center px-4" id="my-modal">
            <div className="relative w-full max-w-md p-6 border shadow-lg rounded-lg bg-white">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Chọn địa chỉ</h3>
                <div className="max-h-[60vh] overflow-y-auto">
                    {addresses.map((address) => (
                        <div key={address.id} className="flex items-center space-x-3 p-3 border rounded-lg mb-2">
                            <input
                                type="checkbox"
                                id={`address-${address.id}`}
                                checked={selectedAddressId === address.id}
                                // defaultChecked={address.isDefault}
                                onChange={() => setSelectedAddressId(address.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                                <p className="font-medium">{address.address || address.detail}</p>
                                <p className="text-sm text-gray-600">{`${address.ward}, ${address.district}, ${address.province}`}</p>
                            </label>
                        </div>
                    ))}
                </div>
                {isAddingNew ? (
                    <div className="mt-4">
                        <AddressRow
                            address={newAddress.address}
                            district={newAddress.district}
                            province={newAddress.province}
                            ward={newAddress.ward}
                            setFieldValue={(field, value) => setNewAddress(prev => ({ ...prev, [field]: value }))}
                        />
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={handleAddNewAddress}
                                className="flex-1 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-150 ease-in-out"
                            >
                                Lưu địa chỉ mới
                            </button>
                            <button
                                onClick={() => setIsAddingNew(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="mt-4 w-full flex items-center justify-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
                    >
                        <FaPlus className="mr-2" />
                        Thêm địa chỉ mới
                    </button>
                )}
                <button
                    onClick={handleSelectAddress}
                    disabled={!selectedAddressId}
                    className={`mt-4 w-full p-2 rounded-md ${
                        selectedAddressId
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition duration-150 ease-in-out`}
                >
                    Xác nhận địa chỉ
                </button>
            </div>
        </div>
    );
};

export default AddressModal;