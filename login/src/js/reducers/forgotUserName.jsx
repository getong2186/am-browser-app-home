


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_USER_NAME,
    SET_BTN_DISABLED,
    SET_UUID
} from '../actions/ForgotUserNameActions';



export default combineReducers({
    // 输入手机/邮箱
    userName: createReducer('', {
        [SET_USER_NAME](state, {data}){
            return data;
        }
    }),

    // uuid
    uuid: createReducer('', {
        [SET_UUID](state, {data}){
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
