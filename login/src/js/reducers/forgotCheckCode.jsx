


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_CHECK_CODE,
    SET_BTN_DISABLED,
    SET_CODE_RULE
} from '../actions/ForgotCheckCodeActions';



export default combineReducers({
    // 验证码
    code: createReducer('', {
        [SET_CHECK_CODE](state, {data}){
            return data;
        }
    }),

    // code 规则
    codeRule: createReducer('', {
        [SET_CODE_RULE](state, {data}){
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
