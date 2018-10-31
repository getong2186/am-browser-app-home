import { Toast } from 'antd-mobile';
import 'whatwg-fetch';  // 兼容safari的fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action事件
 */
export const SET_USER_NAME = 'FORGOT_USER_NAME/SET_USER_NAME';
export const SET_BTN_DISABLED = 'FORGOT_USER_NAME/SET_BTN_DISABLED';
export const SET_UUID = 'FORGOT_USER_NAME/SET_UUID';


/**
 * 封装后的reducers派发器
 */
const setRUserName = createAction(SET_USER_NAME, 'data');
const setRBtnDisabled = createAction(SET_BTN_DISABLED, 'data');
const setRUuid = createAction(SET_UUID, 'data');


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

// 根据用户名密码设置按钮是否点击
export function setBtnDisabled() {
    return (dispatch, getState) => {
        let userName = getState().forgotUserName.userName;
        if (!userName) {
            dispatch(setRBtnDisabled(true));
        } else {
            dispatch(setRBtnDisabled(false));
        }
    }
}

// 
export function checkUserName(callbackFun) {
    return (dispatch, getState) => {
        const companyInfo = getState().common.companyInfo;
        fetch(companyInfo.managerServer + '/v2/verify', {
            method: 'POST',
            mode: 'cors',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: dealBodyFormat({
                byWhich : getState().forgotUserName.userName,
                companyId : companyInfo.companyId
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
                dispatch(setRUuid(data.data.uuid));
                callbackFun(data);
            } else {
                Toast.info(data.message, 1);
            }
        });

    }
}