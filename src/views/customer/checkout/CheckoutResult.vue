<template>
  <div class="bkc-checkout-result">
    <div
      class="bkc-checkout-result-success"
      v-if="checkoutStatus == '00'"
    >
      <h5>Bạn đã đặt hàng thành công!</h5>
      <div class="img-checkout-success mt-4">
      </div>

      <v-btn
        tile
        color="#fbac14"
        width="300px"
        height="50px"
        class="white--text mt-4"
        @click="backToHomePage"
      >
        Quay về trang mua hàng
      </v-btn>
    </div>
    <div
      class="bkc-checkout-result-fail"
      v-if="checkoutStatus != '00'"
    >
      <h5>Thanh toán thất bại!</h5>
      <div class="img-checkout-fail mt-4">
      </div>
      <v-btn
        tile
        color="#fbac14"
        width="300px"
        height="50px"
        class="white--text mt-4"
        @click="checkoutAgain"
      >
        Thanh toán lại
      </v-btn>
      <v-btn
        tile
        color="#fbac14"
        width="300px"
        height="50px"
        class="white--text mt-4"
        @click="backToHomePage"
      >
        Quay về trang mua hàng
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  name: "CCheckoutResult",
  components: {},
  props: {},
  data() {
    return {
      checkoutStatus: "00",
    };
  },
  created() {
    if (this.$route.query && this.$route.query.vnp_ResponseCode) {
      this.checkoutStatus = this.$route.query.vnp_ResponseCode;
    }
  },
  methods: {
    backToHomePage() {
      this.$router.push({
        name: "c-main-home",
      });
    },
    checkoutAgain() {
      this.$router.push({
        name: "c-checkout",
      });
    },
  },
};
</script>
<style  scoped>
@import url("../../../css/customer/c-checkoutresult.css");
</style>
      
      