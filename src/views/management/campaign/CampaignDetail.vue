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
      <!-- <v-btn
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
                  label="Mã sự kiện (*)"
                  :disabled="isViewMode"
                  v-model="currentData.campaigncode"
                  :rules="[rules.campaignCodeRule]"
                ></v-text-field>
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
                <v-text-field
                  label="Tên sự kiện (*)"
                  :disabled="isViewMode"
                  v-model="currentData.campaignname"
                  :rules="[rules.campaignNameRule]"
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
                  label="Ngày bắt đầu"
                  :disabled="isViewMode"
                  v-model="currentData.startdate"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
                <v-text-field
                  label="Ngày kết thúc"
                  :disabled="isViewMode"
                  v-model="currentData.enddate"
                  type="date"
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
                  label="Nội dung email"
                  :disabled="isViewMode"
                  type="file"
                ></v-text-field>
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
                <v-text-field
                  label="Số email đã gửi đi"
                  :disabled="true"
                  type="number"
                  v-show="isViewMode"
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
                  label="Số email chưa gửi"
                  :disabled="true"
                  type="number"
                  v-show="isViewMode"
                ></v-text-field>
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
                <v-text-field
                  label="Số email unsubcribe"
                  :disabled="true"
                  type="number"
                  v-show="isViewMode"
                ></v-text-field>
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
const CampaignService = FactoryService.get("campaignService");
import moment from "moment";
export default {
  name: "CampaignDetail",
  data() {
    return {
      title: "Thêm sự kiện",
      formMode: FormMode.Add,
      isViewMode: false,
      currentData: {},
      validForm: false,
      rules: {
        campaignCodeRule: (value) => !!value || "Mã sự kiện bắt buộc nhập.",
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
    /**
     * Lấy dữ liệu sự kiện nếu ở form view
     */
    getDataInfo() {
      const me = this;
      if (me.formMode == FormMode.Add) {
        return;
      }
      let id = this.$route.params.id;
      CampaignService.getDataById(id)
        .then((result) => {
          if (result && result.data) {
            me.currentData = result.data.data;
            me.currentData.startdate = moment(
              me.currentData["startdate"]
            ).format("yyyy-MM-DD");

            me.currentData.enddate = moment(me.currentData["enddate"]).format(
              "yyyy-MM-DD"
            );
            me.title = `Sự kiện ${me.currentData.campaigncode} - ${me.currentData.campaignname}`;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    backToList() {
      this.$router.push({
        name: "m-campaign",
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
     * thêm mới sự kiện
     */
    insertData() {
      const me = this;
      CampaignService.insertData(this.currentData).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới sự kiện thành công!");
            me.formMode = FormMode.View;
            me.getDataInfo(result.data.data.idcampaign);
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
      CampaignService.updateData(
        this.currentData,
        this.currentData?.idcampaign
      ).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Sửa sự kiện thành công!");
            me.formMode = FormMode.View;
            me.getDataInfo(result.data.data.idcampaign);
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
      let param = {
        CampaignID: this.currentData.idcampaign,
      };
      CampaignService.sendEmail(param).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Gửi email đến các khách mời thành công!");
            me.formMode = FormMode.View;
            me.getDataInfo(me.currentData.idcampaign);
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
  },
};
</script>

<style>
</style>