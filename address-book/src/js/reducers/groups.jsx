


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_IS_REFRESH,
    SET_GROUPS_LIST
} from '../actions/GroupsActions';



export default combineReducers({
    // 刷新状态（请求中or完成）
    isRefresh: createReducer(false, {
        [SET_IS_REFRESH](state, {data}){
            return data;
        }
    }),
    groupsList: createReducer([], {
        [SET_GROUPS_LIST](state, {data}){
            return data;
        }
    }),

});
