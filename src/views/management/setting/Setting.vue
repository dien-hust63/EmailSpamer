<template>
  <div class="bk-employee-detail bk-detail">
    <v-toolbar
      flat
      class="bk-detail-toolbar"
    >
      <v-toolbar-title>
        {{title}}
      </v-toolbar-title>

      <v-spacer></v-spacer>
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
      <div class="bk-detail-content-group">
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
                >
                  <v-text-field
                    label="Số lượng email tối đa một tài khoản gửi trong ngày (*)"
                    :disabled="isViewMode"
                    v-model="emailmax"
                    type="number"
                    :rules="[rules.campaignCodeRule]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </div>

    </div>
  </div>
</template>

<script>
import FormMode from "../../../enum/FormModeEnum";
import AccountStatus from "../../../enum/AccountStatusEnum";
import { FactoryService } from "../../../service/factory/factory.service";
const CampaignService = FactoryService.get("campaignService");
export default {
  name: "SettingDetail",
  data() {
    return {
      title: "Thiết lập",
      formMode: FormMode.Add,
      isViewMode: false,
      currentData: {},
      emailmax: 100,
      validForm: false,
      rules: {
        campaignCodeRule: (value) => !!value || "Thiết lập bắt buộc.",
        titleRule: (value) => !!value || "Tiêu đề email bắt buộc nhập.",
        campaignNameRule: (value) => !!value || "Tên sự kiện bắt buộc nhập.",
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
      fileContent: null,
    };
  },
  created() {
    this.formMode = this.$route.params.formMode;
    if (this.$route.query.mode) {
      this.formMode = parseInt(this.$route.query.mode) ?? FormMode.Vỉew;
    }
    this.getDataInfo();
  },
  methods: {
    onFileSelected(event) {
      this.fileContent = event.target.files[0];
    },
    /**
     * Lấy dữ liệu sự kiện nếu ở form view
     */
    getDataInfo() {
      const me = this;
      CampaignService.getEmailSetting()
        .then((result) => {
          if (result && result.data) {
            me.emailmax = parseInt(result.data.data);
          }
        })
        .catch((e) => {
          console.log(e);
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
      this.currentData["emailmax"] = me.emailmax;
      let isValid = me.validateBeforeSave(this.currentData);
      if (!isValid) {
        return;
      }
      switch (me.formMode) {
        case FormMode.Add:
          this.updateData();
          break;
        case FormMode.Edit:
          this.updateData();
          break;
        default:
          break;
      }
    },
    /**
     * sửa chi nhánh
     */
    updateData() {
      const me = this;
      CampaignService.updateEmailSetting(this.currentData).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thiết lập thành công!");
            me.formMode = FormMode.View;
            me.getDataInfo();
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
  },
  watch: {
    formMode(val) {
      if (!val || (val && val == 3)) {
        this.isViewMode = true;
      }
    },
  },
};
</script>

<style>
</style>