


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_OPENED_MEMBERS,
    SET_CHECKED
} from '../actions/DetailsActions';




export default combineReducers({
    // 当前打开的人数据
    openedMembers: createReducer({}, {
        [SET_OPENED_MEMBERS](state, {data}){
            return data;
        }
    }),
    checked: createReducer(false, {
        [SET_CHECKED](state, {data}){
            return data;
        }
    })
});
