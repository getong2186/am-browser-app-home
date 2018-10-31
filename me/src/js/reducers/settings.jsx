


import {combineReducers} from 'redux';
import {createReducer} from '../utils/Creator';

import {
    // 页面所使用的数据
    SET_AUTO_UPDATE,
} from '../actions/SettingsActions';



export default combineReducers({
    // 自动更新
    autoUpdate: createReducer(false, {
        [SET_AUTO_UPDATE](state, {data}){
            return data;
        }
    }),

});
