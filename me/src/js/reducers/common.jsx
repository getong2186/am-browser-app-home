


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_PERSONAL_INFO
} from '../actions/CommonActions';



export default combineReducers({
    personalInfo: createReducer({}, {
        [SET_PERSONAL_INFO](state, {data}){
            return data;
        }
    }),
});
