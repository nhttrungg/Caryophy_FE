import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosSupport';
import useAxiosSupport from "../hooks/useAxiosSupport";
import default_image from '../assets/images/default-image.svg';
import {Swiper, SwiperSlide} from "swiper/react";


const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const axiosSupport = useAxiosSupport();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosSupport.getAllCategory();
        setCategories(response);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, [axiosSupport]);

  return (
    <div className="py-12 sm:py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#0b328f]">Danh mục sản phẩm</h2>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          className="mySwiper"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <div className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <img 
                  src={category.imageUrl || default_image}
                  alt={category.name} 
                  className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
                />
                <p className="font-semibold text-[#0b328f] whitespace-nowrap overflow-hidden text-ellipsis">{category.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySection;