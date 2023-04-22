const OrderStatus = {
    // Thành công
    Success : 1,

    //Chờ tiếp nhận
    WaitingReceive : 2,

    // Đã tiếp nhận
    Received : 3,

    // Chờ giao hàng
    WaitingDeliver : 4,

    //Đang giao hàng
    DoingDeliver : 5,

    // Giao hàng thất bại
    DeliverFail : 6,

    //Đổi hàng
    Exchange : 7,

    // Trả hàng
    Return : 8,

    // Hủy
    Destroy : 9,
}
export default OrderStatus;