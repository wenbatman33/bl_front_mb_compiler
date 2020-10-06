import Vue from 'vue';

// 第三方套件
import ElementUI from 'element-ui';
import BootstrapVue from 'bootstrap-vue';
import PortalVue from 'portal-vue';
import axios from '@/axiosSetting';
import VueAxios from 'vue-axios';
import './validate';
import VCalendar from 'v-calendar';
import VueCarousel from 'vue-carousel';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
import VueClipboard from 'vue-clipboard2';

import App from './App.vue';
import router from './router';
import store from '@/store/store';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(BootstrapVue);
Vue.use(PortalVue);
Vue.use(VueAxios, axios);
Vue.use(VCalendar);
Vue.use(VueCarousel);
Vue.use(VueAwesomeSwiper /* { default global options } */);
Vue.use(VueClipboard);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
