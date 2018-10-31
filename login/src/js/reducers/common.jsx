


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_COMPANY_INFO
} from '../actions/CommonActions';



export default combineReducers({
    companyInfo: createReducer({}, {
        [SET_COMPANY_INFO](state, {data}){
            return data;
        }
    }),

});
