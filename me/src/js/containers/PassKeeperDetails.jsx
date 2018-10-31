// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as PassKeeperDetailsActions from 'app/actions/PassKeeperDetailsActions';

// 第三方组件和自己封装组件
import { List, InputItem, Button, Toast } from 'antd-mobile';
import ReturnBar from '../components/ReturnBar/ReturnBar';


// 样式
import '../../styles/passKeeper/passKeeperDetails.scss';


class PassKeeperDetails extends React.Component {

    constructor (props) {
        super(props);
    }

    componentWillMount () {
        this.props.actions.initDetails(this.props.location.query);
    }

    userNameChangeHandle = (value) => {
        this.props.actions.setUserName(value);
    }

    passwordChangeHandle = (value) => {
        this.props.actions.setPassword(value);
    }

    confirmPasswordChangeHandle = (value) => {
        this.props.actions.setConfirmPassword(value);
    }

    btnHandle = (e) => {
        let password = this.props.state.passKeeperDetails.password;
        let confirmPassword = this.props.state.passKeeperDetails.confirmPassword;
        if (password !== confirmPassword) {
            Toast.info('密码不一致', 1);
        } else {
            // 保存到客户端
            this.props.actions.saveContent(() => {
                Toast.info('设置完成', 1);
                hashHistory.push({
                    pathname: 'settings/passKeeper',
                    query: {}
                });
            });
        }
    }


    render() {
        const { state, actions } = this.props;
        return (
            <div className='pass_keeper_details_page'>
                <div className='title_pack'>
                    <ReturnBar returnUrl='settings/passKeeper' title='云适配OA' bgColor={state.common.personalInfo.themeColor} />
                </div>
                <div className="tip_pack">
                    <img className="icon_img" src={require('../../images/singel-alerm.png')}></img>
                    <span>配置后若单点登录无效, 请重新配置</span>
                </div>
                <div className="form_pack">
                    <List>
                        <InputItem
                            clear
                            value={state.passKeeperDetails.userName}
                            placeholder="请输入用户名"
                            onChange={this.userNameChangeHandle}
                        >用户名</InputItem>
                        <InputItem
                            clear
                            value={state.passKeeperDetails.password}
                            type="password"
                            placeholder="请输入密码"
                            onChange={this.passwordChangeHandle}
                        >密码</InputItem>
                        <InputItem
                            clear
                            value={state.passKeeperDetails.confirmPassword}
                            type="password"
                            placeholder="请再次输入密码"
                            onChange={this.confirmPasswordChangeHandle}
                        >确认密码</InputItem>
                    </List>

                    <Button className="btn"
                            disabled={state.passKeeperDetails.btnDisabled}
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
    actions: bindActionCreators(PassKeeperDetailsActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PassKeeperDetails);







