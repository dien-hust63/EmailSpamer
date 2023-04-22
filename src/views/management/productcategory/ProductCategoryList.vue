<template>
  <div class="bk-productcategory-list bk-list">
    <MHeader
      :title="title"
      :subtitle="subtitle"
      addBtn='Thêm nhóm hàng hóa'
      @openAddForm="openAddForm"
      @deleteData="deleteData"
      :isShowDelete="isShowDelete"
      deleteBtn="Xóa nhóm hàng hóa"
      searchTitle="Tìm kiếm theo mã, tên nhóm hàng hóa"
      @onSearch="searchProductcategory"
    />
    <div class="bk-list-body">
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="productcategoryList"
        item-key="productcategorycode"
        show-select
        hide-default-footer
        fixed-header
        @dblclick:row="dblclickRow"
        no-data-text="Không có dữ liệu"
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
      @closePopup="closePopup"
      maxwidth="760px"
      :title="titlePopup"
      @saveData="saveData"
    >
      <v-card-text>
        <v-form
          ref="form"
          v-model="validForm"
          lazy-validation
          class="productcategory-form"
        >
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Mã nhóm hàng hóa (*)"
                  required
                  :rules="[rules.productcategoryCodeRule]"
                  v-model="addData.productcategorycode"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Tên nhóm hàng hóa (*)"
                  :rules="[rules.productcategoryNameRule]"
                  required
                  v-model="addData.productcategoryname"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Mô tả nhóm hàng hóa"
                  persistent-hint
                  required
                  v-model="addData.description"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-combobox
                  label="Thuộc nhóm hàng hóa"
                  v-model="selectedCategory"
                  item-text="text"
                  item-value="value"
                  :items="listCategoryCombobox"
                  return-object
                ></v-combobox>
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
const ProductCategoryService = FactoryService.get("productcategoryService");
export default {
  name: "ProductCategoryList",
  components: {
    MHeader,
    BasePopup,
  },
  data() {
    return {
      isShowDelete: false,
      validForm: true,
      rules: {
        productcategoryCodeRule: (value) =>
          !!value || "Mã nhóm hàng hóa bắt buộc nhập.",
        productcategoryNameRule: (value) =>
          !!value || "Tên nhóm hàng hóa bắt buộc nhập.",
        emailMatch: () => `Email hoặc mật khẩu không chính xác.`,
      },
      titlePopup: "Thêm nhóm hàng hóa",
      popupMode: FormMode.Add,
      addData: {},
      isShowPopup: false,
      maxPageShow: 7,
      pageShow: 1,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      title: "Nhóm hàng hóa",
      subtitle: "Danh sách nhóm hàng hóa.",
      selected: [],
      listCategoryCombobox: [],
      headers: [
        {
          text: "ID nhóm hàng hóa",
          align: " d-none",
          sortable: false,
          value: "idproductcategory",
        },
        {
          text: "Mã nhóm hàng hóa",
          align: "start",
          sortable: false,
          value: "productcategorycode",
        },
        {
          text: "Tên nhóm hàng hóa",
          align: "start",
          sortable: false,
          value: "productcategoryname",
        },
        { text: "Mô tả nhóm hàng hóa", value: "description" },
        { text: "Thuộc nhóm hàng hóa", value: "parentname" },
      ],
      productcategoryList: [],
      selectedCategory: null,
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
  },

  methods: {
    /**
     * Tim kiem theo ma va ten vai tro
     * @param {} data
     */
    searchProductcategory(data) {
      console.log(data);
      this.listFilter = [
        {
          FieldName: "productcategorycode",
          Operator: Operator.Like,
          FilterValue: data,
        },
        {
          FieldName: "productcategoryname",
          Operator: Operator.Like,
          FilterValue: data,
        },
      ];
      this.filterFormula = "{0} OR {1}";
      this.getDefaultData();
    },
    dblclickRow(e, rowData) {
      this.addData = rowData.item;
      if (this.isShowDelete) return;
      this.openEditForm();
    },
    getDefaultData() {
      const me = this;
      ProductCategoryService.getPagingData({
        PageIndex: me.pageIndex,
        PageSize: me.pageSize,
        TableName: "ProductCategory",
        ListFilter: me.listFilter,
        FilterFormula: me.filterFormula,
        ListOrderBy: [],
      }).then((result) => {
        if (result && result.data) {
          me.productcategoryList = result.data.listPaging;
          me.listCategoryCombobox = result.data.listPaging
            .filter((x) => x.parentid == 0)
            .map((x) => ({
              value: x.idproductcategory,
              text: x.productcategoryname,
            }));
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
      this.titlePopup = "Sửa nhóm hàng hóa";
      this.popupMode = FormMode.Edit;
      this.isShowPopup = true;
    },
    /**
     * mở form thêm mới
     */
    openAddForm() {
      this.titlePopup = "Thêm nhóm hàng hóa";
      this.popupMode = FormMode.Add;
      this.isShowPopup = true;
    },
    /**
     * Lưu nhóm hàng hóa
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
     * thêm mới nhóm hàng hóa
     */
    insertData() {
      const me = this;
      ProductCategoryService.insertData(this.addData).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới nhóm hàng hóa thành công!");
            me.closePopup();
            this.getDefaultData();
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    /**
     * sửa nhóm hàng hóa
     */
    updateData() {
      const me = this;
      ProductCategoryService.updateData(
        this.addData,
        this.addData?.idproductcategory
      ).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Sửa nhóm hàng hóa thành công!");
            me.closePopup();
            this.getDefaultData();
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
    closePopup() {
      this.$refs.form.resetValidation();
      this.isShowPopup = false;
      this.addData = {};
      this.selectedCategory = null;
    },
    /**
     * xóa dữ liệu
     */
    deleteData() {
      const me = this;
      let listID = this.selected.map((x) => x.idproductcategory).join(",");
      ProductCategoryService.deleteMultiple({ ListID: listID }).then(
        (result) => {
          if (result && result.data) {
            if (result.data.success) {
              this.selected = [];
              me.$toast.success("Xóa nhóm hàng hóa thành công!");
              this.getDefaultData();
            } else {
              me.$toast.error(result.data.errorMessage);
            }
          }
        }
      );
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
    selectedCategory: {
      handler: function (val) {
        if (val) {
          this.addData["parentid"] = val["value"];
          this.addData["parentname"] = val["text"];
        }
      },
      deep: true,
    },
  },
};
</script><style lang="sass" scoped>
@import url('../../../css/management/m-productcategory.css')
</style>
    
    