


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_USER_INFO
} from '../actions/CommonActions';



export default combineReducers({
    userInfo: createReducer({}, {
        [SET_USER_INFO](state, {data}){
            return data;
        }
    }),
});
