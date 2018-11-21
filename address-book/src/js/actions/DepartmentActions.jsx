import { Toast } from 'antd-mobile';
import 'whatwg-fetch';  // 兼容safari的fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action事件
 */

export const SET_DEPARTMENT_IS_REFRESH = 'DEPARTMENT/SET_DEPARTMENT_IS_REFRESH';
export const SET_SCROLL_TOP = 'DEPARTMENT/SET_SCROLL_TOP';

export const SET_CURRENT_DEPARTMENT = 'DEPARTMENT/SET_CURRENT_DEPARTMENT';
export const SET_DEPARTMENT_LIST = 'DEPARTMENT/SET_DEPARTMENT_LIST';

export const SET_DEPARTMENT_PAGE_INDEX = 'DEPARTMENT/SET_DEPARTMENT_PAGE_INDEX';
export const SET_ANALYSIS_DEPARTMENT = 'DEPARTMENT/SET_ANALYSIS_DEPARTMENT';
export const SET_DEPARTMENT_LOADING = 'DEPARTMENT/SET_DEPARTMENT_LOADING';
export const SET_DEPARTMENT_COUNT = 'DEPARTMENT/SET_DEPARTMENT_COUNT';
export const SET_DEPARTMENT_COUNT_PAGE = 'DEPARTMENT/SET_DEPARTMENT_COUNT_PAGE';
export const SET_DEPARTMENT_PAGE_COUNT_LENGTH = 'DEPARTMENT/SET_DEPARTMENT_PAGE_COUNT_LENGTH';

export const SET_DEPARTMENT_DATA_BLOB = 'DEPARTMENT/SET_DEPARTMENT_DATA_BLOB';
export const SET_DEPARTMENT_SECTION_IDS = 'DEPARTMENT/SET_DEPARTMENT_SECTION_IDS';
export const SET_DEPARTMENT_ROW_IDS = 'DEPARTMENT/SET_DEPARTMENT_ROW_IDS';


/**
 * 封装后的reducers派发器
 */
const setRDepartmentRefresh = createAction(SET_DEPARTMENT_IS_REFRESH , 'data');
const setRScrollTop = createAction(SET_SCROLL_TOP , 'data');

const setRCurrentDepartment = createAction(SET_CURRENT_DEPARTMENT , 'data');
const setRDepartmentList = createAction(SET_DEPARTMENT_LIST , 'data');

const setRDepartmentPageIndex = createAction(SET_DEPARTMENT_PAGE_INDEX , 'data');
const setRAnalysisDepartment = createAction(SET_ANALYSIS_DEPARTMENT , 'data');
const setRDepartmentLoading = createAction(SET_DEPARTMENT_LOADING , 'data');
const setRDepartmentCount = createAction(SET_DEPARTMENT_COUNT , 'data');
const setRDepartmentCountPage = createAction(SET_DEPARTMENT_COUNT_PAGE , 'data');
const setRDepartmentPageCountLength = createAction(SET_DEPARTMENT_PAGE_COUNT_LENGTH , 'data');

const setRDepartmentDataBlob = createAction(SET_DEPARTMENT_DATA_BLOB, 'data');
const setRDepartmentSectionIDs = createAction(SET_DEPARTMENT_SECTION_IDS, 'data');
const setRDepartmentRowIDs = createAction(SET_DEPARTMENT_ROW_IDS, 'data');


// 设置部门列表是否是刷新状态
export function setDepartmentRefresh(value) {
    return (dispatch, getState) => {
        dispatch(setRDepartmentRefresh(value));
    }
}

// 滚动条高度
export function setScrollTop (value) {
    return (dispatch, getState) => {
        dispatch(setRScrollTop(value));
    };
};

// 设置当前展开的部门
export function setCurrentDepartment (department) {
    return (dispatch, getState) => {
        dispatch(setRCurrentDepartment(department));
    };
};


// 设置当前页数
export function setDepartmentPageIndex(value) {
    return (dispatch, getState) => {
        dispatch(setRDepartmentPageIndex(value));
    }
}

export function setAnalysisDepartment(value) {
    return (dispatch, getState) => {
        dispatch(setRAnalysisDepartment(value));
    }
}

export function setDepartmentCount(value) {
    return (dispatch, getState) => {
        dispatch(setRDepartmentCount(value));
    }
}

export function setDepartmentCountPage(value) {
    return (dispatch, getState) => {
        dispatch(setRDepartmentCountPage(value));
    }
}

export function setDepartmentPageCountLength(value) {
    return (dispatch, getState) => {
        dispatch(setRDepartmentPageCountLength(value));
    }
}


// 设置加载状态
export function setDepartmentLoading (value) {
    return (dispatch, getState) => {
        dispatch(setRDepartmentLoading(value));
    };
};

// 获取部门数据
export function getDepartmentList (callbackFun) {
    return (dispatch, getState) => {
        const userInfo = getState().common.userInfo;
        fetch(userInfo.managerServer + '/plugin/im/v1/departmentmembers', {
            method: 'POST',
            mode: 'cors',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'access-token': sessionStorage.getItem('ac') || userInfo.accessToken
            },
            body: dealBodyFormat({
                id : getState().department.currentDepartment.departmentId,
                companyId : userInfo.companyId,
                start: getState().department.departmentPageIndex + 1,
                number: 20
            })
        }).then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                Toast.info(JSON.stringify(res), 1);
            }
        }).then(function(data) {
            if (data.errCode == '0') {
                let list = data.data.data;
                // 在跟原来的数据合并
                let concatList = getState().department.analysisDepartment.concat(list);
                dispatch(setRAnalysisDepartment(concatList));
                // 设置当前页数据总数等状态
                dispatch(setRDepartmentCount(data.data.count));
                dispatch(setRDepartmentCountPage(data.data.countPage));
                dispatch(setRDepartmentPageCountLength(list.length));

                callbackFun();
                endRefresh();
            } else {
                Toast.info(JSON.stringify(data), 1);
                endRefresh();
            }
        });
    }
}

// 设置部门列表
export function setDepartmentList(list) {
    return (dispatch, getState) => {
        dispatch(setRDepartmentList(list));
    }
}

// 把当前的部门（一切状态）保存到部门列表中作为上一级部门
export function addDepartmentToList(department) {
    return (dispatch, getState) => {
        let list = [];
        // 需要克隆一下才可以
        for (let value of getState().department.departmentList) {
            list.push(value);
        }
        list.push(department);

        dispatch(setRDepartmentList(list));
    }
}


// 存储同事各项数据到reducers中，方便再次渲染时读取
export function setDepartmentDataBlob(value) {
    return (dispatch, getState) => {
        dispatch(setRDepartmentDataBlob(value));
    }
}
export function setDepartmentSectionIDs(value) {
    return (dispatch, getState) => {
        dispatch(setRDepartmentSectionIDs(value));
    }
}
export function setDepartmentRowIDs(value) {
    return (dispatch, getState) => {
        dispatch(setRDepartmentRowIDs(value));
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







