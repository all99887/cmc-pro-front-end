import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "~/store";

import util from '../common/util'

Vue.use(VueRouter)

import Login from '../frame/Login'
import Main from '../frame/Main'
import NotFoundPage from '../components/NotFoundPage'
import FuncAdmin from '../components/FuncAdmin'

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
                    path: '/func',
                    name: 'funcAdmin',
                    component: FuncAdmin
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