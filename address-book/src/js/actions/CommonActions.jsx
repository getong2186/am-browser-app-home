
import * as Contents from 'app/utils/Contents';

import { createAction } from '../utils/Creator';


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
        dispatch(setRUserInfo(data));
    }
}


