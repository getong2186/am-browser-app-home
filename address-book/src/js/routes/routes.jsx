import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'

import Common from '../containers/Common';
import Home from '../containers/Home';
import Search from '../containers/Search';
import Groups from '../containers/Groups';
import Department from '../containers/Department';
import Details from '../containers/Details';




export default (
    <Router>
        <Route path="/" component={Common}>
            <IndexRoute component={Home} />
            <Route path="search" component={Search}></Route>
            <Route path="groups" component={Groups}></Route>
            <Route path="department" component={Department}></Route>
            <Route path="details" component={Details}></Route>
        </Route>
    </Router>
);