import React from 'react';

const VariantSelect = ({ groupOptions, selectedOptions, handleOptionSelect }) => {
    return (
        groupOptions?.length > 0 && (
                <div className="my-6 border-t border-b py-4">
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
            )

    );
};

export default VariantSelect;