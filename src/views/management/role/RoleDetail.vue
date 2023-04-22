<template>
  <div class="bk-employee-detail bk-detail">
    <v-toolbar
      flat
      class="bk-detail-toolbar"
    >
      <v-btn
        icon
        class="hidden-xs-only"
        @click="backToList"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>
        {{title}}
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <!-- <v-btn
        v-show="isViewMode && currentData.statusid != 2"
        color="success"
        @click="activeAccount"
        class="ml-4"
      >
        <v-icon left>
          mdi-package-variant-closed-check
        </v-icon>
        Kích hoạt
      </v-btn>
      <v-btn
        v-show="isViewMode && currentData.statusid == 2"
        color="error"
        @click="deactiveAccount"
        class="ml-4"
      >
        <v-icon left>
          mdi-block-helper
        </v-icon>
        Ngừng kích hoạt
      </v-btn> -->
      <v-btn
        v-show="isViewMode"
        color="#F4F5F9"
        @click="openFormEdit"
        class="ml-4"
      >
        <v-icon left>
          mdi-pencil
        </v-icon>
        Sửa
      </v-btn>
      <v-btn
        class="ml-4"
        color="primary"
        v-show="formMode == 1 || formMode == 2"
        @click="saveData"
      >
        <v-icon left>
          mdi-content-save-plus
        </v-icon>
        Lưu
      </v-btn>
    </v-toolbar>
    <div class="bk-detail-content">
      <div class="bk-role-common-info">
        <div class="title mt-4">Thông tin chung</div>
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
                  sm="5"
                  class="px-8"
                >
                  <v-text-field
                    label="Mã Vai trò (*)"
                    :disabled="isViewMode"
                    v-model="currentData.rolecode"
                    :rules="[rules.roleCodeRule]"
                  ></v-text-field>
                </v-col>
                <v-col sm="2"></v-col>
                <v-col
                  cols="12"
                  sm="5"
                  class="px-8"
                >
                  <v-text-field
                    label="Tên vai trò (*)"
                    :disabled="isViewMode"
                    v-model="currentData.rolename"
                    :rules="[rules.roleNameRule]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="5"
                  class="px-8"
                >
                  <v-text-field
                    label="Mô tả"
                    :disabled="isViewMode"
                    v-model="currentData.description"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </div>

      <div class="bk-role-permission-module">
        <div class="title">Phân quyền phân hệ</div>
        <div class="bk-role-permission-module-list">
          <div
            class="role-permission-module-item"
            v-for="(item, index) in listModule"
            :key="index"
          >
            <div class="role-permission-module-item-title">{{item.modulename}}</div>
            <div class="role-permission-module-item-content">
              <!-- <v-checkbox
                class="ml-4"
                :input-value="tickQuickSelected(item)"
                @change="changeFullPermissionInModule($event, item)"
                :disabled="isViewMode"
                :key="index"
              >
              </v-checkbox> -->
              <v-combobox
                clearable
                class="ml-2"
                :items="item.permissiondefault"
                multiple
                placeholder="Chọn quyền"
                :disabled="isViewMode"
                return-object
                item-text="permissionname"
                item-value="permissionid"
                v-model="item.permission"
                :value="item.permission"
                width="300px"
                @change="updatePermission($event,item)"
                :key="index"
              >
              </v-combobox>

            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import FormMode from "../../../enum/FormModeEnum";
import AccountStatus from "../../../enum/AccountStatusEnum";
import { FactoryService } from "../../../service/factory/factory.service";
const EmployeeService = FactoryService.get("employeeService");
const RoleService = FactoryService.get("roleService");
const BranchService = FactoryService.get("branchService");
const ModuleService = FactoryService.get("moduleService");
const AuthService = FactoryService.get("authService");
export default {
  name: "RoleDetail",
  data() {
    return {
      listPermissionInModule: "",
      title: "Thêm vai trò",
      formMode: FormMode.Add,
      isViewMode: false,
      currentData: {},
      validForm: false,
      rules: {
        roleCodeRule: (value) => !!value || "Mã vai trò bắt buộc nhập.",
        roleNameRule: (value) => !!value || "Tên vai trò bắt buộc nhập.",
        emailMatch: [
          (v) => !!v || "E-mail bắt buộc nhập.",
          (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ.",
        ],
      },
      listBranch: [],
      selectedBranch: null,
      accountStatus: AccountStatus.NotActive,
      listModule: [],
      valueTest: [
        {
          id: "View",
          text: "Xem",
        },
      ],
      listModulePermissionDefault: [],
      permissionAll: {
        permissionid: "All",
        permissionname: "Toàn quyền",
      },
    };
  },
  created() {
    this.formMode = this.$route.params.formMode;
    if (this.$route.query.mode) {
      this.formMode = parseInt(this.$route.query.mode) ?? FormMode.Vỉew;
    }
    this.getAllBranch();
    this.getDataDetail();
    this.getModulePermissionDefault();
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
    updatePermission(chosen, item) {
      if (
        chosen &&
        chosen.length > 0 &&
        item.permission.findIndex((x) => x.permissionid == "All") > -1
      ) {
        item.permission = [this.permissionAll];
      }
    },
    /**
     * Lấy danh sách quyền module mặc định
     */
    getModulePermissionDefault() {
      const me = this;
      let permissionDefault = localStorage.getItem("permissiondefault");
      if (permissionDefault) {
        me.listModulePermissionDefault = JSON.parse(permissionDefault);
        me.handleListModule();
      } else {
        ModuleService.getModulePermissionDefault()
          .then((result) => {
            if (result && result.data) {
              me.listModulePermissionDefault = result.data.data;
              me.listModulePermissionDefault.forEach((element) => {
                element.permission = JSON.parse(element.permission);
              });
              localStorage.setItem(
                "permissiondefault",
                JSON.stringify(me.listModulePermissionDefault)
              );
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    handleListModule() {
      const me = this;
      me.listModulePermissionDefault.forEach((element) => {
        let index = me.listModule.findIndex(
          (x) => x.idmodule == element.idmodule
        );
        if (index > -1) {
          me.listModule[index]["permissiondefault"] = element["permission"];
          me.listModule[index]["permission"] = [me.permissionAll];
        } else {
          me.listModule.push({
            permissiondefault: element["permission"],
            idmodule: element["idmodule"],
            modulename: element["layoutname"],
            permission: [me.permissionAll],
          });
        }
      });
    },
    tickQuickSelected(item) {
      if (
        item.permission &&
        item.permissiondefault &&
        item.permission.length == item.permissiondefault.length
      ) {
        return true;
      } else return false;
    },
    // changeFullPermissionInModule(isfullpermission, item) {
    //   this.$nextTick(() => {
    //     if (isfullpermission) {
    //       item.permission = item.permissiondefault;
    //     } else {
    //       item.permission = [];
    //     }
    //   });
    // },
    /**
     * Lấy danh sách toàn bộ nhân viên
     */
    getAllBranch() {
      const me = this;
      BranchService.getAllData()
        .then((result) => {
          if (result && result.data) {
            me.listBranch = result.data.data.map((x) => ({
              value: x.idbranch,
              text: x.branchname,
            }));
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * Lấy dữ liệu nhân viên nếu ở form view
     */
    getDataDetail() {
      const me = this;
      if (me.formMode == FormMode.Add) {
        return;
      }
      let id = this.$route.params.id;
      RoleService.getRoleDetail(id)
        .then((result) => {
          if (result && result.data) {
            me.currentData = result.data.data.roleInfo;
            me.listModule = result.data.data.listRoleModule.map((x) => {
              return {
                ...x,
                permission: JSON.parse(x.permission),
                permissiondefault: this.listModulePermissionDefault.find(
                  (y) => y.idmodule == x.idmodule
                ).permission,
              };
            });
            me.title = `Vai trò ${me.currentData.rolecode} - ${me.currentData.rolename}`;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    backToList() {
      this.$router.push({
        name: "m-role",
      });
    },
    openFormEdit() {
      if (
        !this.listPermissionInModule.includes("Edit") &&
        !this.listPermissionInModule.includes("All")
      ) {
        this.$toast.error("Bạn không có quyền thực hiện tính năng này.");
        return;
      }
      if (this.currentData && this.currentData.rolecode == "R00001") {
        this.$toast.error("Quyền quản trị hệ thống là mặc định toàn quyền.");
        return;
      }
      this.$router
        .push({
          query: { mode: FormMode.Edit },
        })
        .catch(() => {});
      this.formMode = FormMode.Edit;
      this.isViewMode = false;
    },
    /**
     * Lưu dữ liệu khi sửa hoặc thêm
     */
    saveData() {
      const me = this;
      let isValid = me.validateBeforeSave(this.currentData);
      if (!isValid) {
        return;
      }
      switch (me.formMode) {
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
     * thêm mới vai trò
     */
    insertData() {
      let param = {
        RoleInfo: this.currentData,
        ListRoleModule: this.listModule.map((x) => {
          return {
            idrole: x.idrole,
            idmodule: x.idmodule,
            permission: x.permission,
          };
        }),
      };
      const me = this;
      RoleService.insertRoleCustom(param).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới vai trò thành công!");
            me.formMode = FormMode.View;
            this.$router.push({
              name: "m-role-detail",
              params: { id: result.data.data["idrole"], formMode: 3 },
            });
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    /**
     * sửa chi nhánh
     */
    updateData() {
      const me = this;
      let param = {
        RoleInfo: this.currentData,
        ListRoleModule: this.listModule.map((x) => {
          return {
            idrole: x.idrole,
            idmodule: x.idmodule,
            permission: x.permission,
            idrolemodule: x.idrolemodule,
          };
        }),
      };
      RoleService.updateRoleCustom(param).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Sửa vai trò thành công!");
            me.formMode = FormMode.View;
            this.$router.push({
              name: "m-role-detail",
              params: { id: result.data.data["idrole"], formMode: 3 },
            });
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
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

    activeAccount() {
      const me = this;
      EmployeeService.activeAccount(this.currentData).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Kích hoạt tài khoản thành công!");
            me.formMode = FormMode.View;
            me.getDataDetail(me.currentData.idemployee);
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },

    deactiveAccount() {
      const me = this;
      EmployeeService.deactiveAccount(this.currentData).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Ngừng kích hoạt tài khoản thành công!");
            me.formMode = FormMode.View;
            me.getDataDetail(me.currentData.idemployee);
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
  },
  watch: {
    formMode(val) {
      if (!val || (val && val == 3)) {
        this.isViewMode = true;
      }
    },
    selectedBranch: {
      handler: function (val) {
        if (val) {
          this.currentData["branchid"] = val["value"];
          this.currentData["branchname"] = val["text"];
        }
      },
      deep: true,
    },
  },
  computed: {},
};
</script>

<style scoped>
@import url("../../../css/management/m-role-detail.css");
</style>