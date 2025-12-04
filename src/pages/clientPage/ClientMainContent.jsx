import React, {useEffect, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import useAxiosSupport from "../../hooks/useAxiosSupport";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import {FiClock, FiShoppingBag, FiTag, FiTrendingUp} from "react-icons/fi";
import {setSelectedCategory} from "../../redux/reducers/userReducer";

const fakeFeaturedProducts = [
    {
        id: 1,
        name: "Smartphone X1",
        description: "Điện thoại thông minh cao cấp với camera 108MP",
        image: [{ path: "https://via.placeholder.com/300x300?text=Smartphone+X1" }],
        minPrice: 15000000,
        maxPrice: 20000000,
        sold: 1200,
        rating: 4.7,
        isDiscount: true
    },
    {
        id: 2,
        name: "Laptop Pro",
        description: "Laptop mỏng nhẹ, hiệu năng cao cho công việc",
        image: [{ path: "https://via.placeholder.com/300x300?text=Laptop+Pro" }],
        minPrice: 25000000,
        maxPrice: 30000000,
        sold: 800,
        rating: 4.5,
        isDiscount: false
    },
    {
        id: 3,
        name: "Smart Watch Series 5",
        description: "Đồng hồ thông minh theo dõi sức khỏe 24/7",
        image: [{ path: "https://via.placeholder.com/300x300?text=Smart+Watch" }],
        minPrice: 5000000,
        maxPrice: 7000000,
        sold: 2000,
        rating: 4.8,
        isDiscount: true
    },
    {
        id: 4,
        name: "Máy ảnh DSLR Pro",
        description: "Máy ảnh chuyên nghiệp cho nhiếp ảnh gia",
        image: [{ path: "https://via.placeholder.com/300x300?text=DSLR+Camera" }],
        minPrice: 35000000,
        maxPrice: 40000000,
        sold: 500,
        rating: 4.9,
        isDiscount: false
    }
];

const fakeNewArrivals = [
    {
        id: 5,
        name: "Tai nghe không dây Ultra",
        description: "Âm thanh sống động, chống ồn tuyệt vời",
        image: [{ path: "https://via.placeholder.com/300x300?text=Wireless+Earbuds" }],
        minPrice: 3000000,
        maxPrice: 4000000,
        sold: 300,
        rating: 4.6,
        isDiscount: true
    },
    {
        id: 6,
        name: "Máy lọc không khí Smart",
        description: "Không khí trong lành, điều khiển qua ứng dụng",
        image: [{ path: "https://via.placeholder.com/300x300?text=Air+Purifier" }],
        minPrice: 4000000,
        maxPrice: 5000000,
        sold: 150,
        rating: 4.4,
        isDiscount: false
    },
    {
        id: 7,
        name: "Bàn phím cơ Gaming",
        description: "Bàn phím chơi game chuyên nghiệp, LED RGB",
        image: [{ path: "https://via.placeholder.com/300x300?text=Gaming+Keyboard" }],
        minPrice: 2000000,
        maxPrice: 3000000,
        sold: 500,
        rating: 4.7,
        isDiscount: true
    },
    {
        id: 8,
        name: "Máy chiếu Mini HD",
        description: "Máy chiếu nhỏ gọn, chất lượng hình ảnh cao",
        image: [{ path: "https://via.placeholder.com/300x300?text=Mini+Projector" }],
        minPrice: 8000000,
        maxPrice: 10000000,
        sold: 100,
        rating: 4.3,
        isDiscount: false
    }
];

const fakeDeals = [
    {
        id: 9,
        title: "Giảm giá sốc Smartphone X1",
        description: "Giảm ngay 20% cho Smartphone X1 trong tuần này!",
        image: "https://via.placeholder.com/400x200?text=Smartphone+X1+Deal",
        discountPrice: "12.000.000 đ",
        originalPrice: "15.000.000 đ"
    },
    {
        id: 10,
        title: "Combo Laptop Pro + Chuột không dây",
        description: "Mua Laptop Pro và nhận ngay chuột không dây cao cấp",
        image: "https://via.placeholder.com/400x200?text=Laptop+Pro+Combo",
        discountPrice: "26.500.000 đ",
        originalPrice: "28.000.000 đ"
    },
    {
        id: 11,
        title: "Sale 50% Tai nghe không dây Ultra",
        description: "Cơ hội cuối để sở hữu tai nghe cao cấp với giá hời",
        image: "https://via.placeholder.com/400x200?text=Earbuds+Sale",
        discountPrice: "1.500.000 đ",
        originalPrice: "3.000.000 đ"
    }
];

const ClientMainContent = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {id} = useSelector(state => state.user);
    const [currentUser, setCurrentUser] = useState(id);
    const navigate = useNavigate();
    const axiosSupport = useAxiosSupport();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const dispatch = useDispatch();

    const handleProductClick = (item) => navigate(`/product/${item.id}`);

    const fetchProducts = async (page, size) => {
        setLoading(true);
        try {
            const response = await axiosSupport.getAllProduct(page, size);
            setProducts(prevProducts => [...prevProducts, ...response]);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosSupport.getAllCategory();
            setCategories(response);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [deals, setDeals] = useState([]);

    // useEffect(() => {
    //     fetchProducts(currentPage, pageSize);
    //     fetchCategories();
    //     fetchFeaturedProducts();
    //     fetchNewArrivals();
    //     fetchDeals();
    // }, []);

    useEffect(() => {
        fetchProducts(currentPage, pageSize);
        fetchCategories();
        // Use fake data instead of fetching
        setFeaturedProducts(fakeFeaturedProducts);
        setNewArrivals(fakeNewArrivals);
        setDeals(fakeDeals);
    }, []);

    const fetchFeaturedProducts = async () => {
        // Simulate fetching featured products
        const response = await axiosSupport.getFeaturedProducts();
        setFeaturedProducts(response);
    };

    const fetchNewArrivals = async () => {
        // Simulate fetching new arrivals
        const response = await axiosSupport.getNewArrivals();
        setNewArrivals(response);
    };

    const fetchDeals = async () => {
        // Simulate fetching deals
        const response = await axiosSupport.getDeals();
        setDeals(response);
    };

    useEffect(() => {
        fetchProducts(currentPage, pageSize);
        fetchCategories();
    }, []);

    const renderCollectionCards = (collections) => {
        return collections.map((item, index) => (
            <SwiperSlide key={index}>
                <div
                    className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-[300px] mx-auto mb-8 cursor-pointer transform hover:scale-105"
                    onClick={() => handleProductClick(item)}
                >
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                        <img
                            src={item?.image?.[0]?.path || 'https://via.placeholder.com/300?text=No+Image'}
                            alt={item.name || 'Product Image'}
                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                            }}
                        />
                        {item.isDiscount && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Sale
              </span>
                        )}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800 truncate">{item?.name}</h3>
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">{item?.description}</p>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-blue-600">{item?.minPrice || 0} - {item?.maxPrice || 0}</span>
                        <span className="text-sm text-gray-500">Đã bán: {item?.sold || 0}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm text-gray-600">{item?.rating?.toFixed(1) || 0}</span>
                    </div>
                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-300"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </SwiperSlide>
        ));
    };
    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pt-16">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
                        Khám Phá Thế Giới Mua Sắm Tuyệt Vời
                    </h1>
                    <p className="text-xl text-center mb-8">
                        Tìm kiếm ưu đãi tốt nhất cho tất cả mặt hàng yêu thích của bạn
                    </p>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm"
                                className="w-full py-3 px-4 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Featured Products Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <FiTrendingUp className="mr-2" /> Sản phẩm nổi bật
                    </h2>
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            768: { slidesPerView: 3, spaceBetween: 24 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        className="mb-12"
                    >
                        {renderCollectionCards(products)}
                    </Swiper>
                </section>

                {/* Categories Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <FiShoppingBag className="mr-2" /> Danh mục sản phẩm
                    </h2>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={2}
                        breakpoints={{
                            640: { slidesPerView: 3, spaceBetween: 20 },
                            768: { slidesPerView: 4, spaceBetween: 24 },
                            1024: { slidesPerView: 6, spaceBetween: 24 },
                        }}
                        navigation
                        pagination={{ clickable: true }}
                        className="mb-12"
                    >
                        {categories.map((category, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={()=>{
                                        dispatch(setSelectedCategory(category.id))
                                        navigate('/client/products')
                                    }}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>

                {/* New Arrivals Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <FiClock className="mr-2" /> Sản phẩm mới
                    </h2>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            768: { slidesPerView: 3, spaceBetween: 24 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        navigation
                        pagination={{ clickable: true }}
                        className="mb-12"
                    >
                        {renderCollectionCards(newArrivals)}
                    </Swiper>
                </section>

                {/* Deals Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                        <FiTag className="mr-2" /> Ưu đãi hấp dẫn
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deals.map((deal, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{deal.title}</h3>
                                    <p className="text-gray-600 mb-4">{deal.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-red-600">{deal.discountPrice}</span>
                                        <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ClientMainContent;