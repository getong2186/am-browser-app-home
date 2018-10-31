// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as ForgotCheckCodeActions from 'app/actions/ForgotCheckCodeActions';

// 第三方组件和自己封装组件
import ReturnBar from '../components/ReturnBar/ReturnBar';
import { List, InputItem, Button } from 'antd-mobile';


// 样式
import '../../styles/forgotCheckCode/forgotCheckCode.scss';

let interval = '';
class ForgotCheckCode extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            count: 80,
            sendState: false
        };
    }

    userNameChangeHandle = (value) => {
        this.props.actions.setUserName(value);
    }

    checkCodeChangeHandle = (value) => {
        this.props.actions.setCheckCode(value);
    }

    getCheckCode = () => {
        this.setState({
            sendState: true
        });       
        interval = setInterval(() => {            
            this.setState({
                count: this.state.count-1
            });             
           
            if (this.state.count === 0) {
                this.setState({
                    count: 80,
                    sendState: false
                });
                clearInterval(interval);
            }
        }, 1000);
        //this.props.actions.getCode();

    }

    goForgotSetPassword = () => {
        // 验证验证码 
        this.props.actions.clientCheckCode(() => {
            clearInterval(interval);
            hashHistory.push({
                pathname: '/forgotSetPassword',
                query: {}
            });
        });

        
    }

    render() {
        const { state, actions } = this.props;
        return (
            <div className='forgotCheckCode_page'>
                <div className='title_pack'>
                    <ReturnBar returnUrl='/forgotUserName' title='输入验证码' bgColor={state.common.companyInfo.themeColor} />
                </div>
                <div className="forgotPassword_process">
                    <span style={{color: state.common.companyInfo.themeColor}}>输入用户名&nbsp;>&nbsp;</span>
                    <span style={{color: state.common.companyInfo.themeColor}}>输入验证码&nbsp;>&nbsp;</span>
                    <span>设置新密码</span>
                </div>
                <div className='form_pack'>
                    <List>
                        <div className="forgotPassword_userName_div">
                            <InputItem
                                clear
                                value={state.forgotUserName.userName}
                                placeholder="请输入手机/邮箱"
                                onChange={this.userNameChangeHandle}
                            ></InputItem>
                            <Button 
                                className="btn" 
                                type="primary" 
                                style={{
                                    background: this.state.sendState? '#f5f5f5' : state.common.companyInfo.themeColor,
                                    color: this.state.sendState? '#333' : '#fff'
                                }}
                                onClick={this.getCheckCode}
                                disabled={this.state.sendState}
                            >{this.state.sendState? this.state.count + 's后重新获取' : '获取验证码'}</Button>
                        </div>
                        

                        <InputItem
                            clear
                            value={state.forgotCheckCode.code}
                            placeholder="请输入验证码"
                            onChange={this.checkCodeChangeHandle}
                            style={{
                                'marginTop': '2px',
                            }}
                        ></InputItem>

                    </List>

                    <Button className='btn'
                            disabled={state.forgotCheckCode.btnDisabled}
                            style={{
                                'margin': '0.5rem 0.3rem',
                                'border': state.forgotCheckCode.btnDisabled ? '1px solid #ddd' : '0px',
                                'color': state.forgotCheckCode.btnDisabled ? '#cdcdcf' : '#fff',
                                'background': state.forgotCheckCode.btnDisabled ? '#fbfbfd' : state.common.companyInfo.themeColor
                            }}
                            onClick={this.goForgotSetPassword}>
                        下一步
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
    actions: bindActionCreators(ForgotCheckCodeActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotCheckCode);







