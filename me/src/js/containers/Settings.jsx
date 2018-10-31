// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as SettingsActions from 'app/actions/SettingsActions';

// 第三方组件和自己封装组件
import ReturnBar from '../components/ReturnBar/ReturnBar';
import Switch from 'rc-switch';
import { Modal, Toast } from 'antd-mobile';

// 样式
import '../../styles/switch.scss';
import '../../styles/settings/settings.scss';


const alert = Modal.alert;
const prompt = Modal.prompt;


class Settings extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            checked: true
        };
    }

    componentWillMount () {
        this.props.actions.initReducers();
    }

    componentWillUnmount () {
        this.props.actions.tabBarHideOperation(false);
    }

    // 新消息提醒item点击事件
    newMessageTap = () => {
        hashHistory.push({
            pathname: '/settings/newMessage',
            query: {}
        });
    }

    // 密码管家item点击事件
    passKeeperTap = () => {
        this.props.actions.passKeeper();
        // hashHistory.push({
        //     pathname: '/settings/passKeeper',
        //     query: {}
        // });
    }

    // 字体大小item点击事件
    fontSizeTap = () => {
        this.props.actions.fontSize();
        // hashHistory.push({
        //     pathname: '/settings/passKeeper',
        //     query: {}
        // });
    }

    // 清空缓存item点击事件
    cacheTap = () => {
        this.props.actions.cache();
        // alert('提示', '将清空Enterplorer本地缓存数据?', [
        //     { text: '取消', onPress: () => console.log('cancel') },
        //     { text: '确认', onPress: () => console.log('ok') },
        // ])
    }

    // 清空聊天记录item点击事件
    chattingTap = () => {
        this.props.actions.chatting();
        // alert('提示', '将清空所有个人和群的聊天记录?', [
        //     { text: '取消', onPress: () => console.log('cancel') },
        //     { text: '确认', onPress: () => console.log('ok') },
        // ])
    }

    // 修改密码item点击事件
    passwordTap = () => {
        this.props.actions.password();
        // prompt(
        //     '验证原密码',
        //     '为了保障您的数据安全, 修改密码前请先填写原密码',
        //     password => {
        //         hashHistory.push({
        //             pathname: '/settings/changePassword',
        //             query: {}
        //         });
        //         console.log(`password: ${password}`)
        //     },
        //     'secure-text',
        // )
    }

    // 自动升级切换事件
    switchChangeHandler = (value) => {
        this.props.actions.setAutoUpdate(value);
    }


    render() {
        const { state, actions } = this.props;
        return (
            <div className='settings_page'>
                <div className='title_pack'>
                    <ReturnBar returnUrl='' title='设置' bgColor={state.common.personalInfo.themeColor} />
                </div>
                <div className="settings_pack">
                    {/*<div className="settings_item" onClick={this.newMessageTap.bind(this)}>
                        <div className="left_pack">
                            <span>新消息提醒</span>
                        </div>
                        <div className="right_pack">
                            <img className="icon_img" src={require('../../images/next-arrows.png')}></img>
                        </div>
                    </div>*/}
                    <div className="settings_item" onClick={this.passKeeperTap.bind(this)}>
                        <div className="left_pack">
                            <span>密码管家</span>
                        </div>
                        <div className="right_pack">
                            <img className="icon_img" src={require('../../images/next-arrows.png')}></img>
                        </div>
                    </div>
                    <div className="settings_item" onClick={this.fontSizeTap.bind(this)}>
                        <div className="left_pack">
                            <span>字体大小</span>
                        </div>
                        <div className="right_pack"></div>
                    </div>
                    <div className="settings_item" onClick={this.cacheTap.bind(this)}>
                        <div className="left_pack">
                            <span>清空缓存</span>
                        </div>
                        <div className="right_pack"></div>
                    </div>
                    <div className="settings_item" onClick={this.chattingTap.bind(this)}>
                        <div className="left_pack">
                            <span>清空聊天记录</span>
                        </div>
                        <div className="right_pack"></div>
                    </div>
                    <div className={state.common.personalInfo.platform == 'android' ? 'settings_item' : 'settings_item last_settings_item'} onClick={this.passwordTap.bind(this)}>
                        <div className="left_pack">
                            <span>修改密码</span>
                        </div>
                        <div className="right_pack"></div>
                    </div>
                    {state.common.personalInfo.platform == 'android' ?
                        <div className="settings_item last_settings_item">
                            <div className="left_pack">
                                <span>自动升级</span>
                            </div>
                            <div className="right_pack">
                                <Switch
                                    onChange={this.switchChangeHandler.bind(this)}
                                    checked={state.settings.autoUpdate}
                                />
                            </div>
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    state: state
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(SettingsActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);







