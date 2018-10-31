import { Toast } from 'antd-mobile';
import 'whatwg-fetch';  // 兼容safari的fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


// /**
//  * action事件
//  */
export const SET_CHECK_CODE = 'FORGOT_CHECK_CODE/SET_CHECK_CODE';
export const SET_BTN_DISABLED = 'FORGOT_CHECK_CODE/SET_BTN_DISABLED';
export const SET_CODE_RULE = 'FORGOT_CHECK_CODE/SET_CODE_RULE';

export const SET_USER_NAME = 'FORGOT_USER_NAME/SET_USER_NAME';


/**
 * 封装后的reducers派发器
 */
const setRUserName = createAction(SET_USER_NAME, 'data');

const setRCheckCode = createAction(SET_CHECK_CODE, 'data');
const setRBtnDisabled = createAction(SET_BTN_DISABLED, 'data');
const setRCodeRule = createAction(SET_CODE_RULE, 'data');


/**
 * 供containers调用的action业务层
 */


// 根据新的数据设置用户名的状态树
export function setUserName(value) {
    return (dispatch, getState) => {
        dispatch(setRUserName(value));
        dispatch(setBtnDisabled());
    }
}

// 根据新的数据设置用户名的状态树
export function setCheckCode(value) {
    return (dispatch, getState) => {
        dispatch(setRCheckCode(value));
        dispatch(setBtnDisabled());

    }
}

// 根据用户名密码设置按钮是否点击
export function setBtnDisabled() {
    return (dispatch, getState) => {
        let code = getState().forgotCheckCode.code;
        let name = getState().forgotUserName.userName;
        if (code != '' && name != '') {
            dispatch(setRBtnDisabled(false));
        } else {
            dispatch(setRBtnDisabled(true));
        }
    }
}


export function getCode() {
    return (dispatch, getState) => {
        const companyInfo = getState().common.companyInfo;
        fetch(companyInfo.managerServer + '/v2/getCode', {
            method: 'POST',
            mode: 'cors',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: dealBodyFormat({
                byWhich : getState().forgotUserName.userName,
                companyId : companyInfo.companyId,
                uuid: getState().forgotUserName.uuid
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
                dispatch(setRCodeRule(data.data.code));
                console.log(getState().forgotCheckCode.codeRule);
            } else {
                Toast.info(data.message, 1);
            }
        });

    }
}


export function clientCheckCode(callbackFun) {
    return (dispatch, getState) => {
        // 生产环境调用客户端方法验证验证码是否符合规则
        if (process.env.NODE_ENV != 'development') {
            let data = JSON.parse(window.redcore.validateVerifyCode(getState().forgotCheckCode.codeRule, getState().forgotCheckCode.code));
            if (data.state) {
                callbackFun();
            } else {
                Toast.info('验证码校验失败', 1);
            }
        } else {
            // 开发环境模拟客户端返回数据
            callbackFun();
        }
    }
}
