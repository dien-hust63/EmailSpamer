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
        v-show="selectedOrderStatus.id == 2 && isReceivePermission"
        color="success"
        @click="receiveOrder"
        class="ml-4"
      >
        <v-icon left>
          mdi-pencil
        </v-icon>
        Tiếp nhận
      </v-btn>
      <v-dialog
        v-model="deliverConfigDialog"
        persistent
        max-width="490"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-show="selectedOrderStatus.id == 3"
            color="success"
            class="ml-4"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon left>
              mdi-pencil
            </v-icon>
            Tạo đơn giao hàng
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h6">
            Hệ thống sẽ tạo đơn giao hàng sang Giao hàng nhanh đối với đơn hàng này. Bạn có chắc muốn tạo đơn giao hàng?
          </v-card-title>
          <!-- <v-card-text>Bạn có chắc muốn xóa những dữ liệu đã chọn?</v-card-text> -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="deliverConfigDialog = false">
              Hủy
            </v-btn>
            <v-btn
              depressed
              color="success"
              @click="createOrderDeliver"
            >
              Đồng ý
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
      <div class="bk-order-common-info">
        <div class="title mt-4">Thông tin mua hàng</div>
        <v-card-text>
          <v-form
            ref="form"
            v-model="validForm"
            lazy-validation
            class="order-form"
          >
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="5"
                  class="px-8"
                >
                  <v-text-field
                    label="Mã đơn hàng (*)"
                    :disabled="true"
                    v-model="currentData.ordercode"
                    :rules="[rules.orderCodeRule]"
                  ></v-text-field>
                </v-col>
                <v-col sm="2"></v-col>
                <v-col
                  cols="12"
                  sm="5"
                  class="px-8"
                >
                  <v-text-field
                    label="Ngày mua hàng (*)"
                    :disabled="isViewMode"
                    v-model="currentData.orderdate"
                    :rules="[rules.orderDateRule]"
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
                    label="Tên khách hàng (*)"
                    :disabled="isViewMode"
                    v-model="currentData.customername"
                    :rules="[rules.customernameRule]"
                  ></v-text-field>
                </v-col>
                <v-col sm="2"></v-col>
                <v-col
                  cols="12"
                  sm="5"
                  class="px-8"
                >
                  <v-text-field
                    label="SĐT khách hàng (*)"
                    :disabled="isViewMode"
                    v-model="currentData.customerphone"
                    :rules="[rules.customerphoneRule]"
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
                    label="Email khách hàng"
                    :disabled="isViewMode"
                    v-model="currentData.customeremail"
                  ></v-text-field>
                </v-col>
                <v-col sm="2"></v-col>
                <v-col
                  cols="12"
                  sm="5"
                  class="px-8"
                >
                  <v-text-field
                    label="Ghi chú"
                    :disabled="isViewMode"
                    v-model="currentData.customerdescription"
                  ></v-text-field>
                </v-col>

              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="5"
                  class="px-8"
                >
                  <v-combobox
                    label="Hình thức mua hàng"
                    v-model="selectedOrderType"
                    item-text="text"
                    item-value="id"
                    :items="listOrderType"
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
                  <v-text-field
                    label="Tổng tiền"
                    :disabled="true"
                    v-model="totalPrice"
                  ></v-text-field>
                </v-col>

              </v-row>
              <div
                class="order-online-area"
                v-show="selectedOrderType.id == 2"
              >
                <v-row>
                  <v-col
                    cols="12"
                    sm="5"
                    class="px-8"
                  >
                    <v-combobox
                      label="Tỉnh thành (*)"
                      v-model="selectedProvince"
                      item-text="text"
                      item-value="id"
                      :items="listProvince"
                      return-object
                      :disabled="isViewMode"
                      @change="changeProvince($event)"
                    ></v-combobox>
                  </v-col>
                  <v-col sm="2"></v-col>
                  <v-col
                    cols="12"
                    sm="5"
                    class="px-8"
                  >
                    <v-combobox
                      label="Quận huyện (*)"
                      v-model="selectedDistrict"
                      item-text="text"
                      item-value="id"
                      :items="listDistrict"
                      return-object
                      :disabled="isDisableDistrict"
                      @change="changeDistrict($event)"
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
                      label="Phường xã (*)"
                      v-model="selectedWard"
                      item-text="text"
                      item-value="id"
                      :items="listWard"
                      return-object
                      :disabled="isDisableWard"
                      @change="changeWard($event)"
                    ></v-combobox>
                  </v-col>
                  <v-col sm="2"></v-col>
                  <v-col
                    cols="12"
                    sm="5"
                    class="px-8"
                  >
                    <v-text-field
                      label="Địa chỉ cụ thể"
                      :disabled="isViewMode"
                      v-model="currentData.customeraddress"
                    ></v-text-field>
                  </v-col>

                </v-row>

                <v-row>
                  <v-col
                    cols="12"
                    sm="5"
                    class="px-8"
                  >
                    <v-combobox
                      label="Hình thức thanh toán"
                      v-model="selectedCheckoutType"
                      item-text="text"
                      item-value="id"
                      :items="listCheckoutType"
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
                      label="Trạng thái thanh toán"
                      v-model="checkoutStatus"
                      item-text="text"
                      item-value="id"
                      :items="listCheckoutStatus"
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
                      label="Trạng thái đơn hàng"
                      v-model="selectedOrderStatus"
                      item-text="text"
                      item-value="id"
                      :items="listOrderStatus"
                      return-object
                      :disabled="isViewMode"
                      @change="changeOrderStatus($event)"
                    ></v-combobox>
                  </v-col>
                </v-row>

              </div>

            </v-container>
          </v-form>
        </v-card-text>
      </div>
      <div class="bk-order-other-info">
        <div class="title mt-4">Thông tin khác</div>
        <v-card-text>
          <v-form
            ref="form"
            v-model="validForm"
            lazy-validation
            class="order-form"
          >
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="5"
                  class="px-8"
                >
                  <v-text-field
                    label="Nhân viên bán hàng"
                    :disabled="true"
                    v-model="currentData.receiveemployeename"
                  ></v-text-field>
                </v-col>
                <v-col sm="2"></v-col>
                <v-col
                  cols="12"
                  sm="5"
                  class="px-8"
                >
                  <v-text-field
                    label="Chi nhánh"
                    :disabled="true"
                    v-model="currentData.branchname"
                  ></v-text-field>
                </v-col>
              </v-row>

            </v-container>
          </v-form>
        </v-card-text>
      </div>
      <div class="bk-order-other-detail-info">
        <div class="title mt-4">Thông tin hàng hóa</div>
        <table
          class="bkc-table-product-detail-instance mt-4"
          v-show="listProductDetail.length > 0"
        >
          <tr class="bkc-table-cart-header">
            <th>Tên</th>
            <th>Mã hàng</th>
            <th>Màu sắc</th>
            <th>Kích thước</th>
            <th>Giá bán</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
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
            <td class="bkc-table-cart-cell">{{item.color}}</td>
            <td class="bkc-table-cart-cell">{{item.size}}</td>
            <td class="bkc-table-cart-cell">
              <v-text-field
                variant="underlined"
                v-model="item.sellprice"
                type="number"
                :disabled="true"
              ></v-text-field>
            </td>
            <td class="bkc-table-cart-cell">
              <v-text-field
                variant="underlined"
                v-model="item.quantity"
                type="number"
                :disabled="isViewMode"
              ></v-text-field>
            </td>
            <td class="bkc-table-cart-cell">
              <v-text-field
                variant="underlined"
                :value="item.sellprice * item.quantity"
                type="number"
                :disabled="true"
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
        <v-btn
          class="mt-4"
          @click="openPopupProduct()"
          :disabled="isViewMode"
        >Thêm hàng hóa</v-btn>
      </div>
      <div
        class="bk-order-deliver-info"
        v-show="selectedOrderType.id == 2"
      >
        <div class="title mt-4">Thông tin giao hàng</div>
        <v-card-text>
          <v-form
            ref="form"
            v-model="validForm"
            lazy-validation
            class="order-form"
          >
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="5"
                  class="px-8"
                >
                  <v-text-field
                    label="Phí giao hàng"
                    :disabled="true"
                    v-model="currentData.deliverprice"
                  ></v-text-field>
                </v-col>
                <v-col sm="2"></v-col>
              </v-row>

            </v-container>
          </v-form>
        </v-card-text>
      </div>
    </div>
    <ProductPopup
      :isShowPopup="isShowProductPopup"
      @close="closeProductPopup"
      @addProductToOrder="addProductToOrder"
    />
  </div>
