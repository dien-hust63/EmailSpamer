<template>
  <div class="bk-role-list bk-list">
    <MHeader
      :title="title"
      :subtitle="subtitle"
      addBtn='Thêm người gửi'
      @openAddForm="openAddForm"
      @deleteData="deleteData"
      :isShowDelete="isShowDelete"
      deleteBtn="Xóa người gửi"
      searchTitle="Tìm kiếm theo email người gửi"
      @onSearch="searchData"
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
              <v-col
                cols="12"
                sm="12"
              >
                <v-text-field
                  label="Password (*)"
                  :rules="[rules.passwordRule]"
                  required
                  v-model="addData.password"
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
const SenderService = FactoryService.get("senderService");
export default {
  name: "SenderList",
  components: {
    MHeader,
    BasePopup,
  },
  data() {
    return {
      isShowDelete: false,
      validForm: true,
      rules: {
        branchCodeRule: (value) => !!value || "Email bắt buộc nhập",
        passwordRule: (value) => !!value || "Password bắt buộc nhập.",
        emailMatch: [
          (v) => !!v || "E-mail bắt buộc nhập.",
          (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ.",
        ],
        provinceRule: (value) => !!value || "Vui lòng chọn tỉnh thành",
        districtRule: (value) => !!value || "Vui lòng chọn quận huyện",
        wardRule: (value) => !!value || "Vui lòng chọn phường xã",
        addressRule: (value) => !!value || "Vui lòng nhập địa chỉ",
      },
      titlePopup: "Thêm người gửi",
      popupMode: FormMode.Add,
      addData: {},
      isShowPopup: false,
      maxPageShow: 7,
      pageShow: 1,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      title: "Người gửi",
      subtitle: "Danh sách người gửi",
      selected: [],
      headers: [
        {
          text: "ID người gửi",
          align: " d-none",
          sortable: false,
          value: "idsender",
        },
        {
          text: "Email",
          align: "start",
          sortable: true,
          value: "email",
        },
        {
          text: "Số email đã gửi trong ngày",
          align: "start",
          sortable: true,
          value: "numberinday",
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
      SenderService.getPagingData({
        PageIndex: me.pageIndex,
        PageSize: me.pageSize,
        TableName: "Sender",
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
      this.titlePopup = "Sửa người gửi";
      this.popupMode = FormMode.Edit;
      this.isShowPopup = true;
    },
    /**
     * mở form thêm mới
     */
    openAddForm() {
      this.titlePopup = "Thêm người gửi";
      this.popupMode = FormMode.Add;
      this.isShowPopup = true;
    },
    /**
     * Lưu người gửi
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
     * thêm mới người gửi
     */
    insertData() {
      const me = this;
      SenderService.insertData(this.addData).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới người gửi thành công!");
            me.closeAddRolePopup();
            this.getDefaultData();
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    /**
     * sửa người gửi
     */
    updateData() {
      const me = this;
      SenderService.updateData(this.addData, this.addData?.idsender).then(
        (result) => {
          if (result && result.data) {
            if (result.data.success) {
              me.$toast.success("Sửa người gửi thành công!");
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
      let listID = this.selected.map((x) => x.idsender).join(",");
      SenderService.deleteMultiple({ ListID: listID }).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            this.selected = [];
            me.$toast.success("Xóa người gửi thành công!");
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
  
  