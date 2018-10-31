// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as ForgotUserNameActions from 'app/actions/ForgotUserNameActions';

// 第三方组件和自己封装组件
import ReturnBar from '../components/ReturnBar/ReturnBar';
import { List, InputItem, Button } from 'antd-mobile';


// 样式
import '../../styles/forgotUserName/forgotUserName.scss';


class ForgotUserName extends React.Component {

    constructor (props) {
        super(props);
    }

    componentWillMount () {
        this.props.actions.setBtnDisabled();
    }

    userNameChangeHandle = (value) => {
        this.props.actions.setUserName(value);
    }

    // 点击下一步
    goForgotCheckCode = () => {
        // 验证用户名是否可用
        this.props.actions.checkUserName((data) => {
            hashHistory.push({
                pathname: '/forgotCheckCode',
                query: {}
            });
        });        
    }

    render() {
        const { state, actions } = this.props;
        return (
            <div className='forgotUserName_page'>
                <div className='title_pack'>
                    <ReturnBar returnUrl='' title='输入用户名' bgColor={state.common.companyInfo.themeColor} />
                </div>
                <div className="forgotPassword_process">
                    <span style={{color: state.common.companyInfo.themeColor}}>输入用户名&nbsp;>&nbsp;</span>
                    <span>输入验证码&nbsp;>&nbsp;</span>
                    <span>设置新密码</span>
                </div>
                <div className='form_pack'>
                    <List>
                        <InputItem
                            clear
                            value={state.forgotUserName.userName}
                            placeholder="请输入手机/邮箱"
                            onChange={this.userNameChangeHandle}
                        ></InputItem>
                    </List>

                    <Button className='btn'
                            disabled={state.forgotUserName.btnDisabled}
                            style={{
                                'margin': '0.5rem 0.3rem',
                                'border': state.forgotUserName.btnDisabled ? '1px solid #ddd' : '0px',
                                'color': state.forgotUserName.btnDisabled ? '#cdcdcf' : '#fff',
                                'background': state.forgotUserName.btnDisabled ? '#fbfbfd' : state.common.companyInfo.themeColor
                            }}
                            onClick={this.goForgotCheckCode}>
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
    actions: bindActionCreators(ForgotUserNameActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotUserName);







