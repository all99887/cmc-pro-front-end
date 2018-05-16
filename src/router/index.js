import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "~/store";

import util from '../common/util'

Vue.use(VueRouter)

import Login from '../frame/Login'
import Main from '../frame/Main'
import NotFoundPage from '../components/NotFoundPage'
import Hello from '../components/Hello'
import FuncAdmin from '../components/admin/FuncAdmin'
import RoleAdmin from '../components/admin/RoleAdmin'
import UserAdmin from '../components/admin/UserAdmin'
import DictAdmin from '../components/admin/DictAdmin'

let router = new VueRouter({
    mode: 'history',
    base: util.getWebRootPath(),
    linkActiveClass: 'active',
    routes: [
        {
            path: '/login_html',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            name: 'main',
            component: Main,
            meta: {
                requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
            },
            children: [
                {
                    path: '/index_html',
                    name: 'index',
                    component: Hello
                },
                {
                    path: '/func_html',
                    name: 'funcAdmin',
                    component: FuncAdmin
                },
                {
                    path: '/role_html',
                    name: 'roleAdmin',
                    component: RoleAdmin
                },
                {
                    path: '/cmcuser_html',
                    name: 'userAdmin',
                    component: UserAdmin
                },
                {
                    path: '/dict_html',
                    name: 'dictAdmin',
                    component: DictAdmin
                }
            ]
        },
        {
            path: '*',
            name: 'notFound',
            component: NotFoundPage
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
        let token = sessionStorage.getItem("CMCPROTOKEN")
        if (token === null || token === '') {
            next({
                name: 'login'
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router