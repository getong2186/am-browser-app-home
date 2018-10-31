// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as HomeActions from 'app/actions/HomeActions';

// 第三方组件和自己封装组件
import { Modal, Toast } from 'antd-mobile';
import Title from '../components/Title/Title';

// 样式
import '../../styles/home/home.scss';


const alert = Modal.alert;


class Home extends React.Component {

    constructor (props) {
        super(props);

        // 供客户端传递上传后的头像
        window.updateAvatar = (url) => {
            this.props.actions.setAvatar(url);
        }
    }


    componentWillMount () {
        this.props.actions.initReducers();
    }


    // 头像点击事件
    avatarsTap = () => {
        this.props.actions.userAvatarTapped();
    }

    // 设置item点击事件
    settingsTap = () => {
        //this.props.actions.tabBarHideOperation(true);
        // hashHistory.push({
        //     pathname: '/settings',
        //     query: {}
        // });
        this.props.actions.settings();
    }

    // 开发者模式item点击事件
    developerTap = () => {
        this.props.actions.developer();
    }

    // 关于item点击事件
    aboutTap = () => {
        //this.props.actions.tabBarHideOperation(true);
        hashHistory.push({
            pathname: '/about',
            query: {}
        });
    }

    // 退出item点击事件
    outTap = () => {
        this.props.actions.out();
        // alert('提示', '确定安全退出吗?', [
        //     { text: '取消', onPress: () => console.log('cancel') },
        //     { text: '确认', onPress: () => console.log('ok') },
        // ])
    }

    render() {
        const { state, actions } = this.props;
        return (
            <div className='home_page'>
                <div className='title_pack'>
                    <Title name={state.common.personalInfo.companyTitle} bgColor={state.common.personalInfo.themeColor} />
                </div>
                <div className='info_pack'>
                    <div className="left_pack">
                        <div className='avatars' onClick={this.avatarsTap.bind(this)}>
                            {state.home.avatar != '' ?
                                <img className="avatars_img" src={state.home.avatar}></img>
                                :
                                <span style={{background: "#74BEF2"}}>
                                    {state.common.personalInfo.name.substr(state.common.personalInfo.name.length-1, 1)}
                                </span>
                            }
                            <img className="tip_img" src={require('../../images/photo.png')}></img>
                        </div>
                    </div>
                    <div className="right_pack">
                        <div className="pack">
                            <div className='name'>
                                <span>{state.common.personalInfo.name}</span>
                            </div>
                            <div className="position">
                                <span>{state.common.personalInfo.position}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="settings_pack">
                    <div className="settings_item" onClick={this.settingsTap.bind(this)}>
                        <div className="left_pack">
                            <img className="icon_img" src={require('../../images/settings.png')}></img>
                            <span>设置</span>
                        </div>
                        <div className="right_pack">
                            <img className="icon_img" src={require('../../images/next-arrows.png')}></img>
                        </div>
                    </div>
                    {state.common.personalInfo.developer ?
                        <div className="settings_item" onClick={this.developerTap.bind(this)}>
                            <div className="left_pack">
                                <img className="icon_img" src={require('../../images/developer.png')}></img>
                                <span>开发者模式</span>
                            </div>
                            <div className="right_pack">
                                <img className="icon_img" src={require('../../images/next-arrows.png')}></img>
                            </div>
                        </div>
                        :
                        ''
                    }
                    <div className="settings_item last_settings_item" onClick={this.aboutTap.bind(this)}>
                        <div className="left_pack">
                            <img className="icon_img" src={require('../../images/sigma.png')}></img>
                            <span>关于Enterplorer</span>
                        </div>
                        <div className="right_pack">
                            <span>
                                {state.common.personalInfo.isForTest == 0 ?
                                    '正式版'
                                    :
                                    '测试版'
                                }
                            {state.common.personalInfo.appVersion}</span>
                            <img className="icon_img" src={require('../../images/next-arrows.png')}></img>
                        </div>
                    </div>
                </div>
                <div className="out_pack">
                    <div className="out_item" onClick={this.outTap.bind(this)}>
                        <span style={{color: state.common.personalInfo.themeColor}}>安全退出</span>
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







