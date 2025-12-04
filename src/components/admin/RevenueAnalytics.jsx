import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import {
    FiArrowDownRight,
    FiArrowUpRight,
    FiCreditCard,
    FiDollarSign,
    FiShoppingCart,
    FiTrendingUp,
    FiUsers
} from 'react-icons/fi';
import RevenueSummaryCard from "./RevenueSummaryCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function RevenueAnalytics() {
    const [timePeriod, setTimePeriod] = useState('thisMonth');
    const [topSalers, setTopSalers] = useState([]);
    const [revenueData, setRevenueData] = useState({
        labels: [],
        datasets: [{
            label: 'Revenue',
            data: [],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }],
    });

    const [categoryRevenue, setCategoryRevenue] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
        }],
    });
    const [summaryData, setSummaryData] = useState({
        totalRevenue: 0,
        orderCount: 0,
        averageOrderValue: 0,
    });

    useEffect(() => {
        fetchRevenueData(timePeriod);
        fetchTopSalers();
        fetchCategoryRevenue();
    }, [timePeriod]);

    const fetchRevenueData = (period) => {

        const dummyData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue',
                data: [50000, 55000, 60000, 58000, 62000, 65000, 70000, 68000, 72000, 75000, 80000, 85000],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }],
        };
        setRevenueData(dummyData);

        const previousMonthRevenue = 70000; // This should come from your API
        const currentMonthRevenue = dummyData.datasets[0].data[dummyData.datasets[0].data.length - 1];
        const percentChange = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(2);

        setSummaryData({
            totalRevenue: dummyData.datasets[0].data.reduce((a, b) => a + b, 0),
            orderCount: 1250,
            averageOrderValue: 54.4,
            percentChange: parseFloat(percentChange)
        });
    };

    const fetchTopSalers = () => {
        setTopSalers([
            { name: 'John Doe', sales: 50000 },
            { name: 'Jane Smith', sales: 45000 },
            { name: 'Bob Johnson', sales: 40000 },
            { name: 'Alice Brown', sales: 35000 },
            { name: 'Charlie Davis', sales: 30000 },
        ]);
    };

    const fetchCategoryRevenue = () => {
        // Implement API call to fetch category revenue
        // For now, we'll use dummy data
        setCategoryRevenue({
            labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Toys'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                ],
            }],
        });
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Revenue Analytics' },
        },
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Phân tích doanh thu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <RevenueSummaryCard
                    title="Tổng doanh thu"
                    value={summaryData.totalRevenue}
                    percentChange={summaryData.percentChange}
                    icon={FiDollarSign}
                />
                <RevenueSummaryCard
                    title="Số đơn hàng"
                    value={summaryData.orderCount}
                    percentChange={5} // You might want to calculate this dynamically
                    icon={FiShoppingCart}
                />
                <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Doanh thu theo danh mục</h3>
                    <div className="h-40">
                        {categoryRevenue.labels.length > 0 &&
                            <Pie data={categoryRevenue} options={{maintainAspectRatio: false}}/>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
                    {revenueData.labels.length > 0 && <Bar options={options} data={revenueData}/>}
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Top 5 Nhân viên bán hàng</h3>
                    <table className="w-full">
                        <thead>
                        <tr>
                            <th className="text-left py-2 px-4 bg-gray-100 font-semibold text-gray-600">Nhân viên</th>
                            <th className="text-right py-2 px-4 bg-gray-100 font-semibold text-gray-600">Doanh số</th>
                        </tr>
                        </thead>
                        <tbody>
                        {topSalers.map((saler, index) => (
                            <tr key={index}
                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex items-center">
                                        <img
                                            src={saler.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(saler.name)}&background=random`}
                                            alt={saler.name}
                                            className="w-8 h-8 rounded-full mr-3"
                                        />
                                        <span>{saler.name}</span>
                                    </div>
                                </td>
                                <td className="text-right py-2 px-4 border-b font-medium text-gray-800">{saler.sales.toLocaleString()} đ</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}