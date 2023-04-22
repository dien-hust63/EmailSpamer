<template>
  <div class="bk-employee-list bk-list">
    <MHeader
      :title="title"
      :subtitle="subtitle"
      addBtn='Thêm nhân viên'
      @openAddForm="openAddForm"
      @deleteData="deleteData"
      :isShowDelete="isShowDelete"
      deleteBtn="Xóa nhân viên"
      searchTitle="Tìm kiếm theo mã, tên nhân viên"
      @onSearch="searchEmployee"
    />
    <div class="bk-list-body">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="employeeList"
        item-key="employeecode"
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
    <!-- <base-popup
      :isShowPopup="isShowPopup"
      @closePopup="closeAddRolePopup"
      :title="titlePopup"
      @saveData="saveEmployee"
      :isFullScreen="true"
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
              <v-col cols="12">
                <v-text-field
                  label="Mã nhân viên (*)"
                  required
                  :rules="[rules.employeeCodeRule]"
                  v-model="addEmployee.employeecode"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Tên nhân viên (*)"
                  :rules="[rules.employeeNameRule]"
                  required
                  v-model="addEmployee.employeename"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email (*)"
                  :rules="rules.emailMatch"
                  persistent-hint
                  required
                  v-model="addEmployee.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-combobox
                  label="Chi nhánh"
                  v-model="selectedBranch"
                  item-text="text"
                  item-value="value"
                  :items="listBranch"
                  return-object
                ></v-combobox>
              </v-col>

            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </base-popup> -->
  </div>
</template>
<script>
import MHeader from "../../../components/management/header/MHeader.vue";
import { FactoryService } from "../../../service/factory/factory.service";
import FormMode from "../../../enum/FormModeEnum";
import Operator from "../../../enum/OperatorEnum";
const EmployeeService = FactoryService.get("employeeService");
export default {
  name: "employeeList",
  components: {
    MHeader,
  },
  data() {
    return {
      isShowDelete: false,
      validForm: true,
      rules: {
        employeeCodeRule: (value) => !!value || "Mã chi nhánh bắt buộc nhập.",
        employeeNameRule: (value) => !!value || "Tên chi nhánh bắt buộc nhập.",
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
      title: "Nhân viên",
      subtitle: "Danh sách các nhân viên",
      selected: [],
      headers: [
        {
          text: "ID nhân viên",
          align: " d-none",
          sortable: false,
          value: "idemployee",
        },
        {
          text: "Mã nhân viên",
          align: "start",
          sortable: false,
          value: "employeecode",
        },
        {
          text: "Tên nhân viên",
          align: "start",
          sortable: false,
          value: "employeename",
        },
        {
          text: "Email",
          align: "start",
          sortable: false,
          value: "email",
        },
        { text: "Chi nhánh", value: "branchname" },
        { text: "Vai trò", value: "rolename" },
        { text: "Trạng thái", value: "statusname" },
      ],
      employeeList: [],
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
    searchEmployee(data) {
      console.log(data);
      this.listFilter = [
        {
          FieldName: "employeecode",
          Operator: Operator.Like,
          FilterValue: data,
        },
        {
          FieldName: "employeename",
          Operator: Operator.Like,
          FilterValue: data,
        },
      ];
      this.filterFormula = "{0} OR {1}";
      this.getDefaultData();
    },
    dblclickRow(e, rowData) {
      let selectedEmployee = rowData.item;
      if (this.isShowDelete) return;
      this.openViewForm(selectedEmployee);
    },
    getDefaultData() {
      const me = this;
      EmployeeService.getPagingData({
        PageIndex: me.pageIndex,
        PageSize: me.pageSize,
        TableName: "Employee",
        ListFilter: me.listFilter,
        FilterFormula: me.filterFormula,
        ListOrderBy: [],
      }).then((result) => {
        if (result && result.data) {
          me.employeeList = result.data.listPaging;
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
    openViewForm(employee) {
      this.$router.push({
        name: "m-employee-detail",
        params: { id: employee["idemployee"], formMode: 3 },
      });
    },
    /**
     * mở form thêm mới
     */
    openAddForm() {
      // this.titlePopup = "Thêm nhân viên";
      // this.popupMode = FormMode.Add;
      // this.isShowPopup = true;
      this.$router.push({
        name: "m-employee-detail",
        params: { id: 0, formMode: 1 },
        query: { mode: FormMode.Add },
      });
    },
    /**
     * Lưu chi nhánh
     */
    saveEmployee() {
      const me = this;
      let isValid = me.validateBeforeSave(this.addBranch);
      if (!isValid) {
        return;
      }
      switch (me.popupMode) {
        case FormMode.Add:
          this.insertBranch();
          break;
        case FormMode.Edit:
          this.updateBranch();
          break;
        default:
          break;
      }
    },
    /**
     * thêm mới chi nhánh
     */
    insertBranch() {
      const me = this;
      EmployeeService.insertData(this.addBranch).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới chi nhánh thành công!");
            me.closeAddRolePopup();
            this.getDefaultData();
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    /**
     * sửa chi nhánh
     */
    updateBranch() {
      const me = this;
      EmployeeService.updateData(this.addBranch, this.addBranch?.idbranch).then(
        (result) => {
          if (result && result.data) {
            if (result.data.success) {
              me.$toast.success("Sửa chi nhánh thành công!");
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
      this.addBranch = {};
    },
    /**
     * xóa dữ liệu
     */
    deleteData() {
      const me = this;
      let listID = this.selected.map((x) => x.idemployee).join(",");
      EmployeeService.deleteMultiple({ ListID: listID }).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            this.selected = [];
            me.$toast.success("Xóa nhân viên thành công!");
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
  
  