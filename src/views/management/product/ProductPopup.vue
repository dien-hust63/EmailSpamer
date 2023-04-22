<template>
  <div class="bk-product-popup">
    <base-popup
      :isShowPopup="isShowPopup"
      @closePopup="closeAddProductPopup"
      maxwidth="1000px"
      :title="titlePopup"
      @saveData="addProductToOrder"
    >
      <div class="bk-product-popup-list bk-list">
        <MHeader
          :title="title"
          :subtitle="subtitle"
          @openAddForm="openAddForm"
          :isHideAddBtn="true"
          @deleteData="deleteData"
          :isShowDelete="false"
          deleteBtn="Xóa hàng hóa"
          searchTitle="Tìm kiếm theo mã, tên hàng hóa"
          @onSearch="searchData"
          :isShowBranch="true"
          @changeBranch="changeBranchHeader"
        />
        <div class="bk-product-popup-body">
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="productList"
            item-key="productcode"
            show-select
            hide-default-footer
            fixed-header
            @dblclick:row="dblclickRow"
            no-data-text="Không có dữ liệu"
            :items-per-page="100"
          >
          </v-data-table>
        </div>
        <!-- <div class="bk-flex bk-flex-between">
          <v-row
            no-gutters
            style="height: 60px;"
            align-content="center"
          >
            <v-col class="bk-flex">
              <h6>
                Tổng bản ghi: {{totalPage}}
              </h6>
            </v-col>
            <v-col justify-content="center">
              <v-pagination
                v-model="pageIndex"
                :length="pageShow"
                :total-visible="pageShow"
              ></v-pagination>
            </v-col>
            <v-col>
              <v-row class="m-0 bk-paging-number">
                <v-col class="p-0"></v-col>
                <v-col class="p-0">
                  <v-select
                    v-model="pageSize"
                    :items="itemPaging"
                    label="Solo field"
                    solo
                    dense
                    width="100"
                  ></v-select>
                </v-col>

              </v-row>
            </v-col>
          </v-row>
        </div> -->
      </div>

    </base-popup>
  </div>
