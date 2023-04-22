import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VeeValidate from 'vee-validate';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VueToast from 'vue-toast-notification';

const EventBus = new Vue();
Vue.prototype.$eventBus = EventBus;

import 'vue-toast-notification/dist/theme-sugar.css';
Vue.config.productionTip = false

Vue.use(VueToast,{
  // One of the options
  position: 'top'
});
Vue.use(VeeValidate);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
