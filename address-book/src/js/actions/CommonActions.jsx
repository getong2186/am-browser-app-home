
import * as Contents from 'app/utils/Contents';
import 'whatwg-fetch';  // 兼容safari的fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action事件
 */

export const SET_USER_INFO = 'COMMON/SET_USER_INFO';


/**
 * 封装后的reducers派发器
 */
const setRUserInfo = createAction(SET_USER_INFO, 'data');



// 获取用户数据
export function getUserInfo () {
    return (dispatch, getState) => {
        let data = process.env.NODE_ENV != 'development' ? JSON.parse(window.redcore.userInfo()) : Contents.userInfo;
        let tokerTimer = null;
        clearInterval(tokerTimer);
        function refreshToken () {
            let access_token = sessionStorage.getItem('ac') || data.accessToken;
            let refresh_token = sessionStorage.getItem('re') || data.refreshToken;
            
            fetch(data.managerServer + '/client/v3/auth/token', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'access-token': sessionStorage.getItem('ac') || data.accessToken
                },
                body: dealBodyFormat({
                    refresh_token: refresh_token,
                    access_token: access_token
                })
            }).then(function(res) {
                if (res.ok) {
                    return res.json();
                }
            }).then(function(data) {
                if (data.errCode == '0') {
                   sessionStorage.setItem('ac', data.data.access_token || ''); 
                   sessionStorage.setItem('re', data.data.refresh_token || ''); 
                }
            });
        }
        refreshToken();
        tokerTimer = setInterval(function () {
            refreshToken();
        }, 600000);

        dispatch(setRUserInfo(data));
    }
}


