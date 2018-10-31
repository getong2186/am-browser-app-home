// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as ForgotSetPasswordActions from 'app/actions/ForgotSetPasswordActions';

// 第三方组件和自己封装组件
import ReturnBar from '../components/ReturnBar/ReturnBar';
import { List, InputItem, Button, Toast } from 'antd-mobile';


// 样式
import '../../styles/forgotSetPassword/forgotSetPassword.scss';


class ForgotSetPassword extends React.Component {

    constructor (props) {
        super(props);
    }

    passwordChangeHandle = (value) => {
        this.props.actions.setPassword(value);
    }

    confirmPasswordChangeHandle = (value) => {
        this.props.actions.setConfirmPassword(value);
    }

    confirmSubmit = () => {
        // 确认提交
        this.props.actions.updatePassword(() => {
            hashHistory.push({
                pathname: '/',
                query: {}
            });
        }); 
    }

    render() {
        const { state, actions } = this.props;
        return (
            <div className='forgotSetPassword_page'>
                <div className='title_pack'>
                    <ReturnBar returnUrl='/forgotCheckCode' title='设置新密码' bgColor={state.common.companyInfo.themeColor} />
                </div>
                <div className="forgotPassword_process">
                    <span style={{color: state.common.companyInfo.themeColor}}>输入用户名&nbsp;>&nbsp;</span>
                    <span style={{color: state.common.companyInfo.themeColor}}>输入验证码&nbsp;>&nbsp;</span>
                    <span style={{color: state.common.companyInfo.themeColor}}>设置新密码</span>
                </div>
                <div className='form_pack'>
                    <List>
                        <div className="forgotPassword_userName_div">                      
                            <InputItem
                                clear
                                value={state.forgotSetPassword.password}
                                type="password"
                                placeholder="新密码（6-16位英文字母，数字组合）"
                                onChange={this.passwordChangeHandle}
                            ></InputItem>
                            <InputItem
                                clear
                                value={state.forgotSetPassword.confirmPassword}
                                type="password"
                                placeholder="确认新密码（6-16位英文字母，数字组合）"
                                onChange={this.confirmPasswordChangeHandle}
                            ></InputItem>
                        </div>
                    </List>

                    <Button className='btn'
                            disabled={state.forgotSetPassword.btnDisabled}
                            style={{
                                'margin': '0.5rem 0.3rem',
                                'border': state.forgotSetPassword.btnDisabled ? '1px solid #ddd' : '0px',
                                'color': state.forgotSetPassword.btnDisabled ? '#cdcdcf' : '#fff',
                                'background': state.forgotSetPassword.btnDisabled ? '#fbfbfd' : state.common.companyInfo.themeColor
                            }}
                            onClick={this.confirmSubmit}>
                        确认提交
                    </Button>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    state: state
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ForgotSetPasswordActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotSetPassword);







