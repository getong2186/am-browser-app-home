

import { createAction } from '../utils/Creator';


/**
 * action事件
 */

export const SET_USER_NAME = 'PASS_KEEPER_DETAILS/SET_USER_NAME';
export const SET_PASSWORD = 'PASS_KEEPER_DETAILS/SET_PASSWORD';
export const SET_CONFIRM_PASSWORD = 'PASS_KEEPER_DETAILS/SET_CONFIRM_PASSWORD';
export const SET_BTN_DISABLED = 'PASS_KEEPER_DETAILS/SET_BTN_DISABLED';


/**
 * 封装后的reducers派发器
 */
const setRUserName = createAction(SET_USER_NAME, 'data');
const setRPassword = createAction(SET_PASSWORD, 'data');
const setRConfirmPassword = createAction(SET_CONFIRM_PASSWORD, 'data');
const setRBtnDisabled = createAction(SET_BTN_DISABLED, 'data');


/**
 * 供containers调用的action业务层
 */

// 根据参数初始化表单
export function initDetails(data) {
    return (dispatch, getState) => {
        dispatch(setRUserName(data.userName));
        dispatch(setRPassword(data.password));
        dispatch(setRConfirmPassword(data.confirmPassword));
        dispatch(setBtnDisabled());
    }
}

export function setUserName(value) {
    return (dispatch, getState) => {
        dispatch(setRUserName(value));

        dispatch(setBtnDisabled());
    }
}

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
        let userName = getState().passKeeperDetails.userName;
        let password = getState().passKeeperDetails.password;
        let confirmPassword = getState().passKeeperDetails.confirmPassword;

        if (userName !== '' && password !== '' && confirmPassword !== '') {
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
        callbackFun();
    }
}

