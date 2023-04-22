<template>
  <div class="bk-employee-list bk-list">
    <MHeader
      :title="title"
      :subtitle="subtitle"
      addBtn='Thêm sự kiện'
      @openAddForm="openAddForm"
      @deleteData="deleteData"
      :isShowDelete="isShowDelete"
      deleteBtn="Xóa sự kiện"
      searchTitle="Tìm kiếm theo mã, tên sự kiện"
      @onSearch="searchData"
    />
    <div class="bk-list-body">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="dataList"
        item-key="campaigncode"
        show-select
        hide-default-footer
        fixed-header
        @dblclick:row="dblclickRow"
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
import { FactoryService } from "../../../service/factory/factory.service";
import FormMode from "../../../enum/FormModeEnum";
import Operator from "../../../enum/OperatorEnum";
const CampaignService = FactoryService.get("campaignService");
export default {
  name: "CampaignList",
  components: {
    MHeader,
  },
  data() {
    return {
      isShowDelete: false,
      validForm: true,
      rules: {
        employeeCodeRule: (value) => !!value || "Mã sự kiện bắt buộc nhập.",
        employeeNameRule: (value) => !!value || "Tên sự kiện bắt buộc nhập.",
        emailMatch: [
          (v) => !!v || "E-mail bắt buộc nhập.",
          (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ.",
        ],
      },
      titlePopup: "Thêm sự kiện",
      popupMode: FormMode.Add,
      addEmployee: {},
      isShowPopup: false,
      maxPageShow: 7,
      pageShow: 1,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      title: "Sự kiện",
      subtitle: "Danh sách các sự kiện",
      selected: [],
      headers: [
        {
          text: "ID sự kiện",
          align: " d-none",
          sortable: false,
          value: "idcampaign",
        },
        {
          text: "Mã sự kiện",
          align: "start",
          sortable: false,
          value: "campaigncode",
        },
        {
          text: "Tên sự kiện",
          align: "start",
          sortable: false,
          value: "campaignname",
        },
        {
          text: "Ngày bắt đầu",
          align: "start",
          sortable: false,
          value: "startdatetext",
        },
        { text: "Ngày kết thúc", value: "enddatetext" },
      ],
      dataList: [],
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
    this.getDefaultData();
  },

  methods: {
    /**
     * Tim kiem theo ma va ten vai tro
     * @param {} data
     */
    searchData(data) {
      console.log(data);
      this.listFilter = [
        {
          FieldName: "campaigncode",
          Operator: Operator.Like,
          FilterValue: data,
        },
        {
          FieldName: "campaignname",
          Operator: Operator.Like,
          FilterValue: data,
        },
      ];
      this.filterFormula = "{0} OR {1}";
      this.getDefaultData();
    },
    dblclickRow(e, rowData) {
      let selectedData = rowData.item;
      if (this.isShowDelete) return;
      this.openViewForm(selectedData);
    },
    getDefaultData() {
      const me = this;
      CampaignService.getPagingData({
        PageIndex: me.pageIndex,
        PageSize: me.pageSize,
        TableName: "Campaign",
        ListFilter: me.listFilter,
        FilterFormula: me.filterFormula,
        ListOrderBy: [],
      }).then((result) => {
        if (result && result.data) {
          me.dataList = result.data.listPaging;
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
    openViewForm(data) {
      this.$router.push({
        name: "m-campaign-detail",
        params: { id: data["idcampaign"], formMode: 3 },
      });
    },
    /**
     * mở form thêm mới
     */
    openAddForm() {
      this.$router.push({
        name: "m-campaign-detail",
        params: { id: 0, formMode: 1 },
        query: { mode: FormMode.Add },
      });
    },
    /**
     * xóa dữ liệu
     */
    deleteData() {
      const me = this;
      let listID = this.selected.map((x) => x.idcampaign).join(",");
      CampaignService.deleteMultiple({ ListID: listID }).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            this.selected = [];
            me.$toast.success("Xóa sự kiện thành công!");
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
@import url('../../../css/management/m-branch.css')
</style>
  
  