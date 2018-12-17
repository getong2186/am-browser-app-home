import { Toast } from 'antd-mobile';
import 'whatwg-fetch';  // 兼容safari的fetch
import * as Contents from 'app/utils/Contents';

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action事件
 */
export const SET_OPENED_MEMBERS = 'DETAILS/SET_OPENED_MEMBERS';
export const SET_CHECKED = 'DETAILS/SET_CHECKED';


/**
 * 封装后的reducers派发器
 */
const setROpenedMembers = createAction(SET_OPENED_MEMBERS , 'data');
const setRChecked = createAction(SET_CHECKED , 'data');


// 设置当前人数据
export function setOpenedMembers(data) {
    return (dispatch, getState) => {
        // 设置用户手机号是否可见
        if (data.tel && data.telHidden == 'true') {
            let confusionStr = data.tel.substring(3, 9);
            data.tel = data.tel.replace(confusionStr, '******');
        }

        dispatch(setROpenedMembers(data));
    };
}


// 查询是否是常用联系人
export function queryIsCommon () {
    return (dispatch, getState) => {
        const userInfo = getState().common.userInfo;
        fetch(userInfo.managerServer + '/plugin/im/v1/colleagues', {
            method: 'POST',
            mode: 'cors',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'access-token': sessionStorage.getItem('ac') || userInfo.accessToken
            },
            body: dealBodyFormat({
                companyId : userInfo.companyId,
                uuid : userInfo.userUuid,
                departmentId : userInfo.departmentId
            })
        }).then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                Toast.info(JSON.stringify(res), 1);
            }
        }).then(function(data) {
            if (data.errCode == '0') {
                // 获取最新常用联系人列表，看看当前人是否在列表当中
                // 如果在，设置check为选中，否则，为不选中
                let id = getState().details.openedMembers.uuid;
                let isSelected = false;
                let list = data.data.data;
                for (let i=0, len=list.length; i<len; i++) {
                    if (list[i].uuid === id) {
                        isSelected = true;
                        dispatch(setRChecked(true));
                        break;
                    }
                }
                if (!isSelected) { dispatch(setRChecked(false)); }

                // 设置页面check的样式颜色
                let $dom = document.querySelector('.rc-switch');
                let color = getState().common.userInfo.themeColor;
                if (isSelected) {
                    $dom.style.border = '1px solid ' + color;
                    $dom.style.background = color;
                } else {
                    $dom.style.border = '1px solid #ccc';
                    $dom.style.background = '#ccc';
                }
            } else {
                Toast.info(JSON.stringify(data), 1);
            }
        });
    }
}

// 设置是否是常用联系人
export function setCommon(value, targetUuid, callbackFun) {
    return (dispatch, getState) => {
        const userInfo = getState().common.userInfo;
        let url = '';
        value ? url = '/plugin/im/v1/addColleague' : url = '/plugin/im/v1/deleteColleague';

        fetch(userInfo.managerServer + url, {
            method: 'POST',
            mode: 'cors',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'access-token': sessionStorage.getItem('ac') || userInfo.accessToken
            },
            body: dealBodyFormat({
                uuid : userInfo.userUuid,
                targetUuid: targetUuid,
                cid : userInfo.companyId
            })
        }).then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                Toast.info(res, 1);
            }
        }).then(function(data) {
            if (data.errCode == '0') {
                dispatch(setRChecked(value));
            } else {
                dispatch(setRChecked(!value));
            }
            callbackFun(data.errCode);
            Toast.info(data.message, 1);
        });
    };
}

// 打开聊天
export function openIm () {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.startMessage(getState().details.openedMembers.uuid);
        } else {
            console.info(getState().details.openedMembers.uuid);
            console.info('打开IM');
        }
    }
}

// 打开头像
export function openAvatar () {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            window.redcore.openAvatar(getState().details.openedMembers.avatar);
        } else {
            console.info(getState().details.openedMembers.avatar);
            console.info('打开头像');
        }
    }
}

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