import React, { useEffect, useState } from 'react';
import {
    FiEdit,
    FiSave,
    FiTrash,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiPlus,
    FiMinus,
    FiArrowLeft, FiArrowRight, FiImage
} from 'react-icons/fi';
import useAxiosSupport from "../hooks/useAxiosSupport";
import { useTransition, animated } from 'react-spring';
import Modal from "./Modal";
import default_image from '../assets/images/default-image.svg';


const ProductDetailAdmin = ({ product, onEdit, onDelete }) => {
    const axiosSupport = useAxiosSupport();
    const [variants, setVariants] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedVariants, setEditedVariants] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [groupOptions,setGroupOptions] = useState(product?.groupOptions || []);


    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const response = await axiosSupport.getVariantByProductId(product.id);
                setVariants(response);
                setEditedVariants(response);
            } catch (error) {
                console.error('Error fetching variants:', error);
            }
        };
        fetchVariants();
    }, [groupOptions]);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % (product.image ? product.image.length : 1)
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + (product.image ? product.image.length : 1)) % (product.image ? product.image.length : 1)
        );
    };

    const transitions = useTransition(currentImageIndex, {
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        onEdit(product.id, editedVariants);
        setIsEditing(false);
        await axiosSupport.updateVariants(editedVariants,product.id);
    };

    const handleCancelClick = () => {
        setEditedVariants(variants);
        setIsEditing(false);
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...editedVariants];
        newVariants[index][field] = value;
        setEditedVariants(newVariants);
    };

    const [isAddingGroupOption, setIsAddingGroupOption] = useState(false);
    const [newGroupOption, setNewGroupOption] = useState({ name: '', options: [{ name: '' }] });
    const addOption = () => {
        setNewGroupOption(prev => ({
            ...prev,
            options: [...prev.options, '']
        }));
    };

    const removeOption = (index) => {
        setNewGroupOption(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };
    const handleOptionChange = (index, value) => {
        setNewGroupOption(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => i === index ? { ...opt, name: value } : opt)
        }));
    };
    
    const [editingGroupOptionIndex, setEditingGroupOptionIndex] = useState(null);

    const startEditingGroupOption = (index) => {
        setEditingGroupOptionIndex(index);
        setNewGroupOption(groupOptions[index]);
        setIsAddingGroupOption(true);
    };

    const saveGroupOption = () => {

        const existingIndex = groupOptions.findIndex(groupOption => groupOption.name === newGroupOption.name);

        let updatedGroupOptions;
        if (existingIndex !== -1) {
            updatedGroupOptions = [...groupOptions];
            updatedGroupOptions[existingIndex] = newGroupOption;
        } else {
            // Nếu chưa tồn tại, thêm mới
            updatedGroupOptions = [...groupOptions, newGroupOption];
        }
        setIsAddingGroupOption(false);
        setNewGroupOption({ name: '', options: [''] });
        setGroupOptions(updatedGroupOptions);
        axiosSupport.saveVariants(product.id, updatedGroupOptions);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const variantsPerPage = 6;

    // Calculate the current variants to display
    const indexOfLastVariant = currentPage * variantsPerPage;
    const indexOfFirstVariant = indexOfLastVariant - variantsPerPage;
    const currentVariants = editedVariants.slice(indexOfFirstVariant, indexOfLastVariant);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            // Xử lý file ở đây, ví dụ: tải lên server hoặc cập nhật state
            const reader = new FileReader();
            reader.onload = (e) => {
                const newVariants = [...editedVariants];
                newVariants[index].image = { path: e.target.result };
                setEditedVariants(newVariants);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = (index) => {
        const newVariants = [...editedVariants];
        newVariants[index].image = null;
        setEditedVariants(newVariants);
    };


    return (
        <div className={`bg-white ${editedVariants.length === 1 ? '' : 'rounded-lg shadow-md'} overflow-hidden mb-4`}>
            <div className={`flex flex-col ${editedVariants.length === 1 ? 'items-center bg-gray-50' : 'md:flex-row md:w-full '}`}>
                <div className={`w-full ${editedVariants.length === 1 ? 'max-w-2xl bg-white rounded-lg shadow-md' : 'md:w-1/2'} p-4`}>
                    <div>
                        <div>
                            {isEditing ?
                                <button
                                    onClick={() => handleSaveClick()}
                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                >
                                    <FiSave size={20}/>
                                </button> :
                                <>
                                    <button
                                        onClick={() => handleEditClick()}
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        <FiEdit size={20}/>
                                    </button>
                                    <button
                                        onClick={() => onDelete(product.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FiTrash size={20}/>
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:w-full">
                        <div className="w-full md:w-1/2 p-4">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                            </div>
                            <div className="relative w-full h-[33vh] mb-4">
                                <div className="absolute inset-0 w-full h-full">
                                {product.image && product.image.length > 0 ? (
                                        <>
                                            {transitions((style, index) => (
                                                <animated.img
                                                    style={style}
                                                    src={product.image[index % product.image.length].path}
                                                    alt={`${product.name} - ${index + 1}`}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ))}
                                            {product.image.length > 1 && (
                                                <>
                                                    <button
                                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
                                                        onClick={prevImage}
                                                    >
                                                        <FiChevronLeft size={24}/>
                                                    </button>
                                                    <button
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
                                                        onClick={nextImage}
                                                    >
                                                        <FiChevronRight size={24}/>
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                                            <FiImage size={48} className="text-gray-400"/>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 p-4">
                            <h4 className="text-lg font-semibold mb-4">Phân loại</h4>
                            {
                                groupOptions.length < 3 &&
                                <button
                                    onClick={() => setIsAddingGroupOption(true)}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
                                >
                                    <FiPlus className="mr-2"/> Thêm phân loại
                                </button>
                            }
                            <div className='mt-1'>
                                {groupOptions && groupOptions.map((group, index) => (
                                    <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <h5 className="font-medium text-gray-700">{group.name}</h5>
                                            <button
                                                onClick={() => startEditingGroupOption(index)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <FiEdit size={16}/>
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {group.options.map((option) => (
                                                <span
                                                    key={option.id}
                                                    className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-300 text-sm"
                                                >
                                                    {option.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full md:w-1/2 p-4">
                                <Modal isOpen={isAddingGroupOption} onClose={() => setIsAddingGroupOption(false)}>
                                    <h5 className="font-semibold text-xl mb-6 text-gray-800 text-center">Thêm Nhóm Tùy Chọn Mới</h5>
                                    <input
                                        type="text"
                                        value={newGroupOption.name}
                                        onChange={(e) => setNewGroupOption({
                                            ...newGroupOption,
                                            name: e.target.value
                                        })}
                                        placeholder="Tên Nhóm Tùy Chọn"
                                        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    />
                                    <table className="w-full mb-4">
                                        <thead>
                                        <tr>
                                            <th className="px-2 py-1 text-left text-xs font-semibold text-gray-600">STT</th>
                                            <th className="px-2 py-1 text-left text-xs font-semibold text-gray-600">Tùy chọn</th>
                                            <th className="px-2 py-1 text-left text-xs font-semibold text-gray-600">Hành động</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {newGroupOption.options.map((option, index) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                <td className="px-2 py-1 text-sm text-gray-600">{index + 1}</td>
                                                <td className="px-2 py-1">
                                                    <input
                                                        type="text"
                                                        value={option.name}
                                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                                        placeholder={`Tùy chọn ${index + 1}`}
                                                        className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                                    />
                                                </td>
                                                <td className="px-2 py-1 justify-center flex">
                                                    <button
                                                        onClick={() => removeOption(index)}
                                                        className="text-red-500 hover:text-red-700 transition duration-300"
                                                    >
                                                        <FiX size={20}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            onClick={addOption}
                                            className="text-base bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out flex items-center"
                                        >
                                            <FiPlus className="mr-2" size={18}/> Thêm
                                        </button>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => setIsAddingGroupOption(false)}
                                                className="text-base bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={saveGroupOption}
                                                className="text-base bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                                            >
                                                Lưu
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        { product.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-semibold">ID:</p>
                            <p className="text-sm text-gray-600">{product.id}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Danh mục:</p>
                            <p className="text-sm text-gray-600">{product.category.name}</p>
                        </div>
                    </div>
                    {editedVariants.length === 1 && (
                        <div className="mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-semibold">Số lượng:</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded-md"
                                            value={editedVariants[0].quantity}
                                            onChange={(e) => setEditedVariants([{
                                                ...editedVariants[0],
                                                quantity: e.target.value
                                            }])}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600">{editedVariants[0].quantity}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Giá:</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded-md"
                                            value={editedVariants[0].price}
                                            onChange={(e) => setEditedVariants([{
                                                ...editedVariants[0],
                                                price: e.target.value
                                            }])}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600">{editedVariants[0].price}</p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">Giá giảm:</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded-md"
                                            value={editedVariants[0].salePrice}
                                            onChange={(e) => setEditedVariants([{
                                                ...editedVariants[0],
                                                salePrice: e.target.value
                                            }])}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600">{editedVariants[0].salePrice}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Tồn kho:</p>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded-md"
                                            value={editedVariants[0].stock}
                                            onChange={(e) => setEditedVariants([{
                                                ...editedVariants[0],
                                                stock: e.target.value
                                            }])}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600">{editedVariants[0].stock}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {editedVariants.length > 1 && (
                    <div className="w-full md:w-1/2 p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold">Biến thể sản phẩm</h4>
                            {isEditing ? (
                                <div>
                                    <button onClick={handleSaveClick}
                                            className="text-green-500 hover:text-green-700 mr-2">
                                        <FiSave size={20}/>
                                    </button>
                                    <button onClick={handleCancelClick} className="text-red-500 hover:text-red-700">
                                        <FiX size={20}/>
                                    </button>
                                </div>
                            ) : (
                                <button onClick={handleEditClick} className="text-blue-500 hover:text-blue-700">
                                    <FiEdit size={20}/>
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <div className='h-[70vh] flex flex-col'>
                                <div className='flex-grow overflow-auto'>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="px-2 md:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hình ảnh
                                            </th>
                                            <th className="px-2 md:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tùy chọn
                                            </th>
                                            <th className="px-2 md:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Số lượng
                                            </th>
                                            <th className="px-2 md:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Giá
                                            </th>
                                            <th className="px-2 md:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Giá giảm
                                            </th>
                                            <th className="px-2 md:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Đã bán
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {currentVariants.map((variant, index) => (
                                                <tr key={index}>
                                                    <td className="px-2 md:px-4 py-4 whitespace-nowrap">
                                                        <div className="flex items-center justify-center">
                                                            {isEditing ? (
                                                                <div className="relative w-12 h-12 group">
                                                                    <input
                                                                        type="file"
                                                                        id={`file-upload-${index}`}
                                                                        className="hidden"
                                                                        onChange={(e) => handleFileChange(e, index)}
                                                                        accept="image/*"
                                                                    />
                                                                    <label
                                                                        htmlFor={`file-upload-${index}`}
                                                                        className="cursor-pointer flex items-center justify-center w-full h-full bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                                                                    >
                                                                        <FiPlus className="text-gray-600" size={24}/>
                                                                    </label>
                                                                    {variant.image && (
                                                                        <>
                                                                            <img
                                                                                src={variant.image.path}
                                                                                alt={`Variant ${index + 1}`}
                                                                                className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                                                                            />
                                                                            <div
                                                                                className="absolute top-0 right-0 hidden group-hover:block">
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        handleDeleteImage(index);
                                                                                    }}
                                                                                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                                                                                >
                                                                                    <FiX size={16}/>
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={variant.image ? variant.image.path : default_image}
                                                                    alt={`Variant ${index + 1}`}
                                                                    className="w-12 h-12 object-cover rounded-md"
                                                                />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 md:px-4 py-4 whitespace-nowrap">
                                                        <div
                                                            className="flex items-center justify-center text-xs md:text-sm text-gray-900">
                                                            {variant.options.map(option => option.name).join(', ')}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 md:px-4 py-4 whitespace-nowrap">
                                                        <div
                                                            className="flex items-center justify-center text-xs md:text-sm text-gray-900">
                                                            {isEditing ? (
                                                                <input
                                                                    type="number"
                                                                    value={variant.quantity || ""}
                                                                    onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                                                                    className="w-full p-1 border rounded text-center"
                                                                />
                                                            ) : (
                                                                variant.quantity || ""
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 md:px-4 py-4 whitespace-nowrap">
                                                        <div
                                                            className="flex items-center justify-center text-xs md:text-sm text-gray-900">
                                                            {isEditing ? (
                                                                <input
                                                                    type="number"
                                                                    value={variant.price || ""}
                                                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                                    className="w-full p-1 border rounded text-center"
                                                                />
                                                            ) : (
                                                                variant.price && variant.price.toLocaleString('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                })
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 md:px-4 py-4 whitespace-nowrap">
                                                        <div
                                                            className="flex items-center justify-center text-xs md:text-sm text-gray-900">
                                                            {isEditing ? (
                                                                <input
                                                                    type="number"
                                                                    value={variant.salePrice || ""}
                                                                    onChange={(e) => handleVariantChange(index, 'salePrice', e.target.value)}
                                                                    className="w-full p-1 border rounded text-center"
                                                                />
                                                            ) : (
                                                                variant.salePrice && variant.salePrice.toLocaleString('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND'
                                                                })
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 md:px-4 py-4 whitespace-nowrap">
                                                        <div
                                                            className="flex items-center justify-center text-xs md:text-sm text-gray-900">
                                                            {isEditing ? (
                                                                <input
                                                                    type="number"
                                                                    value={variant.stock || ""}
                                                                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                                    className="w-full p-1 border rounded text-center"
                                                                />
                                                            ) : (
                                                                variant.stock || ""
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-center">
                                {editedVariants.length > variantsPerPage && (
                                    <nav>
                                        <ul className="flex list-none items-center">
                                            <li>
                                                <button
                                                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : currentPage)}
                                                    className={`px-3 py-1 mx-1 ${
                                                        'bg-gray-200'
                                                    } rounded`}
                                                >
                                                    <FiArrowLeft/>
                                                </button>
                                            </li>
                                            {Array.from({length: Math.ceil(editedVariants.length / variantsPerPage)}).map((_, index) => (
                                                <li key={index}>
                                                    <button
                                                        onClick={() => paginate(index + 1)}
                                                        className={`px-3 py-1 mx-1 ${
                                                            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                                        } rounded`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li>
                                                <button
                                                    onClick={() => paginate(Math.ceil(editedVariants.length / variantsPerPage) > currentPage ? currentPage + 1 : currentPage)}
                                                    className={`px-3 py-1 mx-1 ${
                                                        'bg-gray-200'
                                                    } rounded`}
                                                >
                                                    <FiArrowRight/>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ProductDetailAdmin;