import store from "~/store";
import axios from 'axios'
import { Loading, Message } from 'element-ui'
import router from "~/router";

import i18n from '~/i18n/i18n';

const debug = process.env.NODE_ENV !== 'production'; // 开发环境中为true，否则为false
let loadinginstace
// http request 请求拦截器，有token值则配置上token值
axios.interceptors.request.use(
    config => {
        if(config.loading === true){
            loadinginstace = Loading.service({ fullscreen: true })
        }
        let token = sessionStorage.getItem("CMCPROTOKEN")
        if (token && token !== '') {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
            config.headers.cmcProToken = token;
        }
        if(debug){
            config.url = '/api' + config.url
        }
        return config;
    },
    err => {
        if(loadinginstace){
            loadinginstace.close()
        }
        return Promise.reject(err);
    });

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
    response => {
        if(loadinginstace){
            loadinginstace.close()
        }
        if(response.data.success === false) {
            //弹出错误提示
            let errorList = response.data.error;
            if(errorList !== null && errorList.length > 0){
                let errorMsgList = []
                for(let errorKey of errorList){
                    console.log(errorKey)
                    let errorMsg = i18n.t(errorKey)
                    if(errorMsg) {
                        errorMsgList.push(errorMsg)
                    } else {
                        errorMsgList.push(errorKey)
                    }
                }
                let errorMsgFinal = errorMsgList.join(",")
                Message({
                    message: errorMsgFinal,
                    type: 'error'
                });
            }
        }
        return response;
    },
    error => {
        console.log(error)
        if(loadinginstace){
            loadinginstace.close()
        }
        if (error.response) {
            switch (error.response.status) {
                case 401:{
                    let authResult = error.response.headers['auth-result']
                    if(authResult === 'notLogin'){
                        sessionStorage.removeItem('CMCPROTOKEN')
                        router.replace({
                            name: 'login'
                            // query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
                        })
                    } else if (authResult === 'noPermission') {
                        Message({
                            message: 'unauthorized',
                            type: 'error'
                        });
                    }
                }
            }
        }
        return Promise.reject(error.response.data)
    });

export default axios