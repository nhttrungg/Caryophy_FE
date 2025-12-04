import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaVenusMars, FaIdCard } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosSupport from "../hooks/useAxiosSupport";
import {useDispatch} from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner";


export default function Register() {
    const axiosSupport = useAxiosSupport();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            phoneNumber: '',
            name: '',
            gender: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Tên đăng nhập không được để trống'),
            password: Yup.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').required('Mật khẩu không được để trống'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
                .required('Xác nhận mật khẩu không được để trống'),
            email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
            phoneNumber: Yup.string().matches(/^[0-9]+$/, 'Số điện thoại không hợp lệ').required('Số điện thoại không được để trống'),
            name: Yup.string().required('Họ tên không được để trống'),
            gender: Yup.string().required('Giới tính không được để trống'),
        }),
        onSubmit: async (values) => {
            const response = await fetch(axiosSupport.getFullURL('register'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                    confirmPassword: values.confirmPassword, // Xác nhận mật khẩu
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    name: values.name,
                    gender: values.gender,
                }),
            });
            if (201 === response.status) {
                // Xử lý khi đăng ký thành công
                    toast.success('Đăng ký thành công!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setLoading(true)
                     setTimeout(async () => {
                         const response = await fetch(axiosSupport.getFullURL('login'), {
                             method: 'POST',
                             headers: {
                                 'Content-Type': 'application/json',
                             },
                             body: JSON.stringify({
                                 username: values.username,
                                 password: values.password,
                             }),
                         }).then(async (response) => {
                             if (response.ok) {
                                 const data = await response.json();
                                 dispatch({
                                     type: 'SET_AUTHENTICATION',
                                     payload: {
                                         token: data.accessToken,
                                         role: data.roles[0].authority,
                                     },
                                 })
                                 if (data.roles.some(role => role.authority === 'ROLE_ADMIN')) {
                                     navigate('/home');
                                 } else {
                                     navigate('/client');
                                 }
                             } else {
                                 console.error('Đăng nhập thất bại');
                             }
                             setLoading(false)
                         });
                     },1000)

                // Có thể chuyển hướng người dùng đến trang đăng nhập hoặc trang chính
            } else {
                // Xử lý khi đăng ký thất bại
                toast.error('Đăng ký thất bại. Vui lòng thử lại!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });                // Có thể hiển thị thông báo lỗi cho người dùng
            }
        },
    });


    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            {loading && <Spinner />}
            <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đăng Ký Tài Khoản</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Tạo tài khoản mới để trải nghiệm dịch vụ của chúng tôi
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="flex flex-wrap -mx-3">
                        {/* User Information Section */}
                        <div className="w-full md:w-1/2 px-3 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cá nhân</h3>
                            <div className="space-y-4">
                                {/* Name field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                                    <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                                        <FaUser className="h-5 w-5 text-gray-400 ml-3" />
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            {...formik.getFieldProps('name')}
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                                            placeholder="Họ tên"
                                        />
                                    </div>
                                    {formik.touched.name && formik.errors.name ? (
                                        <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
                                    ) : null}
                                </div>

                                {/* Email field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                                        <FaEnvelope className="h-5 w-5 text-gray-400 ml-3" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            {...formik.getFieldProps('email')}
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                                            placeholder="Email"
                                        />
                                    </div>
                                    {formik.touched.email && formik.errors.email ? (
                                        <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                                    ) : null}
                                </div>

                                {/* Phone Number field */}
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                                        <FaPhone className="h-5 w-5 text-gray-400 ml-3" />
                                        <input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            {...formik.getFieldProps('phoneNumber')}
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                                            placeholder="Số điện thoại"
                                        />
                                    </div>
                                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                        <p className="mt-2 text-sm text-red-600">{formik.errors.phoneNumber}</p>
                                    ) : null}
                                </div>

                                {/* Gender field */}
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                    <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                                        <FaVenusMars className="h-5 w-5 text-gray-400 ml-3" />
                                        <select
                                            id="gender"
                                            name="gender"
                                            {...formik.getFieldProps('gender')}
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </select>
                                    </div>
                                    {formik.touched.gender && formik.errors.gender ? (
                                        <p className="mt-2 text-sm text-red-600">{formik.errors.gender}</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Account Credentials Section */}
                        <div className="w-full md:w-1/2 px-3 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin tài khoản</h3>
                            <div className="space-y-4">
                                {/* Username field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                                    <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                                        <FaIdCard className="h-5 w-5 text-gray-400 ml-3" />
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            {...formik.getFieldProps('username')}
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                                            placeholder="Tên đăng nhập"
                                        />
                                    </div>
                                    {formik.touched.username && formik.errors.username ? (
                                        <p className="mt-2 text-sm text-red-600">{formik.errors.username}</p>
                                    ) : null}
                                </div>

                                {/* Password field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                                    <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                                        <FaLock className="h-5 w-5 text-gray-400 ml-3" />
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            {...formik.getFieldProps('password')}
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                                            placeholder="Mật khẩu"
                                        />
                                    </div>
                                    {formik.touched.password && formik.errors.password ? (
                                        <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
                                    ) : null}
                                </div>

                                {/* Confirm Password field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                    <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                                        <FaLock className="h-5 w-5 text-gray-400 ml-3" />
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            {...formik.getFieldProps('confirmPassword')}
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                                            placeholder="Xác nhận mật khẩu"
                                        />
                                    </div>
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <p className="mt-2 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            Đăng Ký
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}