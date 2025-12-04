import React, { useState, useEffect } from 'react';
import {
    FiStar,
    FiShoppingBag,
    FiMail,
    FiPhone,
    FiClock,
    FiMapPin,
    FiTag,
    FiTruck,
    FiShield,
    FiArrowLeft
} from 'react-icons/fi';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import useAxiosSupport from "../hooks/useAxiosSupport";
import default_image from "../assets/images/default-image.svg";
import {useSelector} from "react-redux";
import ClientHeader from "../pages/clientPage/ClientHeader";
import {formatLastAccess} from "../utils/DateUtil";
import ShopSectionCard from "./ShopSectionCard";

const ShopDetails = () => {
    const {id: userId} = useSelector(state => state.user);
    const {id} = useParams();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [sortBy, setSortBy] = useState('popular');
    const [isFollowing, setIsFollowing] = useState(false);
    const [shopSections, setShopSections] = useState([]);
    const [productsSections, setProductSections] = useState([]);
    const axiosInstance = useAxiosSupport();

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;
    const [currentProducts, setCurrentProducts] = useState([]);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const [totalPages,setTotalPages] = useState('0');
    const [available,setAvailable] = useState(1);

    useEffect(() => {
         setCurrentProducts(products.slice(indexOfFirstProduct, indexOfLastProduct));
    }, [currentPage]);


    useEffect(() => {
        const fetchShopDetails = async () => {
            try {
                const res = await axiosInstance.getShopDetails(id);
                setShop(res);
                setReviews(res.comments);
            } catch (error) {
                console.error('Error fetching shop details:', error);
            }
        };
        fetchShopDetails();
    }, [id, axiosInstance]);

    useEffect(() => {
        setAvailable(products.length/6);
    }, [products]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (activeTab === 'products' && available === currentPage) {
                try {
                    const params = {
                        merchantId: id,
                        page: currentPage - 1,
                        size: productsPerPage * 3
                    };
                    const res = await axiosInstance.getMerchantProducts(params);
                    setProducts([...products, ...res.content]);
                    setTotalPages(res.totalPages);
                    setCurrentProducts(res.slice(0, productsPerPage));
                } catch (error) {
                    console.error('Error fetching products:', error);
                }
            }
        };
        fetchProduct();
    }, [activeTab, axiosInstance, currentPage, available]);

    useEffect(() => {
        const fetchShopSection = async () => {
            if (activeTab === 'sections') {
                try {
                    const res = await axiosInstance.getCategoriesByShop(id);
                    setShopSections(res);
                } catch (error) {
                    console.error('Error fetching shop section:', error);
                }
            }
        };
        fetchShopSection();
    }, [activeTab, axiosInstance]);

    if (!shop) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const getDetailAddress = (address) => {
        if (!address) return 'Address not available';
        const parts = [address.detail, address.ward, address.district, address.province];
        return parts.filter(Boolean).join(', ');
    }

    const handleFollow = async () => {
        setIsFollowing(!isFollowing);
        if(!isFollowing){
            await axiosInstance.addShopToWishlist(shop.id)
        }else{
            await axiosInstance.removeShopFromWishlist(shop.id,userId)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    return (
        <>
            {userId ? <ClientHeader currentUser={userId}/> : <HomeHeader/>}
            <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="relative h-64 overflow-hidden">
                        <img src={shop.background} alt="Shop cover" className="w-full h-full object-cover"/>
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 flex items-center">
                            <img
                                src={shop.logo}
                                alt="Shop avatar"
                                className="w-16 h-16 rounded-full border-2 border-white mr-4"
                            />
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{shop.name}</h1>
                                <div className="flex items-center text-white">
                                    <FiStar className="text-yellow-400 mr-1"/>
                                    <span>{shop.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-700">{shop.description}</p>
                            <button
                                onClick={handleFollow}
                                className={`flex items-center px-4 py-2 rounded ${isFollowing ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'}`}
                            >
                                <FaHeart className="mr-2"/>
                                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div
                                className="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                                <FiMail className="text-blue-500 mr-3 text-xl"/>
                                <span className="text-gray-700">{shop.email}</span>
                            </div>
                            <div
                                className="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                                <FiPhone className="text-blue-500 mr-3 text-xl"/>
                                <span className="text-gray-700">{shop.phoneNumber}</span>
                            </div>
                            <div
                                className="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                                <FiMapPin className="text-blue-500 mr-3 text-xl"/>
                                <span className="text-gray-700">{getDetailAddress(shop.address)}</span>
                            </div>
                            <div
                                className="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                                <FiClock className="text-blue-500 mr-3 text-xl"/>
                                <span className="text-gray-700">{formatLastAccess(shop.last_access)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-gray-200">
                        <nav className="flex justify-between items-center px-6">
                            <div className="flex">
                                <button
                                    className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab('products')}
                                >
                                    Sản phẩm
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium ${activeTab === 'reviews' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab('reviews')}
                                >
                                    Đánh giá
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium ${activeTab === 'categories' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab('sections')}
                                >
                                    Danh mục
                                </button>
                            </div>
                            {activeTab === 'products' && (
                                <select
                                    className="border rounded p-2"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                <option value="popular">Phổ biến</option>
                                    <option value="price-low">Giá thấp đến cao</option>
                                    <option value="price-high">Giá cao đến thấp</option>
                                    <option value="newest">Mới nhất</option>
                                </select>
                            )}
                        </nav>
                    </div>
                    {activeTab === 'products' && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentProducts.map((product) => (
                                    <div key={product.id}
                                         className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                                        <img src={product?.image[0]?.path || default_image} alt={product.name}
                                             className="w-full h-48 object-cover"/>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                            <p className="text-blue-600 font-bold">{product.minPrice}đ
                                                - {product.maxPrice}đ</p>
                                            <div className="flex items-center mt-2">
                                                <FiStar className="text-yellow-400 mr-1"/>
                                                <span>{product.rating}</span>
                                            </div>
                                            <button
                                                className="mt-3 flex items-center justify-center w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                                                <FiShoppingBag className="mr-2"/>
                                                Thêm vào giỏ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                                >
                                    Trang trước
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                                >
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    )}
                
                    {activeTab === 'reviews' && (
                        <div className="p-6 space-y-4">
                            {reviews.map((comment, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-md">
                                    <div className="flex items-center mb-2">
                                        <span className="font-semibold mr-2">{comment.user.name}</span>
                                        <span className="text-sm text-gray-500">
                                        {new Date(comment.date).toLocaleDateString()}
                                    </span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <p>{comment.content}</p>
                                    {comment?.images?.length > 0 && (
                                        <div className="mt-2 flex space-x-2 overflow-x-auto">
                                            {comment.images.map((image, idx) => (
                                                <img
                                                    key={idx}
                                                    src={image.path || default_image}
                                                    alt="Comment image"
                                                    className="mt-2 max-w-xs max-h-40 object-contain"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>
                    )}

                    {activeTab === 'sections' && (
                        <div className="p-6 space-y-4">
                            {!productsSections.length? (
                                shopSections.map((section, index) => (
                                    <ShopSectionCard
                                        key={index}
                                        section={section}
                                        onSectionClick={(products) => { setProductSections(products) }}
                                    />
                                ))
                            ) : (
                                productsSections.length > 0 && (
                                    <>
                                        <p className={'button hover:cursor-cell'}  onClick={()=>setProductSections([])}><FiArrowLeft size={40}/></p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {productsSections.map((product, index) => (
                                            <div key={product.id}
                                                 className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                                                <img src={product?.image[0]?.path || default_image} alt={product.name}
                                                     className="w-full h-48 object-cover"/>
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                                    <p className="text-blue-600 font-bold">{product.minPrice}đ
                                                        - {product.maxPrice}đ</p>
                                                    <div className="flex items-center mt-2">
                                                        <FiStar className="text-yellow-400 mr-1"/>
                                                        <span>{product.rating}</span>
                                                    </div>
                                                    <button
                                                        className="mt-3 flex items-center justify-center w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                                                        <FiShoppingBag className="mr-2"/>
                                                        Thêm vào giỏ
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    </>
                                    )
                                    )}
                                    </div>
                                )}

                        </div>
                        </div>
                        <HomeFooter/>
                        </>
    );
}
export default ShopDetails;
