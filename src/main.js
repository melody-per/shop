import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "../src/assets/css/global.css";
import TreeTable from "vue-table-with-tree-grid";
Vue.component("tree-table", TreeTable);

//富文本编辑器
import VueQuillEditor from "vue-quill-editor";

import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */);

//导入字体图标
import "../src/assets/fonts/iconfont.css";
//导入axios
import axios from "axios";

import NProgress from "nprogress";
import "../node_modules/nprogress/nprogress.css";
//配置基地址
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
//在请求头中挂载token令牌
axios.interceptors.request.use(function(config) {
  NProgress.start();
  config.headers.Authorization = sessionStorage.getItem("token");
  return config;
});

axios.interceptors.response.use(function(config) {
  NProgress.done();
  return config;
});

Vue.use(ElementUI);

Vue.config.productionTip = false;
//将axios当做一个属性挂载给vue的函数的原型上
Vue.prototype.$http = axios;

Vue.filter("dataFormate", function(param) {
  const date = new Date(param);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date
    .getDate()
    .toString()
    .padStart(2, "0");
  const h = date
    .getHours()
    .toString()
    .padStart(2, "0");
  const mm = date
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const s = date
    .getSeconds()
    .toString()
    .padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${mm}:${s}`;
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
