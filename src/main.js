import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/dayjs'
// 全局导入vant核心组件库
import Vant from 'vant';
// 导入vant全局样式
import 'vant/lib/index.css';

// 导入全局样式(在第三方样式文件之后导入)
import './styles/index.less'

// 导入amfe-fiexible包，动态设置rem基准值
import 'amfe-flexible'

Vue.use(Vant);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
