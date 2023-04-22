<template>
  <div class="bkc-productlisttab">
    <div
      class="product-category-item"
      v-for="(item, index) in productcategoryList"
      :key="index"
    >
      <div class="main-category mb-3">{{ item.parent.productcategoryname }}</div>
      <div class="sub-category">
        <div
          class="sub-category-item"
          @click="chooseProductCategory(child)"
          v-for="(child, i) in item.child"
          :key="i"
        >
          <v-icon class="m-0 p-0">mdi mdi-chevron-right</v-icon>{{ child.productcategoryname }}
        </div>
      </div>
    </div>
  </div>
</template>
    <script>
export default {
  name: "CProductListTab",
  data() {
    return {};
  },
  props: {
    productcategoryList: Array,
  },

  methods: {
    chooseProductCategory(item) {
      this.$router.push({
        name: "c-productcategory",
        params: {
          id: item["idproductcategory"],
          categoryname: item["categoryname"],
        },
      });
      this.$emit("closeProductListTab");
    },
  },
};
</script>
  <style  scoped>
@import url("../../../css/customer/c-productlisttab.css");
</style>
      
      