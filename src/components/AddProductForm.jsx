import React, {useRef, useState} from 'react';
import {FiChevronLeft, FiChevronRight, FiUpload} from 'react-icons/fi';
import useAxiosSupport from "../hooks/useAxiosSupport";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { useTransition, animated } from 'react-spring';


const AddProductForm = ({ onSubmit, categories, merchants,setIsModalOpen, merchantId }) => {
    const axiosSupport = useAxiosSupport();
    const user = useSelector(state => state.user);
    const id = useSelector(state => state.merchant.id || {});
    const [product, setProduct] = useState({
        name: '',
        description: '',
        category: '',
    });
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        setIsUploading(true);
        const files = Array.from(e.target.files);
        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }))
            .then(results => {
                setImages(prevImages => [...prevImages, ...results]);
                setIsUploading(false);
            })
            .catch(error => {
                console.error('Error reading files:', error);
                setIsUploading(false);
            });
    };

    const createProductData = (product) => {
        console.log("product",product);
        return {
            name: product.name,
            description: product.description,
            category: {
                id: product.category,
            },
            merchant: {
                id: id
            },
            image: images.map((image, index) => ({
                path: image
            }))
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = createProductData(product);
        axiosSupport.createProduct(productData)
            .then(() => {
                toast.success('Thêm sản phẩm thành công!');
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error('Error creating product:', error);
                toast.error('Có lỗi xảy ra khi thêm sản phẩm');
            });
    };


    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const transitions = useTransition(currentImageIndex, {
        from: {opacity: 0, transform: 'translate3d(100%,0,0)'},
        enter: {opacity: 1, transform: 'translate3d(0%,0,0)'},
        leave: {opacity: 0, transform: 'translate3d(-50%,0,0)'},
        config: {tension: 220, friction: 20},
    });

       return (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg w-full h-full flex flex-col">
                <h2 className="text-3xl font-bold mb-6 text-center py-4">Thêm Sản Phẩm Mới</h2>
                <div
                    className="flex-grow flex flex-col md:flex-row p-6 space-y-6 md:space-y-0 md:space-x-6 overflow-y-auto">
                    <div className="md:w-1/2 space-y-6">
                        <div className="aspect-w-16 aspect-h-9">
                            {
                                isUploading ? (
                                    <div className="text-center h-full flex items-center justify-center">
                                        <div
                                            className="animate-spin rounded-full w-16 h-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                                        <p className="mt-4 text-base text-gray-600">Đang tải...</p>
                                    </div>
                                ) : images.length > 0 ? (
                                    <div className="relative h-64 overflow-hidden">
                                        {transitions((style, i) => (
                                            <animated.img
                                                style={style}
                                                src={images[i]}
                                                alt={`Product preview ${i + 1}`}
                                                className="absolute w-full h-full object-cover rounded-lg"
                                            />
                                        ))}
                                        <button
                                            onClick={() => setImages(images.filter((_, i) => i !== currentImageIndex))}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 z-10"
                                            type="button"
                                        >
                                            X
                                        </button>
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 z-10"
                                                    type="button"
                                                >
                                                    <FiChevronLeft className="text-2xl"/>
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 z-10"
                                                    type="button"
                                                >
                                                    <FiChevronRight className="text-2xl"/>
                                                </button>
                                            </>
                                        )}
                                        <div
                                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                                            {images.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center cursor-pointer"
                                        onClick={triggerFileInput}
                                    >
                                        <FiUpload className="text-6xl text-gray-400"/>
                                        <p className="mt-2 text-sm text-gray-500">Tải lên hình ảnh sản phẩm</p>
                                    </div>
                                )}
                        </div>
                        {images.length < 5 && (
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Thêm ảnh
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
                            <input
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm py-2 px-3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                            <select
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm py-2 px-3"
                                // required
                            >
                                <option value="">Chọn danh mục</option>
                                {categories && categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                rows="4"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm py-2 px-3"
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 flex justify-end space-x-4">
                    <button
                        type="submit"
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Thêm sản phẩm
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Hủy bỏ
                    </button>
                </div>
            </form>
        );
    };


export default AddProductForm;

// =====end=====