<template>
  <div class="bkc-top-navigation">
    <div class="c-nav-header">
      <div class="c-nav-header-left">
        <v-img
          src="https://nvdien1.blob.core.windows.net/image/360formen.png"
          @click="returnHomePage"
        ></v-img>
      </div>
      <div class="c-nav-header-center">
        <!-- search input -->
        <div class="form-group has-search m-header-search">
          <span class="fa fa-search fa-2xl form-control-feedback"></span>
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm sản phẩm..."
            v-on:keyup.enter="onSearch"
            v-model="searchValue"
          >
        </div>
      </div>
      <div class="c-nav-header-right">
        <div class="ml-4 c-nav-header-right-icon c-nav-header-right-icon-cart">
          <c-cart-mini />
        </div>
        <div class="ml-4 c-nav-header-right-icon mr-2">
          <v-icon large>
            mdi mdi-account-circle
          </v-icon>
        </div>
      </div>
    </div>
    <div
      class="c-nav-tab"
      @focusout="handleFocusOut"
      tabindex="0"
    >
      <div
        class="c-nav-tab-item c-nav-tab-product"
        :class="{'c-nav-tab-product--active':isShowProductTab}"
        @click="isShowProductTab = !isShowProductTab"
      >
        <div>Sản phẩm</div>

      </div>
      <!-- <div
        class="c-nav-tab-item"
        @click="showListBranch"
        @mouseover="isShowProductTab = false"
      >Hệ thống cửa hàng</div> -->
      <v-expand-transition>
        <div
          class="c-nav-product-category"
          v-show="isShowProductTab"
        >
          <CProductListTab
            :productcategoryList="productcategoryList"
            @closeProductListTab="isShowProductTab=false"
          />
        </div>
      </v-expand-transition>
    </div>
  </div>
</template>
      <script>
import CProductListTab from "../home/CProductListTab.vue";
import { FactoryService } from "../../../service/factory/factory.service";
import CCartMini from "../cart/CCartMini.vue";
const ProductCategoryService = FactoryService.get("productcategoryService");
export default {
  name: "CTopNavigation",
  components: {
    CProductListTab,
    CCartMini,
  },
  created() {
    this.getCategoryList();
    console.log(this.$store);
  },
  data() {
    return {
      searchValue: "",
      isShowProductTab: false,
      productcategoryList: [],
    };
  },
  methods: {
    onSearch() {
      this.$router.push({
        name: "c-productsearch",
        query: { text: this.searchValue },
      });
      //this.$eventBus.$emit("searchProduct", this.searchValue);
    },
    handleFocusOut() {
      this.isShowProductTab = false;
    },
    showListBranch() {
      this.isShowProductTab = false;
    },

    getCategoryList() {
      const me = this;
      ProductCategoryService.getAllData()
        .then((result) => {
          if (result && result.data) {
            let listCategory = result.data.data;
            let parentList = listCategory.filter((x) => x.parentid == 0);
            me.productcategoryList = [];
            parentList.forEach((item) => {
              let childCategory = listCategory.filter(
                (x) => x.parentid == item.idproductcategory
              );
              me.productcategoryList.push({
                parent: item,
                child: childCategory,
              });
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    returnHomePage() {
      this.$router.push({
        name: "c-main-home",
      });
    },
  },
};
</script>
<style  scoped>
@import url("../../../css/customer/c-topnavigation.css");
</style>
      
      