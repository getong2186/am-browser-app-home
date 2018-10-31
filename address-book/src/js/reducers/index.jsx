import { combineReducers } from 'redux';

import common from './common';
import home from './home';
import search from './search';
import groups from './groups';
import department from './department';
import details from './details';

const rootReducer = combineReducers({
    common,

    home,
    search,
    groups,
    department,
    details,
});

export default rootReducer;
