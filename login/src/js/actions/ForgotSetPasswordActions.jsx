import { Toast } from 'antd-mobile';
import 'whatwg-fetch';  // 兼容safari的fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action事件
 */
export const SET_PASSWORD = 'FORGOT_SET_PASSWORD/SET_PASSWORD';
export const SET_BTN_DISABLED = 'FORGOT_SET_PASSWORD/SET_BTN_DISABLED';
export const SET_CONFIRM_PASSWORD = 'FORGOT_SET_PASSWORD/SET_CONFIRM_PASSWORD';


/**
 * 封装后的reducers派发器
 */
const setRSetPassword = createAction(SET_PASSWORD, 'data');
const setRBtnDisabled = createAction(SET_BTN_DISABLED, 'data');
const setRConfirmPassword = createAction(SET_CONFIRM_PASSWORD, 'data');


/**
 * 供containers调用的action业务层
 */

export function setPassword(value) {
    return (dispatch, getState) => {
        dispatch(setRSetPassword(value));
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
        let userName = getState().forgotSetPassword.userName;
        let password = getState().forgotSetPassword.password;
        let confirmPassword = getState().forgotSetPassword.confirmPassword;
        if (userName !== '' && password !== '' && confirmPassword !== '') {
            dispatch(setRBtnDisabled(false));
        } else {
            dispatch(setRBtnDisabled(true));
        }
    }
}

// 修改密码
export function updatePassword(callbackFun) {
    return (dispatch, getState) => {

        if (getState().forgotSetPassword.password !== getState().forgotSetPassword.confirmPassword) {
            Toast.info('两次密码不同', 1);
        } else if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(getState().forgotSetPassword.password))) {
            Toast.info('密码应6-16位英文字母，数字组合', 1);
        } else {
            const companyInfo = getState().common.companyInfo;
            fetch(companyInfo.managerServer + '/v2/changepwd', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                },
                body: dealBodyFormat({
                    uuid: getState().forgotUserName.uuid,
                    password : getState().forgotSetPassword.confirmPassword,
                })
            }).then(function(res) {
                if (res.ok) {
                    return res.json();
                } else {
                    Toast.info(JSON.stringify(res), 1);
                }
            }).then(function(data) {
                console.log(data);
                if (data.status) {
                    callbackFun();
                } else {
                    Toast.info(data.message, 1);
                }
            });
        }
    }
}
