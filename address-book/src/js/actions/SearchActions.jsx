import { ListView, Toast } from 'antd-mobile';
import 'whatwg-fetch';  // 兼容safari的fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action事件
 */
export const SET_SCROLL_TOP = 'SEARCH/SET_SCROLL_TOP';
export const SET_KEYWORD = 'SEARCH/SET_KEYWORD';
export const SET_IS_REQUEST = 'SEARCH/SET_IS_REQUEST';
export const SET_ORIGINAL_SEARCH = 'SEARCH/SET_ORIGINAL_SEARCH';
export const SET_ANALYSIS_SEARCH = 'SEARCH/SET_ANALYSIS_SEARCH';
export const SET_SEARCH_DATA_SOURCE = 'SEARCH/SET_SEARCH_DATA_SOURCE';


/**
 * 封装后的reducers派发器
 */
const setRScrollTop = createAction(SET_SCROLL_TOP, 'data');
const setRKeyword = createAction(SET_KEYWORD, 'data');
const setRIsRequest = createAction(SET_IS_REQUEST, 'data');
const setROriginalSearch = createAction(SET_ORIGINAL_SEARCH, 'data');
const setRAnalysisSearch = createAction(SET_ANALYSIS_SEARCH, 'data');
const setRSearchDataSource = createAction(SET_SEARCH_DATA_SOURCE, 'data');


/**
 * 供containers调用的action业务层
 */

// 保存 搜索 组件所需对象
const searchGetSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
const searchGetRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
const searchDataSource = new ListView.DataSource({
    getRowData: searchGetRowData,
    getSectionHeaderData: searchGetSectionData,
    rowHasChanged: (row1, row2) => row1 !== row2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});
let searchDataBlob = {};
let searchSectionIDs = [];
let searchRowIDs = [];




// 设置滚动条位置
export function setScrollTop(value) {
    return (dispatch, getState) => {
        dispatch(setRScrollTop(value));
    }
}

// 设置关键字
export function setKeyword (keyword) {
    return (dispatch, getState) => {
        dispatch(setRKeyword(keyword));
    }
}

// 设置原始数据
export function setOriginalSearch (value) {
    return (dispatch, getState) => {
        dispatch(setROriginalSearch(value));
    }
}

// 设置解析数据
export function setAnalysisSearch (value) {
    return (dispatch, getState) => {
        dispatch(setRAnalysisSearch(value));
    }
}

// 设置组件对象
export function setSearchDataSource (value) {
    return (dispatch, getState) => {
        dispatch(setRSearchDataSource(value));
    }
}

// 获取搜索的数据
export function getSearchUseList () {
    return (dispatch, getState) => {
        if (getState().search.keyword != '') {
            // 更改请求状态
            dispatch(setRIsRequest(true));
            const userInfo = getState().common.userInfo;
            fetch(userInfo.managerServer + '/plugin/im/v1/all', {
                method: 'POST',
                mode: 'cors',
                //credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'access-token': sessionStorage.getItem('ac') || userInfo.accessToken
                },
                body: dealBodyFormat({
                    keyword: getState().search.keyword.toUpperCase(),
                    companyId : userInfo.companyId
                })
            }).then(function(res) {
                // 更改请求状态
                dispatch(setRIsRequest(false));
                if (res.ok) {
                    return res.json();
                } else {
                    Toast.info(JSON.stringify(res), 1);
                }
            }).then(function(data) {
                if (data.errCode == '0') {
                    if (Object.prototype.toString.call(data.data)!='[object Array]') {
                        // 保存原始数据，供索引或点击单个item时获取完整数据
                        dispatch(setROriginalSearch(data.data.members));

                        // 保存解析后的展示数据
                        let analysisSearchData = analysisSearch(getState().search.originalSearchList);
                        dispatch(setRAnalysisSearch(analysisSearchData));

                        // 保存index组件所需对象
                        searchDataBlob = analysisSearchData.dataBlob;
                        searchSectionIDs = analysisSearchData.sectionIDs;
                        searchRowIDs = analysisSearchData.rowIDs;
                        dispatch(setRSearchDataSource(
                            searchDataSource.cloneWithRowsAndSections(searchDataBlob, searchSectionIDs, searchRowIDs)
                        ));
                    } else {
                        Toast.info('未搜索到关键字 ' + getState().search.keyword + ' 相关的联系人', 2);
                    }
                } else {
                    Toast.info(JSON.stringify(data), 1);
                }
            });
        } else {
            dispatch(setRSearchDataSource(''));
        }
    }
}


// 将后台返回的搜索数据解析为containers中可使用的数据格式
export function analysisSearch (data) {
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