import React, {useEffect, useRef, useState} from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useAxiosSupport from "../hooks/useAxiosSupport";
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import default_image from "../assets/images/default-image.svg";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const VariantSelectCart = ({setIsOpen, productId , variant}) => {
    const axiosSupport = useAxiosSupport();
    const {id : userId} = useSelector(state => state.user);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate()

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [images,setImages] = useState([]);
    const [groupOptions, setGroupOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState(variant.options || []);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await axiosSupport.getDetailsProduct(productId);
                setProduct(res.product);

                // Initialize images with product images
                const productImages = res.product.image || [];
                let allImages = [...productImages]

                if (res.variants) {
                    setVariants(res.variants);
                    // Add variant images to allImages
                    res.variants.forEach(variant => {
                        if (variant.image && !allImages.some(img => img.id === variant.image.id)) {
                            allImages.push(variant.image);
                        }
                    });
                }

                if(res.product.groupOptions) {
                    setGroupOptions(res.product.groupOptions);
                }

                setImages(allImages);

                setSelectedImage(0);

            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProductDetails();

    }, [productId]);

    useEffect(() => {
        if (images[selectedImage]) {
            const variantWithSelectedImage = variants.find(variant =>
                variant.image && variant.image.id === images[selectedImage].id
            );
            if (variantWithSelectedImage) {
                setSelectedVariant(variantWithSelectedImage);
            }
        }
    }, [selectedImage, images, variants])


    useEffect(() => {
        if(selectedOptions.length === groupOptions.length) {
            setSelectedVariant(
                variants.find(variant => variant.options.every((option, index) => option === selectedOptions[index]))
            )
        }
    }, [selectedOptions]);

    const handleOptionSelect = (groupName, optionName) => {
        const prevOptions = {...selectedOptions,[groupName]: optionName};
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [groupName]: optionName
        }));

        const matchingVariant = variants.find(variant =>
            variant.options.every(opt =>
                prevOptions[opt.groupName] === opt.name
            )
        );


        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
            if (matchingVariant.image) {
                const imageIndex = images.findIndex(img => img.id === matchingVariant.image.id);
                if (imageIndex !== -1) {
                    setSelectedImage(imageIndex);
                    swiperRef.current.slideTo(imageIndex);
                }
            }
        }
    };

    const submitClick = async () => {
        try {
            await axiosSupport.updateVariantCart(userId, variant.id, selectedVariant.id);
            setIsOpen(false);
            // Reload the page after updating the cart
            window.location.reload();
        } catch (error) {
            console.error("Error updating cart:", error);
            // Optionally, you can show an error message to the user here
        }
    };


    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Image display section */}
            <div className="w-full md:w-1/2 md:h-[70vh]">
                <div className="relative w-full h-[300px]">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        pagination={{clickable: true}}
                        onSlideChange={(swiper) => {
                            const newIndex = swiper.activeIndex;
                            setSelectedImage(newIndex);

                            // Find the variant that matches the selected image
                            const selectedImg = images[newIndex];
                            if (selectedImg) {
                                const matchingVariant = variants.find(variant =>
                                    variant.image && variant.image.id === selectedImg.id
                                );
                                if (matchingVariant) {
                                    setSelectedVariant(matchingVariant);
                                } else {
                                    setSelectedVariant(null);
                                }
                            }
                        }}
                    >
                        {images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className="w-full h-[50vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black">
                                    <img
                                        src={img?.path || default_image}
                                        alt={`${product.name} - Image ${index + 1}`}
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = default_image;
                                        }}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Variant selection section */}
            <div className="w-full md:w-1/2">
                {groupOptions?.length > 0 && (
                    <div className="border-t border-b py-4">
                        <h3 className="text-lg font-semibold mb-3">Chọn phân loại:</h3>
                        {groupOptions.map((groupOption, groupIndex) => (
                            <div key={`group-${groupIndex}`} className="mb-4">
                                <h4 className="text-md font-medium mb-2">{groupOption.name}:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {groupOption.options.map((option, optionIndex) => (
                                        <button
                                            key={`option-${groupIndex}-${optionIndex}`}
                                            className={`px-4 py-2 border rounded-full hover:border-blue-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                selectedOptions[groupOption.name] === option.name ? 'bg-blue-500 text-white' : ''
                                            }`}
                                            onClick={() => handleOptionSelect(groupOption.name, option.name)}
                                        >
                                            {option.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                    onClick={() =>
                        submitClick()
                    }
                >
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
};

export default VariantSelectCart;