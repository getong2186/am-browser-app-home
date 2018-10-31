// react、redux引用
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


// 样式
import '../../styles/routerAnimations.scss';


class Layout extends React.Component {
    render() {
        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="page"
                transitionAppear={true}
                transitionAppearTimeout={1500}
                transitionEnterTimeout={1500}
                transitionLeaveTimeout={1500}>
                <div key={this.props.location.pathname} >
                    {this.props.children}
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}


export default Layout;



