


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_USER_NAME,
    SET_PASSWORD,
    SET_CONFIRM_PASSWORD,
    SET_BTN_DISABLED
} from '../actions/PassKeeperDetailsActions';



export default combineReducers({
    // 登录用户名
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
    // 确认密码
    confirmPassword: createReducer('', {
        [SET_CONFIRM_PASSWORD](state, {data}){
            return data;
        }
    }),
    // 按钮是否可点击状态
    btnDisabled: createReducer(true, {
        [SET_BTN_DISABLED](state, {data}){
            return data;
        }
    }),
});
