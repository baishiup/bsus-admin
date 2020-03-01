import Vue from 'vue';
import App from './App';
import { router } from './router';

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import './assets/style/reset.less';
import Axios from './helpers/Axios';

Vue.config.productionTip = false;
Vue.prototype.$http = Axios;

Vue.use(ViewUI);
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  created() {
    Axios.errorHandler_UNAUTHORIZED = message => {
      window.localStorage.removeItem('token');
      this.$router.push('/');
    };
  }
});
