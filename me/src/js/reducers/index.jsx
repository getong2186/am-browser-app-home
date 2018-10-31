import { combineReducers } from 'redux';

import common from './common';
import home from './home';
import settings from './settings';
import passKeeperDetails from './passKeeperDetails';
import changePassword from './changePassword';
import about from './about';


const rootReducer = combineReducers({
    common,
    home,
    settings,
    passKeeperDetails,
    changePassword,
    //about
});

export default rootReducer;
