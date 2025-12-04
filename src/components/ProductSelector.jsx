import React, { useState, useEffect } from 'react';
import useAxiosSupport from "../hooks/useAxiosSupport";

const ProductSelector = ({ shopId, selectedProducts, setSelectedProducts }) => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const axiosSupport = useAxiosSupport();

    useEffect(() => {
        fetchProducts();
    }, [shopId]);

    const fetchProducts = async () => {
        try {
            const response = await axiosSupport.getProductByMerchantId(shopId);
            setProducts(response);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleProductSelect = (product) => {
        if (selectedProducts.some(p => p.id === product.id)) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
            setSelectedProductId(null);
        } else {
            setSelectedProducts([...selectedProducts, product]);
            setSelectedProductId(product.id);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Chọn sản phẩm cho danh mục</h3>
            <div className="max-h-60 overflow-y-auto">
                {products.map(product => (
                    <div key={product.id} className="mb-4">
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id={`product-${product.id}`}
                                checked={selectedProducts.some(p => p.id === product.id)}
                                onChange={() => handleProductSelect(product)}
                                className="mr-2"
                            />
                            <label htmlFor={`product-${product.id}`}>{product.name}</label>
                        </div>
                        {selectedProductId === product.id && (
                            <div className="ml-6 mt-2">
                                <img 
                                    src={product?.image[0]?.path || '/images/default-product-image.jpg'}
                                    alt={product.name}
                                    className="w-24 h-24 object-cover rounded"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSelector;