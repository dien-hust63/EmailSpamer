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
      <v-btn
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
      </v-btn>
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
                  label="Mã nhân viên (*)"
                  :disabled="isViewMode"
                  v-model="currentData.employeecode"
                  :rules="[rules.employeeCodeRule]"
                ></v-text-field>
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
                <v-text-field
                  label="Tên nhân viên (*)"
                  :disabled="isViewMode"
                  v-model="currentData.employeename"
                  :rules="[rules.employeeNameRule]"
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
                  label="Email (*)"
                  :disabled="isViewMode"
                  v-model="currentData.email"
                  :rules="rules.emailMatch"
                  required
                ></v-text-field>
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
                <v-combobox
                  label="Chi nhánh"
                  v-model="selectedBranch"
                  item-text="text"
                  item-value="value"
                  :items="listBranch"
                  return-object
                  :disabled="isViewMode"
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
                <v-combobox
                  label="Vai trò"
                  v-model="selectedRole"
                  item-text="text"
                  item-value="value"
                  :items="listRole"
                  return-object
                  :disabled="isViewMode"
                ></v-combobox>
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
                <v-combobox
                  label="Trạng thái"
                  v-model="selectedStatus"
                  item-text="text"
                  item-value="value"
                  :items="listStatus"
                  return-object
                  :disabled="isViewMode"
                ></v-combobox>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </div>
  </div>
</template>

<script>
import FormMode from "../../../enum/FormModeEnum";
import AccountStatus from "../../../enum/AccountStatusEnum";
import { FactoryService } from "../../../service/factory/factory.service";
const EmployeeService = FactoryService.get("employeeService");
const BranchService = FactoryService.get("branchService");
const RoleService = FactoryService.get("roleService");
export default {
  name: "EmployeeDetail",
  data() {
    return {
      title: "Thêm nhân viên",
      formMode: FormMode.Add,
      isViewMode: false,
      currentData: {},
      validForm: false,
      rules: {
        employeeCodeRule: (value) => !!value || "Mã nhân viên bắt buộc nhập.",
        employeeNameRule: (value) => !!value || "Tên nhân viên bắt buộc nhập.",
        emailMatch: [
          (v) => !!v || "E-mail bắt buộc nhập.",
          (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ.",
        ],
      },
      listBranch: [],
      selectedBranch: null,
      accountStatus: AccountStatus.NotActive,
      listStatus: [
        { value: 1, text: "Chưa kích hoạt" },
        { value: 2, text: "Đã kích hoạt" },
      ],
      selectedStatus: { value: 1, text: "Chưa kích hoạt" },
      selectedRole: null,
      listRole: [],
    };
  },
  created() {
    this.formMode = this.$route.params.formMode;
    if (this.$route.query.mode) {
      this.formMode = parseInt(this.$route.query.mode) ?? FormMode.Vỉew;
    }
    this.getAllBranch();
    this.getAllRole();
    this.getEmployeeInfo();
  },
  methods: {
    /**
     * Lấy danh sách toàn bộ vai trò
     */
    getAllRole() {
      const me = this;
      RoleService.getAllData()
        .then((result) => {
          if (result && result.data) {
            me.listRole = result.data.data.map((x) => ({
              value: x.idrole,
              text: x.rolename,
            }));
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
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
    getEmployeeInfo() {
      const me = this;
      if (me.formMode == FormMode.Add) {
        return;
      }
      let id = this.$route.params.id;
      EmployeeService.getDataById(id)
        .then((result) => {
          if (result && result.data) {
            me.currentData = result.data.data;
            me.title = `Nhân viên ${me.currentData.employeecode} - ${me.currentData.employeename}`;
            me.selectedBranch = {
              text: me.currentData["branchname"],
              value: me.currentData["branchid"],
            };
            me.selectedRole = {
              text: me.currentData["rolename"],
              value: me.currentData["roleid"],
            };
            me.selectedStatus = {
              text: me.currentData["statusname"],
              value: me.currentData["statusid"],
            };
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    backToList() {
      this.$router.push({
        name: "m-employee",
      });
    },
    openFormEdit() {
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
          this.insertEmployee();
          break;
        case FormMode.Edit:
          this.updateEmployee();
          break;
        default:
          break;
      }
    },
    /**
     * thêm mới nhân viên
     */
    insertEmployee() {
      this.currentData.statusid = AccountStatus.NotActive;
      this.currentData.statusname = "Chưa kích hoạt";
      const me = this;
      EmployeeService.insertData(this.currentData).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới nhân viên thành công!");
            me.formMode = FormMode.View;
            me.getEmployeeInfo(result.data.data.idemployee);
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    /**
     * sửa chi nhánh
     */
    updateEmployee() {
      const me = this;
      EmployeeService.updateData(
        this.currentData,
        this.currentData?.idemployee
      ).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Sửa nhân viên thành công!");
            me.formMode = FormMode.View;
            me.getEmployeeInfo(result.data.data.idemployee);
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
            me.getEmployeeInfo(me.currentData.idemployee);
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
            me.getEmployeeInfo(me.currentData.idemployee);
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
    selectedRole: {
      handler: function (val) {
        if (val) {
          this.currentData["roleid"] = val["value"];
          this.currentData["rolename"] = val["text"];
        }
      },
      deep: true,
    },
    selectedStatus: {
      handler: function (val) {
        if (val) {
          this.currentData["statusid"] = val["value"];
          this.currentData["statusname"] = val["text"];
        }
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>