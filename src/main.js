import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueAxios from 'vue-axios'
import store from './store/index';
import router from './router/index';
import axios from './http/index'


Vue.use(ElementUI)
Vue.use(VueAxios, axios)



new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
