import React, {useState, useEffect, useRef} from 'react';
import { FiCheckCircle, FiXCircle, FiEye, FiMoreVertical } from 'react-icons/fi';
import { convertTimestampToReadableFormat } from '../../utils/DateUtil';
import axiosSupport from "../../services/axiosSupport";
import useAxiosSupport from "../../hooks/useAxiosSupport";

function ApprovalManagement() {
    const axiosSupport = useAxiosSupport();
    const [activeTab, setActiveTab] = useState('ĐANG CHỜ');
    const [approvals, setApprovals] = useState([]);
    const [activeToolbox, setActiveToolbox] = useState(null);
    const [toolboxPosition, setToolboxPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    useEffect(() => {
        const fetchApprovals = async () => {
            const res = await axiosSupport.getAllMerchantForm();
            setApprovals([...res]);
        };
        fetchApprovals();
    }, []);

    const filteredApprovals = approvals.filter(approval => approval.status === activeTab);

    const handleApprove = async (id) => {
        const status = approvals.find(a => a.id === id).formStatus;
        await axiosSupport.approvalForm({
            id: id,
            formStatus: status
        })
    };

    const handleReject = async (id) => {
        const status= approvals.find(a => a.id === id).formStatus;
        await axiosSupport.rejectForm({
            id: id,
            formStatus: status
        })
    };

    const handleViewDocuments = (id) => {
        // Thực hiện logic xem tài liệu
        console.log(`Đang xem tài liệu cho biểu mẫu có id: ${id}`);
    };


    const toggleToolbox = (id) => {
        if (activeToolbox === id) {
            setActiveToolbox(null);
        } else {
            setActiveToolbox(id);
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setToolboxPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.right - 150 + window.scrollX,
                });
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Phê duyệt</h2>
            <div className="mb-6 flex space-x-4">
                {['ĐANG CHỜ', 'ĐÃ DUYỆT', 'ĐÃ TỪ CHỐI'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setActiveTab(status)}
                        className={`px-6 py-3 rounded-full transition-all duration-200 ${
                            activeTab === status
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người bán</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại biểu mẫu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái hiện tại</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái yêu cầu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApprovals.map((approval) => (
                        <tr key={approval.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">{approval.merchant.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{approval.formType}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{approval.currentStatus}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{approval.requestedStatus}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{convertTimestampToReadableFormat(approval.submissionDate)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    ref={buttonRef}
                                    onClick={() => toggleToolbox(approval.id)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FiMoreVertical size={20}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {activeToolbox && (
                <>
                    <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setActiveToolbox(null)}></div>
                    <div
                        className="fixed w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                        style={{
                            top: `${toolboxPosition.top}px`,
                            left: `${toolboxPosition.left}px`,
                        }}
                    >
                        <div className="py-1">
                            <button
                                onClick={() => handleApprove(activeToolbox)}
                                className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 transition duration-150 ease-in-out"
                            >
                                <FiCheckCircle className="mr-2" /> Phê duyệt
                            </button>
                            <button
                                onClick={() => handleReject(activeToolbox)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition duration-150 ease-in-out"
                            >
                                <FiXCircle className="mr-2" /> Từ chối
                            </button>
                            <button
                                onClick={() => handleViewDocuments(activeToolbox)}
                                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 transition duration-150 ease-in-out"
                            >
                                <FiEye className="mr-2" /> Xem tài liệu
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ApprovalManagement;