<template>
  <div class="bk-role-list bk-list">
    <MHeader
      :title="title"
      :subtitle="subtitle"
      addBtn='Thêm chi nhánh'
      @openAddForm="openAddForm"
      @deleteData="deleteData"
      :isShowDelete="isShowDelete"
      deleteBtn="Xóa chi nhánh"
      searchTitle="Tìm kiếm theo mã, tên chi nhánh"
      @onSearch="searchBranch"
    />
    <div class="bk-list-body">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="branchList"
        item-key="branchcode"
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
      @saveData="saveBranch"
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
                sm="5"
              >
                <v-text-field
                  label="Mã chi nhánh (*)"
                  required
                  :rules="[rules.branchCodeRule]"
                  v-model="addBranch.branchcode"
                ></v-text-field>
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
              >
                <v-text-field
                  label="Tên chi nhánh (*)"
                  :rules="[rules.branchNameRule]"
                  required
                  v-model="addBranch.branchname"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="5"
              >
                <v-combobox
                  label="Tỉnh thành (*)"
                  v-model="selectedProvince"
                  item-text="text"
                  item-value="id"
                  :items="listProvince"
                  return-object
                  dense
                  @change="changeProvince($event)"
                  :rules="[rules.provinceRule]"
                ></v-combobox>
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
              >
                <v-combobox
                  label="Quận huyện (*)"
                  v-model="selectedDistrict"
                  item-text="text"
                  item-value="id"
                  :items="listDistrict"
                  return-object
                  dense
                  :disabled="isDisableDistrict"
                  @change="changeDistrict($event)"
                  :rules="[rules.districtRule]"
                ></v-combobox>
              </v-col>
              <v-col
                cols="12"
                sm="5"
              >

                <v-text-field
                  label="Địa chỉ (*)"
                  required
                  dense
                  :rules="[rules.addressRule]"
                  v-model="addBranch.address"
                ></v-text-field>
              </v-col>
              <v-col sm="2"></v-col>
              <v-col
                cols="12"
                sm="5"
              >
                <v-combobox
                  label="Phường xã (*)"
                  v-model="selectedWard"
                  item-text="text"
                  item-value="id"
                  :items="listWard"
                  return-object
                  dense
                  :disabled="isDisableWard"
                  :rules="[rules.wardRule]"
                ></v-combobox>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-checkbox
                  label="Là chi nhánh online"
                  v-model="addBranch.isaddressdefault"
                ></v-checkbox>
                <!-- <v-combobox
                  label="Trưởng chi nhánh"
                  v-model="selectedManager"
                  item-text="text"
                  item-value="value"
                  :items="listEmployee"
                  return-object
                ></v-combobox> -->
              </v-col>
              <v-col sm="6"></v-col>

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
const BranchService = FactoryService.get("branchService");
const EmployeeService = FactoryService.get("employeeService");
const LocationService = FactoryService.get("locationService");
export default {
  name: "BranchList",
  components: {
    MHeader,
    BasePopup,
  },
  data() {
    return {
      isShowDelete: false,
      validForm: true,
      rules: {
        branchCodeRule: (value) => !!value || "Mã chi nhánh bắt buộc nhập.",
        branchNameRule: (value) => !!value || "Tên chi nhánh bắt buộc nhập.",
        emailMatch: () => `Email hoặc mật khẩu không chính xác.`,
        provinceRule: (value) => !!value || "Vui lòng chọn tỉnh thành",
        districtRule: (value) => !!value || "Vui lòng chọn quận huyện",
        wardRule: (value) => !!value || "Vui lòng chọn phường xã",
        addressRule: (value) => !!value || "Vui lòng nhập địa chỉ",
      },
      titlePopup: "Thêm chi nhánh",
      popupMode: FormMode.Add,
      addBranch: {},
      isShowPopup: false,
      maxPageShow: 7,
      pageShow: 1,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      title: "Chi nhánh",
      subtitle: "Danh sách các chi nhánh",
      selected: [],
      headers: [
        {
          text: "ID chi nhánh",
          align: " d-none",
          sortable: false,
          value: "idbranch",
        },
        {
          text: "Mã chi nhánh",
          align: "start",
          sortable: false,
          value: "branchcode",
        },
        {
          text: "Tên chi nhánh",
          align: "start",
          sortable: false,
          value: "branchname",
        },
        //{ text: "Trưởng chi nhánh", value: "branchmanagername" },
        { text: "Địa chỉ", value: "address" },
        { text: "Xã phường", value: "wardname" },
        { text: "Quận huyện", value: "districtname" },
        { text: "Tỉnh thành", value: "provincename" },
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
      selectedManager: null,

      /**
       * address
       */
      selectedProvince: null,
      listProvince: [],
      isDisableDistrict: true,
      listDistrict: [],
      selectedDistrict: null,
      listWard: [],
      selectedWard: null,
      isDisableWard: true,
    };
  },

  created() {
    this.getDefaultData();
    this.getAllEmployee();
    this.getAllProvince();
  },

  methods: {
    /**
     * Lấy danh sách toàn bộ nhân viên
     */
    getAllEmployee() {
      const me = this;
      EmployeeService.getAllData()
        .then((result) => {
          if (result && result.data) {
            me.listEmployee = result.data.data.map((x) => ({
              value: x.idemployee,
              text: `${x.employeename} (${x.employeecode})`,
            }));
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * Tim kiem theo ma va ten vai tro
     * @param {} data
     */
    searchBranch(data) {
      console.log(data);
      this.listFilter = [
        {
          FieldName: "branchcode",
          Operator: Operator.Like,
          FilterValue: data,
        },
        {
          FieldName: "branchname",
          Operator: Operator.Like,
          FilterValue: data,
        },
      ];
      this.filterFormula = "{0} OR {1}";
      this.getDefaultData();
    },
    dblclickRow(e, rowData) {
      this.addBranch = rowData.item;
      this.selectedProvince = {
        id: rowData.item["provinceid"],
        text: rowData.item["provincename"],
      };
      this.selectedDistrict = {
        id: rowData.item["districtid"],
        text: rowData.item["districtname"],
      };
      this.selectedWard = {
        id: rowData.item["wardid"],
        text: rowData.item["wardname"],
      };
      if (this.isShowDelete) return;
      this.openEditForm();
    },
    getDefaultData() {
      const me = this;
      BranchService.getPagingData({
        PageIndex: me.pageIndex,
        PageSize: me.pageSize,
        TableName: "Branch",
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
      this.titlePopup = "Sửa chi nhánh";
      this.popupMode = FormMode.Edit;
      this.isShowPopup = true;
    },
    /**
     * mở form thêm mới
     */
    openAddForm() {
      this.titlePopup = "Thêm chi nhánh";
      this.popupMode = FormMode.Add;
      this.isShowPopup = true;
    },
    /**
     * Lưu chi nhánh
     */
    saveBranch() {
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
      BranchService.insertData(this.addBranch).then((result) => {
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
      BranchService.updateData(this.addBranch, this.addBranch?.idbranch).then(
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
      this.selectedProvince = null;
      this.selectedDistrict = null;
      this.selectedWard = null;
    },
    /**
     * xóa dữ liệu
     */
    deleteData() {
      const me = this;
      let listID = this.selected.map((x) => x.idbranch).join(",");
      BranchService.deleteMultiple({ ListID: listID }).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            this.selected = [];
            me.$toast.success("Xóa chi nhánh thành công!");
            this.getDefaultData();
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    /**
     * Lấy danh sách các tỉnh
     */
    getAllProvince() {
      const me = this;

      LocationService.getListProvince()
        .then((result) => {
          if (result && result.data) {
            me.listProvince = result.data.data.map((x) => ({
              id: x.ProvinceID,
              text: x.ProvinceName,
            }));
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    changeProvince(province) {
      const me = this;
      me.selectedDistrict = null;
      me.selectedWard = null;
      me.deliverPrice = null;
      LocationService.getDistrictByProvince(province.id)
        .then((result) => {
          if (result && result.data) {
            me.isDisableDistrict = false;
            me.listDistrict = result.data.data.map((x) => ({
              id: x.DistrictID,
              text: x.DistrictName,
            }));
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    changeDistrict(district) {
      const me = this;
      me.selectedWard = null;
      me.deliverPrice = null;
      LocationService.getWardByDistrict(district.id)
        .then((result) => {
          if (result && result.data) {
            me.isDisableWard = false;
            me.listWard = result.data.data.map((x) => ({
              id: x.WardCode,
              text: x.WardName,
            }));
          }
        })
        .catch((e) => {
          console.log(e);
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
    selectedManager: {
      handler: function (val) {
        if (val) {
          this.addBranch["branchmanagerid"] = val["value"];
          this.addBranch["branchmanagername"] = val["text"];
        }
      },
      deep: true,
    },
    selectedProvince: {
      handler: function (val) {
        if (val) {
          this.addBranch["provinceid"] = val["id"];
          this.addBranch["provincename"] = val["text"];
        }
      },
      deep: true,
    },
    selectedDistrict: {
      handler: function (val) {
        if (val) {
          this.addBranch["districtid"] = val["id"];
          this.addBranch["districtname"] = val["text"];
        }
      },
      deep: true,
    },
    selectedWard: {
      handler: function (val) {
        if (val) {
          this.addBranch["wardid"] = val["id"];
          this.addBranch["wardname"] = val["text"];
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
  
  