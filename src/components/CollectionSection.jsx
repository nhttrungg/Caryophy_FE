import React, { useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductHomeCard from "./ProductHomeCard";
import HomeProductCard from "./ProductHomeCard";

const CollectionSection = ({ products, renderCollectionCards }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = useCallback(() => {
        setShowMore(prev => !prev);
    }, []);

    return (
        <section className="py-12 sm:py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#0b328f]">
                    Khám phá Bộ sưu tập của chúng tôi
                </h2>

                {!showMore ? (
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            768: { slidesPerView: 3, spaceBetween: 24 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        navigation
                        pagination={{ clickable: true }}
                        className="mb-8"
                    >
                        {renderCollectionCards(products.slice(0, 8))}
                    </Swiper>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        {products.map(product => <HomeProductCard item={product} />)}
                    </div>
                )}

                <div className="text-center">
                    <button
                        onClick={toggleShowMore}
                        className="bg-[#f2a429] text-white py-2 px-4 rounded hover:bg-[#e09321] transition-colors text-sm sm:text-base inline-flex items-center justify-center mx-auto"
                    >
                        {showMore ? <FiArrowUp className="mr-2"/> : <FiArrowDown className="mr-2"/>}
                        <span>{showMore ? 'Thu gọn' : 'Xem thêm'}</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CollectionSection;