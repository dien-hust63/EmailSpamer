<template>
  <div class="base-popup">
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        :max-width="maxwidth"
        :fullscreen="isFullScreen"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ title }}</span>
          </v-card-title>
          <slot></slot>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closePopup">Hủy</v-btn>
            <v-btn
              depressed
              color="primary"
              @click="saveData"
            >
              Lưu
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
  
  <script>
export default {
  name: "BasePopup",
  data() {
    return {
      dialog: false,
    };
  },
  props: {
    isShowPopup: Boolean,
    maxwidth: String,
    title: String,
    isFullScreen: Boolean,
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    saveData() {
      this.$emit("saveData");
    },
  },
  watch: {
    isShowPopup(val) {
      this.dialog = val;
    },
  },
};
</script>
  
  <style scoped>
@import url("../../css/common/basepopup.css");
</style>