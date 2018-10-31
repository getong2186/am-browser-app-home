

import { createAction } from '../utils/Creator';


/**
 * action事件
 */
export const SET_AUTO_UPDATE = 'SETTINGS/SET_AUTO_UPDATE';


/**
 * 封装后的reducers派发器
 */
const setRAutoUpdate = createAction(SET_AUTO_UPDATE, 'data');


/**
 * 供containers调用的action业务层
 */

// 初始化信息
export function initReducers() {
    return (dispatch, getState) => {
        if (getState().common.personalInfo.platform == 'android') {
            let autoUpdate = getState().common.personalInfo.autoUpdate;
            dispatch(setRAutoUpdate(autoUpdate));
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


export function passKeeper() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.settingOperation('ssos');
        }
    }
}

export function fontSize() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.settingOperation('font');
        }
    }
}

export function cache() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.settingOperation('clearCache');
        }
    }
}

export function chatting() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.settingOperation('clearChats');
        }
    }
}

export function password() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.settingOperation('changePsw');
        }
    }
}

export function setAutoUpdate(value) {
    return (dispatch, getState) => {
        dispatch(setRAutoUpdate(value));
        if (process.env.NODE_ENV != 'development') {
            window.redcore.autoUpdate(value);
        }
    }
}

