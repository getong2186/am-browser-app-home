

import { createAction } from '../utils/Creator';

import {
    // 页面所使用的数据
    setRPersonalInfo
} from '../actions/CommonActions';




/**
 * action事件
 */
export const SET_AVATAR = 'HOME/SET_AVATAR';


/**
 * 封装后的reducers派发器
 */
const setRAvatar = createAction(SET_AVATAR, 'data');


/**
 * 供containers调用的action业务层
 */

// 初始化信息
export function initReducers() {
    return (dispatch, getState) => {
        // 每一次组件刷新时，判断home的reducers是不是已经有了值，如果有了采用已经存在的封面
        // 如果没有，采用客户端返回的封面
        let avatar = '';
        if (getState().home.avatar == '') {
            if (getState().common.personalInfo.avatar) {
                avatar = getState().common.personalInfo.avatar;
            }
        } else {
            avatar = getState().home.avatar;
        }
        dispatch(setRAvatar(avatar));
    }
}

// 打开上传头像model
export function userAvatarTapped() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.userAvatarTapped();
        }
    }
}

// 设置头像
export function setAvatar(url) {
    return (dispatch, getState) => {
        dispatch(setRAvatar(url));
    }
}

// 打开设置客户端原生页面
export function settings() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.openSettings();
        }
    }
}

// 打开开发者客户端原生页面
export function developer() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.openDeveloper();
        }
    }
}

// 退出
export function out() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.safeExit();
        }
    }
}

// 设置客户端tabbar
export function tabBarHideOperation(value) {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            //window.redcore.tabBarHideOperation(value);
        }
    }
}