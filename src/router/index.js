import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../Login.vue'
import Home from '../components/Home.vue'
import User from '../components/user/User.vue'
import Rights from '../components/rights/Rights.vue'
import Roles from '../components/rights/Roles.vue'
import Cate from '../components/goods/Goods_cate'

Vue.use(VueRouter)

const routes = [
    // 重定向
    { path: '/', redirect: '/login' },
    // 普通路由规则
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        // 添加路由子规则
        children: [
            { path: '/users', component: User },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/categories', component: Cate },
        ],
    }
]

const router = new VueRouter({
    routes
});
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();

});
export default router