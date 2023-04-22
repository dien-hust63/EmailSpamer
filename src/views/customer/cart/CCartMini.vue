<template>
  <div class="bkc-cart-mini">
    <div class="c-nav-header-right-icon c-nav-header-right-icon-cart">
      <v-icon
        large
        @click="showCartMini()"
      >
        mdi mdi-cart-minus
      </v-icon>
      <div
        class="c-nav-cart-minus-count"
        @click="showCartMini()"
      >
        {{ $store.state.cart.totalCartItem }}
      </div>

      <div
        class="c-nav-cart-mini-content"
        v-show="isShowCartMini "
      >
        <div class="cart-mini-content-header">
          <div class="title">Giỏ hàng</div>
          <div
            class="close"
            @click="isShowCartMini = false"
          >
            <v-icon size="30px">mdi-close</v-icon>
          </div>
        </div>
        <div class="cart-mini-content-body ">
          <div
            class="cart-mini-content-body-empty"
            v-if="$store.state.cart.totalCartItem == 0"
          >
            <div class="">Giỏ hàng của bạn trống.</div>
          </div>
          <div
            class="cart-mini-body-item"
            v-for="(item, index) in $store.state.cart.cartList"
            :key="index"
          >
            <div class="cart-mini-item-image">
              <v-img :src="item.image"></v-img>
            </div>
            <div class="cart-mini-item-content pl-3">
              <div class="mini-item-name">
                <div class="mini-item-product-name">{{item.productname}}</div>
                <div class="delete-icon">
                  <v-icon
                    size="24px"
                    @click="removeProductFromList(item)"
                  >mdi-delete</v-icon>
                </div>
              </div>
              <div class="mini-item-price"><b class="red--text">{{item.sellprice}}đ</b></div>
              <div class="mini-item-color-size">Màu sắc: {{item.color}}, Size: {{item.size}}</div>
              <div class="quantity-total">
                <ButtonQuantity
                  :quantityVal="passQuantityInList(item)"
                  @changeQuantity="changeQuantityInList(...arguments, item)"
                  :key="item.idproduct"
                />
                <div class="item-total">
                  <div>
                    Tổng cộng: <b class="red--text">{{item.sellprice * item.quantity}}đ</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cart-mini-content-footer">
          <div class="footer-total mt-2">Tổng cộng: <b class="red--text">{{totalPrice}}đ</b></div>
          <div class="btn-view-cart">
            <v-btn
              tile
              color="#fbac14"
              width="100%"
              height="100%"
              class="white--text"
              @click="viewCartDetail"
            >
              Xem giỏ hàng
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonQuantity from "../../common/ButtonQuantity.vue";
export default {
  name: "CCartMini",
  components: {
    ButtonQuantity,
  },
  data() {
    return {
      isShowCartMini: false,
    };
  },
  methods: {
    viewCartDetail() {
      this.isShowCartMini = false;
      this.$router.push({
        name: "c-cart",
      });
    },
    showCartMini() {
      this.isShowCartMini = !this.isShowCartMini;
    },
    changeQuantityInList(quantity, item) {
      if (quantity && quantity != "") {
        item.quantity = parseInt(quantity);
      }
    },
    passQuantityInList(item) {
      return item.quantity;
    },
    removeProductFromList(item) {
      this.$store.commit("cart/removeProductToCart", item);
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
@import url("../../../css/customer/c-cartmini.css");
</style>
      
      