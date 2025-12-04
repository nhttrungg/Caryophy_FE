import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBook,
  FaUniversity,
  FaInfoCircle,
  FaEnvelope,
  FaSignInAlt,
  FaShoppingCart,
  FaBox,
  FaStore
} from 'react-icons/fa';
import { FaFacebookF, FaYoutube, FaGoogle } from 'react-icons/fa';
import { AiOutlineAppstore } from 'react-icons/ai';
import { IoLibrary } from 'react-icons/io5';
import { Link as ScrollLink } from 'react-scroll';
import BorrowBooksImage from '../assets/images/borrowBooks.png'
import ReactDOM from 'react-dom';
import { FaBookOpen, FaClock, FaCalendar, FaSearch, FaBars, FaChevronRight, FaUsers, FaBookmark, FaGraduationCap, FaGlobe } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import useAxiosSupport from "../hooks/useAxiosSupport";
import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import CollectionSection from "../components/CollectionSection";
import CategorySection from "../components/CategorySection";
import FeatureProductSection from "../components/FeatureProductSection";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducers/cartReducer";
import HomeProductCard from "../components/ProductHomeCard";
export default function HomePage() {
  const axiosSupport = useAxiosSupport();

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const fetchProducts = useCallback(async (page, size) => {
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
  }, [axiosSupport]);

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [fetchProducts, currentPage, pageSize]);

  const [backgroundImage, setBackgroundImage] = useState("https://img.freepik.com/free-photo/cyber-monday-retail-sales_23-2148688493.jpg");
  const images = [
    "https://img.freepik.com/free-photo/cyber-monday-retail-sales_23-2148688493.jpg",
    "https://img.freepik.com/free-photo/woman-holding-various-shopping-bags-copy-space_23-2148674122.jpg",
    "https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg"
  ];



  const renderCollectionCards = (collections) => {
    return collections.map((item, index) => (
      <SwiperSlide key={index}>
        <HomeProductCard item={item} />
      </SwiperSlide>));
  };

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setBackgroundImage(images[currentIndex]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HomeHeader />

      <main className="flex-grow">
        <div className="bg-cover bg-center py-16 sm:py-24 md:py-32 relative" id="banner-section"
          style={{ backgroundImage: `url(${backgroundImage})` }}>
          {/* Overlay tối màu */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="bg-black bg-opacity-30 p-6 rounded-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-white
                     text-shadow-lg">
                Chào mừng đến với HTQ eCommerce
              </h1>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-white font-semibold text-shadow-md
                    max-w-2xl mx-auto">
                Khám phá thế giới mua sắm trực tuyến tại HTQ eCommerce. Chúng tôi cung cấp đa dạng
                sản phẩm chất lượng cao và dịch vụ khách hàng xuất sắc.
              </p>
              <div className="max-w-xl mx-auto flex flex-col sm:flex-row">
                <input type="text" placeholder="Tìm kiếm sản phẩm..."
                  className="w-full sm:flex-grow px-4 py-2 rounded-lg sm:rounded-r-none
                          focus:outline-none focus:ring-2 focus:ring-[#0b328f] mb-2 sm:mb-0"/>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#f2a429] hover:bg-[#e09321] text-white px-6 py-2
                    rounded-lg sm:rounded-l-none transition-colors flex items-center
                    justify-center font-bold whitespace-nowrap"
                >
                  <FaSearch className="h-4 w-4 mr-2" />
                  <span>Tìm kiếm</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <CategorySection />


        <CollectionSection products={products} renderCollectionCards={renderCollectionCards} />

        <FeatureProductSection />
        <div className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#0b328f]">Khuyến mãi hot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: "Giảm 20% cho đơn hàng trên 5 triệu",
                  desc: "Áp dụng cho tất cả sản phẩm. Thời gian: 1/6 - 30/6"
                },
                { title: "Mua 1 tặng 1 phụ kiện", desc: "Khi mua smartphone. Thời gian: Đến hết tháng 6" },
                { title: "Trả góp 0%", desc: "Áp dụng cho laptop và điện thoại cao cấp. Thời gian: Không giới hạn" }
              ].map((promo, index) => (
                <div key={index}
                  className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0b328f] mb-2">{promo.title}</h3>
                  <p className="text-sm text-gray-600">{promo.desc}</p>
                  <button
                    className="mt-4 bg-[#f2a429] text-white px-4 py-2 rounded hover:bg-[#e09118] transition-colors">
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#0b328f]">Sản phẩm gợi ý hôm
              nay</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  category: "Sách",
                  products: [
                    { name: "Đắc Nhân Tâm", author: "Dale Carnegie", image: "path_to_image1.jpg", price: "100.000đ" },
                    { name: "Nhà Giả Kim", author: "Paulo Coelho", image: "path_to_image2.jpg", price: "120.000đ" },
                  ]
                },
                {
                  category: "Văn phòng phẩm",
                  products: [
                    { name: "Bút bi cao cấp", brand: "Parker", image: "path_to_image3.jpg", price: "50.000đ" },
                    { name: "Sổ tay bìa da", brand: "Moleskine", image: "path_to_image4.jpg", price: "80.000đ" },
                  ]
                },
                {
                  category: "Thiết bị điện tử",
                  products: [
                    { name: "Tai nghe không dây", brand: "Sony", image: "path_to_image5.jpg", price: "1.500.000đ" },
                    { name: "Bàn phím cơ", brand: "Logitech", image: "path_to_image6.jpg", price: "2.000.000đ" },
                  ]
                }
              ].map((category, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-md">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0b328f] mb-4">{category.category}</h3>
                  <div className="space-y-4">
                    {category.products.map((product, productIndex) => (
                      <div key={productIndex}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <img src={product.image} alt={product.name}
                          className="w-full h-48 object-cover rounded-md mb-4" />
                        <h4 className="text-md font-semibold text-[#0b328f]">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.author || product.brand}</p>
                        <p className="text-[#f2a429] font-bold mt-2">{product.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-12 sm:py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#0b328f]">Dịch vụ Nổi
              bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: "Giao hàng nhanh chóng",
                  desc: "Nhận hàng trong vòng 24h",
                  items: ["Miễn phí vận chuyển", "Theo dõi đơn hàng", "Đổi trả dễ dàng", "Hỗ trợ 24/7"]
                },
                {
                  title: "Thanh toán an toàn",
                  desc: "Đa dạng phương thức thanh toán",
                  items: ["Thẻ tín dụng/ghi nợ", "Ví điện tử", "Thanh toán khi nhận hàng", "Chuyển khoản ngân hàng"]
                },
                {
                  title: "Khuyến mãi hấp dẫn",
                  desc: "Tiết kiệm hơn khi mua sắm",
                  items: ["Giảm giá theo mùa", "Ưu đãi thành viên", "Tích điểm đổi quà", "Flash sale hàng tuần"]
                }
              ].map((service, index) => (
                <div key={index}
                  className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#0b328f]">{service.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{service.desc}</p>
                  <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                    {service.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                  <button
                    className="mt-4 w-full bg-[#f2a429] text-white py-2 rounded hover:bg-[#e09321] transition-colors text-sm sm:text-base">
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-12 sm:py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#0b328f]">Thống kê Thương
              mại</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {[
                { icon: FaShoppingCart, number: "1,000,000+", desc: "Đơn hàng thành công" },
                { icon: FaBox, number: "50,000+", desc: "Sản phẩm đang bán" },
                { icon: FaUsers, number: "100,000+", desc: "Khách hàng đăng ký" },
                { icon: FaStore, number: "1,000+", desc: "Cửa hàng đối tác" }
              ].map((stat, index) => (
                <div key={index}
                  className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                  <stat.icon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-[#f2a429]" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-[#0b328f]">{stat.number}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#0b328f]">Đối tác của Chúng
              tôi</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-8">
              {[...Array(6)].map((_, index) => (
                <img key={index} src={backgroundImage} alt={`Đối tác ${index + 1}`}
                  className="mx-auto filter grayscale hover:filter-none transition-all duration-300" />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Contact div */}
      <div id="contact" className="py-12 md:py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Đăng kí gia nhập làm người bán hàng</h2>
          <a href="mailto:library@university.edu"
            className="bg-[#0b328f] text-white px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-[#08367b] text-base md:text-lg transition-transform transform hover:scale-105">
            <FaEnvelope size={20} className="inline mr-2" /> Đăng kí ngay
          </a>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
}
