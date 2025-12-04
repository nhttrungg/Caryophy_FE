import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import useAxiosSupport from "../hooks/useAxiosSupport";
import Modal from './Modal';
import ProductSelector from './ProductSelector';
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {MdOutlineLabel} from "react-icons/md";
import {toast} from "react-toastify";

const CategoryManagement = () => {
    const {id: shopId} = useSelector(state => state.merchant);
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const axiosSupport = useAxiosSupport();
    const [isError,setIsError] = useState(false)
    const [deleteCategory,setDeleteCategory]= useState(null);
    useEffect(() => {
        fetchCategories();
    }, [shopId]);

    const fetchCategories = async () => {
        try {
            const response = await axiosSupport.getCategoriesByShop(shopId);
            setCategories(response);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Tên danh mục là bắt buộc')
            .max(50, 'Tên danh mục không được quá 50 ký tự'),
        description: Yup.string()
            .required('Mô tả là bắt buộc')
            .max(200, 'Mô tả không được quá 200 ký tự'),
    });

    const handleAddCategory = async (values, { resetForm }) => {
        try {
            const res = await axiosSupport.createShopSection({
                ...values, 
                merchant: {
                    id: shopId
                } 
            });
            if(res === null){
                setIsError(true)
            }
            resetForm();
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleEditCategory = async (values, { resetForm }) => {
        if (!editingCategory) return;
        try {
            await axiosSupport.updateShopSection({
                ...values,
                id: editingCategory.id,
                products: selectedProducts,
                merchant: {
                    id: shopId
                }
            });
            setEditingCategory(null);
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await axiosSupport.deleteShopSection(id);
            setDeleteCategory(null)
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setSelectedProducts(category.products || []);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Quản lý danh mục</h2>

            {/* Add new category form */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Thêm danh mục mới</h3>
                <Formik
                    initialValues={{ name: '', description: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleAddCategory}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className="mb-2">
                                <Field
                                    name="name"
                                    type="text"
                                    placeholder="Tên danh mục"
                                    className={`w-full p-2 border rounded ${errors.name && touched.name ? 'border-red-500' : ''}`}
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="mb-2">
                                <Field
                                    name="description"
                                    type="text"
                                    placeholder="Mô tả"
                                    className={`w-full p-2 border rounded ${errors.description && touched.description ? 'border-red-500' : ''}`}
                                />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                <FiPlus className="inline mr-2" />
                                Thêm danh mục
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>

            {/* Category list */}
            {/* Category list */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Danh sách danh mục</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white shadow-sm rounded-lg p-3 flex flex-col justify-between text-sm">
                            <div>
                                <h4 className="font-semibold mb-1 flex items-center">
                                    <MdOutlineLabel className="mr-1 text-blue-500" />
                                    {category.name}
                                </h4>
                                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{category.description}</p>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => openEditModal(category)}
                                    className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition duration-200"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button
                                    onClick={() => setDeleteCategory(category.id)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition duration-200 ml-1"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Category Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-2xl font-bold mb-4">Chỉnh sửa danh mục</h2>
                <Formik
                    initialValues={editingCategory || { name: '', description: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleEditCategory}
                    enableReinitialize
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className="mb-2">
                                <label>Tên danh mục:</label>
                                <Field
                                    name="name"
                                    type="text"
                                    className={`w-full p-2 border rounded ${errors.name && touched.name ? 'border-red-500' : ''}`}
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="mb-2">
                                <label>Mô tả:</label>
                                <Field
                                    name="description"
                                    type="text"
                                    className={`w-full p-2 border rounded ${errors.description && touched.description ? 'border-red-500' : ''}`}
                                />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                            </div>
                            <ProductSelector
                                shopId={shopId}
                                selectedProducts={selectedProducts}
                                setSelectedProducts={setSelectedProducts}
                            />
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                            >
                                Lưu thay đổi
                            </button>
                        </Form>
                    )}
                </Formik>
            </Modal>
            <Modal isOpen={isError} onClose={() => setIsError(false)}>
                    <div>
                        <h2 className="text-2xl font-bold mb-4"> Tên danh mục đã tồn tại, bạn vui lòng tạo với tên danh mục
                            khác</h2>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            onClick={() => setIsError(false)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4 block"
                        >
                            OK
                        </button>
                    </div>
            </Modal>
            <Modal isOpen={deleteCategory} onClose={() => setDeleteCategory(null)}>
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-center">Bạn có chắc chắn muốn xóa danh mục này không?</h2>
                </div>
                <div className="flex items-center justify-end">
                    <div>
                        <button
                            type="submit"
                            onClick={() => handleDeleteCategory(deleteCategory)}
                            className="bg-green-500 text-white px-8 py-4 rounded hover:bg-green-600 mr-10 mt-4 inline-block"
                        >
                            Có
                        </button>
                        <button
                            type="submit"
                            onClick={() => setDeleteCategory(null)}
                            className="bg-red-500 text-white px-8 py-4 rounded hover:bg-red-600 mt-4 inline-block"
                        >
                            Không
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CategoryManagement;