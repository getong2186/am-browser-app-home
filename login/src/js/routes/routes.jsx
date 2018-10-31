import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'

import Common from '../containers/Common';
import Home from '../containers/Home';
import ForgotUserName from '../containers/ForgotUserName';
import ForgotCheckCode from '../containers/ForgotCheckCode';
import ForgotSetPassword from '../containers/ForgotSetPassword';


export default (
    <Router>
        <Route path="/" component={Common}>
            <IndexRoute component={Home} />
            <Route path="forgotUserName" component={ForgotUserName}></Route>
            <Route path="forgotCheckCode" component={ForgotCheckCode}></Route>
            <Route path="forgotSetPassword" component={ForgotSetPassword}></Route>
        </Route>
    </Router>
);