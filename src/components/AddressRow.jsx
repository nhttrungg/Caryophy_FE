import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import {FaMapMarkerAlt} from "react-icons/fa";
import {ErrorMessage, Field} from "formik";

const AddressRow = ({ address, district, province, ward , setFieldValue}) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [detailedAddress, setDetailedAddress] = useState(address || '');
    console.log("address:", address, "district:", district, "province:", province, "ward:", ward);

    useEffect(() => {
        addressSelector();
    }, []);

    const addressSelector = () => {
        fetch('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then(response => response.json())
            .then(data => {
                setProvinces(data);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleProvinceChange = (e) => {
        province = e.target.options[e.target.selectedIndex].text;// Sử dụng tên tỉnh/thành phố thay vì ID
        setFieldValue('province', province); // Cập nhật giá trị của trường province trong form
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        const selectedProvinceData = provinces.find(p => p.Id === provinceId);
        setDistricts(selectedProvinceData ? selectedProvinceData.Districts : []);
        setSelectedDistrict('');
        setWards([]);
    };

    const handleDistrictChange = (e) => {
        district = e.target.options[e.target.selectedIndex].text; // Sử dụng tên quận/huyện thay vì ID
        setFieldValue('district', district); // Cập nhật giá trị của trường district trong form
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        const selectedDistrictData = districts.find(d => d.Id === districtId);
        setWards(selectedDistrictData ? selectedDistrictData.Wards : []);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <select
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    className="w-full md:w-1/3 p-2 border rounded"
                >
                    <option value="">Tỉnh/Thành phố</option>
                    {provinces.map(province => (
                        <option key={province.Id} value={province.Id}>{province.Name}</option>
                    ))}
                </select>
        
                <select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className="w-full md:w-1/3 p-2 border rounded"
                >
                    <option value="">Quận/Huyện</option>
                    {districts.map(district => (
                        <option key={district.Id} value={district.Id}>{district.Name}</option>
                    ))}
                </select>
        
                <select
                    value={selectedWard}
                    onChange={(e) => {
                        setSelectedWard(e.target.value)
                        ward = e.target.options[e.target.selectedIndex].text;
                        setFieldValue('ward', ward);
                    }}
                    className="w-full md:w-1/3 p-2 border rounded"
                >
                    <option value="">Phường/Xã</option>
                    {wards.map(ward => (
                        <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
                    ))}
                </select>
            </div>
        
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ chi tiết</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <FaMapMarkerAlt className="h-5 w-5"/>
                    </span>
                    <Field
                        name="address"
                        type="text"
                        onChange={(e) => {
                            setDetailedAddress(e.target.value)
                            setFieldValue('address', detailedAddress);
                        }}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300"
                    />
                </div>
                <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1"/>
            </div>
        </div>
    );
};

export default AddressRow;