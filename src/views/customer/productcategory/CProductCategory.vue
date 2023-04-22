<template>
  <div class="bkc-product-category">
    <div class="bkc-product-category-header">
      <div class="title">{{titleCategory}}</div>
      <div class="c-productcategory-sortorder">
        <v-select
          v-model="selectedSortOrder"
          :items="listSortOrder"
          variant="underlined"
          @change="sortProduct($event)"
          item-text="text"
          item-value="id"
          return-object
          width="300px"
        ></v-select>
      </div>
    </div>
    <div
      class="
        empty-region-image"
      v-if="listProduct.length == 0"
    >
      <img
        src="../../../assets/images/nodata.jpg"
        alt="Không có dữ liệu"
        width="400px"
      >
    </div>
    <div
      class="
        c-list-product-region"
      v-if="listProduct.length > 0"
    >
      <c-product-area :listProduct="listProduct" />
      <v-pagination
        v-model="pageIndex"
        :length="pageShow"
        :total-visible="pageShow"
      ></v-pagination>
    </div>
  </div>
</template>
<script>
import CProductArea from "../product/CProductArea.vue";
import { FactoryService } from "../../../service/factory/factory.service";
const ProductService = FactoryService.get("productService");
const ProductCategoryService = FactoryService.get("productcategoryService");
export default {
  components: { CProductArea },
  name: "CProductCategory",
  data() {
    return {
      pageIndex: 1,
      pageShow: 2,
      pageSize: 12,
      totalPage: 0,
      currentPageShow: 0,
      maxPageShow: 7,
      listProduct: [],
      category: {},
      titleCategory: "",
      searchtext: "",
      listSortOrder: [
        {
          id: 1,
          text: "Mới nhất",
        },
        {
          id: 2,
          text: "Giá thấp đến cao",
        },
        {
          id: 3,
          text: "Giá cao xuống thấp",
        },
      ],
      selectedSortOrder: {
        id: 1,
        text: "Mới nhất",
      },
      currentCategory: {},
    };
  },
  created() {
    this.getListProductByCategoryDefault();
    this.getCurrentCategory();
  },
  methods: {
    getCurrentCategory() {
      const me = this;
      ProductCategoryService.getDataById(this.$route.params.id).then(
        (result) => {
          if (result && result.data) {
            me.currentCategory = result.data.data;
            me.titleCategory = me.currentCategory["productcategoryname"];
          }
        }
      );
    },
    getListProductByCategoryDefault() {
      const me = this;
      let param = {
        PageIndex: me.pageIndex,
        PageSize: me.pageSize,
        SortBy: me.selectedSortOrder.id,
        CategoryID: me.$route.params.id,
        searchtext: me.searchtext,
      };
      ProductService.getListProductByCategory(param).then((result) => {
        if (result && result.data) {
          me.listProduct = result.data.data.listPaging;
          me.totalPage = result.data.data.total;
          let currentPageShow = Math.ceil((me.totalPage * 1.0) / me.pageSize);
          me.pageShow =
            currentPageShow < me.maxPageShow ? currentPageShow : me.maxPageShow;
        }
      });
    },
    sortProduct() {},
  },
  watch: {
    pageIndex: {
      handler: function (val) {
        if (val > 0) {
          this.getListProductByCategoryDefault();
        }
      },
      deep: true,
    },
    selectedSortOrder: {
      handler: function () {
        this.getListProductByCategoryDefault();
      },
      deep: true,
    },
  },
};
</script>
  <style  scoped>
@import url("../../../css/customer/c-productcategory.css");
</style>
      
      