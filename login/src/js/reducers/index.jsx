import { combineReducers } from 'redux';

import common from './common';
import home from './home';
import forgotUserName from './forgotUserName';
import forgotCheckCode from './forgotCheckCode';
import forgotSetPassword from './forgotSetPassword';


const rootReducer = combineReducers({
    common,
    home,
    forgotUserName,
    forgotCheckCode,
    forgotSetPassword
});

export default rootReducer;
