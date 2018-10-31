import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'

import Common from '../containers/Common';
import Home from '../containers/Home';

import Settings from '../containers/Settings';
import NewMessage from '../containers/NewMessage';
import PassKeeper from '../containers/PassKeeper';
import PassKeeperDetails from "../containers/PassKeeperDetails";
import ChangePassword from "../containers/ChangePassword";

import About from "../containers/About";
import FunctionIntroduced from "../containers/FunctionIntroduced";
import ServiceAgreement from "../containers/ServiceAgreement";
import PrivacyPolicy from "../containers/PrivacyPolicy";


export default (
    <Router>
        <Route path="/" component={Common}>
            <IndexRoute component={Home} />
            <Route path="settings" component={Settings}></Route>
            <Route path="settings/newMessage" component={NewMessage}></Route>
            <Route path="settings/passKeeper" component={PassKeeper}></Route>
            <Route path="settings/passKeeper/:id" component={PassKeeperDetails}></Route>
            <Route path="settings/changePassword" component={ChangePassword}></Route>
            <Route path="about" component={About}></Route>
            <Route path="about/functionIntroduced" component={FunctionIntroduced}></Route>
            <Route path="about/serviceAgreement" component={ServiceAgreement}></Route>
            <Route path="about/privacyPolicy" component={PrivacyPolicy}></Route>
        </Route>
    </Router>
);