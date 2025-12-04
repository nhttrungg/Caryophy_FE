import React, {useEffect, useState} from 'react';
import { FiMinus, FiPlus, FiTrash2, FiChevronDown } from 'react-icons/fi';
import VariantSelect from './VariantSelect';
import Modal from "./Modal";
import VariantSelectCart from "./VariantSelectCart";

const CartItemCard = ({ item, onQuantityChange, onRemove, onVariantChange, setSelectedVariants,isSelected }) => {
  const [showVariantSelect, setShowVariantSelect] = useState(false);

  const toggleVariantSelect = () => {
    setShowVariantSelect(!showVariantSelect);
  };

  return (
      <div className="flex flex-col border-b py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
              {/* First row (or column on small screens) */}
              <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                  {/* Checkbox */}
                  <input
                      type="checkbox"
                      id={`select-${item.id}`}
                      className="form-checkbox h-5 w-5 text-blue-600 mr-4"
                      onChange={(e) => setSelectedVariants(prev =>
                          e.target.checked ? [...prev, item.id] : prev.filter(id => id !== item.id)
                      )}
                      checked={isSelected}
                  />
                  {/* Product Image and Info */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <img
                        src={item.image?.path || '/images/default-product-image.jpg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md mr-4"
                      />
                      <div>
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <p className="text-blue-600 font-semibold mt-1">
                          {item.price} VND
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => item.options.length > 1 && item.options[0].name !== 'DEFAULT' && toggleVariantSelect()}
                        className="text-gray-600 text-sm flex items-center hover:text-blue-500 focus:outline-none"
                      >
                        {item.options.map((option, index) => (
                          index === 0 ? <span key={index}>{option.name}</span> :
                            <span key={index}>, {option.name}</span>
                        ))}
                        <FiChevronDown className="ml-1"/>
                      </button>
                    </div>
                  </div>
              </div>

              {/* Second row (or column on small screens) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full sm:w-auto">
                  {/* Variant Selection */}
                  {/* Quantity Controls and Remove Button */}
                  <div className="flex items-center space-x-4">
                      <button
                          onClick={() => onQuantityChange(item.id, -1)}
                          className="p-2 hover:bg-gray-100"
                          disabled={item.quantity <= 0}
                      >
                          <FiMinus/>
                      </button>
                      <span className="px-4 py-2 border-x">{item.quantity > 0 ? item.quantity : 0}</span>
                      <button
                          onClick={() => onQuantityChange(item.id, 1)}
                          className="p-2 hover:bg-gray-100"
                          disabled={item.quantity > item.itemQuantity - 1}
                      >
                          <FiPlus/>
                      </button>
                      <button
                          onClick={() => onRemove(item.id)}
                          className="text-red-500 hover:text-red-700"
                      >
                          <FiTrash2 size={20}/>
                      </button>
                  </div>
              </div>
          </div>

          {/* Variant Select Modal */}
          {showVariantSelect && (
              <Modal isOpen={showVariantSelect} onClose={toggleVariantSelect}>
                  <div className="mt-4">
                      <VariantSelectCart
                          productId={item.product.id}
                          variant={item}
                          setIsOpen={setShowVariantSelect}
                      />
                  </div>
              </Modal>
          )}
      </div>
  );
}

export default CartItemCard;