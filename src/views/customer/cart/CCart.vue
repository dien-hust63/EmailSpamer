<template>
  <div class="bkc-cart">
    <div class="bkc-cart-content">
      <div class="bkc-cart-content-header">
        <div class="title">GIỎ HÀNG</div>
        <div class="count-product">({{$store.state.cart.totalCartItem}}) Sản phẩm</div>
      </div>
      <div class="bkc-cart-content-detail mt-4">
        <div
          class="bkc-cart-content-detail-empty"
          v-show="$store.state.cart.totalCartItem == 0"
        >
          <div class="mb-4">Giỏ hàng của bạn trống.</div>
          <v-btn
            tile
            color="#fbac14"
            class="white--text"
            width="300px"
            height="50px"
            @click="backToHomePage"
          >
            Về trang mua hàng
          </v-btn>
        </div>
        <table
          class="bkc-table-cart"
          v-show="$store.state.cart.totalCartItem > 0"
        >
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
            <th></th>
          </tr>
          <tr
            v-for="(product, index) in $store.state.cart.cartList"
            :key="index"
            class="bkc-table-cart-row"
          >
            <td class="bkc-table-cart-cell">
              <div class="bkc-table-cart-product-name">
                <div class="table-cart-img">
                  <v-img :src="product.image"></v-img>
                </div>
                <div class="product-name ml-2">
                  <div class="product-name-link">{{product.productname}}</div>
                  <div class="product-name-color-size">Màu sắc: {{product.color}}</div>
                  <div class="product-name-color-size">Size: {{product.size}}</div>
                </div>
              </div>
            </td>
            <td class="bkc-table-cart-cell"><b>{{product.sellprice}}đ</b></td>
            <td class="bkc-table-cart-cell">
              <ButtonQuantity
                :quantityVal="passQuantityInList(product)"
                @changeQuantity="changeQuantityInList(...arguments, product)"
                :key="product.idproduct"
              />
            </td>
            <td class="bkc-table-cart-cell"><b class="red--text">{{product.quantity * product.sellprice}}đ</b></td>
            <td>
              <div>
                <v-icon
                  class="delete-icon"
                  @click="removeProductFromList(product)"
                >mdi-delete</v-icon>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div
      class="bkc-cart-total"
      v-show="$store.state.cart.totalCartItem > 0"
    >
      <div class="bkc-cart-total-price">
        <div><b>Tổng đơn hàng (Tạm tính):</b></div>
        <div><b class="red--text">{{totalPrice}}đ</b></div>
      </div>
      <div class="btn-order">
        <v-btn
          tile
          color="#fbac14"
          width="100%"
          height="100%"
          class="white--text"
          @click="redirectOrderPage"
        >
          Đặt hàng
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonQuantity from "../../common/ButtonQuantity.vue";
export default {
  name: "CCart",
  components: {
    ButtonQuantity,
  },
  data() {
    return {};
  },
  methods: {
    redirectOrderPage() {
      this.$router.push({
        name: "c-checkout",
      });
    },
    changeQuantityInList(quantity, product) {
      if (quantity && quantity != "") {
        product.quantity = parseInt(quantity);
      }
    },
    passQuantityInList(product) {
      return product.quantity;
    },
    removeProductFromList(product) {
      this.$store.commit("cart/removeProductToCart", product);
    },
    backToHomePage() {
      this.$router.push({
        name: "c-main-home",
      });
    },
  },
  computed: {
    totalPrice() {
      console.log(this.$store.state.cart);
      return this.$store.state.cart.cartList.reduce(
        (sum, item) => sum + item.sellprice * item.quantity,
        0
      );
    },
  },
};
</script>
  <style  scoped>
@import url("../../../css/customer/c-cart.css");
</style>
      
      