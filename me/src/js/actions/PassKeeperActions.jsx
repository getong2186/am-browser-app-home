
import 'whatwg-fetch';  // 兼容safari的fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


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

export function setBtnDisabled() {
    return (dispatch, getState) => {
        let userName = getState().passKeeperDetails.userName;
        let password = getState().passKeeperDetails.password;
        let confirmPassword = getState().passKeeperDetails.confirmPassword;

        let flag = getState().passKeeperDetails.btnDisabled;

        if (!name) { flag = true; }
        console.info(name);
        if (!password) { flag = true; }
        console.info(password);
        if (!confirmPassword) { flag = true; }
        console.info(confirmPassword);
        if (password !== confirmPassword) { flag = true; }
        console.info(11111111);
        flag = false;



        dispatch(setRBtnDisabled(flag));
    }
}
