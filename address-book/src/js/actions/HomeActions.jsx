import { ListView, Toast } from 'antd-mobile';
import 'whatwg-fetch';  // ����safari��fetch

import { createAction } from '../utils/Creator';
import { dealBodyFormat } from '../utils/BodyFormat';


/**
 * action�¼�
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
 * ��װ���reducers�ɷ���
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
 * ��containers���õ�actionҵ���
 */


// ���� ���� ����������
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


// ���ó����б��Ƿ���ˢ��״̬
export function setCommonIsRefresh(value) {
    return (dispatch, getState) => {
        dispatch(setRCommonIsRefresh(value));
    }
}

// ����ͬ���б��Ƿ��Ǽ���״̬
export function setColleaguesIsRefresh(value) {
    return (dispatch, getState) => {
        dispatch(setRColleaguesIsRefresh(value));
    }
}

// ����ҳ���Ƿ���Ⱦ��
export function setPageLoaded(value) {
    return (dispatch, getState) => {
        dispatch(setRPageLoaded(value));
    }
}

// ���ó�ʼtab
export function setActiveTab(value) {
    return (dispatch, getState) => {
        dispatch(setRActiveTab(value));
    }
}

// ���ù�����λ��
export function setScrollTop(value) {
    return (dispatch, getState) => {
        dispatch(setRScrollTop(value));
    }
}

/**
 * �����б������߼�
 */

// ��ȡ��������
export function getCommonUseList (callbackFun) {
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
                departmentId : userInfo.departmentId,
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
            if (data.errCode == '0') {
                dispatch(setRCommonDataSource(''));
                // ����ԭʼ���ݣ���������������itemʱ��ȡ��������
                let list = data.data.data;
                let concatList = getState().home.originalCommonList.concat(list);
                dispatch(setROriginalCommon(concatList));

                // ����������չʾ����
                let analysisCommonData = analysisCommon(getState().home.originalCommonList);
                dispatch(setRAnalysisCommon(analysisCommonData));
                
                dispatch(setRColleaguesCount(data.data.count));
                dispatch(setRColleaguesCountPage(data.data.countPage));
                dispatch(setRColleaguesPageCountLength(data.data.data.length));
                // ����index����������
                commonDataBlob = analysisCommonData.dataBlob;
                commonSectionIDs = analysisCommonData.sectionIDs;
                commonRowIDs = analysisCommonData.rowIDs;
                dispatch(setRCommonDataSource(
                    commonDataSource.cloneWithRowsAndSections(commonDataBlob, commonSectionIDs, commonRowIDs)
                ));

                callbackFun();
                endRefresh();
            } else {
                Toast.info(JSON.stringify(data), 1);
                endRefresh();
            }
        });
    }
}


// ����̨���صĳ������ݽ���Ϊcontainers�п�ʹ�õ����ݸ�ʽ
export function analysisCommon (data) {
    let allSectionID = [];
    let allDataBlob = {};
    let allRowIDs = [];

    // ��ȡ��ĸ�������������������ĸ
    for (let i=0, len=data.length; i<len; i++) {
        let id = pinyinUtil.getFirstLetter(data[i].name, true)[0][0];
        // ������ĸ��ȫ�����ɵ�#����ȥ
        !/^[A-Za-z]+$/.test(id) ? id = '#' : id;
        allSectionID.push(id);
        data[i].pSectionID = id;
        allDataBlob[data[i].uuid] = data[i].name;
    }

    // ��ĸȥ��
    var n = []; //һ���µ���ʱ����
    for (let i=0, len=allSectionID.length; i<len; i++) {
        if (n.indexOf(allSectionID[i]) == -1) {
            n.push(allSectionID[i]);
        }
    }
    allSectionID = n.sort();

    // ����ĸ��ӵ�����������
    for (let i=0, len=allSectionID.length; i<len; i++) {
        allDataBlob[allSectionID[i]] = allSectionID[i];
    }

    // ������ĸ�б���֯ÿ����ĸ��ӳ������
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
 * ͬ���б������߼�
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

// ��ȡͬ������
export function getColleaguesList (callbackFun) {
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
                id : userInfo.topId,
                companyId : userInfo.companyId,
                start: getState().home.colleaguesPageIndex + 1,
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
                // �ڸ�ԭ�������ݺϲ�
                let concatList = getState().home.analysisColleagues.concat(list);
                dispatch(setRAnalysisColleagues(concatList));
                // ���õ�ǰҳ����������״̬
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

// ���õ�ǰҳ��
export function setColleaguesPageIndex(value) {
    return (dispatch, getState) => {
        dispatch(setRColleaguesPageIndex(value));
    }
}

// ���õ�ǰ�Ƿ��Ǽ���״̬
export function setColleaguesLoading(value) {
    return (dispatch, getState) => {
        dispatch(setRColleaguesLoading(value));
    }
}






// �洢ͬ�¸������ݵ�reducers�У������ٴ���Ⱦʱ��ȡ
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


// ����֪ͨ�ͻ��˴�ҳ���費��Ҫ����ˢ��
export function settingRefresh(value) {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            if (window.redcore.setCanDropDownRefresh) {
                window.redcore.setCanDropDownRefresh(value);
            }
        } else {
            console.info('���ô�ҳ������ˢ��');
        }
    }
}

// ֪ͨ�ͻ�������ˢ�½���
export function endRefresh() {
    if (process.env.NODE_ENV != 'development') {
        if (window.redcore.clientStopRefresh) {
            window.redcore.clientStopRefresh();
        }
    } else {
        console.info('�ͻ���ֹͣ����ˢ��');
    }
}

// ֪ͨ�ͻ��˽ӹ�����ˢ�¶���
export function receptionRefresh() {
    return (dispatch, getState) => {
        if (process.env.NODE_ENV != 'development') {
            if (window.redcore.clientReceptionRefresh) {
                window.redcore.clientReceptionRefresh();
            }
        } else {
            console.info('�ͻ��˽ӹ�������������ʼ����ˢ��');
        }
    }
}















