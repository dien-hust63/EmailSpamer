<template>
  <div class="bkc-product-area">
    <div class="c-product-area-content">
      <v-row justify="center">
        <v-col
          v-for="(product,index) in listProduct"
          :key="index"
          cols="12"
          sm="6"
          xs="6"
          md="3"
          class="px-4"
        >
          <div
            class="c-product-area-item"
            @click="viewDetailProduct(product)"
          >
            <CProductCard :product="product" />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import CProductCard from "../productcard/ProductCard.vue";
export default {
  name: "CProductArea",
  components: { CProductCard },
  props: {
    listProduct: Array,
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    viewDetailProduct(product) {
      this.$router.push({
        name: "c-product-detail",
        params: { id: product["idproduct"] },
      });
    },
  },
};
</script>
  <style  scoped>
@import url("../../../css/customer/c-productarea.css");
</style>
      
      