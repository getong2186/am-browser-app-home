
import * as Contents from 'app/utils/Contents';

import { createAction } from '../utils/Creator';


/**
 * action事件
 */

export const SET_PERSONAL_INFO = 'COMMON/SET_PERSONAL_INFO';


/**
 * 封装后的reducers派发器
 */
export const setRPersonalInfo = createAction(SET_PERSONAL_INFO, 'data');



// 获取用户数据
export function getLoginInfo () {
    return (dispatch, getState) => {
        let data = process.env.NODE_ENV != 'development' ? JSON.parse(window.redcore.personalInfo()) : Contents.personalInfo;
        // let data = JSON.parse(window.redcore.personalInfo());
        // let data = Contents.personalInfo;
        // 处理下颜色
        if (data.themeColor) {
            data.themeColor = data.themeColor.replace('0X', '#');
        }
        dispatch(setRPersonalInfo(data));
    }
}


