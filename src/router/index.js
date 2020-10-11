import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../Login.vue'
const Login = () =>
    import ( /* webpackChunkName: "Login_Home" */ '../Login.vue')
    // import Home from '../components/Home.vue'
const Home = () =>
    import ( /* webpackChunkName: "Login_Home" */ '../components/Home.vue')
    // import User from '../components/user/User.vue'
const User = () =>
    import ( /* webpackChunkName: "User_Rights_Roles" */ '../components/user/User.vue')
    // import Rights from '../components/rights/Rights.vue'
const Rights = () =>
    import ( /* webpackChunkName: "User_Rights_Roles" */ '../components/rights/Rights.vue')
    // import Roles from '../components/rights/Roles.vue'
const Roles = () =>
    import ( /* webpackChunkName: "User_Rights_Roles" */ '../components/rights/Roles.vue')
    // import Cate from '../components/goods/Goods_cate.vue'
const Cate = () =>
    import ( /* webpackChunkName: "Cate_Params_List_Add" */ '../components/goods/Goods_cate.vue')
    // import Params from '../components/goods/Params.vue'
const Params = () =>
    import ( /* webpackChunkName: "Cate_Params_List_Add" */ '../components/goods/Params.vue')
    // import List from '../components/goods/List.vue'
const List = () =>
    import ( /* webpackChunkName: "Cate_Params_List_Add" */ '../components/goods/List.vue')
    // import Add from '../components/goods/Add.vue'
const Add = () =>
    import ( /* webpackChunkName: "Cate_Params_List_Add" */ '../components/goods/Add.vue')
    // import Order from '../components/order/Order.vue'
const Order = () =>
    import ( /* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
    // import Report from '../components/report/Report.vue'
const Report = () =>
    import ( /* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')
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
            { path: '/params', component: Params },
            { path: '/goods', component: List },
            { path: '/goods/add', component: Add },
            { path: '/orders', component: Order },
            { path: '/reports', component: Report },
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