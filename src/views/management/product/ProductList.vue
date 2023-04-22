<template>
  <div class="bk-product-list bk-list">
    <MHeader
      :title="title"
      :subtitle="subtitle"
      addBtn='Thêm hàng hóa'
      @openAddForm="openAddForm"
      @deleteData="deleteData"
      :isShowDelete="isShowDelete"
      deleteBtn="Xóa hàng hóa"
      searchTitle="Tìm kiếm theo mã, tên hàng hóa"
      @onSearch="searchData"
      :listPermission="listPermissionInModule"
      :isShowBranch="true"
      @changeBranch="changeBranchHeader"
    />
    <div class="bk-list-body">
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
      >
      </v-data-table>
    </div>
    <div class="bk-list-footer bk-flex bk-flex-between">
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
    </div>
  </div>
</template>
<script>
import MHeader from "../../../components/management/header/MHeader.vue";

import FormMode from "../../../enum/FormModeEnum";
import Operator from "../../../enum/OperatorEnum";
import { FactoryService } from "../../../service/factory/factory.service";
const ProductService = FactoryService.get("productService");
const AuthService = FactoryService.get("authService");
export default {
  name: "productList",
  components: {
    MHeader,
  },
  data() {
    return {
      currentSearch: "",
      currentBranch: null,
      listPermissionInModule: "",
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
      titlePopup: "Thêm chi nhánh",
      popupMode: FormMode.Add,
      addEmployee: {},
      isShowPopup: false,
      maxPageShow: 7,
      pageShow: 1,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      title: "Hàng hóa",
      subtitle: "Danh sách các hàng hóa",
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
          text: "Nhóm hàng hóa",
          align: "start",
          sortable: false,
          value: "categoryname",
        },
        { text: "Giá vốn", value: "costprice" },
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
    };
  },

  created() {
    //me.getDefaultData();
    const me = this;
    let user = JSON.parse(localStorage.getItem("user"));
    AuthService.getPermission(user.userInfo).then((result) => {
      if (result && result.data) {
        let listPermissionClone = [...result.data.data];
        me.listPermissionInModule = listPermissionClone.find(
          (x) => x.modulecode == "ProductList"
        ).permission;
      }
    });
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
    /**
     * Tim kiem theo ma va ten vai tro
     * @param {} data
     */
    searchData(data) {
      this.currentSearch = data;
      this.listFilter = [
        {
          FieldName: "productcode",
          Operator: Operator.Like,
          FilterValue: data,
        },
        {
          FieldName: "productname",
          Operator: Operator.Like,
          FilterValue: data,
        },
        {
          FieldName: "branchid",
          Operator: Operator.Equal,
          FilterValue: this.currentBranch?.id.toString() ?? "0",
        },
      ];
      this.filterFormula = "({0} OR {1}) AND {2}";
      this.getDefaultData();
    },
    dblclickRow(e, rowData) {
      let selectedProduct = rowData.item;
      if (this.isShowDelete) return;
      this.openViewForm(selectedProduct);
    },
    getDefaultData() {
      const me = this;
      ProductService.getPagingData({
        PageIndex: me.pageIndex,
        PageSize: me.pageSize,
        TableName: "Product",
        ListFilter: me.listFilter,
        FilterFormula: me.filterFormula,
        ListOrderBy: [],
      }).then((result) => {
        if (result && result.data) {
          me.productList = result.data.listPaging;
          me.totalPage = result.data.total;
          let currentPageShow = Math.ceil((me.totalPage * 1.0) / me.pageSize);
          me.pageShow =
            currentPageShow < me.maxPageShow ? currentPageShow : me.maxPageShow;
        }
      });
    },
    /**
     * mở form view
     */
    openViewForm(product) {
      this.$router.push({
        name: "m-product-detail",
        params: {
          id: product["idproduct"],
          formMode: 3,
          branchid: this.currentBranch?.id,
          branchname: this.currentBranch?.text,
        },
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
        params: {
          id: 0,
          formMode: 1,
          branchid: this.currentBranch?.id,
          branchname: this.currentBranch?.text,
        },
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
            me.$toast.error("Hàng hóa đã phát sinh dữ liệu trên đơn hàng!");
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
@import url('../../../css/management/m-branch.css')
</style>
  
  