// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as AboutActions from 'app/actions/AboutActions';

// 第三方组件和自己封装组件
import ReturnBar from '../components/ReturnBar/ReturnBar';
import { Modal, Toast } from 'antd-mobile';

// 样式
import '../../styles/about/about.scss';


const alert = Modal.alert;
const prompt = Modal.prompt;


class About extends React.Component {

    constructor (props) {
        super(props);

        this.counter = 0;
        this.time = '';
    }

    // logo点击事件
    logoTap = () => {
        if(this.counter == 0) {
            this.time = new Date().getSeconds();
        }
        this.counter = this.counter+1;
        if(this.counter == 5) {
            if((new Date().getSeconds() - this.time) > 2) {
                console.info("点击超时");
            } else {
                this.props.actions.setDeveloperIsShow();
                hashHistory.push({
                    pathname: '',
                    query: {}
                });
            }
            this.counter=0;
        }
    }

    // 检查新版本item点击事件
    checkVersionTap = () => {
        this.props.actions.checkVersion();
    }

    // 服务协议item点击事件
    serviceAgreementTap = () => {
        hashHistory.push({
            pathname: 'about/serviceAgreement',
            query: {}
        });
    }

    // 隐私政策item点击事件
    privacyPolicyTap = () => {
        hashHistory.push({
            pathname: 'about/privacyPolicy',
            query: {}
        });
    }


    render() {
        const { state, actions } = this.props;
        return (
            <div className='about_page'>
                <div className='title_pack'>
                    <ReturnBar returnUrl='' title='关于Enterplorer' bgColor={state.common.personalInfo.themeColor} />
                </div>
                <div className="logo_pack">
                    <div onClick={this.logoTap.bind(this)}>
                        <img className="icon_img" src={require('../../images/about-logo.png')}></img>
                    </div>
                    <div>
                        <span>{state.common.personalInfo.appVersion}</span>
                    </div>
                </div>
                <div className="settings_pack">
                    {state.common.personalInfo.platform == 'android' ?
                        <div  className="settings_item" onClick={this.checkVersionTap.bind(this)}>
                            <div className="left_pack">
                                <span>检查新版本</span>
                            </div>
                            <div className="right_pack">
                                <img className="icon_img" src={require('../../images/next-arrows.png')}></img>
                            </div>
                        </div>
                        :
                        ''
                    }
                    <div className="settings_item" onClick={this.serviceAgreementTap.bind(this)}>
                        <div className="left_pack">
                            <span>服务协议</span>
                        </div>
                        <div className="right_pack">
                            <img className="icon_img" src={require('../../images/next-arrows.png')}></img>
                        </div>
                    </div>
                    <div className="settings_item last_settings_item" onClick={this.privacyPolicyTap.bind(this)}>
                        <div className="left_pack">
                            <span>隐私政策</span>
                        </div>
                        <div className="right_pack">
                            <img className="icon_img" src={require('../../images/next-arrows.png')}></img>
                        </div>
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
    actions: bindActionCreators(AboutActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(About);







