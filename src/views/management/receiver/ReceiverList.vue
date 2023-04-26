<template>
  <div class="bk-role-list bk-list">
    <MHeader
      :title="title"
      :subtitle="subtitle"
      addBtn='Thêm người nhận'
      @openAddForm="openAddForm"
      @deleteData="deleteData"
      :isShowDelete="isShowDelete"
      deleteBtn="Xóa người nhận"
      searchTitle="Tìm kiếm theo email người nhận"
      :isImport="true"
      @onSearch="searchData"
      @onFileSelected="onImport"
    />
    <div class="bk-list-body">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="branchList"
        item-key="email"
        show-select
        hide-default-footer
        fixed-header
        @dblclick:row="dblclickRow"
        :key="tableKey"
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
    <base-popup
      :isShowPopup="isShowPopup"
      @closePopup="closeAddRolePopup"
      maxwidth="760px"
      :title="titlePopup"
      @saveData="saveData"
    >
      <v-card-text>
        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
          class="role-form"
        >
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="12"
              >
                <v-text-field
                  label="Email (*)"
                  required
                  :rules="rules.emailMatch"
                  v-model="addData.email"
                ></v-text-field>
              </v-col>

            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </base-popup>
  </div>
</template>
<script>
import MHeader from "../../../components/management/header/MHeader.vue";
import { FactoryService } from "../../../service/factory/factory.service";
import BasePopup from "../../../components/common/BasePopup.vue";
import FormMode from "../../../enum/FormModeEnum";
import Operator from "../../../enum/OperatorEnum";
const ReceiverService = FactoryService.get("receiverService");
export default {
  name: "ReceiverList",
  components: {
    MHeader,
    BasePopup,
  },
  data() {
    return {
      tableKey: false,
      isShowDelete: false,
      validForm: true,
      rules: {
        emailMatch: [
          (v) => !!v || "E-mail bắt buộc nhập.",
          (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ.",
        ],
      },
      titlePopup: "Thêm người nhận",
      popupMode: FormMode.Add,
      addData: {},
      isShowPopup: false,
      maxPageShow: 7,
      pageShow: 1,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      title: "Người nhận",
      subtitle: "Danh sách người nhận",
      selected: [],
      headers: [
        {
          text: "ID người nhận",
          align: " d-none",
          sortable: false,
          value: "idreceiver",
        },
        {
          text: "Email",
          align: "start",
          sortable: true,
          value: "email",
        },
      ],
      branchList: [],
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
      listEmployee: [],
    };
  },

  created() {
    this.getDefaultData();
  },

  methods: {
    onImport(file) {
      let param = new FormData();
      param.append("file", file, file.name);
      const me = this;
      ReceiverService.importReceiver(param).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Nhập khẩu thành công!");
            me.tableKey = !me.tableKey;
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
      me.$toast.success(
        "Hệ thống đang nhập khẩu dữ liệu. Chúng tôi sẽ thông báo cho bạn khi quá trình hoàn thành."
      );
    },
    /**
     * Tim kiem theo ma va ten vai tro
     * @param {} data
     */
    searchData(data) {
      this.listFilter = [
        {
          FieldName: "email",
          Operator: Operator.Like,
          FilterValue: data,
        },
      ];
      this.filterFormula = "{0}";
      this.getDefaultData();
    },
    dblclickRow(e, rowData) {
      this.addData = rowData.item;
      if (this.isShowDelete) return;
      this.openEditForm();
    },
    getDefaultData() {
      const me = this;
      ReceiverService.getPagingData({
        PageIndex: me.pageIndex,
        PageSize: me.pageSize,
        TableName: "Receiver",
        ListFilter: me.listFilter,
        FilterFormula: me.filterFormula,
        ListOrderBy: [],
      }).then((result) => {
        if (result && result.data) {
          me.branchList = result.data.listPaging;
          me.totalPage = result.data.total;
          let currentPageShow = Math.ceil((me.totalPage * 1.0) / me.pageSize);
          me.pageShow =
            currentPageShow < me.maxPageShow ? currentPageShow : me.maxPageShow;
        }
      });
    },
    /**
     * mở form sửa
     */
    openEditForm() {
      this.titlePopup = "Sửa người nhận";
      this.popupMode = FormMode.Edit;
      this.isShowPopup = true;
    },
    /**
     * mở form thêm mới
     */
    openAddForm() {
      this.titlePopup = "Thêm người nhận";
      this.popupMode = FormMode.Add;
      this.isShowPopup = true;
    },
    /**
     * Lưu người nhận
     */
    saveData() {
      const me = this;
      let isValid = me.validateBeforeSave(this.addData);
      if (!isValid) {
        return;
      }
      switch (me.popupMode) {
        case FormMode.Add:
          this.insertData();
          break;
        case FormMode.Edit:
          this.updateData();
          break;
        default:
          break;
      }
    },
    /**
     * thêm mới người nhận
     */
    insertData() {
      const me = this;
      ReceiverService.insertData(this.addData).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới người nhận thành công!");
            me.closeAddRolePopup();
            this.getDefaultData();
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    /**
     * sửa người nhận
     */
    updateData() {
      const me = this;
      ReceiverService.updateData(this.addData, this.addData?.idreceiver).then(
        (result) => {
          if (result && result.data) {
            if (result.data.success) {
              me.$toast.success("Sửa người nhận thành công!");
              me.closeAddRolePopup();
              this.getDefaultData();
            } else {
              me.$toast.error(result.data.errorMessage);
            }
          }
        }
      );
    },
    /**
     * Kiểm tra dữ liệu trước khi lưu
     */
    validateBeforeSave(dataSave) {
      this.$refs.form.validate();
      if (
        !this.validForm ||
        !dataSave ||
        (dataSave && Object.keys(dataSave).length === 0)
      ) {
        return false;
      }
      return true;
    },
    closeAddRolePopup() {
      this.$refs.form.resetValidation();
      this.isShowPopup = false;
      this.addData = {};
    },
    /**
     * xóa dữ liệu
     */
    deleteData() {
      const me = this;
      let listID = this.selected.map((x) => x.idreceiver).join(",");
      ReceiverService.deleteMultiple({ ListID: listID }).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            this.selected = [];
            me.$toast.success("Xóa người nhận thành công!");
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
</script>
<style  scoped>
@import url("../../../css/management/m-branch.css");
</style>
  
  