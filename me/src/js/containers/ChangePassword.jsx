// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as ChangePasswordActions from 'app/actions/ChangePasswordActions';

// 第三方组件和自己封装组件
import { List, InputItem, Button, Toast, Modal } from 'antd-mobile';
import ReturnBar from '../components/ReturnBar/ReturnBar';


// 样式
import '../../styles/changePassword/changePassword.scss';


const alert = Modal.alert;


class ChangePassword extends React.Component {

    constructor (props) {
        super(props);
    }

    passwordChangeHandle = (value) => {
        this.props.actions.setPassword(value);
    }

    confirmPasswordChangeHandle = (value) => {
        this.props.actions.setConfirmPassword(value);
    }

    btnHandle = (e) => {
        let password = this.props.state.changePassword.password;
        let confirmPassword = this.props.state.changePassword.confirmPassword;
        if (password !== confirmPassword) {
            Toast.info('密码不一致', 1);
        } else {
            // 保存到客户端
            this.props.actions.saveContent((response) => {
                if (response.state) {
                    Toast.info('修改成功', 1);
                    hashHistory.push({
                        pathname: 'settings',
                        query: {}
                    });
                } else {
                    alert('提示', response.msg, [
                        { text: '取消', onPress: () => console.log('cancel') },
                        { text: '确认', onPress: () => console.log('ok') },
                    ])
                }

            });
        }
    }


    render() {
        const { state, actions } = this.props;
        return (
            <div className='change_password_page'>
                <div className='title_pack'>
                    <ReturnBar returnUrl='settings' title='修改密码' bgColor={state.common.personalInfo.themeColor} />
                </div>
                <div className="form_pack">
                    <List>
                        <InputItem
                            clear
                            value={state.changePassword.password}
                            type="password"
                            placeholder="6-16位英文字母, 数字组合"
                            onChange={this.passwordChangeHandle}
                        >密码</InputItem>
                        <InputItem
                            clear
                            value={state.changePassword.confirmPassword}
                            type="password"
                            placeholder="6-16位英文字母, 数字组合"
                            onChange={this.confirmPasswordChangeHandle}
                        >确认密码</InputItem>
                    </List>

                    <Button className="btn"
                            disabled={state.changePassword.btnDisabled}
                            onClick={this.btnHandle}
                            style={{
                                'margin': '0.5rem 0.3rem',
                                'color': '#fff',
                            }}>
                        确定
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
    actions: bindActionCreators(ChangePasswordActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePassword);







