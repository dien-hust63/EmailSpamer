<template>
  <div
    class="bkc-product-card"
    :style="{'height':height}"
  >
    <div class="bkc-product-card-image">
      <v-img :src="product.image"></v-img>
    </div>
    <div class="bkc-product-card-title">
      <div class="product-card-name">{{ product.productname }}</div>
      <div class="product-card-price">{{ product.sellprice }} (VNĐ)</div>
    </div>
  </div>
</template>
          <script>
export default {
  name: "CProductCard",
  props: {
    product: Object,
    height: String,
  },
};
</script>
  <style  scoped>
@import url("../../../css/customer/c-productcard.css");
</style>
          
          