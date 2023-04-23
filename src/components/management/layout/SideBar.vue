<template>
  <div class="bk-management-sidebar">
    <v-navigation-drawer
      v-model="drawer"
      permanent
      color="#F4F5F9"
      app
    >
      <v-list-item class="px-2 pt-5">
        <v-list-item-title
          class="text-capitalize"
          align="center"
        >
          <v-avatar
            class="d-block text-center mx-auto mt-4 mb-10"
            size="120"
          >
            <v-img src="../../../assets/images/emailspam.png"></v-img>
          </v-avatar>
          <!-- <h6>{{ userInfo.username}} ( {{ userInfo.usercode}} )</h6> -->
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="selectedItem"
          color="deep-purple"
        >
          <v-list-item
            v-for="(item, i) in listModule"
            :key="i"
            @click="handleMenuClick(item.routename)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.modulename"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- <v-list-group
            :value="false"
            prepend-icon="mdi-package-variant-closed"
            color="deep-purple"
            v-for="(item) in listModuleParent"
            :key="item.idmodule"
          >
            <template v-slot:activator>
              <v-list-item-title>{{item.modulename}}</v-list-item-title>
            </template>

            <v-list-item
              v-for="(item) in item.listchild"
              :key="item.idmodule"
              link
              @click="handleMenuClick(item.routename)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="item.modulename"></v-list-item-title>
            </v-list-item>
          </v-list-group> -->

          <!-- <v-list-group
            :value="false"
            prepend-icon="fas fa-cog"
            color="deep-purple"
          >
            <template v-slot:activator>
              <v-list-item-title>Thiết lập</v-list-item-title>
            </template>
            <v-list-item
              v-for="([title, icon,name], i) in settings"
              :key="i"
              link
              @click="handleMenuClick(name)"
            >
              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="title"></v-list-item-title>
            </v-list-item>
          </v-list-group> -->
        </v-list-item-group>
      </v-list>
      <!-- <v-list-item class="px-2 pt-5 sidebar-branch">
        <v-list-item-content>
          <v-combobox
            :items="listBranch"
            variant="solo"
          ></v-combobox>
        </v-list-item-content>
      </v-list-item> -->

    </v-navigation-drawer>
  </div>
</template>
<script>
//import { FactoryService } from "../../../service/factory/factory.service";
//const AuthService = FactoryService.get("authService");

export default {
  data: () => ({
    selectedItem: 0,
    drawer: null,
    listModule: [
      {
        icon: "mdi-account-check-outline",
        modulename: "Người gửi",
        routename: "m-sender",
      },
      {
        icon: "mdi-account-group",
        modulename: "Người nhận",
        routename: "m-receiver",
      },
      {
        icon: "mdi-alarm-panel",
        modulename: "Sự kiện",
        routename: "m-campaign",
      },
      {
        icon: "mdi-home-circle-outline",
        modulename: "Thiết lập",
        routename: "m-promotion",
      },
    ],
    listModuleParent: [],

    listProducts: [
      ["Danh mục", "", "m-product"],
      ["Nhóm hàng hóa", "", "m-productcategory"],
      // ["Thiết lập giá", "", "m-role"],
    ],
    settings: [
      ["Chi nhánh", "", "m-branch"],
      ["Nhân viên", "", "m-employee"],
      ["Vai trò", "", "m-role"],
    ],
    listBranch: [],
    listPermission: [],
    userInfo: null,
  }),
  created() {
    // const me = this;
    // this.getModulePermission();
    // let user = JSON.parse(localStorage.getItem("user"));
    // this.userInfo = user.userInfo;
    // AuthService.getPermission(user.userInfo).then((result) => {
    //   if (result && result.data) {
    //     me.listPermission = [...result.data.data];
    //     let listPermissionClone = [...me.listPermission];
    //     // let itemRemove = ["Promotion", "Customer"];
    //     // itemRemove.forEach((item) => {
    //     //   const index = listPermissionClone.findIndex(
    //     //     (x) => x.modulecode == item
    //     //   );
    //     //   if (index > -1) {
    //     //     listPermissionClone.splice(index, 1);
    //     //   }
    //     // });
    //     listPermissionClone.forEach((element) => {
    //       if (
    //         (element.permission.includes("All") ||
    //           element.permission.includes("View")) &&
    //         element.parentid == 0
    //       ) {
    //         if (element.isparent) {
    //           element["listchild"] = listPermissionClone.filter(
    //             (x) =>
    //               x.parentid == element.idmodule &&
    //               (x.permission.includes("All") ||
    //                 x.permission.includes("View"))
    //           );
    //           me.listModuleParent.push(element);
    //         } else {
    //           me.listModule.push(element);
    //         }
    //       }
    //     });
    //   }
    // });
  },
  methods: {
    getModulePermission() {
      // Lấy danh sách các module và quyền đối với user hiện tại
    },
    handleMenuClick(name) {
      this.$router
        .push({
          name: name,
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped>
div >>> .v-list a {
  text-decoration: none;
}

.v-navigation-drawer__content {
  position: relative;
}

.sidebar-branch {
  position: absolute;
  bottom: 0;
  left: 10px;
}
</style>