<template>
  <div class="login-form">
    <div class="login-card">
      <img
        id="profile-img"
        src="https://nvdien1.blob.core.windows.net/image/360formen.png"
        class="profile-img-card"
      />
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        class="login-form-inside"
      >

        <v-text-field
          v-model="user.email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required]"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Mật khẩu"
          @click:append="show1 = !show1"
          class="mt-2"
        ></v-text-field>
        <a
          href="#"
          class="text-decoration-none mt-2"
        >Quên mật khẩu ?</a>
        <v-btn
          :disabled="!valid"
          color="success"
          @click="loginPage"
          width="100%"
          class="mt-3"
        >
          Đăng nhập
        </v-btn>
      </v-form>
    </div>
  </div>
</template>
<script>
import AuthService from "../../../service/auth.service";
export default {
  data: () => ({
    valid: true,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail bắt buộc nhập.",
      (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ.",
    ],
    show1: false,
    rules: {
      required: (value) => !!value || "Mật khẩu bắt buộc nhập.",
      emailMatch: () => `Email hoặc mật khẩu không chính xác.`,
    },
    user: {
      email: "",
      password: "",
    },
  }),

  methods: {
    async loginPage() {
      this.$refs.form.validate();
      let response = await AuthService.login(this.user);
      if (response) {
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
          this.$router.push({ name: "m-sender" });
        } else {
          this.$toast.open({
            message: response.errorMessage,
            type: "error",
            duration: 5000,
            dismissible: true,
          });
        }
      } else {
        this.$toast.open({
          message: "Có lỗi xảy ra.",
          type: "error",
          duration: 5000,
          dismissible: true,
        });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
<style scoped>
.login-form {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("https://nvdien1.blob.core.windows.net/image/loginbg.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.login-card {
  background-color: aliceblue;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 8px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
.login-form-inside {
  padding: 10px 50px 50px 50px;
}

.profile-img-card {
  width: 120px;
  height: 120px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>