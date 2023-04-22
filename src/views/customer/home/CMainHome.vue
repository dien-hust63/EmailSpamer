<template>
  <div class="bkc-main-content-home">
    <v-carousel
      :show-arrows="false"
      height="calc(100vh - 170px)"
      cycle
    >
      <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
      ></v-carousel-item>
    </v-carousel>
    <div class="c-product-area">
      <div class="c-product-area-title">
        SẢN PHẨM MỚI NHẤT
      </div>
      <div class="c-product-area-content">
        <v-row justify="center">
          <v-col
            v-for="(product, index) in listProduct"
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
  </div>
</template>
    <script>
import CProductCard from "../productcard/ProductCard.vue";
import { FactoryService } from "../../../service/factory/factory.service";
const ProductService = FactoryService.get("productService");
const BranchService = FactoryService.get("branchService");
import Operator from "../../../enum/OperatorEnum";
export default {
  name: "CMainHome",
  components: {
    CProductCard,
  },
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
        image: "https://nvdien1.blob.core.windows.net/image/test.jpg",
        productname: "Áo khoác nam AKHTK305",
        sellprice: "949.000",
      },
      listProduct: [],
      ListFilter: [],
      onlineBranch: null,
    };
  },
  created() {
    const me = this;

    BranchService.getAllData()
      .then((result) => {
        if (
          result &&
          result.data &&
          result.data.data &&
          result.data.data.length > 0
        ) {
          let index = result.data.data.findIndex(
            (x) => x.isaddressdefault == true
          );
          if (index > -1) {
            me.onlineBranch = result.data.data[index];
          } else {
            me.onlineBranch = result.data.data[0];
          }
          localStorage.setItem("branchonline", JSON.stringify(me.onlineBranch));
          me.listFilter = [
            {
              FieldName: "branchid",
              Operator: Operator.Equal,
              FilterValue: this.onlineBranch?.idbranch.toString() ?? "0",
            },
          ];
          ProductService.getPagingData({
            PageIndex: 1,
            PageSize: 12,
            TableName: "Product",
            ListFilter: me.listFilter,
            FilterFormula: "{0}",
          }).then((result) => {
            if (result && result.data) {
              me.listProduct = result.data.listPaging;
            }
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  },
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
@import url("../../../css/customer/c-contenthome.css");
</style>
      
      