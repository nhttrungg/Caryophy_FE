import React, {useEffect, useState} from 'react';
import {Formik, Form, Field, ErrorMessage, useFormikContext} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from "react-redux";
import AddressModal from "./AddressModal";
import axiosSupport from "../services/axiosSupport";
import useAxiosSupport from "../hooks/useAxiosSupport";
import {setAddressUser} from "../redux/reducers/userReducer";
import CompletePayment from "./CompletePayment";
import {toast} from "react-toastify";
import Modal from "./Modal";
import websocketConfig from "../config/websocketConfig";

const CompletePaymentForm = ({selectedVariants, total, onSubmit}) => {
    const axiosSupport = useAxiosSupport();
    const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const user = useSelector(state => state.user.user);
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [orderData,setOrderData] = useState(null);
    const validationSchema = Yup.object({
        fullName: Yup.string().required('Họ tên là bắt buộc'),
        phoneNumber: Yup.string().required('Số điện thoại là bắt buộc'),
        email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    });
    const initialValues = {
        fullName: user?.name || '',
        phoneNumber: user?.phoneNumber || '',
        email: user?.email || '',
        addresses: user?.addresses?.[0],
    };
    const dispatch = useDispatch();
    const groupedItems = selectedVariants.reduce((acc, item) => {
        if (!acc[item.product.merchant.id]) {
            acc[item.product.merchant.id] = { shopName: item.product.merchant.name, items: [] };
        }
        acc[item.product.merchant.id].items.push(item);
        return acc;
    }, {});
    const groupSize = Object.keys(groupedItems).length;

    const AddressSelector = () => {
        const { setFieldValue } = useFormikContext();

        return (
            <>
                <div>
                    <label htmlFor="address" className="block mb-1">Địa chỉ</label>
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => setIsAddressModalOpen(true)}
                            className="w-full p-2 border rounded text-left bg-gray-100 hover:bg-gray-200 transition duration-300"
                        >
                            {selectedAddress ? `${selectedAddress?.detail || setAddresses?.address || ''}, ${selectedAddress?.ward || ''}, ${selectedAddress?.district || ''}, ${selectedAddress?.province || ''}` : 'Chọn địa chỉ'}
                        </button>
                    </div>
                </div>

                {isAddressModalOpen && (
                    <AddressModal
                        addresses={addresses}
                        onClose={() => setIsAddressModalOpen(false)}
                        onSelectAddress={(address) => {
                            setSelectedAddress(address);
                            setFieldValue('addresses', address);
                            setIsAddressModalOpen(false);
                        }}
                        onAddNewAddress={async (newAddress) => {
                            setAddresses([...addresses, newAddress]);
                            setSelectedAddress(newAddress);
                            setFieldValue('addresses', newAddress);
                            setIsAddressModalOpen(false);
                            if(user?.id){
                               const address =  await axiosSupport.saveUserAddress(newAddress, user.id);
                               dispatch(setAddressUser(address))
                            }
                        }}
                    />
                )}
            </>
        );
    };

    const prepareOrderData = (values) => {
        const orderData = {
            variants: selectedVariants,
            merchantNumber: groupSize, // Assuming all products are from the same merchant
            userId: user?.id || null,
            detail: {
                address: `${selectedAddress.detail || selectedAddress.address}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`,
                paymentType: paymentMethod,
                name: values?.fullName,
                phone: values?.phoneNumber,
                email: values?.email,
            }
        };

        return orderData;
    };

    useEffect(() => {
        websocketConfig.connect(user.id, {
            onOrderReceived: (newOrder) => {
                setOrderData(prevOrders => prevOrders ? [...prevOrders, newOrder] : [newOrder]);
                toast.success('Đơn hàng đã được gửi đến kho hàng');
            }
        });

        return () => {
            websocketConfig.disconnect();
        };
    }, [user.id]);

    const handleSubmit = async (values) => {
        try {
            const data = await axiosSupport.createOrder(prepareOrderData(values));
        } catch (error) {
            console.error('Error creating order:', error);
        } finally {
        }
    };


    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Hoàn tất thanh toán</h2>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Thông tin đơn hàng</h3>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        {selectedVariants.map((variant) => (
                            <div key={variant.id} className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <img
                                        src={variant.image?.path || '/path/to/default/image.jpg'}
                                        alt={variant.product.name}
                                        className="w-16 h-16 object-cover rounded-md mr-4"
                                    />
                                    <div>
                                        <p className="font-medium">{variant.product.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {variant.options.length > 1 && variant.options.map(option => `${option.groupName}: ${option.name}`).join(', ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p>{variant.quantity} x {variant.price} VND</p>
                                    <p className="font-semibold">{(variant.quantity * variant.price)} VND</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-right">
                        <p className="text-xl font-bold">Tổng cộng: {total} VND</p>
                    </div>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ values }) => (
                        <Form>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fullName" className="block mb-1">Họ tên</label>
                                    <Field name="fullName" type="text" className="w-full p-2 border rounded"/>
                                    <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm"/>
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block mb-1">Số điện thoại</label>
                                    <Field name="phoneNumber" type="text" className="w-full p-2 border rounded"/>
                                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm"/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-1">Email</label>
                                    <Field name="email" type="email" className="w-full p-2 border rounded"/>
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm"/>
                                </div>

                                <AddressSelector/>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-3">Phương thức thanh toán</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="cod"
                                            checked={paymentMethod === 'CASH'}
                                            onChange={() => setPaymentMethod('CASH')}
                                            className="mr-2"
                                        />
                                        Thanh toán khi nhận hàng (COD)
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="bank"
                                            checked={paymentMethod === 'BANK_TRANSFER'}
                                            onChange={() => setPaymentMethod('BANK_TRANSFER')}
                                            className="mr-2"
                                        />
                                        Chuyển khoản ngân hàng
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-6 w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-lg"
                                onClick={() => handleSubmit(values)}
                            >
                                Xác nhận đặt hàng
                            </button>
                        </Form>
                    )}
                </Formik>
                {orderData &&
                    <Modal isOpen={orderData}>
                        <CompletePayment orders={orderData} />
                    </Modal>}
            </div>
        </div>
    );
};

export default CompletePaymentForm;