</template>

<script>
import FormMode from "../../../enum/FormModeEnum";
import AccountStatus from "../../../enum/AccountStatusEnum";
import OrderStatus from "../../../enum/OrderStatusEnum";
import { FactoryService } from "../../../service/factory/factory.service";
import { AZURE_STORAGE_BASE_URL } from "../../../config/config.dev.json";
import moment from "moment";
import ProductPopup from "../product/ProductPopup.vue";
const OrderService = FactoryService.get("orderService");
const BranchService = FactoryService.get("branchService");
const LocationService = FactoryService.get("locationService");
const DeliverService = FactoryService.get("deliverService");
const ProductCategoryService = FactoryService.get("productcategoryService");
const AuthService = FactoryService.get("authService");

export default {
  name: "OrderDetail",
  components: { ProductPopup },
  data() {
    return {
      defaultBranch: null,
      listPermissionInModule: "",
      selectedProvince: null,
      listProvince: [],
      isDisableDistrict: true,
      listDistrict: [],
      selectedDistrict: null,
      listWard: [],
      selectedWard: null,
      isDisableWard: true,
      isShowProductPopup: false,
      titlePopup: "Danh sách hàng hóa",
      testImg: "",
      listOrderType: [
        {
          id: 1,
          text: "Mua trực tiếp tại chi nhánh",
        },
        {
          id: 2,
          text: "Mua online",
        },
      ],
      listCheckoutType: [
        {
          id: 1,
          text: "Thanh toán qua VNPAY",
        },
        {
          id: 2,
          text: "Thanh toán khi nhận hàng",
        },
      ],
      listCheckoutStatus: [
        {
          id: 1,
          text: "Đã thanh toán",
        },
        {
          id: 2,
          text: "Chưa thanh toán",
        },
      ],
      selectedCheckoutType: {
        id: 2,
        text: "Thanh toán khi nhận hàng",
      },
      checkoutStatus: {
        id: 2,
        text: "Chưa thanh toán",
      },
      selectedOrderStatus: {
        id: 1,
        text: "Thành công",
      },
      listOrderStatus: [
        {
          id: 1,
          text: "Thành công",
        },
        {
          id: 2,
          text: "Chờ tiếp nhận",
        },
        {
          id: 3,
          text: "Đã tiếp nhận",
        },
        {
          id: 4,
          text: "Chờ giao hàng",
        },
        {
          id: 5,
          text: "Đang giao hàng",
        },
        {
          id: 6,
          text: "Giao hàng thất bại",
        },
        {
          id: 7,
          text: "Đổi hàng",
        },
        {
          id: 8,
          text: "Trả hàng",
        },
        {
          id: 9,
          text: "Hủy",
        },
      ],
      listImageInColor: [],
      listProductDetail: [],
      listColorSelected: [],
      isShowGroupInstance: false,
      isShowGroupAttribute: false,
      title: "Thêm đơn hàng",
      formMode: FormMode.Add,
      isViewMode: false,
      currentData: {},
      validForm: false,
      rules: {
        orderCodeRule: (value) => !!value || "Mã đơn hàng bắt buộc nhập.",
        orderDateRule: (value) => !!value || "Ngày mua hàng bắt buộc nhập.",
        customernameRule: (value) => !!value || "Tên khách hàng bắt buộc nhập.",
        customerphoneRule: (value) =>
          !!value || "SĐT khách hàng bắt buộc nhập.",
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
      selectedOrderType: {
        id: 1,
        text: "Mua trực tiếp tại chi nhánh",
      },
      isShowPopup: false,
      currentUser: null,
      isReceivePermission: false,
      deliverConfigDialog: false,
    };
  },
  created() {
    const me = this;
    this.formMode = this.$route.params.formMode;
    if (this.$route.query.mode) {
      this.formMode = parseInt(this.$route.query.mode) ?? FormMode.Vỉew;
    }
    if (this.formMode == FormMode.Add) {
      OrderService.getOrderCodeAuto().then((result) => {
        if (result && result.data) {
          me.currentData["ordercode"] = result.data.data;
        }
      });
    }
    this.currentData.orderdate = moment().format("yyyy-MM-DD");
    this.getAllBranch();
    // this.getAllProductCategory();
    this.getDetailInfo();
    this.getAllProvince();
    let user = JSON.parse(localStorage.getItem("user"));
    this.currentUser = user.userInfo;
    AuthService.getPermission(user.userInfo).then((result) => {
      if (result && result.data) {
        let listPermissionClone = [...result.data.data];
        me.listPermissionInModule = listPermissionClone.find(
          (x) => x.modulecode == "Order"
        ).permission;
        me.isReceivePermission =
          me.listPermissionInModule.includes("Receive") ||
          me.listPermissionInModule.includes("All");
      }
    });

    this.currentData["receiveemployeename"] = this.currentUser.username;
    this.currentData["receiveemployeeid"] = parseInt(this.currentUser.iduser);
    this.currentData["branchid"] = this.$route.params.branchid
      ? this.$route.params.branchid
      : this.currentUser.branchid;
    this.currentData["branchname"] = this.$route.params.branchname
      ? this.$route.params.branchname
      : this.currentUser.branchname;
    this.currentData["ordertypeid"] = this.selectedOrderType.id;
    this.currentData["ordertypename"] = this.selectedOrderType.text;
  },
  methods: {
    addProductToOrder(listSelectedProduct) {
      const me = this;
      this.isShowProductPopup = false;

      listSelectedProduct.forEach((element) => {
        if (
          me.listProductDetail.findIndex(
            (x) => x.productcode == element.productcode
          ) == -1
        ) {
          me.listProductDetail.push({
            idproductdetail: element.idproductdetail,
            size: element.size,
            color: element.color,
            sellprice: element.sellprice,
            quantity: 1,
            productcode: element.productcode,
            productname: element.productname,
          });
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
    changeWard(ward) {
      this.currentData["wardid"] = ward.id;
      this.currentData["wardname"] = ward.text;
      // if (ward && this.selectedProvince && this.selectedDistrict) {
      //   const me = this;
      //   let param = {
      //     from_district_id: this.defaultBranch.districtid,
      //     service_type_id: 2,
      //     to_district_id: this.selectedDistrict["id"],
      //     to_ward_code: this.selectedWard["id"],
      //     height: 5,
      //     length: 30,
      //     weight: 20,
      //     width: 20,
      //     insurance_value: this.totalPrice,
      //     coupon: null,
      //   };
      //   // gọi lấy thông tin vận chuyển
      //   DeliverService.getDeliverPrice(param)
      //     .then((result) => {
      //       if (result) {
      //         me.deliverPrice = result.data.data.service_fee;
      //       }
      //     })
      //     .catch((e) => {
      //       console.log(e);
      //     });
      // } else {
      //   this.deliverPrice = null;
      // }
    },
    changeProvince(province) {
      const me = this;
      me.currentData["provinceid"] = province.id;
      me.currentData["provincename"] = province.text;
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
      me.currentData["districtid"] = district.id;
      me.currentData["districtname"] = district.text;
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
            console.log(me.listWard);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    closeProductPopup() {
      this.isShowProductPopup = false;
    },
    openPopupProduct() {
      this.isShowProductPopup = true;
    },
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
     * Tạo đơn giao hàng
     */
    createOrderDeliver() {
      const me = this;

      let orderParam = {
        payment_type_id: 2,
        note: `Đơn hàng mã ${me.currentData?.ordercode}`,
        from_name: "360 for men",
        from_phone: "0337877093",
        from_address: me.defaultBranch.address,
        from_ward_name: me.defaultBranch.wardname,
        from_district_name: me.defaultBranch.districtname,
        from_province_name: me.defaultBranch.provincename,
        required_note: "KHONGCHOXEMHANG",
        return_name: "360 for men",
        return_phone: "0337877093",
        return_address: me.defaultBranch.address,
        return_ward_name: me.defaultBranch.wardname,
        return_district_name: me.defaultBranch.districtname,
        return_province_name: me.defaultBranch.provincename,
        client_order_code: "",
        to_name: me.currentData?.customername,
        to_phone: me.currentData?.customerphone,
        to_address: me.currentData?.customeraddress,
        to_ward_name: me.currentData?.wardname,
        to_district_name: me.currentData?.districtname,
        to_province_name: me.currentData?.provincename,
        cod_amount: 0,
        content: "Theo New York Times",
        weight: 200,
        length: 1,
        width: 19,
        height: 10,
        cod_failed_amount: 2000,
        pick_station_id: 1444,
        deliver_station_id: null,
        insurance_value: 0,
        service_id: 0,
        service_type_id: 2,
        coupon: null,
        pick_shift: null,
        pickup_time: 1665272576,
      };
      orderParam["items"] = me.listProductDetail.map((x) => ({
        name: x.productname,
        code: x.productcode,
        quantity: x.quantity,
        price: x.sellprice,
        length: 12,
        width: 12,
        height: 12,
        category: {
          level1: "Áo",
        },
      }));
      if (me.currentData.checkoutstatusid == 2) {
        orderParam.cod_amount = me.totalPrice;
      }

      DeliverService.createShippingOrder(orderParam).then((result) => {
        if (result) {
          me.$toast.success("Tạo đơn giao hàng thành công");
          me.deliverConfigDialog = false;
          me.currentData["statusid"] = OrderStatus.WaitingDeliver;
          let orderParam = {
            order: JSON.stringify(me.currentData),
            orderdetail: JSON.stringify(me.listProductDetail),
          };
          OrderService.updateOrderDetail(orderParam).then((result) => {
            if (result && result.data) {
              if (result.data.success) {
                me.getDetailInfo();
              } else {
                me.$toast.error(result.data.errorMessage);
              }
            }
          });
        } else {
          me.$toast.error("Tạo đơn giao hàng lỗi");
          me.deliverConfigDialog = false;
        }
      });
    },
    /**
     * tiếp nhận đơn hàng
     */
    receiveOrder() {
      if (
        !this.listPermissionInModule.includes("Receive") &&
        !this.listPermissionInModule.includes("All")
      ) {
        this.$toast.error("Bạn không có quyền thực hiện tính năng này.");
        return;
      }
      this.currentData["statusid"] = OrderStatus.Received;
      this.currentData["statusname"] = "Đã tiếp nhận";
      this.currentData["receiveemployeename"] = this.currentUser.username;
      this.currentData["receiveemployeeid"] = parseInt(this.currentUser.iduser);
      this.currentData["branchid"] = this.$route.params.branchid
        ? this.$route.params.branchid
        : this.currentUser.branchid;
      this.currentData["branchname"] = this.$route.params.branchname
        ? this.$route.params.branchname
        : this.currentUser.branchname;
      this.updateData(true);
    },
    /**
     * Lấy danh sách toàn bộ chi nháh
     */
    getAllBranch() {
      const me = this;
      BranchService.getAllData()
        .then((result) => {
          if (
            result &&
            result.data &&
            result.data.data &&
            result.data.data.length > 0
          ) {
            let index = result.data.data.findIndex(
              (x) => x.isaddressdefault == true
            );
            if (index > -1) {
              me.defaultBranch = result.data.data[index];
            } else {
              me.defaultBranch = result.data.data[0];
            }
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
      OrderService.getOrderDetail(id)
        .then((result) => {
          if (result && result.data) {
            me.currentData = result.data.data.saleOrder;
            // me.selectedProductCategory = {
            //   value: me.currentData["categoryid"],
            //   text: me.currentData["categoryname"],
            // };
            this.currentData.orderdate = moment(
              me.currentData["orderdate"]
            ).format("yyyy-MM-DD");
            me.title = `${me.currentData.ordercode} - ${me.currentData.customername}`;
            me.listProductDetail = [...result.data.data.orderDetail];
            me.selectedOrderType = {
              id: me.currentData["ordertypeid"],
              text: me.currentData["ordertypename"],
            };
            me.selectedOrderStatus = {
              id: me.currentData["statusid"],
              text: me.currentData["statusname"],
            };
            me.checkoutStatus = {
              id: me.currentData["checkoutstatusid"],
              text: me.currentData["checkoutstatusname"],
            };
            me.selectedCheckoutType = {
              id: me.currentData["checkouttypeid"],
              text: me.currentData["checkouttypename"],
            };
            me.selectedProvince = {
              id: me.currentData["provinceid"],
              text: me.currentData["provincename"],
            };
            me.selectedDistrict = {
              id: me.currentData["districtid"],
              text: me.currentData["districtname"],
            };
            me.selectedWard = {
              id: me.currentData["wardid"],
              text: me.currentData["wardname"],
            };
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    backToList() {
      this.$router.push({
        name: "m-order",
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
      let listFieldToInt = ["costprice", "sellprice", "inventory", "quantity"];
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
      if (this.currentData["ordertypeid"] == 1) {
        this.currentData["statusid"] = OrderStatus.Success;
        // this.currentData["statusname"] = "Thành công";
      }
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
      let orderParam = {
        order: JSON.stringify(this.currentData),
        orderdetail: JSON.stringify(this.listProductDetail),
      };
      const me = this;
      OrderService.insertOrderDetail(orderParam).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            me.$toast.success("Thêm mới đơn hàng thành công!");
            me.formMode = FormMode.View;
            this.$router.push({
              name: "m-order-detail",
              params: { id: result.data.data["idsaleorder"], formMode: 3 },
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
    updateData(isUpdateCustom = false) {
      let orderParam = {
        order: JSON.stringify(this.currentData),
        orderdetail: JSON.stringify(this.listProductDetail),
      };
      const me = this;
      OrderService.updateOrderDetail(orderParam).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            if (isUpdateCustom) {
              me.$toast.success("Tiếp nhận đơn hàng thành công!");
              me.getDetailInfo();
            } else {
              me.$toast.success("Cập nhật đơn hàng thành công!");
              me.formMode = FormMode.View;
              this.$router.push({
                name: "m-order-detail",
                params: { id: result.data.data["idsaleorder"], formMode: 3 },
              });
            }
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
    selectedCheckoutType: {
      handler: function (val) {
        if (val) {
          this.currentData["checkouttypeid"] = val["id"];
          this.currentData["checkouttypename"] = val["text"];
        }
      },
      deep: true,
    },
    checkoutStatus: {
      handler: function (val) {
        if (val) {
          this.currentData["checkoutstatusid"] = val["id"];
          this.currentData["checkoutstatusname"] = val["text"];
        }
      },
      deep: true,
    },
    selectedOrderStatus: {
      handler: function (val) {
        if (val) {
          this.currentData["statusid"] = val["id"];
          this.currentData["statusname"] = val["text"];
        }
      },
      deep: true,
    },
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
    selectedOrderType: {
      handler: function (val) {
        if (val) {
          this.currentData["ordertypeid"] = val["id"];
          this.currentData["ordertypename"] = val["text"];
        }
      },
      deep: true,
    },

    totalInventory(val) {
      this.currentData["inventory"] = val;
    },
    totalPrice(val) {
      this.currentData["totalprice"] = val;
    },
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.listProductDetail.forEach((x) => {
        if (x && x["sellprice"] && x["sellprice"] != "") {
          total += parseInt(x["sellprice"]) * parseInt(x["quantity"]);
        }
      });
      if (
        this.currentData &&
        this.currentData["deliverprice"] &&
        this.currentData["deliverprice"] != "" &&
        this.selectedOrderType.id == 2
      ) {
        total += parseInt(this.currentData["deliverprice"]);
      }
      return total;
    },
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