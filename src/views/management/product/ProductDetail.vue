<template>
  <div class="bk-product-detail bk-detail">
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
      <div class="title mt-4">Thông tin chung</div>
      <v-card-text class="pt-0">
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
                sm="6"
                class="px-8"
              >
                <v-col
                  cols="12"
                  class="px-8"
                >
                  <v-text-field
                    label="Mã hàng hóa (*)"
                    :disabled="isViewMode"
                    v-model="currentData.productcode"
                    :rules="[rules.productCodeRule]"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  class="px-8"
                >
                  <v-text-field
                    label="Tên hàng hóa (*)"
                    :disabled="isViewMode"
                    v-model="currentData.productname"
                    :rules="[rules.productNameRule]"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  class="px-8"
                >
                  <v-combobox
                    label="Nhóm hàng hóa"
                    v-model="selectedProductCategory"
                    item-text="text"
                    item-value="value"
                    :items="listProductCategory"
                    return-object
                    :disabled="isViewMode"
                  ></v-combobox>
                </v-col>
                <v-col
                  cols="12"
                  class="px-8"
                >
                  <v-text-field
                    v-model="currentData.costprice"
                    type="number"
                    label="Giá vốn"
                    :disabled="isViewMode"
                  />
                </v-col>
                <v-col
                  cols="12"
                  class="px-8"
                >
                  <v-text-field
                    v-model="currentData.sellprice"
                    type="number"
                    label="Giá bán"
                    :disabled="isViewMode"
                  />
                </v-col>
                <v-col
                  cols="12"
                  class="px-8"
                >
                  <v-textarea
                    label="Mô tả"
                    v-model="currentData.description"
                    rows="1"
                    auto-grow
                    :disabled="isViewMode"
                  ></v-textarea>
                </v-col>
                <v-col
                  cols="12"
                  class="px-8 "
                >
                  <div class="product-detail-inventory">

                    <v-text-field
                      v-model="totalInventory"
                      type="number"
                      disabled
                      label="Tồn kho"
                    />
                  </div>
                </v-col>

              </v-col>
              <v-col
                cols="12"
                sm="6"
                class="px-16 product-detail-main-image"
              >
                <image-upload
                  ref="mainImage"
                  width="300px"
                  :imageVal="mainImageLink"
                  @onFileSelected="changeMainImage"
                />

              </v-col>

            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <div class="product-detail-list-bonus">
        <div class="product-detail-attribute-area">
          <div
            class="product-detail-area-title"
            @click="isShowGroupAttribute = !isShowGroupAttribute"
          >
            <div class="title">Thuộc tính</div>
            <i class="fas fa-chevron-down"></i>
          </div>

          <div
            class="product-detail-attribute"
            v-show="isShowGroupAttribute"
          >
            <div class="product-detail-attribute-color">
              <div class="attribute-title mr-4">Màu sắc:</div>
              <div class="attribute-color-content">
                <table
                  class="bkc-table-cart"
                  v-if="listColorSelected.length > 0"
                >
                  <tr>
                    <th>Màu sắc</th>
                    <th class="pl-8">Hình ảnh</th>
                    <th></th>
                  </tr>
                  <tr
                    v-for="(item, index) in listColorSelected"
                    :key="index"
                    class="bkc-table-cart-row"
                  >
                    <td class="bkc-table-cart-cell">
                      <v-combobox
                        v-model="item.color"
                        :items="listColor"
                        :disabled="isViewMode"
                        width="300px"
                        placeholder="Chọn màu sắc"
                        clearable
                      ></v-combobox>
                    </td>
                    <td class="bkc-table-cart-cell ">
                      <div class="bkc-table-cart-product-name pl-8">
                        <div class="table-cart-img">
                          <image-upload
                            width="100px"
                            :imageVal="item.image"
                            @onFileSelected="changeColorImage(...arguments, item)"
                            :key="index"
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <v-icon
                          class="delete-icon"
                          @click="removeColor(index)"
                        >mdi-delete</v-icon>
                      </div>
                    </td>
                  </tr>
                </table>
                <v-btn
                  @click="insertColorAttribute()"
                  :disabled="isViewMode"
                >Thêm dòng</v-btn>
              </div>
            </div>
            <div class="product-detail-attribute-size">
              <div class="attribute-title mr-4">Kích thước:</div>
              <div class="attribute-size-content">
                <v-combobox
                  v-model="listSizeSelected"
                  :items="listSize"
                  return-object
                  :disabled="isViewMode"
                  width="300px"
                  multiple
                  chips
                  placeholder="Chọn kích thước"
                  clearable
                ></v-combobox>
              </div>
            </div>
          </div>
        </div>
        <div class="product-detail-instance-area mt-4 mb-4">
          <div
            class="product-detail-area-title"
            @click="isShowGroupInstance = !isShowGroupInstance"
          >
            <div class="title">Danh sách hàng hóa cùng loại</div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div
            class="product-detail-area-instance-content"
            v-show="isShowGroupInstance"
          >
            <table class="bkc-table-product-detail-instance">
              <tr class="bkc-table-cart-header">
                <th>Tên</th>
                <th>Mã hàng</th>
                <th>Giá vốn</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th></th>
              </tr>
              <tr
                v-for="(item, index) in listProductDetail"
                :key="index"
                class="bkc-table-cart-row"
              >
                <td class="bkc-table-cart-cell">
                  {{item.productname}}
                </td>
                <td class="bkc-table-cart-cell">{{item.productcode}}</td>
                <td class="bkc-table-cart-cell">
                  <v-text-field
                    variant="underlined"
                    v-model="item.costprice"
                    type="number"
                    :disabled="isViewMode"
                  ></v-text-field>
                </td>
                <td class="bkc-table-cart-cell">
                  <v-text-field
                    variant="underlined"
                    v-model="item.sellprice"
                    type="number"
                    :disabled="isViewMode"
                  ></v-text-field>
                </td>
                <td class="bkc-table-cart-cell">
                  <v-text-field
                    variant="underlined"
                    v-model="item.inventory"
                    type="number"
                    :disabled="isViewMode"
                  ></v-text-field>
                </td>
                <td>
                  <div>
                    <v-icon
                      class="delete-icon"
                      @click="removeProductItem(index)"
                    >mdi-delete</v-icon>
                  </div>
                </td>
              </tr>
            </table>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import FormMode from "../../../enum/FormModeEnum";
