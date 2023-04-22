<template>
  <div class="bk-order-list bk-list">
    <MHeader
      :title="title"
      :subtitle="subtitle"
      addBtn='Thêm đơn hàng'
      @openAddForm="openAddForm"
      @deleteData="deleteData"
      :isShowDelete="isShowDelete"
      deleteBtn="Xóa đơn hàng"
      searchTitle="Tìm kiếm theo mã đơn hàng, tên khách hàng"
      @onSearch="searchData"
      :isShowBranch="true"
      :listPermission="listPermissionInModule"
      @changeBranch="changeBranchHeader"
    />

    <div class="bk-list-body">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="orderList"
        item-key="ordercode"
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
const OrderService = FactoryService.get("orderService");
const AuthService = FactoryService.get("authService");
export default {
  name: "OrderList",
  components: {
    MHeader,
  },
  data() {
    return {
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
      title: "Đơn hàng",
      subtitle: "Danh sách các đơn hàng",
      selected: [],
      headers: [
        {
          text: "Ngày mua hàng",
          align: "start",
          sortable: false,
          value: "orderdatetext",
        },
        {
          text: "ID đơn hàng",
          align: " d-none",
          sortable: false,
          value: "idsaleorder",
        },
        {
          text: "Mã đơn hàng",
          align: "start",
          sortable: false,
          value: "ordercode",
        },
        {
          text: "Tên khách hàng",
          align: "start",
          sortable: false,
          value: "customername",
        },
        {
          text: "Tổng tiền",
          align: "start",
          sortable: false,
          value: "totalprice",
        },
        { text: "Trạng thái", value: "statusname" },
        { text: "Nhân viên tiếp nhận", value: "receiveemployeename" },
        { text: "Hình thức mua hàng", value: "ordertypename" },
        { text: "Chi nhánh", value: "branchname" },
      ],
      orderList: [],
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
      currentSearch: "",
      currentBranch: null,
      currentUser: null,
    };
  },

  created() {
    // this.getDefaultData();
    const me = this;
    let user = JSON.parse(localStorage.getItem("user"));
    this.currentUser = user.userInfo;
    AuthService.getPermission(user.userInfo).then((result) => {
      if (result && result.data) {
        let listPermissionClone = [...result.data.data];
        me.listPermissionInModule = listPermissionClone.find(
          (x) => x.modulecode == "Order"
        ).permission;
      }
    });
  },

  methods: {
    /**
     * Tim kiem theo ma va ten vai tro
     * @param {} data
     */
    searchData(data) {
      this.listFilter = [
        {
          FieldName: "ordercode",
          Operator: Operator.Like,
          FilterValue: data,
        },
        {
          FieldName: "customername",
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
      let selectedData = rowData.item;
      if (this.isShowDelete) return;
      this.openViewForm(selectedData);
    },
    getDefaultData() {
      const me = this;
      OrderService.getPagingData({
        PageIndex: me.pageIndex,
        PageSize: me.pageSize,
        TableName: "SaleOrder",
        ListFilter: me.listFilter,
        FilterFormula: me.filterFormula,
        ListOrderBy: [],
      }).then((result) => {
        if (result && result.data) {
          me.orderList = result.data.listPaging;
          me.totalPage = result.data.total;
          let currentPageShow = Math.ceil((me.totalPage * 1.0) / me.pageSize);
          me.pageShow =
            currentPageShow < me.maxPageShow ? currentPageShow : me.maxPageShow;
        }
      });
    },
    changeBranchHeader(branch) {
      this.currentBranch = branch;
      this.listFilter = [
        {
          FieldName: "ordercode",
          Operator: Operator.Like,
          FilterValue: this.currentSearch,
        },
        {
          FieldName: "customername",
          Operator: Operator.Like,
          FilterValue: this.currentSearch,
        },
        {
          FieldName: "branchid",
          Operator: Operator.Equal,
          FilterValue: branch?.id.toString() ?? "0",
        },

        // {
        //   FieldName: "receiveemployeeid",
        //   Operator: Operator.Equal,
        //   FilterValue: this.currentUser?.iduser.toString() ?? "0",
        // },
      ];
      this.filterFormula = "({0} OR {1}) AND {2}";
      this.getDefaultData();
    },
    /**
     * mở form view
     */
    openViewForm(order) {
      this.$router.push({
        name: "m-order-detail",
        params: {
          id: order["idsaleorder"],
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
        name: "m-order-detail",
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
      let listID = this.selected.map((x) => x.idsaleorder).join(",");
      OrderService.deleteMultiple({ ListID: listID }).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            this.selected = [];
            me.$toast.success("Xóa đơn hàng thành công!");
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
</script><style lang="css" scoped>
@import url("../../../css/management/m-orderlist.css");
</style>
  