// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as PassKeeperActions from 'app/actions/PassKeeperActions';

// 第三方组件和自己封装组件
import ReturnBar from '../components/ReturnBar/ReturnBar';

// 样式
import '../../styles/passKeeper/passKeeper.scss';


class PassKeeper extends React.Component {

    constructor (props) {
        super(props);

    }

    // 详情item点击事件
    passKeeperDetailsTap = () => {
        hashHistory.push({
            pathname: 'settings/passKeeper/2',
            query: {
                'userName': 'zhangsan',
                'password': '123456',
                'confirmPassword': '123456'
            }
        });
    }



    render() {
        const { state, actions } = this.props;
        return (
            <div className='pass_keeper_page'>
                <div className='title_pack'>
                    <ReturnBar returnUrl='settings' title='密码管家设置' bgColor={state.common.personalInfo.themeColor} />
                </div>
                <div className="tip_pack">
                    <img className="icon_img" src={require('../../images/singel-alerm.png')}></img>
                    <span>密码有改动请及时修改配置, 以确保该功能可用</span>
                </div>
                <div className="settings_pack">
                    <div className="settings_item" onClick={this.passKeeperDetailsTap.bind(this)}>
                        <div className="left_pack">
                            <img className="icon_img" src={require('../../images/group-icon.png')}></img>
                            <span>云适配OA</span>
                        </div>
                        <div className="right_pack">
                            <img className="icon_img icon" src={require('../../images/protect.png')}></img>
                            <span>已配置</span>
                            <img className="icon_img arrows" src={require('../../images/next-arrows.png')}></img>
                        </div>
                    </div>
                    <div className="settings_item">
                        <div className="left_pack">
                            <img className="icon_img" src={require('../../images/group-icon.png')}></img>
                            <span>云适配OA</span>
                        </div>
                        <div className="right_pack">
                            <img className="icon_img icon" src={require('../../images/unprotect.png')}></img>
                            <span>未配置</span>
                            <img className="icon_img arrows" src={require('../../images/next-arrows.png')}></img>
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
    actions: bindActionCreators(PassKeeperActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PassKeeper);







