<template>
  <div class="bk-role-list bk-list">
    <MHeader
      :title="title"
      :subtitle="subtitle"
      addBtn='Thêm vai trò'
      @openAddForm="openAddForm"
      @deleteData="deleteData"
      :isShowDelete="isShowDelete"
      deleteBtn="Xóa vai trò"
      searchTitle="Tìm kiếm theo mã, tên vai trò"
      @onSearch="searchRoles"
      :listPermission="listPermissionInModule"
    />
    <div class="bk-list-body">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="roleList"
        item-key="rolecode"
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
      maxwidth="760px"
      :title="titlePopup"
      @saveData="saveRole"
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
                  label="Mã vai trò (*)"
                  required
                  :rules="[rules.roleCodeRule]"
                  v-model="addRole.rolecode"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Tên vai trò (*)"
                  :rules="[rules.roleNameRule]"
                  required
                  v-model="addRole.rolename"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Mô tả vai trò"
                  persistent-hint
                  required
                  v-model="addRole.description"
                ></v-text-field>
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
const RoleService = FactoryService.get("roleService");
const AuthService = FactoryService.get("authService");
export default {
  name: "RoleList",
  components: {
    MHeader,
  },
  data() {
    return {
      listPermissionInModule: "",
      isShowDelete: false,
      validForm: true,
      rules: {
        roleCodeRule: (value) => !!value || "Mã vai trò bắt buộc nhập.",
        roleNameRule: (value) => !!value || "Tên vai trò bắt buộc nhập.",
        emailMatch: () => `Email hoặc mật khẩu không chính xác.`,
      },
      titlePopup: "Thêm vai trò",
      popupMode: FormMode.Add,
      addRole: {},
      isShowPopup: false,
      maxPageShow: 7,
      pageShow: 1,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      title: "Vai trò",
      subtitle:
        "Vai trò là một bộ quyền quy định mức độ truy cập phân hệ và các hoạt động. Bạn có thể thực hiện phân quyền khác nhau cho các người dùng khác nhau.",
      selected: [],
      headers: [
        {
          text: "ID vai trò",
          align: " d-none",
          sortable: false,
          value: "idrole",
        },
        {
          text: "Mã vai trò",
          align: "start",
          sortable: false,
          value: "rolecode",
        },
        {
          text: "Tên vai trò",
          align: "start",
          sortable: false,
          value: "rolename",
        },
        { text: "Mô tả vai trò", value: "description" },
      ],
      roleList: [],
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
    };
  },

  created() {
    this.getDefaultData();
    const me = this;
    let user = JSON.parse(localStorage.getItem("user"));
    AuthService.getPermission(user.userInfo).then((result) => {
      if (result && result.data) {
        let listPermissionClone = [...result.data.data];
        me.listPermissionInModule = listPermissionClone.find(
          (x) => x.modulecode == "SettingRole"
        ).permission;
      }
    });
  },

  methods: {
    /**
     * Tim kiem theo ma va ten vai tro
     * @param {} data
     */
    searchRoles(data) {
      console.log(data);
      this.listFilter = [
        {
          FieldName: "rolecode",
          Operator: Operator.Like,
          FilterValue: data,
        },
        {
          FieldName: "rolename",
          Operator: Operator.Like,
          FilterValue: data,
        },
      ];
      this.filterFormula = "{0} OR {1}";
      this.getDefaultData();
    },
    dblclickRow(e, rowData) {
      this.addRole = rowData.item;
      if (this.isShowDelete) return;
      this.openViewForm(this.addRole);
    },
    getDefaultData() {
      const me = this;
      RoleService.getPagingData({
        PageIndex: me.pageIndex,
        PageSize: me.pageSize,
        TableName: "Role",
        ListFilter: me.listFilter,
        FilterFormula: me.filterFormula,
        ListOrderBy: [],
      }).then((result) => {
        if (result && result.data) {
          me.roleList = result.data.listPaging;
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
      this.titlePopup = "Sửa vai trò";
      this.popupMode = FormMode.Edit;
      this.isShowPopup = true;
    },
    /**
     * mở form thêm mới
     */
    openAddForm() {
      this.$router.push({
        name: "m-role-detail",
        params: { id: 0, formMode: 1 },
        query: { mode: FormMode.Add },
      });
    },
    /**
     * Lưu vai trò
     */
    saveRole() {
      const me = this;
      let isValid = me.validateBeforeSave(this.addRole);
      if (!isValid) {
        return;
      }
      switch (me.popupMode) {
        case FormMode.Add:
          this.insertRole();
          break;
        case FormMode.Edit:
          this.updateRole();
          break;
        default:
          break;
      }
    },

    /**
     * mở form view
     */
    openViewForm(data) {
      this.$router.push({
        name: "m-role-detail",
        params: { id: data["idrole"], formMode: 3 },
      });
    },
    /**
     * thêm mới vai trò
     */
    insertRole() {
      const me = this;
      RoleService.insertData(this.addRole).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới vai trò thành công!");
            me.closeAddRolePopup();
            this.getDefaultData();
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    /**
     * sửa vai trò
     */
    updateRole() {
      const me = this;
      RoleService.updateData(this.addRole, this.addRole?.idrole).then(
        (result) => {
          if (result && result.data) {
            if (result.data.success) {
              me.$toast.success("Sửa vai trò thành công!");
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
      this.addRole = {};
    },
    /**
     * xóa dữ liệu
     */
    deleteData() {
      if (this.selected.findIndex((x) => x.rolecode == "R00001") > -1) {
        this.$toast.error("Không được xóa quyền Quản trị hệ thống.");
        return;
      }
      const me = this;
      let listID = this.selected.map((x) => x.idrole).join(",");
      RoleService.deleteMultiple({ ListID: listID }).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            this.selected = [];
            me.$toast.success("Xóa vai trò thành công!");
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
@import url('../../../css/management/m-role.css')
</style>
  
  