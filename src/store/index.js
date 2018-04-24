import Vue from 'vue';
import Vuex from 'vuex';
import state from './state.js';
import * as getters from './getters.js';
import mutations from './mutations.js';
// import actions from './actions.js';
import createLogger from 'vuex/dist/logger'; // 修改日志

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'; // 开发环境中为true，否则为false

const store =  new Vuex.Store({
    state,
    getters,
    mutations,
    // actions,
    plugins: debug ? [createLogger()] : [] // 开发环境下显示vuex的状态修改
});

export default store