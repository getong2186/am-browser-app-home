
import 'whatwg-fetch';  // 兼容safari的fetch
import * as Contents from 'app/utils/Contents';

import { createAction } from '../utils/Creator';


/**
 * action事件
 */

export const SET_COMPANY_INFO = 'COMMON/SET_COMPANY_INFO';


/**
 * 封装后的reducers派发器
 */
const setRCompanyInfo = createAction(SET_COMPANY_INFO, 'data');



// 获取公司数据
export function getCompanyInfo () {
    return (dispatch, getState) => {
        let data = process.env.NODE_ENV != 'development' ? JSON.parse(window.redcore.companyInfo()) : Contents.companyInfo;
        dispatch(setRCompanyInfo(data));
    }
}


