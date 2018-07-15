import * as types from './mutation-type.js';

export default {
    [types.SET_TOKEN](state, token) {
        state.token = token;
    },

    [types.SET_CONTENT_BOX_HEIGHT](state, contentBoxHeight) {
        state.contentBoxHeight = contentBoxHeight;
    }
};