

import { createAction } from '../utils/Creator';


/**
 * action事件
 */

export const SET_PASSWORD = 'CHANGE_PASSWORD/SET_PASSWORD';
export const SET_CONFIRM_PASSWORD = 'CHANGE_PASSWORD/SET_CONFIRM_PASSWORD';
export const SET_BTN_DISABLED = 'CHANGE_PASSWORD/SET_BTN_DISABLED';


/**
 * 封装后的reducers派发器
 */
const setRPassword = createAction(SET_PASSWORD, 'data');
const setRConfirmPassword = createAction(SET_CONFIRM_PASSWORD, 'data');
const setRBtnDisabled = createAction(SET_BTN_DISABLED, 'data');


/**
 * 供containers调用的action业务层
 */

export function setPassword(value) {
    return (dispatch, getState) => {
        dispatch(setRPassword(value));

        dispatch(setBtnDisabled());
    }
}

export function setConfirmPassword(value) {
    return (dispatch, getState) => {
        dispatch(setRConfirmPassword(value));

        dispatch(setBtnDisabled());
    }
}

// 设置按钮是否可点击状态
export function setBtnDisabled() {
    return (dispatch, getState) => {
        let password = getState().changePassword.password;
        let confirmPassword = getState().changePassword.confirmPassword;

        if (password !== '' && confirmPassword !== '') {
            dispatch(setRBtnDisabled(false));
        } else {
            dispatch(setRBtnDisabled(true));
        }
    }
}

// 将内容保存到客户端
export function saveContent(callbackFun) {
    return (dispatch, getState) => {
        console.info('保存到客户端完成！！！');
        let response = {
            state: 0,
            msg: '密码不通过1111'
        };
        callbackFun(response);
    }
}

