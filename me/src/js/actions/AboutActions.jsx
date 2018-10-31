
import * as Contents from 'app/utils/Contents';

import { createAction } from '../utils/Creator';


import {
    // 页面所使用的数据
    setRPersonalInfo
} from '../actions/CommonActions';





/**
 * action事件
 */

//export const SET_DEVELOPER = 'ABOUT/SET_DEVELOPER';


/**
 * 封装后的reducers派发器
 */
//const setRDeveloper = createAction(SET_DEVELOPER, 'data');





// 检查新版本
export function checkVersion() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.checkVersion();
        }
    }
}

// 改变开发者模式状态
export function setDeveloperIsShow() {
    return (dispatch, getState) => {
        let data = getState().common.personalInfo;
        data.developer = !data.developer;
        dispatch(setRPersonalInfo(data));
        if (process.env.NODE_ENV != 'development') {
            window.redcore.changeDeveloper(data.developer);
        }
    }
}

// 打开客户端开发者模式
export function openDeveloper() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.openDeveloper();
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