import AccountStatus from "../../../enum/AccountStatusEnum";
import ImageUpload from "../../common/ImageUpload.vue";
import { FactoryService } from "../../../service/factory/factory.service";
import { AZURE_STORAGE_BASE_URL } from "../../../config/config.dev.json";
const ProductService = FactoryService.get("productService");
const BranchService = FactoryService.get("branchService");
const ProductCategoryService = FactoryService.get("productcategoryService");
const AuthService = FactoryService.get("authService");
export default {
  name: "ProductDetail",
  components: {
    ImageUpload,
  },
  data() {
    return {
      testImg: "",
      listImageInColor: [],
      listProductDetail: [],
      listColorSelected: [],
      isShowGroupInstance: false,
      isShowGroupAttribute: false,
      title: "Thêm hàng hóa",
      formMode: FormMode.Add,
      isViewMode: false,
      currentData: {},
      validForm: false,
      rules: {
        productCodeRule: (value) => !!value || "Mã hàng hóa bắt buộc nhập.",
        productNameRule: (value) => !!value || "Tên hàng hóa bắt buộc nhập.",
        emailMatch: [
          (v) => !!v || "E-mail bắt buộc nhập.",
          (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ.",
        ],
      },
      listBranch: [],
      selectedBranch: null,
      mainImageLink: "",
      listProductCategory: [],
      selectedProductCategory: null,
      accountStatus: AccountStatus.NotActive,
      isOpenInventory: false,
      validInventoryForm: false,
      listSize: ["XS", "S", "M", "L", "XL", "XXL"],
      listColor: [
        "Đen",
        "Trắng",
        "Tím",
        "Hồng",
        "Đỏ",
        "Vàng",
        "Cam",
        "Nâu",
        "Xám",
        "Be",
        "Xanh lá cây",
        "Xanh dương",
      ],
      listSizeSelected: [],
      selectedColor: "",
      listFiles: [],
      listPermissionInModule: "",
      workingbranchid: 0,
      workingbranchname: "",
    };
  },
  created() {
    this.formMode = this.$route.params.formMode;
    this.currentData["branchid"] = this.$route.params.branchid;
    this.currentData["branchname"] = this.$route.params.branchname;
    if (this.$route.query.mode) {
      this.formMode = parseInt(this.$route.query.mode) ?? FormMode.Vỉew;
    }

    //this.getAllBranch();
    this.getAllProductCategory();
    this.getDetailInfo();
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
    removeProductItem(index) {
      this.listProductDetail.splice(index, 1);
    },
    removeColor(index) {
      this.listColorSelected.splice(index, 1);
    },
    /**
     * Thêm 1 màu sắc
     */
    insertColorAttribute() {
      this.listColorSelected.push({
        color: "",
      });
    },
    /**
     * Lấy danh sách toàn bộ chi nháh
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
    openProductInvetoryPopup() {
      this.isOpenInventory = true;
    },
    closeInventoryPopup() {
      this.isOpenInventory = false;
    },
    saveInventory() {},
    /**
     * Lấy danh sách toàn bộ nhóm hàng hoas
     */
    getAllProductCategory() {
      const me = this;
      ProductCategoryService.getAllData()
        .then((result) => {
          if (result && result.data) {
            me.listProductCategory = result.data.data
              .filter((x) => x.parentid != 0)
              .map((x) => ({
                value: x.idproductcategory,
                text: x.productcategoryname,
              }));
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * Lấy dữ liệu hàng hóa nếu ở form view
     */
    getDetailInfo() {
      const me = this;
      if (me.formMode == FormMode.Add) {
        return;
      }
      let id = this.$route.params.id;
      ProductService.getProductDetail(id)
        .then((result) => {
          if (result && result.data) {
            me.currentData = result.data.data.product;
            me.selectedProductCategory = {
              value: me.currentData["categoryid"],
              text: me.currentData["categoryname"],
            };
            me.mainImageLink = me.currentData["image"];
            me.listColorSelected = JSON.parse(me.currentData.color);
            me.listSizeSelected = JSON.parse(me.currentData.size);
            me.title = `${me.currentData.productcode} - ${me.currentData.productname}`;
            me.listProductDetail = [...result.data.data.productDetail];
            if (me.listProductDetail && me.listProductDetail.length > 0) {
              me.isShowGroupInstance = true;
            }
            if (me.listSizeSelected || me.listColorSelected.length > 0) {
              me.isShowGroupAttribute = true;
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    backToList() {
      this.$router.push({
        name: "m-product",
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
      this.prepareDataBeforeSave();
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
     * Làm chuẩn dữ liệu trước khi lưu
     */
    prepareDataBeforeSave() {
      let listFieldToInt = ["costprice", "sellprice", "inventory"];
      listFieldToInt.forEach((element) => {
        if (this.currentData[element] && this.currentData[element] != "") {
          this.currentData[element] = parseInt(this.currentData[element]);
        }
        this.listProductDetail.forEach((detail) => {
          if (detail[element] && detail[element] != "") {
            detail[element] = parseInt(detail[element]);
          }
        });
      });
      let listColorSelectedClone = [...this.listColorSelected];
      if (this.listImageInColor.length > 0) {
        listColorSelectedClone.forEach((element) => {
          element["image"] = this.listImageInColor.find(
            (x) => x.color == element.color
          )?.image;
        });
      }
      this.currentData["color"] = JSON.stringify(listColorSelectedClone);
      this.currentData["size"] = JSON.stringify(this.listSizeSelected);
    },
    /**
     * thay đổi image chính
     */
    changeMainImage(file) {
      if (file) {
        let fileClone = this.renameFile(file, `${Date.now()}`);
        this.currentData[
          "image"
        ] = `${AZURE_STORAGE_BASE_URL}${fileClone.name}`;
        this.listFiles.push(fileClone);
      }
    },
    renameFile(originalFile, newName) {
      return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
    },
    /**
     * thay đổi image list color
     */
    changeColorImage(file, item) {
      if (file) {
        let fileClone = this.renameFile(file, `${Date.now()}`);
        this.listImageInColor.push({
          color: item.color,
          image: `${AZURE_STORAGE_BASE_URL}${fileClone.name}`,
        });

        this.listFiles.push(fileClone);
      }
    },
    /**
     * thêm mới hàng hóa
     */
    insertData() {
      let productParam = new FormData();
      productParam.append("product", JSON.stringify(this.currentData));
      productParam.append(
        "productdetail",
        JSON.stringify(this.listProductDetail)
      );
      for (let i = 0; i < this.listFiles.length; i++) {
        productParam.append("file", this.listFiles[i], this.listFiles[i].name);
      }
      const me = this;
      ProductService.insertProductDetail(productParam).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới hàng hóa thành công!");
            me.formMode = FormMode.View;
            me.listSizeSelected = JSON.parse(result.data.data.size);
            me.listColorSelected = JSON.parse(result.data.data.color);
            this.$router.push({
              name: "m-product-detail",
              params: { id: result.data.data["idproduct"], formMode: 3 },
            });
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },
    /**
     * sửa hàng hóa
     */
    updateData() {
      let productParam = new FormData();
      productParam.append("product", JSON.stringify(this.currentData));
      productParam.append(
        "productdetail",
        JSON.stringify(this.listProductDetail)
      );
      for (let i = 0; i < this.listFiles.length; i++) {
        productParam.append("file", this.listFiles[i], this.listFiles[i].name);
      }
      const me = this;
      ProductService.updateProductDetail(productParam).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Sửa hàng hóa thành công!");
            me.formMode = FormMode.View;
            me.listSizeSelected = JSON.parse(result.data.data.size);
            me.listColorSelected = JSON.parse(result.data.data.color);
            this.$router.push({
              name: "m-product-detail",
              params: { id: result.data.data["idproduct"], formMode: 3 },
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
    selectedProductCategory: {
      handler: function (val) {
        if (val) {
          this.currentData["categoryid"] = val["value"];
          this.currentData["categoryname"] = val["text"];
        }
      },
      deep: true,
    },
    listColorSelected: {
      handler: function (val) {
        if (
          val &&
          val.length > 0 &&
          (this.formMode == FormMode.Add || this.formMode == FormMode.Edit)
        ) {
          const me = this;
          me.isShowGroupInstance = true;
          let countP = 0;
          if (this.formMode == FormMode.Add) {
            me.listProductDetail = [];
            val.forEach((element) => {
              if (element["color"] != "") {
                if (me.listSizeSelected && me.listSizeSelected.length > 0) {
                  me.listSizeSelected.forEach((size) => {
                    countP++;
                    me.listProductDetail.push({
                      productname: `${me.currentData["productname"]} - ${element["color"]} - ${size}`,
                      productcode: `${me.currentData["productcode"]}-${countP}`,
                      costprice: `${me.currentData["costprice"]}`,
                      sellprice: `${me.currentData["sellprice"]}`,
                      size: size,
                      color: element["color"],
                    });
                  });
                } else {
                  countP++;
                  me.listProductDetail.push({
                    productname: `${me.currentData["productname"]} - ${element["color"]}`,
                    productcode: `${me.currentData["productcode"]}-${countP}`,
                    costprice: `${me.currentData["costprice"]}`,
                    sellprice: `${me.currentData["sellprice"]}`,
                    color: element["color"],
                  });
                }
              }
            });
          }
        }
      },
      deep: true,
    },
    currentData: {
      handler: function (val) {
        if (
          val &&
          (this.formMode == FormMode.Add || this.formMode == FormMode.Edit)
        ) {
          const me = this;
          me.isShowGroupInstance = true;
          let countP = 0;
          if (this.formMode == FormMode.Add) {
            me.listProductDetail = [];
            if (me.listColorSelected && me.listColorSelected.length > 0) {
              me.listColorSelected.forEach((element) => {
                if (element["color"] != "") {
                  if (me.listSizeSelected && me.listSizeSelected.length > 0) {
                    me.listSizeSelected.forEach((size) => {
                      countP++;
                      me.listProductDetail.push({
                        productname: `${val["productname"]} - ${element["color"]} - ${size}`,
                        productcode: `${val["productcode"]}-${countP}`,
                        costprice: `${val["costprice"]}`,
                        sellprice: `${val["sellprice"]}`,
                        size: size,
                        color: element["color"],
                      });
                    });
                  } else {
                    me.listProductDetail = [];
                    countP++;
                    me.listProductDetail.push({
                      productname: `${val["productname"]} - ${element["color"]}`,
                      productcode: `${val["productcode"]}-${countP}`,
                      costprice: `${val["costprice"]}`,
                      sellprice: `${val["sellprice"]}`,
                      color: element["color"],
                    });
                  }
                }
              });
            }
          }
        }
      },
      deep: true,
    },
    listSizeSelected: {
      handler: function (val) {
        if (
          val &&
          val.length > 0 &&
          (this.formMode == FormMode.Add || this.formMode == FormMode.Edit)
        ) {
          const me = this;
          me.isShowGroupInstance = true;
          let countP = 0;
          if (this.formMode == FormMode.Add) {
            me.listProductDetail = [];
            me.listColorSelected.forEach((element) => {
              if (element["color"] != "") {
                if (val && val.length > 0) {
                  val.forEach((size) => {
                    countP++;
                    me.listProductDetail.push({
                      productname: `${me.currentData["productname"]} - ${element["color"]} - ${size}`,
                      productcode: `${me.currentData["productcode"]}-${countP}`,
                      costprice: `${me.currentData["costprice"]}`,
                      sellprice: `${me.currentData["sellprice"]}`,
                      size: size,
                      color: element["color"],
                    });
                  });
                } else {
                  me.listProductDetail = [];
                  countP++;
                  me.listProductDetail.push({
                    productname: `${me.currentData["productname"]} - ${element["color"]}`,
                    productcode: `${me.currentData["productcode"]}-${countP}`,
                    costprice: `${me.currentData["costprice"]}`,
                    sellprice: `${me.currentData["sellprice"]}`,
                    color: element["color"],
                  });
                }
              }
            });
          }
        }
      },
      deep: true,
    },
    totalInventory(val) {
      this.currentData["inventory"] = val;
    },
  },
  computed: {
    totalInventory() {
      let total = 0;
      this.listProductDetail.forEach((x) => {
        if (x && x["inventory"] && x["inventory"] != "") {
          total += parseInt(x["inventory"]);
        }
      });

      return total;
    },
  },
};
</script>

<style scroped>
@import url("../../../css/management/m-productdetail.css");
</style>