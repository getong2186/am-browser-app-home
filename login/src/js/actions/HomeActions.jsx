
import { ListView } from 'antd-mobile';
import 'whatwg-fetch';  // 兼容safari的fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action事件
 */
export const SET_USER_NAME = 'HOME/SET_USER_NAME';
export const SET_PASSWORD = 'HOME/SET_PASSWORD';
export const SET_BTN_DISABLED = 'HOME/SET_BTN_DISABLED';

export const SET_COMPANY_INFO = 'COMMON/SET_COMPANY_INFO';


/**
 * 封装后的reducers派发器
 */
const setRUserName = createAction(SET_USER_NAME, 'data');
const setRPassword = createAction(SET_PASSWORD, 'data');
const setRBtnDisabled = createAction(SET_BTN_DISABLED, 'data');

const setRCompanyInfo = createAction(SET_COMPANY_INFO, 'data');


/**
 * 供containers调用的action业务层
 */

// 根据客户端传递的用户名初始化用户名输入框内容
export function initUserName() {
    return (dispatch, getState) => {
        dispatch(setRUserName(getState().common.companyInfo.userName));
    }
}



// 根据新的数据设置用户名的状态树
export function setUserName(value) {
    return (dispatch, getState) => {
        dispatch(setRUserName(value));
        dispatch(setBtnDisabled());
    }
}

// 根据新的数据设置用户密码的状态树
export function setPassword(value) {
    return (dispatch, getState) => {
        dispatch(setRPassword(value));
        dispatch(setBtnDisabled());
    }
}

// 根据用户名密码设置按钮是否点击
export function setBtnDisabled() {
    return (dispatch, getState) => {
        let userName = getState().home.userName;
        let password = getState().home.password;
        if (!userName || !password) {
            dispatch(setRBtnDisabled(true));
        } else {
            dispatch(setRBtnDisabled(false));
        }
    }
}

// 登录
export function login() {
    return (dispatch, getState) => {
        // 生产环境调用客户端方法验证验证码是否符合规则
        if (process.env.NODE_ENV != 'development') {
            window.redcore.login(getState().home.userName, getState().home.password);
        } else {
            console.info('点击登录按钮');
        }
    }
}

// 返回上一级
export function returnPrev() {
    return (dispatch, getState) => {
        // 生产环境调用客户端方法验证验证码是否符合规则
        if (process.env.NODE_ENV != 'development') {
            window.redcore.backToEnterCodePage();
        } else {
            console.info('点击返回上一级按钮');
        }
    }
}

// 当图片error时，设置logoUrl为‘’，使其加载内置logo
export function setLogoUrl() {
    return (dispatch, getState) => {
        let companyInfo = {
            managerServer: getState().common.companyInfo.managerServer,
            companyId: getState().common.companyInfo.companyId,
            themeColor: getState().common.companyInfo.themeColor,
            accountPlaceHolder: getState().common.companyInfo.accountPlaceHolder,
            logoUrl: ''
        };
        dispatch(setRCompanyInfo(companyInfo));
    }
}

