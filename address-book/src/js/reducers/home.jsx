


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_COMMON_IS_REFRESH,
    SET_COLLEAGUES_IS_REFRESH,

    SET_PAGE_LOADED,
    SET_ACTIVE_TAB,
    SET_SCROLL_TOP,

    SET_COMMON_DATA_SOURCE,
    SET_ORIGINAL_COMMON,
    SET_ANALYSIS_COMMON,

    SET_COLLEAGUES_PAGE_INDEX,
    SET_ANALYSIS_COLLEAGUES,
    SET_COLLEAGUES_LOADING,
    SET_COLLEAGUES_COUNT,
    SET_COLLEAGUES_COUNT_PAGE,
    SET_COLLEAGUES_PAGE_COUNT_LENGTH,

    SET_COLLEAGUES_DATA_BLOB,
    SET_COLLEAGUES_SECTION_IDS,
    SET_COLLEAGUES_ROW_IDS,
} from '../actions/HomeActions';




export default combineReducers({
    // 常用列表是否在刷新状态
    commonIsRefresh: createReducer(false, {
        [SET_COMMON_IS_REFRESH](state, {data}){
            return data;
        }
    }),
    // 同事列表是否在刷新状态
    colleaguesIsRefresh: createReducer(false, {
        [SET_COLLEAGUES_IS_REFRESH](state, {data}){
            return data;
        }
    }),
    // 页面是否已经渲染过
    pageLoaded: createReducer(false, {
        [SET_PAGE_LOADED](state, {data}){
            return data;
        }
    }),
    // 当前tab
    activeTab: createReducer(0, {
        [SET_ACTIVE_TAB](state, {data}){
            return data;
        }
    }),
    // 滚动条位置
    scrollTop: createReducer({'common': 0, 'colleagues': 0}, {
        [SET_SCROLL_TOP](state, {data}){
            return data;
        }
    }),


    // 常用联系人后台返回的原始数据
    originalCommonList: createReducer([], {
        [SET_ORIGINAL_COMMON](state, {data}){
            return data;
        }
    }),
    // 常用联系人解析过的数据
    analysisCommonList: createReducer({}, {
        [SET_ANALYSIS_COMMON](state, {data}){
            return data;
        }
    }),
    // 常用联系人组件配置参数
    commonDataSource: createReducer('', {
        [SET_COMMON_DATA_SOURCE](state, {data}){
            return data;
        }
    }),


    // 同事列表当前页数
    colleaguesPageIndex: createReducer(0, {
        [SET_COLLEAGUES_PAGE_INDEX](state, {data}){
            return data;
        }
    }),
    // 同事列表解析后的数据
    analysisColleagues: createReducer([], {
        [SET_ANALYSIS_COLLEAGUES](state, {data}){
            return data;
        }
    }),
    // 同事数据是否正在加载
    colleaguesLoading: createReducer(true, {
        [SET_COLLEAGUES_LOADING](state, {data}){
            return data;
        }
    }),
    // 同事页面总个数
    colleaguesCount: createReducer(0, {
        [SET_COLLEAGUES_COUNT](state, {data}){
            return data;
        }
    }),
    // 同事页面总页数
    colleaguesCountPage: createReducer(0, {
        [SET_COLLEAGUES_COUNT_PAGE](state, {data}){
            return data;
        }
    }),
    // 同事页面这一页多少条数据
    colleaguesPageCountLength: createReducer(0, {
        [SET_COLLEAGUES_PAGE_COUNT_LENGTH](state, {data}){
            return data;
        }
    }),

    // 同事组件需要存储的配置参数
    colleaguesDataBlob: createReducer({}, {
        [SET_COLLEAGUES_DATA_BLOB](state, {data}){
            return data;
        }
    }),
    colleaguesSectionIDs: createReducer([], {
        [SET_COLLEAGUES_SECTION_IDS](state, {data}){
            return data;
        }
    }),
    colleaguesRowIDs: createReducer([], {
        [SET_COLLEAGUES_ROW_IDS](state, {data}){
            return data;
        }
    }),
});
