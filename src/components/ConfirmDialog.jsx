import React from 'react';
import Modal from './Modal'; // Giả sử bạn đã có một modal component

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                <h2 className="text-lg font-semibold">Xác nhận</h2>
                <p className="mt-2">{message}</p>
                <div className="mt-4 flex justify-end">
                    <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Hủy</button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>Xóa</button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;