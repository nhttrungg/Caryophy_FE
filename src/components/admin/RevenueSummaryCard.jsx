import React from 'react';
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

const RevenueSummaryCard = ({ title, value, percentChange, icon: Icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-green-100 rounded-full">
            <Icon className="text-green-500 text-2xl" />
          </div>
          <div
            className={`text-sm font-medium ${
              percentChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            <span className="flex items-center">
              {percentChange >= 0 ? (
                <FiArrowUpRight className="mr-1" />
              ) : (
                <FiArrowDownRight className="mr-1" />
              )}
              {Math.abs(percentChange)}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {typeof value === 'number' ? value.toLocaleString() : value} đ
          </p>
        </div>
        <p className="text-xs text-gray-400">So với tháng trước</p>
      </div>
    </div>
  );
};

export default RevenueSummaryCard;