export const VoucherType = [
    { label: 'Giảm theo phần trăm', value: 'PERCENT' },
    { label: 'Giảm theo số tiền cố định', value: 'MINUS' },
    { label: 'Giảm tối đa theo số tiền', value: 'MAX_MINUS' },
    { label: 'Giảm tối đa theo phần trăm', value: 'MAX_PERCENT' }
];

export const FormStatus = {

}

export const VoucherCondition = {
    ONLY_CATEGORY: "Danh mục",
    ONLY_PRODUCT: "Sản phẩm",
    ONLY_SHOP: "Người bán",
    ALL_AVAILABLE: "Không giới hạn",
    MIN_COST: "Giá tối thiểu",
}


export const OrderStatus = {
    PENDING: "Chờ xác nhận",
    DOING: "Đang chuẩn bị đơn hàng",
    SHIPPING: "Đang giao hàng",
    DONE: "Hoàn thành",
    CANCEL: "Đã hủy"
}