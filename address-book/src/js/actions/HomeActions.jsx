import { ListView, Toast } from 'antd-mobile';
import 'whatwg-fetch';  // 兼容safari的fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action事件
 */
export const SET_COMMON_IS_REFRESH = 'HOME/SET_COMMON_IS_REFRESH';
export const SET_COLLEAGUES_IS_REFRESH = 'HOME/SET_COLLEAGUES_IS_REFRESH';
export const SET_PAGE_LOADED = 'HOME/SET_PAGE_LOADED';
export const SET_ACTIVE_TAB = 'HOME/SET_ACTIVE_TAB';
export const SET_SCROLL_TOP = 'HOME/SET_SCROLL_TOP';
export const SET_COMMON_DATA_SOURCE = 'HOME/SET_COMMON_DATA_SOURCE';
export const SET_ORIGINAL_COMMON = 'HOME/SET_ORIGINAL_COMMON';
export const SET_ANALYSIS_COMMON = 'HOME/SET_ANALYSIS_COMMON';

export const SET_COLLEAGUES_PAGE_INDEX = 'HOME/SET_COLLEAGUES_PAGE_INDEX';
export const SET_ANALYSIS_COLLEAGUES = 'HOME/SET_ANALYSIS_COLLEAGUES';
export const SET_COLLEAGUES_LOADING = 'HOME/SET_COLLEAGUES_LOADING';
export const SET_COLLEAGUES_COUNT = 'HOME/SET_COLLEAGUES_COUNT';
export const SET_COLLEAGUES_COUNT_PAGE = 'HOME/SET_COLLEAGUES_COUNT_PAGE';
export const SET_COLLEAGUES_PAGE_COUNT_LENGTH = 'HOME/SET_COLLEAGUES_PAGE_COUNT_LENGTH';

export const SET_COLLEAGUES_DATA_BLOB = 'HOME/SET_COLLEAGUES_DATA_BLOB';
export const SET_COLLEAGUES_SECTION_IDS = 'HOME/SET_COLLEAGUES_SECTION_IDS';
export const SET_COLLEAGUES_ROW_IDS = 'HOME/SET_COLLEAGUES_ROW_IDS';




/**
 * 封装后的reducers派发器
 */
const setRCommonIsRefresh = createAction(SET_COMMON_IS_REFRESH, 'data');
const setRColleaguesIsRefresh = createAction(SET_COLLEAGUES_IS_REFRESH, 'data');
const setRPageLoaded = createAction(SET_PAGE_LOADED, 'data');
const setRActiveTab = createAction(SET_ACTIVE_TAB, 'data');
const setRScrollTop = createAction(SET_SCROLL_TOP, 'data');
const setRCommonDataSource = createAction(SET_COMMON_DATA_SOURCE, 'data');
const setROriginalCommon = createAction(SET_ORIGINAL_COMMON, 'data');
const setRAnalysisCommon = createAction(SET_ANALYSIS_COMMON, 'data');

const setRColleaguesPageIndex = createAction(SET_COLLEAGUES_PAGE_INDEX, 'data');
const setRAnalysisColleagues = createAction(SET_ANALYSIS_COLLEAGUES, 'data');
const setRColleaguesLoading = createAction(SET_COLLEAGUES_LOADING, 'data');
const setRColleaguesCount = createAction(SET_COLLEAGUES_COUNT, 'data');
const setRColleaguesCountPage = createAction(SET_COLLEAGUES_COUNT_PAGE, 'data');
const setRColleaguesPageCountLength = createAction(SET_COLLEAGUES_PAGE_COUNT_LENGTH, 'data');

const setRColleaguesDataBlob = createAction(SET_COLLEAGUES_DATA_BLOB, 'data');
const setRColleaguesSectionIDs = createAction(SET_COLLEAGUES_SECTION_IDS, 'data');
const setRColleaguesRowIDs = createAction(SET_COLLEAGUES_ROW_IDS, 'data');



/**
 * 供containers调用的action业务层
 */


// 保存 常用 组件所需对象
const commonGetSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
const commonGetRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
const commonDataSource = new ListView.DataSource({
    getRowData: commonGetRowData,
    getSectionHeaderData: commonGetSectionData,
    rowHasChanged: (row1, row2) => row1 !== row2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});
let commonDataBlob = {};
let commonSectionIDs = [];
let commonRowIDs = [];


// 设置常用列表是否是刷新状态
export function setCommonIsRefresh(value) {
    return (dispatch, getState) => {
        dispatch(setRCommonIsRefresh(value));
    }
}

// 设置同事列表是否是加载状态
export function setColleaguesIsRefresh(value) {
    return (dispatch, getState) => {
        dispatch(setRColleaguesIsRefresh(value));
    }
}

// 设置页面是否被渲染过
export function setPageLoaded(value) {
    return (dispatch, getState) => {
        dispatch(setRPageLoaded(value));
    }
}

// 设置初始tab
export function setActiveTab(value) {
    return (dispatch, getState) => {
        dispatch(setRActiveTab(value));
    }
}

// 设置滚动条位置
export function setScrollTop(value) {
    return (dispatch, getState) => {
        dispatch(setRScrollTop(value));
    }
}

/**
 * 常用列表数据逻辑
 */

