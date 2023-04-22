<template>
  <div class="bkc-content-home">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>
  <script>
// import CProductCard from "../productcard/ProductCard.vue";
export default {
  name: "CContentHome",
  // components: {
  //   CProductCard,
  // },
  data() {
    return {
      items: [
        {
          src: "https://nvdien1.blob.core.windows.net/image/banner-web.jpg",
        },
        {
          src: "https://nvdien1.blob.core.windows.net/image/Banner-web-2.jpg",
        },
        {
          src: "https://nvdien1.blob.core.windows.net/image/banner-web3.jpg",
        },
      ],
      product: {
        mainimage: "https://nvdien1.blob.core.windows.net/image/test.jpg",
        productname: "Áo khoác nam AKHTK305",
        sellprice: "949.000",
      },
    };
  },
};
</script>
<style  scoped>
@import url("../../../css/customer/c-contenthome.css");
</style>
    
    