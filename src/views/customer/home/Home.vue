<template>
  <div class="bkc-home">
    <CTopNavigationMobile v-if="isMobileView" />
    <CTopNavigation v-if="!isMobileView" />
    <CContentHome />
    <CFooter />
  </div>
</template>
<script>
import CFooter from "../common/CFooter.vue";
import CTopNavigationMobile from "../common/CTopNavigationMobile.vue";
import CTopNavigation from "../common/CTopNavigation.vue";
import CContentHome from "./CContentHome.vue";
export default {
  name: "HomePage",
  components: {
    CFooter,
    CTopNavigation,
    CTopNavigationMobile,
    CContentHome,
  },
  data() {
    return {
      isMobileView: false,
    };
  },
};
</script>
<style  scoped>
@import url("../../../css/customer/c-home.css");
</style>