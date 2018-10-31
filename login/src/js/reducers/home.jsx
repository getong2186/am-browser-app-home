


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_USER_NAME,
    SET_PASSWORD,
    SET_BTN_DISABLED
} from '../actions/HomeActions';




export default combineReducers({
    // 用户名（手机号或邮箱）
    userName: createReducer('', {
        [SET_USER_NAME](state, {data}){
            return data;
        }
    }),

    // 密码
    password: createReducer('', {
        [SET_PASSWORD](state, {data}){
            return data;
        }
    }),

    // 登录按钮的可点击状态
    btnDisabled: createReducer(true, {
        [SET_BTN_DISABLED](state, {data}){
            return data;
        }
    })
    
});
