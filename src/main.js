import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/css/global.css'
//导入字体图标
import '../src/assets/fonts/iconfont.css';
//导入axios
import axios from "axios";
//配置基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //在请求头中挂载token令牌
axios.interceptors.request.use(function(config) {
    config.headers.Authorization = sessionStorage.getItem('token');
    return config;
}, function(error) {
    // Do something with request error
    return Promise.reject(error);
});

Vue.use(ElementUI);

Vue.config.productionTip = false
    //将axios当做一个属性挂载给vue的函数的原型上
Vue.prototype.$http = axios

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')