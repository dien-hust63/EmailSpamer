<template>
  <div class="bkc-checkout">
    <div class="bkc-checkout-user-info">
      <div class="checkout-avatar">
        <v-avatar
          class="d-block text-center mx-auto mt-4 mb-10"
          size="120"
        >
          <v-img src="https://nvdien1.blob.core.windows.net/image/360formen.png"></v-img>
        </v-avatar>
      </div>
      <div class="checkout-user-deliver">
        <div class="checkout-user-content">
          <div class="title">
            Thông tin giao hàng
          </div>
          <v-form
            ref="form"
            v-model="validForm"
            lazy-validation
            class="user-form"
          >
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Họ và tên (*)"
                    required
                    :rules="[rules.fullNameRule]"
                    outlined
                    dense
                    v-model="customerInfo.customername"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Số điện thoại (*)"
                    :rules="[rules.phonenumberRule]"
                    required
                    outlined
                    dense
                    v-model="customerInfo.customerphone"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Email (*)"
                    :rules="rules.emailMatch"
                    required
                    outlined
                    dense
                    v-model="customerInfo.customeremail"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Ghi chú"
                    persistent-hint
                    required
                    outlined
                    dense
                    v-model="customerInfo.customerdescription"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-combobox
                    label="Tỉnh thành (*)"
                    v-model="selectedProvince"
                    item-text="text"
                    item-value="id"
                    :items="listProvince"
                    return-object
                    outlined
                    dense
                    @change="changeProvince($event)"
                    :rules="[rules.provinceRule]"
                  ></v-combobox>
                </v-col>
                <v-col cols="12">
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
                <v-col cols="12">
                  <v-combobox
                    label="Phường xã (*)"
                    v-model="selectedWard"
                    item-text="text"
                    item-value="id"
                    :items="listWard"
                    return-object
                    dense
                    :disabled="isDisableWard"
                    @change="changeWard($event)"
                    :rules="[rules.wardRule]"
                  ></v-combobox>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Địa chỉ (*)"
                    required
                    outlined
                    dense
                    :rules="[rules.addressRule]"
                    v-model="customerInfo.customeraddress"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </div>
        <div class="checkout-deliver-payment">
          <div class="deliver-cost">
            <div class="title">Vận chuyển</div>
            <div class="deliver-cost-content">
              <div
                v-if="deliverPrice"
                class="deliver-cost-content-hasvalue"
              >
                <div class="deliver-cost-text">Phí vận chuyển</div>
                <div class="deliver-cost-price">{{deliverPrice}}đ</div>
              </div>
              <div v-if="!deliverPrice">
                <div class="deliver-cost-text-required">Vui lòng nhập thông tin giao hàng</div>
              </div>
            </div>
          </div>
          <div class="payment-method">
            <div class="title mt-4">Thanh toán</div>
            <div class="payment-radio-group">

              <v-radio-group v-model="radios">
                <v-radio
                  label="Thanh toán qua VNPAY"
                  :value="1"
                ></v-radio>
                <v-radio
                  label="Thanh toán khi nhận hàng"
                  :value="2"
                ></v-radio>
              </v-radio-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bkc-checkout-order-info">
      <div class="title">Đơn hàng ({{$store.state.cart.totalCartItem}} sản phẩm)</div>
      <div class="bkc-checkout-order-product-list">

        <div
          class="cart-mini-body-item"
          v-for="(item, index) in $store.state.cart.cartList"
          :key="index"
        >
          <div class="cart-mini-item-image">
            <v-img :src="item.image"></v-img>
            <div class="quantity-total">
              {{item.quantity}}
            </div>
          </div>
          <div class="cart-mini-item-content pl-3">
            <div class="cart-mini-item-content-left">

              <div class="mini-item-name">
                <div class="mini-item-product-name"> {{item.productname}}</div>
              </div>

              <div class="mini-item-color-size">Màu sắc: {{item.color}}, Size: {{item.size}}</div>

            </div>
            <div class="mini-item-price ml-4">{{item.quantity * item.sellprice}}đ</div>
          </div>
        </div>
      </div>
      <div class="checkout-price-total mt-4">
        <div class="checkout-deliver-price">
          <div class="text">Phí vận chuyển</div>
          <div
            class="price"
            v-if="deliverPrice"
          >{{deliverPrice}}đ</div>
          <div
            class="price"
            v-if="!deliverPrice"
          >-</div>
        </div>
        <div class="checkout-order-total mt-2">
          <div class="text">Tổng cộng</div>
          <div class="price-total">{{totalPrice}}đ</div>
        </div>
      </div>
      <div class="checkout-order-info-footer mt-4">
        <div
          class="back-to-cart"
          @click="returnCartPage"
        >
          <i class="fas fa-chevron-left"></i>
          Quay về giỏ hàng
        </div>
        <div class="btn-order-checkout">
          <v-btn
            tile
            color="#fbac14"
            width="100%"
            height="100%"
            class="white--text"
            @click="orderProduct"
          >
            Đặt hàng
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FactoryService } from "../../../service/factory/factory.service";
const LocationService = FactoryService.get("locationService");
const DeliverService = FactoryService.get("deliverService");
const BranchService = FactoryService.get("branchService");
const PaymentService = FactoryService.get("paymentService");
const OrderService = FactoryService.get("orderService");
import moment from "moment";
export default {
  name: "CCheckout",
  created() {
    this.getAllProvince();
    this.getAllBranch();
    this.listOrderDetail = this.$store.state.cart.cartList;
    let customerCheckoutInfo = sessionStorage.getItem("customerCheckoutInfo");
    if (customerCheckoutInfo) {
      this.customerInfo = JSON.parse(customerCheckoutInfo);
      this.deliverPrice = this.customerInfo["deliverprice"];
      this.selectedProvince = {
        id: this.customerInfo["provinceid"],
        text: this.customerInfo["provincename"],
      };
      this.selectedDistrict = {
        id: this.customerInfo["districtid"],
        text: this.customerInfo["districtname"],
      };
      this.selectedWard = {
        id: this.customerInfo["wardid"],
        text: this.customerInfo["wardname"],
      };
      this.radios = this.customerInfo["checkouttypeid"];
    }
  },
  data() {
    return {
      rules: {
        fullNameRule: (value) => !!value || "Vui lòng nhập họ tên",
        phonenumberRule: (value) => !!value || "Vui lòng nhập số điện thoại",
        emailMatch: [
          (v) => !!v || "E-mail bắt buộc nhập.",
          (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ.",
        ],
        provinceRule: (value) => !!value || "Vui lòng chọn tỉnh thành",
        districtRule: (value) => !!value || "Vui lòng chọn quận huyện",
        wardRule: (value) => !!value || "Vui lòng chọn phường xã",
        addressRule: (value) => !!value || "Vui lòng nhập địa chỉ",
      },
      radios: null,
      selectedProvince: null,
      listProvince: [],
      isDisableDistrict: true,
      listDistrict: [],
      selectedDistrict: null,
      listWard: [],
      selectedWard: null,
      isDisableWard: true,
      customerInfo: {},
      validForm: true,
      deliverPrice: null,
      defaultBranch: null,
      listOrderDetail: [],
    };
  },
  methods: {
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
      if (!this.radios) {
        this.$toast.warning("Vui lòng chọn hình thức thanh toán");
        return false;
      }
      return true;
    },
    /**
     * check validate và đặt hàng
     */
    orderProduct() {
      let isValid = this.validateBeforeSave(this.customerInfo);
      if (!isValid) {
        return;
      }
      this.handleOrder();
    },
    /**
     * Tiến hành dặt hàng
     */
    handleOrder() {
      const me = this;
      this.prepareBeforeHandle();
      // Lưu vào db đơn hàng ở trạng thái chờ tiếp nhận, với trạng thái thanh toán: Chưa thanh toán
      sessionStorage.setItem(
        "customerCheckoutInfo",
        JSON.stringify(this.customerInfo)
      );
      let orderParam = {
        order: JSON.stringify(this.customerInfo),
        orderdetail: JSON.stringify(this.listOrderDetail),
      };
      OrderService.insertOrderDetail(orderParam).then((result) => {
        if (result && result.data) {
          if (result.data.success) {
            if (me.radios == 1) {
              // thanh toán qua vnpay
              let param = {
                Amount: me.totalPrice,
              };

              PaymentService.getVNPayLink(param)
                .then((result) => {
                  if (result && result.data) {
                    let vnpayUrl = result.data.data;
                    window.location.href = vnpayUrl;
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            } else {
              me.$toast.success("Đặt mua hàng thành công!");
              this.$router.push({
                name: "c-checkout-result",
              });
            }
          } else {
            me.$toast.error(result.data.errorMessage);
          }
        }
      });
    },

    /**\
     * Chuẩn bị dữ liệu trước khi đặt hàng
     */
    prepareBeforeHandle() {
      this.customerInfo["checkoutstatusid"] = 2; // chưa thanh toán
      this.customerInfo["ordertypeid"] = 2; // Mua online
      this.customerInfo["statusid"] = 2; // chờ tiếp nhận
      this.customerInfo["orderdate"] = moment().format("yyyy-MM-DD");
      this.customerInfo["totalprice"] = this.totalPrice;
      this.customerInfo["branchid"] = this.defaultBranch.idbranch;
      this.customerInfo["branchname"] = this.defaultBranch.branchname;
      // Xử lý danh sách các hàng hóa mua
      this.listOrderDetail = this.listOrderDetail.map((x) => ({
        idproductdetail: x.idproductdetail,
        quantity: x.quantity,
        size: x.size,
        color: x.color,
        sellprice: x.sellprice,
        productcode: x.productcode,
        productname: x.productnamedetail,
      }));
    },
    /**
     * Lấy danh sách các tỉnh
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
      if (ward && this.selectedProvince && this.selectedDistrict) {
        const me = this;
        me.customerInfo["wardid"] = ward.id;
        me.customerInfo["wardname"] = ward.text;
        let param = {
          from_district_id: this.defaultBranch.districtid,
          service_type_id: 2,
          to_district_id: this.selectedDistrict["id"],
          to_ward_code: this.selectedWard["id"],
          height: 5,
          length: 30,
          weight: 20,
          width: 20,
          insurance_value: this.totalPrice,
          coupon: null,
        };
        // gọi lấy thông tin vận chuyển
        DeliverService.getDeliverPrice(param)
          .then((result) => {
            if (result) {
              me.deliverPrice = result.data.data.service_fee;
              me.customerInfo["deliverprice"] = me.deliverPrice;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        this.deliverPrice = null;
      }
    },
    changeProvince(province) {
      const me = this;
      me.customerInfo["provinceid"] = province.id;
      me.customerInfo["provincename"] = province.text;
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
      me.customerInfo["districtid"] = district.id;
      me.customerInfo["districtname"] = district.text;
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
    returnCartPage() {
      this.$router.push({
        name: "c-cart",
      });
    },
  },
  computed: {
    totalPrice() {
      let tempTotal = this.$store.state.cart.cartList.reduce(
        (sum, item) => sum + item.sellprice * item.quantity,
        0
      );
      if (this.deliverPrice) {
        return parseInt(this.deliverPrice) + tempTotal;
      } else {
        return tempTotal;
      }
    },
  },
  watch: {
    radios(val) {
      this.customerInfo["checkouttypeid"] = val;
    },
  },
};
</script>

<style scoped>
@import url("../../../css/customer/c-checkout.css");
</style>