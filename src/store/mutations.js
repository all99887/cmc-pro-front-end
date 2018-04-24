import * as types from './mutation-type.js';

export default {
    [types.SET_TOKEN](state, token) {
        state.token = token;
    }
};