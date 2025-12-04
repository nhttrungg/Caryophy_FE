import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React, {useEffect, useState} from 'react';
import { Bar } from 'react-chartjs-2';
import { FiActivity, FiDollarSign, FiShoppingCart, FiUsers } from 'react-icons/fi';
import {useSelector} from "react-redux";
import useAxiosSupport from "../hooks/useAxiosSupport";
import BestSellerProducts from "./BestSellerProducts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dữ liệu mẫu cho biểu đồ
const chartData = [
    { name: 'T1', value: 2800 },
    { name: 'T2', value: 2200 },
    { name: 'T3', value: 1800 },
    { name: 'T4', value: 2800 },
    { name: 'T5', value: 5900 },
    { name: 'T6', value: 2700 },
    { name: 'T7', value: 1600 },
    { name: 'T8', value: 5200 },
    { name: 'T9', value: 3700 },
    { name: 'T10', value: 3400 },
    { name: 'T11', value: 1400 },
    { name: 'T12', value: 5400 },
];

const bestSellerProducts = [
    {
        id: 1,
        name: "Smartphone X1",
        sales: 1250,
        revenue: 25000000,
        image: "https://via.placeholder.com/50x50?text=X1"
    },
    {
        id: 2,
        name: "Laptop Pro",
        sales: 850,
        revenue: 42500000,
        image: "https://via.placeholder.com/50x50?text=LP"
    },
    {
        id: 3,
        name: "Wireless Earbuds",
        sales: 2000,
        revenue: 10000000,
        image: "https://via.placeholder.com/50x50?text=WE"
    },
    {
        id: 4,
        name: "Smart Watch",
        sales: 1500,
        revenue: 15000000,
        image: "https://via.placeholder.com/50x50?text=SW"
    },
    {
        id: 5,
        name: "4K TV",
        sales: 500,
        revenue: 50000000,
        image: "https://via.placeholder.com/50x50?text=4K"
    }
];

export const StatCard = ({ title, value, icon: Icon, change }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <Icon className="text-gray-400 w-5 h-5" />
        </div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
        </p>
    </div>
);

const ChartJSBarChart = ({ currentData, previousData }) => {
    const chartData = {
        labels: currentData.map(item => item.name),
        datasets: [
            {
                label: 'Doanh thu kỳ này',
                data: currentData.map(item => item.value),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            },
            {
                label: 'Doanh thu kỳ trước',
                data: previousData.map(item => item.value),
                backgroundColor: 'rgba(245, 158, 11, 0.5)',
                borderColor: 'rgb(245, 158, 11)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                },
            },
            title: {
                display: true,
                text: 'So sánh doanh thu',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: 'black',
                bodyColor: 'black',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                cornerRadius: 6,
                displayColors: true,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

const TimeSelector = ({ selectedTime, onTimeChange }) => {
    return (
        <select
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="ml-4 p-2 border border-gray-300 rounded-md text-sm"
        >
            <option value="thisMonth">Tháng này</option>
            <option value="lastMonth">Tháng trước</option>
            <option value="lastQuarter">Quý trước</option>
            <option value="lastYear">Năm trước</option>
            <option value="thisYear">Năm nay</option>
        </select>
    );
};

export default function DashboardHome() {
    const [selectedTime, setSelectedTime] = useState('thisMonth');
    const [orderComparison, setOrderComparison] = useState(null);
    const [revenueComparison, setCompareRevenueChange] = useState(null);
    const [currentRevenueData, setCurrentRevenueData] = useState([]);
    const [previousRevenueData, setPreviousRevenueData] = useState([]);
    const axiosSupport = useAxiosSupport();
    const {id:merchantId} = useSelector(state => state.merchant);

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentRevenueChartData = await axiosSupport.getRevenueChart(merchantId, selectedTime);
                const formattedCurrentRevenueData = Object.entries(currentRevenueChartData).map(([key, value]) => ({
                    name: `T${key}`,
                    value: value
                }));
                setCurrentRevenueData(formattedCurrentRevenueData);

                // Fetch previous period data
                const previousPeriod = getPreviousPeriod(selectedTime);
                const previousRevenueChartData = await axiosSupport.getRevenueChart(merchantId, previousPeriod);
                const formattedPreviousRevenueData = Object.entries(previousRevenueChartData).map(([key, value]) => ({
                    name: `T${key}`,
                    value: value
                }));
                setPreviousRevenueData(formattedPreviousRevenueData);

                const orderComparisonData = await axiosSupport.compareCountOrderWithPreviousMonth(merchantId);
                setOrderComparison(orderComparisonData);

                const compareRevenueChange = await axiosSupport.compareRevenueWithPreviousMonth(merchantId);
                setCompareRevenueChange(compareRevenueChange)
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, [merchantId, selectedTime]);

    const getPreviousPeriod = (currentPeriod) => {
        switch (currentPeriod) {
            case 'thisMonth':
                return 'lastMonth';
            case 'lastMonth':
                return 'lastQuarter';
            case 'lastQuarter':
                return 'lastYear';
            case 'lastYear':
            case 'thisYear':
                return 'lastYear';
            default:
                return 'lastMonth';
        }
    };


    return (
        <div className="p-6 bg-gray-50 min-h-screen rounded-md">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Tổng quan</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Tổng doanh thu" value={`${revenueComparison?.currentMonthRevenue && revenueComparison?.currentMonthRevenue.toFixed(2) || 0} đ`} icon={FiDollarSign} change={`${revenueComparison?.percentageChange && revenueComparison?.percentageChange.toFixed(2) || 0}% so với tháng trước`} />
                    <StatCard title="Người theo dõi" value="+2350" icon={FiUsers} change="+180,1% so với tháng trước" />
                    <StatCard title="Đơn hàng" value={`+${orderComparison?.currentMonthOrderCount && orderComparison?.currentMonthOrderCount.toFixed(0) || 0}`} icon={FiShoppingCart} change={`${orderComparison?.percentageChange && orderComparison?.percentageChange.toFixed(2) || 0}% so với tháng trước`} />
                    <StatCard title="Đang hoạt động" value="+573" icon={FiActivity} change="+201 so với giờ trước" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Tổng quan</h2>
                        <TimeSelector selectedTime={selectedTime} onTimeChange={handleTimeChange}/>
                    </div>
                    <ChartJSBarChart currentData={currentRevenueData} previousData={previousRevenueData}/>
                </div>
                <BestSellerProducts products={bestSellerProducts} />
            </div>
        </div>
    );
}