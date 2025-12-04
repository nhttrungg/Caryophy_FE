import React, {useState, useEffect, useRef} from 'react';
import {FiChevronLeft, FiChevronRight, FiFilter, FiSearch, FiX} from 'react-icons/fi';
import {FaStar} from "react-icons/fa";
import {Pagination} from "swiper/modules";
import useAxiosSupport from "../../hooks/useAxiosSupport";
import {to} from "react-spring";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";



const ProductListingPage = () => {
  const selectedCategory = useSelector(state => state.user.selectedCategory);
  const axiosInstant = useAxiosSupport();
  const [products, setProducts] = useState([]);
  const filterRef = useRef(null);
  const navigate = useNavigate();
  const [totalPages,setTotalPages] = useState();
  const [categories, setCategories] = useState([]);
  const [provinces,setProvinces] = useState([]);
  const [filters, setFilters] = useState({
    address: '',
    priceMax: '',
    priceMin: '',
    isSale: false,
    categoryId: '',
    rating: 0,
    term: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const [pageable,setPageable] = useState(null);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchProduct = async () =>{
    const res = await axiosInstant.filterProducts(filters,currentPage,productsPerPage)
    setProducts(res.content);
    setTotalPages(res.totalPages)
    setPageable(Math.ceil(products.length / productsPerPage));
  }
  useEffect(()=>{
     if(selectedCategory){
       filters.categoryId = selectedCategory;
       fetchProduct()
     }
  },[selectedCategory])

  useEffect( ()=>{
    const fetchNewData = async ()=>{
      const res = await axiosInstant.filterProducts(filters,currentPage,productsPerPage)
      setProducts(prevState => {
        return [...prevState, ...res.content]
      });
      setTotalPages(res.totalPages)
      setPageable(Math.ceil(products.length / productsPerPage));
    }
     if(currentPage > pageable){
       fetchNewData()
     }
  },[currentPage])

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const addressSelector = () => {
      fetch('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
          .then(response => response.json())
          .then(data => {
            setProvinces(data);
          })
          .catch(error => console.error('Error:', error));
    };
    const fetchCategories = async () => {
      try {
        const response = await axiosInstant.getAllCategory();
        setCategories(response);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
    addressSelector();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const applyFilters = () => {
    fetchProduct()
  };

  const resetFilters = () => {
    setFilters({
      address: '',
      priceMax: '',
      priceMin: '',
      isSale: false,
      category: '',
      rating: 0
    });
  };




  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mega Filter - Left Side */}
        <div className="md:w-1/4">
          <div
              ref={filterRef}
              className={`filter-container ${showFilters ? 'show' : ''} bg-white p-4 rounded-lg shadow relative`}>
            <button
                onClick={() => setShowFilters(false)}
                className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24}/>
            </button>
            <h2 className="text-xl font-bold mb-4">Bộ lọc</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Địa chỉ cửa hàng</label>
                <select
                    value={filters.address}
                    onChange={(e) => handleFilterChange('address', e.target.value)}
                    className="w-full p-2 border rounded"
                >
                  <option value="">Tỉnh/Thành phố</option>
                  {provinces.map(province => (
                      <option key={province.Id} value={province.Name}>{province.Name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Khoảng giá</label>
                <div className="flex gap-2">
                  <input
                      type="number"
                      className="w-1/2 p-2 border rounded"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      placeholder="Tối thiểu"
                  />
                  <input
                      type="number"
                      className="w-1/2 p-2 border rounded"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      placeholder="Tối đa"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                      type="checkbox"
                      checked={filters.isSale}
                      onChange={(e) => handleFilterChange('isSale', e.target.checked)}
                      className="mr-2"
                  />
                  Chỉ hiện sản phẩm giảm giá
                </label>
              </div>
              <div>
                <label className="block mb-2">Phân loại</label>
                <select
                    className="w-full p-2 border rounded"
                    defaultValue={filters.categoryId}
                    value={filters.categoryId}
                    onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                  ))}
                </select>
              </div>
              {/* New Rating Filter */}
              <div>
                <label className="block mb-2">Đánh giá tối thiểu</label>
                <div className="flex items-center">
            <span className="ml-2 flex items-center">
              {[...Array(5)].map((_, index) => (
                  <FaStar
                      key={index}
                      className={`text-2xl ${index < (filters.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                      onClick={() => handleFilterChange('rating', index + 1)}
                  />
              ))}
            </span>
                  <span className="ml-2 text-lg">{filters.rating || 0}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                    onClick={applyFilters}
                    className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Áp dụng
                </button>
                <button
                    onClick={resetFilters}
                    className="w-1/2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Product Cards - Right Side */}
        <div className="md:w-3/4">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex items-center md:w-1/3">
              <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={filters.term}
                  onChange={(e) => handleFilterChange('address', e.target.value)}
                  className="w-full p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FiSearch className="w-5 h-5"/>
              </button>
            </form>
          </div>
          <div className="mb-4 md:hidden">
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded"
            >
              <FiFilter className="mr-2"/>
              Mở bộ lọc
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map(product => (
                <div key={product.id}
                     className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img src={product?.image[0]?.path || '/images/default-product-image.jpg'} alt={product.name}
                         className="w-full h-48 object-cover"/>
                    {product.discount > 0 && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-sm font-bold">
                          -{Math.floor(product?.discount)}%
                        </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
                    <div className="flex justify-between items-center mb-2">
                      {product.isDiscount && product.discount > 0 ? (
                          <>
                            <p className="text-gray-600 font-bold">{product?.salePrice} VND</p>
                            <p className="text-sm text-gray-400 line-through">
                              {product?.maxPrice || 0 + "-" + product?.minPrice || 0} VND
                            </p>
                          </>
                      ) : (
                          <p className="text-gray-600 font-bold">{product?.maxPrice || 0 + "-" + product?.minPrice || 0} VND</p>
                      )}
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm text-gray-600">{product?.rating || 0}</span>
                      <span className="text-sm text-gray-500 ml-2">({product?.reviewCount || 0} đánh giá)</span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            {product?.merchantAddress}
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-gray-100">
                        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
                        onClick={()=>navigate(`/client/details/${product.id}`)}>
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-8">
            <button
                className="px-4 py-2 rounded-l-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
            >
              <FiChevronLeft/>
            </button>
            <span className="px-4 py-2 bg-white">
            Trang {currentPage} trên {totalPages}
          </span>
            <button
                className="px-4 py-2 rounded-r-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
              <FiChevronRight/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;