import { Toast } from 'antd-mobile';

import 'whatwg-fetch';  // 兼容safari的fetch
import * as Contents from 'app/utils/Contents';


import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action事件
 */

export const SET_IS_REFRESH = 'GROUPS/SET_IS_REFRESH';
export const SET_GROUPS_LIST = 'GROUPS/SET_GROUPS_LIST';



/**
 * 封装后的reducers派发器
 */
const setRIsRefresh = createAction(SET_IS_REFRESH, 'data');
const setRGroupsList = createAction(SET_GROUPS_LIST, 'data');


/**
 * 供containers调用的action业务层
 */



// 获取常用数据
export function getGroupsList () {
    return (dispatch, getState) => {
        dispatch(setRIsRefresh(true));
        const userInfo = getState().common.userInfo;
        fetch(userInfo.managerServer + '/plugin/im/v1/groups', {
            method: 'POST',
            mode: 'cors',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'access-token': sessionStorage.getItem('ac') || userInfo.accessToken
            },
            body: dealBodyFormat({
                id: userInfo.userUuid
            })
        }).then(function(res) {
            dispatch(setRIsRefresh(false));
            if (res.ok) {
                return res.json();
            } else {
                Toast.info(res, 1);
            }
        }).then(function(data) {
            if (data.errCode == '0') {
                dispatch(setRGroupsList(data.data));
                endRefresh();
            } else {
                Toast.info(JSON.stringify(data), 1);
                endRefresh();
            }
        });
    }
}

// 打开聊天
export function openIm (rowData) {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.startGroupMessage(rowData.id);
        } else {
            console.info(rowData.id);
            console.info('打开IM');
        }
    }
}


// 首先通知客户端此页面需不需要下拉刷新
// 首先通知客户端此页面需不需要下拉刷新
export function settingRefresh(value) {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            if (window.redcore.setCanDropDownRefresh) {
                window.redcore.setCanDropDownRefresh(value);
            }
        } else {
            console.info('设置此页面下拉刷新');
        }
    }
}

// 通知客户端下拉刷新结束
export function endRefresh() {
    if (process.env.NODE_ENV != 'development') {
        if (window.redcore.clientStopRefresh) {
            window.redcore.clientStopRefresh();
        }
    } else {
        console.info('客户端停止下拉刷新');
    }
}


// 通知客户端接管下拉刷新动作
export function receptionRefresh() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            if (window.redcore.clientReceptionRefresh) {
                window.redcore.clientReceptionRefresh();
            }
        } else {
            console.info('客户端接管下拉动作，开始下拉刷新');
        }
    }
}








