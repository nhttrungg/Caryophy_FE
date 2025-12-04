import React, { useState, useEffect } from 'react';
import {Formik, useFormik} from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import useAxiosSupport from '../hooks/useAxiosSupport';
import {VoucherType} from "../utils/constObject";
import {useSelector} from "react-redux";

const AddVoucherForm = ({ setIsModalOpen, merchantId, onVoucherAdded }) => {
    const axiosSupport = useAxiosSupport();
    const role = useSelector(state => state.user.role);
    const [voucherTypes, setVoucherTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const categoriesResponse = await axiosSupport.getAllCategory();
                setVoucherTypes(VoucherType);
                setCategories([...categoriesResponse]);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu ban đầu:', error);
                toast.error('Không thể tải dữ liệu ban đầu');
            }
        };
        fetchInitialData();
    }, []);

    const onSubmit = async (values) => {
            setIsModalOpen(false);
            const mappedValues = {
                name: values.name,
                code: values.code,
                voucherType: values.voucherType,
                conditionType: values.conditionType,
                voucherConditionId: values.voucherConditionId,
                valueCondition: parseFloat(values.maxDiscount),
                discount: parseFloat(values.discount),
                active: values.active,
                expirationDate: new Date(values.validTo).toISOString(),
                startDate: new Date(values.validFrom).toISOString(),
                status: values.status,
                merchantId: merchantId,
                quantity: parseInt(values.usageLimit),
                products: values.products,
                description: values.description,
                categoryId: values.categoryId ? parseInt(values.categoryId) : null,
                minPrice: values.minPrice ? parseFloat(values.minPrice) : null,
            };

            const res = await axiosSupport.createVoucher(mappedValues);
            if(res){
                toast.success('Thêm voucher thành công');
            }else{
                toast.error('Không thể thêm voucher');
            }
            onVoucherAdded(res);


    }


    const formik = useFormik({
        initialValues: {
            code: '',
            discount: '',
            validFrom: '',
            validTo: '',
            description: '',
            minPurchase: '',
            maxDiscount: '',
            usageLimit: '',
            voucherType: '',
            isActive: true,
            conditionType: '',
            categoryId: '',
            products: [],
            minPrice: '',
        },
        validationSchema: Yup.object({
            code: Yup.string().required('Bắt buộc'),
            discount: Yup.number()
              .required('Bắt buộc')
              .positive('Phải là số dương')
              .test('discount-range', 'Giá trị không hợp lệ', function(value) {
                const { voucherType } = this.parent;
                if (voucherType === 'PERCENT' || voucherType === 'MAX_PERCENT') {
                  if (value > 100) {
                    return this.createError({
                      message: 'Phần trăm giảm giá không thể vượt quá 100%',
                    });
                  }
                  return value > 0 && value <= 100;
                }
                return value > 0;
              }),
            validFrom: Yup.date().required('Bắt buộc'),
            validTo: Yup.date().required('Bắt buộc').min(Yup.ref('validFrom'), 'Ngày kết thúc phải sau ngày bắt đầu'),
            description: Yup.string().required('Bắt buộc'),
            minPurchase: Yup.number().required('Bắt buộc').min(0, 'Không được âm'),
            maxDiscount: Yup.number().required('Bắt buộc').min(0, 'Không được âm'),
            usageLimit: Yup.number().required('Bắt buộc').positive('Phải là số dương').integer('Phải là số nguyên'),
            voucherType: Yup.string().required('Bắt buộc'),
            conditionType: Yup.string().required('Loại điều kiện là bắt buộc'),
            categoryId: Yup.string().test('category-required', 'Danh mục là bắt buộc khi chọn điều kiện danh mục', function(value) {
                return this.parent.conditionType !== 'CATEGORY' || (this.parent.conditionType === 'CATEGORY' && value);
            }),
            productId: Yup.string().test('product-required', 'Sản phẩm là bắt buộc khi chọn điều kiện sản phẩm', function(value) {
                return this.parent.conditionType !== 'PRODUCT' || (this.parent.conditionType === 'PRODUCT' && value);
            }),
            minPrice: Yup.number().test('min-price-required', 'Giá tối thiểu là bắt buộc khi chọn điều kiện giá tối thiểu', function(value) {
                return this.parent.conditionType !== 'MIN_PRICE' || (this.parent.conditionType === 'MIN_PRICE' && value >= 0);
            }),
        }),
        onSubmit: onSubmit
    });

    return (
        <Formik
            formik={formik}
        >
            <form onSubmit={formik.handleSubmit}
                  className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Thêm Voucher Mới</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="col-span-1 sm:col-span-2 md:col-span-1">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Mã
                            Voucher</label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            {...formik.getFieldProps('code')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.code && formik.errors.code && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.code}</div>
                        )}
                    </div>

                    <div className="col-span-1 sm:col-span-2 md:col-span-1">
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Giảm giá
                            (%)</label>
                        <input
                            id="discount"
                            name="discount"
                            type="number"
                            {...formik.getFieldProps('discount')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.discount && formik.errors.discount && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.discount}</div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="validFrom" className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt
                            đầu</label>
                        <input
                            id="validFrom"
                            name="validFrom"
                            type="date"
                            {...formik.getFieldProps('validFrom')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.validFrom && formik.errors.validFrom && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.validFrom}</div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="validTo" className="block text-sm font-medium text-gray-700 mb-1">Ngày kết
                            thúc</label>
                        <input
                            id="validTo"
                            name="validTo"
                            type="date"
                            {...formik.getFieldProps('validTo')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.validTo && formik.errors.validTo && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.validTo}</div>
                        )}
                    </div>

                    <div className="col-span-1 sm:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô
                            tả</label>
                        <textarea
                            id="description"
                            name="description"
                            {...formik.getFieldProps('description')}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.description && formik.errors.description && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700 mb-1">Giá trị
                            đơn hàng tối thiểu</label>
                        <input
                            id="minPurchase"
                            name="minPurchase"
                            type="number"
                            {...formik.getFieldProps('minPurchase')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.minPurchase && formik.errors.minPurchase && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.minPurchase}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="voucherType" className="block text-sm font-medium text-gray-700 mb-1">Loại
                            Voucher</label>
                        <select
                            id="voucherType"
                            name="voucherType"
                            {...formik.getFieldProps('voucherType')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn loại voucher</option>
                            {voucherTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        {formik.touched.voucherType && formik.errors.voucherType && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.voucherType}</div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700 mb-1">Giảm giá
                            tối đa</label>
                        <input
                            id="maxDiscount"
                            name="maxDiscount"
                            type="number"
                            {...formik.getFieldProps('maxDiscount')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.maxDiscount && formik.errors.maxDiscount && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.maxDiscount}</div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700 mb-1">Giới hạn sử
                            dụng</label>
                        <input
                            id="usageLimit"
                            name="usageLimit"
                            type="number"
                            {...formik.getFieldProps('usageLimit')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.usageLimit && formik.errors.usageLimit && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.usageLimit}</div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="conditionType" className="block text-sm font-medium text-gray-700 mb-1">Loại
                            điều kiện</label>
                        <select
                            id="conditionType"
                            name="conditionType"
                            {...formik.getFieldProps('conditionType')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn loại điều kiện</option>
                            <option value="ONLY_CATEGORY">Danh mục</option>
                            {role[0].authority !== 'ROLE_ADMIN' && (<option value="ONLY_PRODUCT">Sản phẩm</option>)}
                            <option value="MIN_COST">Giá tối thiểu</option>
                        </select>
                        {formik.touched.conditionType && formik.errors.conditionType && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.conditionType}</div>
                        )}
                    </div>

                    {formik.values.conditionType === 'ONLY_CATEGORY' && (
                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Chọn
                                danh mục</label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                {...formik.getFieldProps('categoryId')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            {formik.touched.categoryId && formik.errors.categoryId && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.categoryId}</div>
                            )}
                        </div>
                    )}

                    {formik.values.conditionType === 'ONLY_PRODUCT' && role[0].authority !== 'ROLE_ADMIN' && (
                        <div>
                            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">Chọn sản
                                phẩm</label>
                            <select
                                id="productId"
                                name="productId"
                                {...formik.getFieldProps('productId')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn sản phẩm</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                            {formik.touched.productId && formik.errors.productId && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.productId}</div>
                            )}
                        </div>
                    )}

                    {formik.values.conditionType === 'MIN_COST' && (
                        <div>
                            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Giá tối
                                thiểu</label>
                            <input
                                id="minPrice"
                                name="minPrice"
                                type="number"
                                {...formik.getFieldProps('minPrice')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formik.touched.minPrice && formik.errors.minPrice && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.minPrice}</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Thêm Voucher
                    </button>
                </div>
            </form>

        </Formik>
    );
};

export default AddVoucherForm;