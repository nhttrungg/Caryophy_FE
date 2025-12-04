import React, {useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import { FaUser, FaLock } from 'react-icons/fa';
import useAxiosSupport from '../hooks/useAxiosSupport';
import Spinner from '../components/Spinner';
import {loginSuccess, logout, setAuthenticate} from "../redux/reducers/userReducer";

function Login() {
    const axiosSupport = useAxiosSupport();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);
    const user = useSelector(state => state.user);

    useEffect(() => {
        dispatch(logout())
    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Tên đăng nhập không được để trống'),
            password: Yup.string().required('Mật khẩu không được để trống'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await fetch(axiosSupport.getFullURL('login'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password,
                    }),
                });
                if (response.status === 200) {
                    const data = await response.json();
                    dispatch(setAuthenticate(data.accessToken, data.roles,data.id))
                    if(response.status === 200 && data.roles.some(role => role.authority === 'ROLE_USER')) {
                        const user = await axiosSupport.getUserDetail(data.id);
                        dispatch(loginSuccess(user));

                    }
                    toast.success('Đăng nhập thành công!');
                    if (data.roles.some(role => role.authority === 'ROLE_MERCHANT' )) {
                        navigate('/dashboard/');
                    }else if(data.roles.some(role => role.authority === 'ROLE_ADMIN')){
                        navigate('/admin');
                    } else {
                        navigate('/client');
                    }
                } else {
                    toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
                }
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            {loading && <Spinner />}
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đăng Nhập</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Đăng nhập để trải nghiệm dịch vụ của chúng tôi
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                                <FaUser className="h-5 w-5 text-gray-400 ml-3" />
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
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                        Chưa có tài khoản? Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;