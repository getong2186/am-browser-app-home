


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_DEPARTMENT_IS_REFRESH,
    SET_SCROLL_TOP,
    SET_CURRENT_DEPARTMENT,
    SET_DEPARTMENT_LIST,
    SET_DEPARTMENT_PAGE_INDEX,
    SET_ANALYSIS_DEPARTMENT,
    SET_DEPARTMENT_LOADING,
    SET_DEPARTMENT_COUNT,
    SET_DEPARTMENT_COUNT_PAGE,
    SET_DEPARTMENT_PAGE_COUNT_LENGTH,

    SET_DEPARTMENT_DATA_BLOB,
    SET_DEPARTMENT_SECTION_IDS,
    SET_DEPARTMENT_ROW_IDS
} from '../actions/DepartmentActions';

export default combineReducers({
    // 部门列表是否在刷新
    departmentIsRefresh: createReducer(false, {
        [SET_DEPARTMENT_IS_REFRESH](state, {data}){
            return data;
        }
    }),
    // 滚动条位置
    scrollTop: createReducer(0, {
        [SET_SCROLL_TOP](state, {data}){
            return data;
        }
    }),

    // 当前展示的部门
    currentDepartment: createReducer({}, {
        [SET_CURRENT_DEPARTMENT](state, {data}){
            return data;
        }
    }),
    // 全部的部门数据列表（只是用来存储、返回、级别显示）（只保存除了当前展示的部门）
    departmentList: createReducer([], {
        [SET_DEPARTMENT_LIST](state, {data}){
            return data;
        }
    }),

    // 同事列表当前页数
    departmentPageIndex: createReducer(0, {
        [SET_DEPARTMENT_PAGE_INDEX](state, {data}){
            return data;
        }
    }),
    // 同事列表解析后的数据
    analysisDepartment: createReducer([], {
        [SET_ANALYSIS_DEPARTMENT](state, {data}){
            return data;
        }
    }),
    // 同事数据是否正在加载
    departmentLoading: createReducer(true, {
        [SET_DEPARTMENT_LOADING](state, {data}){
            return data;
        }
    }),
    // 同事页面总个数
    departmentCount: createReducer(0, {
        [SET_DEPARTMENT_COUNT](state, {data}){
            return data;
        }
    }),
    // 同事页面总页数
    departmentCountPage: createReducer(0, {
        [SET_DEPARTMENT_COUNT_PAGE](state, {data}){
            return data;
        }
    }),
    // 同事页面这一页多少条数据
    departmentPageCountLength: createReducer(0, {
        [SET_DEPARTMENT_PAGE_COUNT_LENGTH](state, {data}){
            return data;
        }
    }),

    // 同事组件需要存储的配置参数
    departmentDataBlob: createReducer({}, {
        [SET_DEPARTMENT_DATA_BLOB](state, {data}){
            return data;
        }
    }),
    departmentSectionIDs: createReducer([], {
        [SET_DEPARTMENT_SECTION_IDS](state, {data}){
            return data;
        }
    }),
    departmentRowIDs: createReducer([], {
        [SET_DEPARTMENT_ROW_IDS](state, {data}){
            return data;
        }
    }),
});