// 获取常用数据
export function getCommonUseList () {
    return (dispatch, getState) => {
        const userInfo = getState().common.userInfo;
        fetch(userInfo.managerServer + '/u/colleagues', {
            method: 'POST',
            mode: 'cors',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
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
            if (data.status) {
                dispatch(setRCommonDataSource(''));
                // 保存原始数据，供索引或点击单个item时获取完整数据
                dispatch(setROriginalCommon(data.data.members));

                // 保存解析后的展示数据
                let analysisCommonData = analysisCommon(getState().home.originalCommonList);
                dispatch(setRAnalysisCommon(analysisCommonData));

                // 保存index组件所需对象
                commonDataBlob = analysisCommonData.dataBlob;
                commonSectionIDs = analysisCommonData.sectionIDs;
                commonRowIDs = analysisCommonData.rowIDs;
                dispatch(setRCommonDataSource(
                    commonDataSource.cloneWithRowsAndSections(commonDataBlob, commonSectionIDs, commonRowIDs)
                ));

                endRefresh();
            } else {
                Toast.info(JSON.stringify(data), 1);
                endRefresh();
            }
        });
    }
}


// 将后台返回的常用数据解析为containers中可使用的数据格式
export function analysisCommon (data) {
    let allSectionID = [];
    let allDataBlob = {};
    let allRowIDs = [];

    // 提取字母索引，添加数据所属字母
    for (let i=0, len=data.length; i<len; i++) {
        let id = pinyinUtil.getFirstLetter(data[i].name, true)[0][0];
        // 不是字母的全部归纳到#里面去
        !/^[A-Za-z]+$/.test(id) ? id = '#' : id;
        allSectionID.push(id);
        data[i].pSectionID = id;
        allDataBlob[data[i].uuid] = data[i].name;
    }

    // 字母去重
    var n = []; //一个新的临时数组
    for (let i=0, len=allSectionID.length; i<len; i++) {
        if (n.indexOf(allSectionID[i]) == -1) {
            n.push(allSectionID[i]);
        }
    }
    allSectionID = n.sort();

    // 将字母添加到具体数据中
    for (let i=0, len=allSectionID.length; i<len; i++) {
        allDataBlob[allSectionID[i]] = allSectionID[i];
    }

    // 根据字母列表组织每个字母的映射数据
    for (let i=0, len=allSectionID.length; i<len; i++) {
        allRowIDs[i] = [];
        for (let j = 0, jLen = data.length; j < jLen; j++) {
            if (data[j].pSectionID == allSectionID[i]) {
                allRowIDs[i].push(data[j].uuid);
            }
        }
    }

    return {
        'dataBlob': allDataBlob,
        'sectionIDs': allSectionID,
        'rowIDs': allRowIDs
    };
}


/**
 * 同事列表数据逻辑
 */

export function resetColleaguesList() {
    return (dispatch, getState) => {
        dispatch(setRColleaguesPageIndex(0));
        dispatch(setRAnalysisColleagues([]));
        dispatch(setRColleaguesLoading(true));
        dispatch(setRColleaguesCount(0));
        dispatch(setRColleaguesCountPage(0));
        dispatch(setRColleaguesPageCountLength(0));
        dispatch(setRColleaguesDataBlob({}));
        dispatch(setRColleaguesSectionIDs([]));
        dispatch(setRColleaguesRowIDs([]));
    }
}

// 获取同事数据
export function getColleaguesList (callbackFun) {
    return (dispatch, getState) => {
        const userInfo = getState().common.userInfo;
        fetch(userInfo.managerServer + '/departmentmembers', {
            method: 'POST',
            mode: 'cors',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: dealBodyFormat({
                id : userInfo.topId,
                companyId : userInfo.companyId,
                start: getState().home.colleaguesPageIndex + 1,
                number: 200
            })
        }).then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                Toast.info(JSON.stringify(res), 1);
            }
        }).then(function(data) {
            if (data.status) {
                let list = data.data.data;
                // 在跟原来的数据合并
                let concatList = getState().home.analysisColleagues.concat(list);
                dispatch(setRAnalysisColleagues(concatList));
                // 设置当前页数据总数等状态
                dispatch(setRColleaguesCount(data.data.count));
                dispatch(setRColleaguesCountPage(data.data.countPage));
                dispatch(setRColleaguesPageCountLength(list.length));

                callbackFun();
                endRefresh();
            } else {
                Toast.info(JSON.stringify(data), 1);
                endRefresh();
            }
        });
    }
}

// 设置当前页数
export function setColleaguesPageIndex(value) {
    return (dispatch, getState) => {
        dispatch(setRColleaguesPageIndex(value));
    }
}

// 设置当前是否是加载状态
export function setColleaguesLoading(value) {
    return (dispatch, getState) => {
        dispatch(setRColleaguesLoading(value));
    }
}






// 存储同事各项数据到reducers中，方便再次渲染时读取
export function setColleaguesDataBlob(value) {
    return (dispatch, getState) => {
        dispatch(setRColleaguesDataBlob(value));
    }
}
export function setColleaguesSectionIDs(value) {
    return (dispatch, getState) => {
        dispatch(setRColleaguesSectionIDs(value));
    }
}
export function setColleaguesRowIDs(value) {
    return (dispatch, getState) => {
        dispatch(setRColleaguesRowIDs(value));
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















