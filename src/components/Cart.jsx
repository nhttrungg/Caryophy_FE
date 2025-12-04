import React, { useState, useEffect } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import CartItemCard from "./CartItemCard";
import {useDispatch, useSelector} from "react-redux";
import ClientHeader from "../pages/clientPage/ClientHeader";
import useAxiosSupport from "../hooks/useAxiosSupport";
import CompletePaymentForm from "./CompletePaymentForm";
import {useNavigate} from "react-router-dom";

const Cart = () => {
    const axiosSupport = useAxiosSupport();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const {id : userId} = useSelector(state => state.user);
    const cart = useSelector(state => state.cart);
    const [selectedVariants, setSelectedVariants] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if(userId){
                    const response = await axiosSupport.getCartByUserId(userId);
                    const cartItemsWithDefaultQuantity = response.variants.map(item => ({
                        ...item,
                        quantity: 1,
                        itemQuantity: item.quantity
                    }));
                    setCartItems(cartItemsWithDefaultQuantity);
                }else{
                    setCartItems([...cart.items]);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [userId, axiosSupport]);

    useEffect(() => {
        if (Array.isArray(cartItems) && cartItems.length > 0) {
            const newTotal = cartItems.reduce((sum, item) => {
                if (selectedVariants.includes(item.id)) {
                    return sum + item.price * item.quantity;
                }
                return sum;
            }, 0);
            setTotal(newTotal);
        }
    }, [cartItems, selectedVariants]);

    const handleQuantityChange = (id, change) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(0, item.quantity + change) }
                    : item
            )
        );
    };

    const handleRemoveItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };


    const groupedItems =  cartItems.reduce((acc, item) => {
        if (!acc[item.product.merchant.id]) {
            acc[item.product.merchant.id] = { shopName: item.product.merchant.name, items: [] };
        }
        acc[item.product.merchant.id].items.push(item);
        return acc;
    }, {});

    const handleProceedToPayment = () => {
        const selectedItems = cartItems.filter(item => selectedVariants.includes(item.id));
        console.log("selectedItems: ", selectedItems);
        dispatch({ type: 'SET_CART_ITEMS', payload: selectedItems });
        userId ? navigate('/client/payment') : navigate('/payment') ;
    };

    return (
        <>
            {!userId && <HomeHeader/>}
            <div className="container mx-auto p-4 md:w-[50vw] xs:w-full">
                <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
                {Object.values(groupedItems).map((shop) => (
                    <div key={shop.shopName} className="mb-8 bg-white rounded-lg shadow-md p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold mb-2 sm:mb-0">{shop.shopName}</h2>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`select-all-${shop.shopName}`}
                                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setSelectedVariants(prev => {
                                            const updatedVariants = isChecked
                                                ? [...new Set([...prev, ...shop.items.map(item => item.id)])]
                                                : prev.filter(id => !shop.items.some(item => item.id === id));
                                            return updatedVariants;
                                        });
                                    }}
                                />
                                <label htmlFor={`select-all-${shop.shopName}`}>Chọn tất cả</label>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {shop.items.map((item) => (
                                <CartItemCard
                                    key={item.id}
                                    item={item}
                                    onQuantityChange={handleQuantityChange}
                                    onRemove={handleRemoveItem}
                                    setSelectedVariants={setSelectedVariants}
                                    isSelected={selectedVariants.includes(item.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                <div className="mt-8 bg-white rounded-lg shadow-md p-4 sticky bottom-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Tổng cộng:</h2>
                        <p className="text-2xl font-bold text-blue-600">${total.toLocaleString()} VND</p>
                    </div>
                    <button
                        onClick={handleProceedToPayment}
                        className="mt-4 w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-lg"
                    >
                        Tiến hành thanh toán
                    </button>
                </div>
            </div>
            {!userId && <div className="hidden sm:block">
                <HomeFooter/>
            </div>}
        </>
    );
};

export default Cart;