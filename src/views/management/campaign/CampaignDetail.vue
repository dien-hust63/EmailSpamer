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
        @click="openActiveAccount"
        class="ml-4"
      >
        <v-icon left>
          mdi-package-variant-closed-check
        </v-icon>
        Kích hoạt
      </v-btn>
      <v-btn
        v-show="isViewMode && currentData.statusid != 2"
        color="primary"
        @click="testBeforeActive"
        class="ml-4"
      >
        <v-icon left>
          mdi-package-variant-closed-check
        </v-icon>
        Kiểm thử
      </v-btn>
      <v-btn
        v-show="isViewMode && currentData.statusid != 2"
        color="secondary"
        @click="openResetConfirm"
        class="ml-4"
      >
        <v-icon left>
          mdi-package-variant-closed-check
        </v-icon>
        Reset
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
                <label for="fileContent">Nội dung email (*): </label>
                <input
                  type="file"
                  @change="onFileSelected"
                  id="fileContent"
                >
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
                <v-text-field
                  label="Tiêu đề email(*)"
                  :disabled="isViewMode"
                  v-model="currentData.subjectemail"
                  :rules="[rules.titleRule]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>

              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
                class="px-8"
              >
                <v-text-field
                  label="Tên hiển thị khi gửi(*)"
                  :disabled="isViewMode"
                  v-model="currentData.senderdisplay"
                  :rules="[rules.displaynameRule]"
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
                  label="Tổng số khách mời"
                  :disabled="true"
                  type="number"
                  v-show="isViewMode"
                  v-model="currentData.total"
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
                  v-model="currentData.sentemail"
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
                  v-model="currentData.waitemail"
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
                  v-model="currentData.unsubcribe"
                ></v-text-field>
              </v-col>
            </v-row>

          </v-container>
        </v-form>
      </v-card-text>
    </div>
    <base-popup
      :isShowPopup="isShowPopupEmail"
      @closePopup="closeEmailPopup"
      maxwidth="760px"
      :title="titlePopup"
      @saveData="handleTestSendEmail"
    >
      <v-card-text>
        <v-form
          ref="form"
          v-model="validFormEmail"
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
                  v-model="emailtest"
                ></v-text-field>
              </v-col>

            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </base-popup>

    <base-popup
      :isShowPopup="isShowPopupReset"
      @closePopup="closeResetPopup"
      maxwidth="500px"
      :title="titlePopupReset"
      @saveData="handleTestSendReset"
      saveText="Đồng ý"
    >
      <v-card-text>
        <div>
          Hệ thống sẽ update các email trong chiến dịch ở trạng thái đã gửi về trạng thái chưa gửi.
        </div>
        <div>
          <b>Bạn có chắc muốn khởi động lại chiến dịch?</b>
        </div>
      </v-card-text>
    </base-popup>

    <base-popup
      :isShowPopup="isShowPopupActive"
      @closePopup="closeActivePopup"
      maxwidth="500px"
      :title="titlePopupActive"
      @saveData="activeAccount"
      saveText="Đồng ý"
    >
      <v-card-text>
        <div>
          <b>Bạn có chắc muốn kích hoạt chiến dịch?</b>
        </div>
      </v-card-text>
    </base-popup>
  </div>
</template>

<script>
import FormMode from "../../../enum/FormModeEnum";
import AccountStatus from "../../../enum/AccountStatusEnum";
import { FactoryService } from "../../../service/factory/factory.service";
import BasePopup from "../../../components/common/BasePopup.vue";
const CampaignService = FactoryService.get("campaignService");
import moment from "moment";
export default {
  name: "CampaignDetail",
  components: {
    BasePopup,
  },
  data() {
    return {
      isShowPopupEmail: false,
      isShowPopupReset: false,
      isShowPopupActive: false,
      validFormEmail: true,
      emailtest: "",
      titlePopup: "Kiểm thử",
      titlePopupReset: "Khởi động lại chiến dịch",
      titlePopupActive: "Kích hoạt chiến dịch",
      title: "Thêm sự kiện",
      formMode: FormMode.Add,
      isViewMode: false,
      currentData: {},
      validForm: false,
      rules: {
        campaignCodeRule: (value) => !!value || "Mã sự kiện bắt buộc nhập.",
        titleRule: (value) => !!value || "Tiêu đề email bắt buộc nhập.",
        displaynameRule: (value) => !!value || "Tên hiển thị bắt buộc nhập.",
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
    handleTestSendReset() {
      const me = this;
      let param = {
        CampaignID: this.currentData.idcampaign,
      };
      CampaignService.resetCampaign(param).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Reset thành công!");
            me.formMode = FormMode.View;
            me.getDataInfo(me.currentData.idcampaign);
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    openResetConfirm() {
      this.isShowPopupReset = true;
    },
    openActiveAccount() {
      this.isShowPopupActive = true;
    },
    onFileSelected(event) {
      this.fileContent = event.target.files[0];
    },
    closeEmailPopup() {
      this.emailtest = "";
      this.isShowPopupEmail = false;
    },
    closeResetPopup() {
      this.isShowPopupReset = false;
    },
    closeActivePopup() {
      this.isShowPopupActive = false;
    },
    handleTestSendEmail() {
      const me = this;
      let param = {
        CampaignID: this.currentData.idcampaign,
        Email: this.emailtest,
      };
      CampaignService.testSendEmail(param).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Gửi email thành công!");
            me.formMode = FormMode.View;
            me.getDataInfo(me.currentData.idcampaign);
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
      me.$toast.success("Đang gửi email cho khách mời.Vui lòng chờ!");
    },
    /**
     * Lấy dữ liệu sự kiện nếu ở form view
     */
    getDataInfo() {
      const me = this;
      if (me.formMode == FormMode.Add) {
        return;
      }
      let id = this.$route.params.id;
      CampaignService.getDataByIDCustom(id)
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
      let param = new FormData();
      param.append("campaigncode", this.currentData.campaigncode);
      param.append("campaignname", this.currentData.campaignname);
      param.append("subjectemail", this.currentData.subjectemail);
      param.append("senderdisplay", this.currentData.senderdisplay);
      param.append("startdate", this.currentData.startdate);
      param.append("enddate", this.currentData.enddate);
      param.append("file", this.fileContent, this.fileContent.name);
      CampaignService.addNewCampaign(param).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới sự kiện thành công!");
            this.backToList();
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    /**
     * sửa chieens dichj
     */
    updateData() {
      const me = this;
      let param = new FormData();
      param.append("campaigncode", this.currentData.campaigncode);
      param.append("campaignname", this.currentData.campaignname);
      param.append("subjectemail", this.currentData.subjectemail);
      param.append("senderdisplay", this.currentData.senderdisplay);
      param.append("startdate", this.currentData.startdate);
      param.append("enddate", this.currentData.enddate);
      param.append("idcampaign", this.currentData.idcampaign);
      if (this.fileContent) {
        param.append("file", this.fileContent, this.fileContent?.name);
      }

      CampaignService.updateCampaign(param).then((result) => {
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
      if (!this.fileContent && this.formMode == FormMode.Add) {
        this.$toast.error("Bạn chưa chọn file nội dung email.");
        return false;
      }
      return true;
    },
    testBeforeActive() {
      this.isShowPopupEmail = true;
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
            me.closeActivePopup();
            me.formMode = FormMode.View;
            me.getDataInfo(me.currentData.idcampaign);
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
      me.$toast.success("Đang gửi email cho khách mời.Vui lòng chờ!");
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