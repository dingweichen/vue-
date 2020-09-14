import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'


// 导入axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// axios拦截器：在前端发起的请求到达服务器前，进行预处理
axios.interceptors.request.use(config => {
    console.log(config);
    // 给请求头添加Authorization字段，其值为token
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
});
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')