</template>
<script>
import MHeader from "../../../components/management/header/MHeader.vue";
import BasePopup from "../../../components/common/BasePopup.vue";
import FormMode from "../../../enum/FormModeEnum";
import Operator from "../../../enum/OperatorEnum";
import { FactoryService } from "../../../service/factory/factory.service";
const ProductService = FactoryService.get("productService");
export default {
  name: "ProductPopup",
  components: {
    MHeader,
    BasePopup,
  },
  data() {
    return {
      isShowDelete: false,
      validForm: true,
      rules: {
        productCodeRule: (value) => !!value || "Mã chi nhánh bắt buộc nhập.",
        productNameRule: (value) => !!value || "Tên chi nhánh bắt buộc nhập.",
        emailMatch: [
          (v) => !!v || "E-mail bắt buộc nhập.",
          (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ.",
        ],
      },
      titlePopup: "",
      popupMode: FormMode.Add,
      addEmployee: {},
      maxPageShow: 7,
      pageShow: 1,
      pageSize: 100,
      pageIndex: 1,
      totalPage: 0,
      title: "Danh sách các hàng hóa",
      subtitle: "",
      selected: [],
      headers: [
        {
          text: "ID hàng hóa",
          align: " d-none",
          sortable: false,
          value: "idproduct",
        },
        {
          text: "Mã hàng hóa",
          align: "start",
          sortable: false,
          value: "productcode",
        },
        {
          text: "Tên hàng hóa",
          align: "start",
          sortable: false,
          value: "productname",
        },
        {
          text: "Màu sắc",
          align: "start",
          sortable: false,
          value: "color",
        },
        { text: "Kích thước", value: "size" },
        { text: "Giá bán", value: "sellprice" },
        { text: "Tồn kho", value: "inventory" },
      ],
      productList: [],
      itemPaging: [
        {
          text: "10 bản ghi/ trang",
          value: 10,
        },
        {
          text: "20 bản ghi/ trang",
          value: 20,
        },
        {
          text: "50 bản ghi/ trang",
          value: 50,
        },
      ],
      listFilter: [],
      filterFormula: "",
      listBranch: [],
      currentBranch: null,
      currentUser: null,
      searchtext: "",
    };
  },
  props: {
    isShowPopup: Boolean,
  },
  created() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.currentUser = user.userInfo;
    this.getDefaultData();
  },

  methods: {
    changeBranchHeader(branch) {
      this.currentBranch = branch;
      this.listFilter = [
        {
          FieldName: "productcode",
          Operator: Operator.Like,
          FilterValue: this.currentSearch,
        },
        {
          FieldName: "productname",
          Operator: Operator.Like,
          FilterValue: this.currentSearch,
        },
        {
          FieldName: "branchid",
          Operator: Operator.Equal,
          FilterValue: branch?.id.toString() ?? "0",
        },
      ];
      this.filterFormula = "({0} OR {1}) AND {2}";
      this.getDefaultData();
    },
    addProductToOrder() {
      let lstProductEmpty = [];
      this.selected.forEach((element) => {
        if (element.inventory == 0) {
          lstProductEmpty.push(element.productcode);
        }
      });
      if (lstProductEmpty.length > 0) {
        let productName = lstProductEmpty.join(",");
        let errorMessge = `${productName} đã hết hàng. Vui lòng chọn lại hàng hóa!`;
        this.$toast.warning(errorMessge);
        return;
      }
      this.$emit("addProductToOrder", this.selected);
    },
    closeAddProductPopup() {
      this.$emit("close");
    },
    /**
     * Tim kiem theo ma va ten vai tro
     * @param {} data
     */
    searchData(data) {
      this.searchtext = data;
      this.getDefaultData();
    },
    dblclickRow(e, rowData) {
      let selectedProduct = rowData.item;
      if (this.isShowDelete) return;

      this.openViewForm(selectedProduct);
    },
    getDefaultData() {
      const me = this;
      let param = {
        branchid: me.currentBranch.id,
        searchtext: me.searchtext,
      };
      ProductService.getProductDetailByBranch(param).then((result) => {
        if (result && result.data) {
          me.productList = result.data.data;
          //   me.totalPage = result.data.total;
          //   let currentPageShow = Math.ceil((me.totalPage * 1.0) / me.pageSize);
          //   me.pageShow =
          //     currentPageShow < me.maxPageShow ? currentPageShow : me.maxPageShow;
        }
      });
    },
    /**
     * mở form view
     */
    openViewForm(product) {
      this.$router.push({
        name: "m-product-detail",
        params: { id: product["idproduct"], formMode: 3 },
      });
    },
    /**
     * mở form thêm mới
     */
    openAddForm() {
      // this.titlePopup = "Thêm hàng hóa";
      // this.popupMode = FormMode.Add;
      // this.isShowPopup = true;
      this.$router.push({
        name: "m-product-detail",
        params: { id: 0, formMode: 1 },
        query: { mode: FormMode.Add },
      });
    },

    /**
     * xóa dữ liệu
     */
    deleteData() {
      const me = this;
      let listID = this.selected.map((x) => x.idproduct).join(",");
      ProductService.deleteMultiple({ ListID: listID }).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            this.selected = [];
            me.$toast.success("Xóa hàng hóa thành công!");
            this.getDefaultData();
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
  },

  watch: {
    selected: {
      handler: function (val) {
        if (val && val.length > 0) {
          this.isShowDelete = true;
        } else {
          this.isShowDelete = false;
        }
      },
      deep: true,
    },

    pageIndex: {
      handler: function (val) {
        if (val > 0) {
          this.getDefaultData();
        }
      },
      deep: true,
    },
    pageSize: {
      handler: function (val) {
        if (val > 0) {
          this.getDefaultData();
        }
      },
      deep: true,
    },
  },
};
</script><style lang="sass" scoped>
@import url('../../../css/management/m-productpopup.css')
</style>
  
  