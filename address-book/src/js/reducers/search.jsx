
import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_SCROLL_TOP,
    SET_KEYWORD,
    SET_IS_REQUEST,
    SET_ORIGINAL_SEARCH,
    SET_ANALYSIS_SEARCH,
    SET_SEARCH_DATA_SOURCE,
} from '../actions/SearchActions';




export default combineReducers({
    // 滚动条位置
    scrollTop: createReducer(0, {
        [SET_SCROLL_TOP](state, {data}){
            return data;
        }
    }),
    // 搜索关键字
    keyword: createReducer('', {
        [SET_KEYWORD](state, {data}){
            return data;
        }
    }),
    // 请求状态（请求中or完成）
    isRequest: createReducer(false, {
        [SET_IS_REQUEST](state, {data}){
            return data;
        }
    }),
    // 原始的搜索数据
    originalSearchList: createReducer([], {
        [SET_ORIGINAL_SEARCH](state, {data}){
            return data;
        }
    }),
    // 解析后的搜索数据
    analysisCommonList: createReducer({}, {
        [SET_ANALYSIS_SEARCH](state, {data}){
            return data;
        }
    }),
    // 联系人组件可初始化的数据格式
    searchDataSource: createReducer('', {
        [SET_SEARCH_DATA_SOURCE](state, {data}){
            return data;
        }
    })
});
