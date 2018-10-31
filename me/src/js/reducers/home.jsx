


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_AVATAR
} from '../actions/HomeActions';




export default combineReducers({
    avatar: createReducer('', {
        [SET_AVATAR](state, {data}){
            console.info(data);
            return data;
        }
    }),
});
