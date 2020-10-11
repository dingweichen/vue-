import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入第三方树形table插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入第三方编辑器插件及其所用样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入第三方进度条加载及其所用样式
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入axios
import axios from 'axios'


Vue.prototype.$http = axios

Vue.config.productionTip = false

// 全局注册第三方树形table插件
Vue.component('tree-table', TreeTable);
// 全局注册第三方编辑器插件
Vue.use(VueQuillEditor);

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// axios拦截器：在前端发起的请求到达服务器前，进行预处理
axios.interceptors.request.use(config => {
    console.log(config);
    // 加载进度条
    NProgress.start();
    // 给请求头添加Authorization字段，其值为token
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
});
axios.interceptors.response.use(config => {
    console.log(config);
    // 关闭进度条
    NProgress.done();
    return config;
});
// 注册一个名为dateFormat的全局过滤器，用于将日期数据格式化
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal);

    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    const d = (dt.getDate() + '').padStart(2, '0');
    const hh = (dt.getHours() + '').padStart(2, '0');
    const mm = (dt.getMinutes() + '').padStart(2, '0');
    const ss = (dt.getSeconds() + '').padStart(2, '0');

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')