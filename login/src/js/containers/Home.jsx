// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as HomeActions from 'app/actions/HomeActions';

// 第三方组件和自己封装组件
import { List, InputItem, Button, Toast } from 'antd-mobile';

// 样式
import '../../styles/home/home.scss';


class Home extends React.Component {

    constructor (props) {
        super(props);
    }

    // componentWillMount () {
    //     this.props.actions.initUserName();
    // }

    handleImageErrored() {
        this.props.actions.setLogoUrl();
    }

    // 输入用户名
    userNameChangeHandle = (value) => {
        this.props.actions.setUserName(value);
    }

    //输入密码
    passwordChangeHandle = (value) => {
        this.props.actions.setPassword(value);
    }

    // 登录
    login = () => {
        this.props.actions.login();
    }

    // 忘记密码
    goForgotUsername = () => {
        hashHistory.push({
            pathname: '/forgotUserName',
            query: {}
        });
    }

    // 返回上一级
    returnPrev = () => {
        this.props.actions.returnPrev();
    }

    render() {
        const { state, actions } = this.props;
        return (
            <div className='home_page' style={{
                background: `url(${require('../../images/login-enterprise-bg.png')})`
            }}>
                <div className='login_pack'>
                    <div className='logo_pack'>
                        <img className="icon_img"
                             onError={this.handleImageErrored.bind(this)}
                             src={
                                state.common.companyInfo.logoUrl && state.common.companyInfo.logoUrl != null && state.common.companyInfo.logoUrl != ''
                                ?
                                state.common.companyInfo.logoUrl
                                :
                                require('../../images/login-logo.png')
                        }></img>
                    </div>
                    <div className='form_pack'>
                        <List>
                            <InputItem
                                clear
                                value={state.home.userName}
                                placeholder={
                                    state.common.companyInfo.accountPlaceHolder && state.common.companyInfo.accountPlaceHolder != ''
                                        ?
                                        state.common.companyInfo.accountPlaceHolder
                                        :
                                        '请输入用户名'
                                }
                                onChange={this.userNameChangeHandle}
                            ></InputItem>
                            <InputItem
                                clear
                                value={state.home.password}
                                type="password"
                                placeholder="请输入密码"
                                onChange={this.passwordChangeHandle}
                            ></InputItem>
                        </List>

                        <Button className='btn'
                                disabled={state.home.btnDisabled}
                                style={{
                                    'margin': '0.5rem 0.3rem',
                                    'border': state.home.btnDisabled ? '1px solid #ddd' : '0px',
                                    'color': state.home.btnDisabled ? '#cdcdcf' : '#fff',
                                    'background': state.home.btnDisabled ? '#fbfbfd' : state.common.companyInfo.themeColor
                                }}
                                onClick={this.login}>
                            登录
                        </Button>
                    </div>
                    <div className='forgot_password_pack'>
                        <span className="footer_return" style={{color: state.common.companyInfo.themeColor}} onClick={this.returnPrev}>返回上一级</span>
                        <span style={{color: state.common.companyInfo.themeColor}} onClick={this.goForgotUsername}>忘记密码</span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    state: state
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(HomeActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);







