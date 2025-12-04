import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../services/axiosSupport';
import { FaStore, FaMapMarkerAlt, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import AddressRow from "./AddressRow";
import useAxiosSupport from "../hooks/useAxiosSupport";

const CreateMerchantForm = ({ onSuccess }) => {
    const {user} = useSelector((state) => state.user);
    const [error, setError] = useState(null);
    const axiosSupport =useAxiosSupport();
    const initialValues = {
        name: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        description: '',
        email: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Tên merchant là bắt buộc'),
        address: Yup.string().required('Địa chỉ là bắt buộc'),
        province: Yup.string().required('Tỉnh/Thành phố là bắt buộc'),
        district: Yup.string().required('Quận/Huyện là bắt buộc'),
        ward: Yup.string().required('Phường/Xã là bắt buộc'),
        description: Yup.string(),
        email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    });


    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const merchantData = {
                name: values.name,
                address: {
                    street: values.address.street,
                    province: values.address.province,
                    district: values.address.district,
                    ward: values.address.ward
                },
                description: values.description,
                email: values.email,
               user: {
                  id: "1",
               }
            };
            const response = await axiosSupport.createMerchant(merchantData);
            onSuccess(response.data);
        } catch (error) {
            console.log(error)
            if (error.response) {
                setError(`Lỗi: ${error.response.data}`);
            } else if (error.request) {
                setError('Không nhận được phản hồi từ server. Vui lòng thử lại sau.');
            } else {
                setError('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Tạo Merchant Mới
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Điền thông tin để tạo merchant của bạn
                    </p>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="mt-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên Merchant</label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            <FaStore className="h-5 w-5" />
                                        </span>
                                        <Field 
                                            name="name" 
                                            type="text" 
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300"
                                        />
                                    </div>
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            <FaEnvelope className="h-5 w-5" />
                                        </span>
                                        <Field 
                                            name="email" 
                                            type="email" 
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300"
                                        />
                                    </div>
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                            </div>

                            <AddressRow
                                address={'address'}
                                province={'province'}
                                district={'district'}
                                ward={'ward'}
                                setFieldValue={setFieldValue}
                            />

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                                <div className="mt-1">
                                    <Field 
                                        name="description" 
                                        as="textarea" 
                                        rows={3}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                    />
                                </div>
                                <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            {error && <div className="text-red-500 text-center text-sm">{error}</div>}

                            <div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {isSubmitting ? 'Đang xử lý...' : 'Tạo Merchant'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CreateMerchantForm;