import React, { useState, useEffect } from 'react';
import {FiPlus, FiEdit, FiTrash, FiSearch, FiArrowLeft} from 'react-icons/fi';
import Modal from '../components/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosSupport from '../services/axiosSupport';
import ProductCard from "../components/ProductCard";
import ProductCardAdmin from "../components/ProductCardAdmin";
import {useSelector} from "react-redux";
import AddProductForm from "../components/AddProductForm";
import {useNavigate} from "react-router-dom";
import useAxiosSupport from "../hooks/useAxiosSupport";
import ProductDetailAdmin from "../components/ProductDetailAdmin";

const axios = new AxiosSupport(); // Khởi tạo AxiosSupport

export default function ProductsDashBoard() {
    const axiosSupport = useAxiosSupport();
    const id = useSelector(state => state.merchant.id || {});
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);


    useEffect(() => {
        const fetchProducts = async () => {
            const res = await axiosSupport.getProductByMerchantId(id);
                setProducts(res);
                setTotalPages(Math.ceil(res.length / 5)); // Assuming 5 items per page
        };
        fetchProducts();
        const fetchCategories = async () => {
            const res = await axiosSupport.getAllCategory();
            setCategories(res);
        }
        fetchCategories();
    }, [axiosSupport, id]);
    console.log("log aaaaaaaaaaaaaa",products)


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleEditProduct = (product) => {
        // Implement edit functionality
        console.log("Editing product:", product);
    };

    const handleDeleteProduct = (productId) => {
        // Implement delete functionality
        console.log("Deleting product with ID:", productId);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-6 bg-gray-50 min-h-screen rounded-md">
            <div className="flex-1 lg:p-6 space-y-4 lg:space-y-6 overflow-x-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Quản lý sản phẩm</h1>
                {selectedProduct && (
                    <button
                        onClick={()=>{setSelectedProduct(null)}}
                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                    >
                        <FiArrowLeft className="mr-2" />
                        Quay lại
                    </button>
                )}

                {selectedProduct ? (
                    <ProductDetailAdmin
                        product={selectedProduct}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                    />
                ) : (
                    <>
                        <div className="mb-4 lg:mb-6 flex justify-center items-center p-1">
                            <div className="relative flex items-center w-4/5">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-4 text-gray-700 placeholder-gray-500"
                                />
                                <FiSearch size={20}
                                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"/>
                            </div>
                            <button onClick={() => setIsModalOpen(true)}
                                    className="flex justify-center items-start bg-white py-3 px-3 rounded-md text-black border border-gray-300 ml-4 w-1/5">
                                <FiPlus/>
                            </button>
                        </div>
                        <div className="bg-white rounded-md shadow-md overflow-x-auto">
                            <div className="bg-white rounded-md shadow-md overflow-x-auto">
                                {currentProducts.map(product => (
                                    <ProductCardAdmin
                                        key={product.id}
                                        product={product}
                                        handleProductClick={() => handleProductClick(product)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div
                            className="flex flex-col sm:flex-row justify-between items-center mt-4 text-gray-600 space-y-2 sm:space-y-0">
                            <span className="text-sm">Trang {currentPage} trên {totalPages}</span>
                            <div className="flex items-center space-x-2 text-sm">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    disabled={currentPage === 1}
                                >
                                    &lt;&lt;
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    disabled={currentPage === 1}
                                >
                                    &lt;
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    disabled={currentPage === totalPages}
                                >
                                    &gt;
                                </button>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    disabled={currentPage === totalPages}
                                >
                                    &gt;&gt;
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Phân trang */}


                <Modal isOpen={isModalOpen}>
                    <AddProductForm
                        setIsModalOpen={setIsModalOpen}
                        merchantId={id}
                        categories={categories}
                    />
                </Modal>

                <ToastContainer/>
            </div>
        </div>
    );
}
