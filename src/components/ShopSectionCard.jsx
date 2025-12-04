import React from 'react';
import AxiosSupport from '../services/axiosSupport';

const ShopSectionCard = ({ section, onSectionClick }) => {
  const axiosSupport = new AxiosSupport();

  const handleClick = async () => {
    try {
      const products = await axiosSupport.getMerchantCategoriesInShopSection(section.id);
      onSectionClick(products);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
      <div
          className="flex items-center p-4 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
          onClick={handleClick}
      >
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{section.name}</h3>
          <p className="text-gray-600">{section.description}</p>
        </div>
      </div>
  );
};

export default ShopSectionCard;