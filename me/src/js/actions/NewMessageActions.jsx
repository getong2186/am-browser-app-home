
import { ListView } from 'antd-mobile';
import 'whatwg-fetch';  // 兼容safari的fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action事件
 */
export const SET_COMPANY_NAME = 'SET_COMPANY_NAME';
export const SET_DEFAULT_ACTIVE_TAB = 'HOME/SET_DEFAULT_ACTIVE_TAB';
export const SET_COMMON_DATA_SOURCE = 'HOME/SET_COMMON_DATA_SOURCE';
export const SET_ORIGINAL_COMMON = 'HOME/SET_ORIGINAL_COMMON';
export const SET_ANALYSIS_COMMON = 'HOME/SET_ANALYSIS_COMMON';
export const SET_QUICK_SEARCH_INDEX = 'HOME/SET_QUICK_SEARCH_INDEX';
export const SET_ANALYSIS_COLLEAGUS = 'HOME/SET_ANALYSIS_COLLEAGUS';
export const SET_OPENED_DEPARTMENT = 'HOME/SET_OPENED_DEPARTMENT';


/**
 * 封装后的reducers派发器
 */
const setCompanyName = createAction(SET_COMPANY_NAME, 'data');
const setDefaultActiveTab = createAction(SET_DEFAULT_ACTIVE_TAB, 'data');
const setCommonDataSource = createAction(SET_COMMON_DATA_SOURCE, 'data');
const setOriginalCommon = createAction(SET_ORIGINAL_COMMON, 'data');
const setAnalysisCommon = createAction(SET_ANALYSIS_COMMON, 'data');
const setQuickSearchIndex = createAction(SET_QUICK_SEARCH_INDEX, 'data');
const setAnalysisColleagues = createAction(SET_ANALYSIS_COLLEAGUS, 'data');
const setOpenedDepartment = createAction(SET_OPENED_DEPARTMENT, 'data');


/**
 * 供containers调用的action业务层
 */

// 设置初始tab
export function setActiveTab(value) {
    return (dispatch, getState) => {
        dispatch(setDefaultActiveTab(value));
    }
}

// 获取常用数据
export function getCommonUseList () {
    return (dispatch, getState) => {
        const loginInfo = getState().common.loginInfo;
        dispatch(setCompanyName(loginInfo.companyName));
        fetch(loginInfo.managerServer + '/u/colleagues', {
            method: 'POST',
            mode: 'cors',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: dealBodyFormat({
                companyId : loginInfo.companyId,
                uuid : loginInfo.userUuid,
                departmentId : loginInfo.departmentId
            })
        }).then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                console.error(JSON.stringify(res));
            }
        }).then(function(data) {
            if (data.status) {
                // 保存原始数据，供索引或点击单个item时获取完整数据
                dispatch(setOriginalCommon(data.data.members));

                // 保存解析后的展示数据
                let analysisCommonData = analysisCommon(getState().home.originalCommonList);
                dispatch(setAnalysisCommon(analysisCommonData));

                // 保存index组件所需对象
                const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
                const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
                const dataSource = new ListView.DataSource({
                    getRowData,
                    getSectionHeaderData: getSectionData,
                    rowHasChanged: (row1, row2) => row1 !== row2,
                    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
                });
                let dataBlob = getState().home.analysisCommonList.dataBlob;
                let sectionIDs = getState().home.analysisCommonList.sectionIDs;
                let rowIDs = getState().home.analysisCommonList.rowIDs;
                dispatch(setCommonDataSource(dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)));
            } else {
                console.error(JSON.stringify(data));
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

// 获取同事数据
export function getColleaguesList (pageIndex, callbackFun) {
    return (dispatch, getState) => {
        const loginInfo = getState().common.loginInfo;
        fetch(loginInfo.managerServer + '/departmentmembers', {
            method: 'POST',
            mode: 'cors',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: dealBodyFormat({
                id : loginInfo.departmentId,
                companyId : loginInfo.companyId,
                start: pageIndex+1,
                number: 100
            })
        }).then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                console.error(JSON.stringify(res));
            }
        }).then(function(data) {
            if (data.status) {
                let list = data.data.data;
                // 在跟原来的数据合并
                let concatList = getState().home.analysisColleagues.concat(list);
                dispatch(setAnalysisColleagues(concatList));

                callbackFun({
                    totalPageNumber: data.data.countPage,
                    dataNumber: list.length
                });
            } else {
                console.error(JSON.stringify(data));
            }
        });
    }
}


// 设置字母索引
export function setQuickSearch (index) {
    return (dispatch, getState) => {
        // 处理字母为↑的情况
        if (index == undefined) {
            index = '↑';
        }
        dispatch(setQuickSearchIndex(index));
    }
}


// 设置当前打开的部门
export function setDepartment (department, callbackFun) {
    return (dispatch, getState) => {
        const loginInfo = getState().common.loginInfo;
        // 设置父级
        department['pDepartmentId'] = loginInfo.departmentId;
        department['pDepartmentName'] = '全公司';

        dispatch(setOpenedDepartment(department));
        callbackFun();
    }
}
