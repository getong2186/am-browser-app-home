// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// 逻辑和redux业务功能
import * as CommonActions from 'app/actions/CommonActions';



class Common extends React.Component {


    componentWillMount () {
        this.props.actions.getLoginInfo();
    }

    render () {
        return (
            <div className="common_page" key={this.props.location.pathname} >
                { JSON.stringify(this.props.state.common.loginInfo) != '{}' && this.props.children }
            </div>
        )
    }
}


const mapStateToProps = state => ({
    state: state
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(CommonActions, dispatch)
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Common);





