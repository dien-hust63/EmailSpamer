<template>
  <div>
    <v-app>
      <SideBar v-if="!showSideBar" />
      <v-main>
        <router-view :key="$route.fullPath"></router-view>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import SideBar from "./components/management/layout/SideBar.vue";
export default {
  name: "ManagementApp",

  components: {
    SideBar,
  },

  data: () => ({
    showSideBar: window.location.pathname.toLocaleLowerCase().includes("login"),
  }),
  updated() {
    this.showSideBar = window.location.pathname
      .toLocaleLowerCase()
      .includes("login");
  },
};
</script>
