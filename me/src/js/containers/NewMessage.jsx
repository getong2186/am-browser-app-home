// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as NewMessageActions from 'app/actions/NewMessageActions';

// 第三方组件和自己封装组件
import ReturnBar from '../components/ReturnBar/ReturnBar';
import Switch from 'rc-switch';
import { Toast } from 'antd-mobile';

// 样式
import '../../styles/switch.scss';
import '../../styles/newMessage/newMessage.scss';


class NewMessage extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            checked: true
        };
    }

    // 自动升级切换事件
    switchChangeHandler = (value) => {
        console.info(value);
        this.setState({
            checked: value
        });
    }


    render() {
        const { state, actions } = this.props;
        return (
            <div className='new_message_page'>
                <div className='title_pack'>
                    <ReturnBar returnUrl='settings' title='消息提醒设置' bgColor={state.common.personalInfo.themeColor} />
                </div>
                <div className="settings_pack">
                    <div className="settings_item">
                        <div className="left_pack">
                            <span>接受新消息通知</span>
                        </div>
                        <div className="right_pack">
                            <Switch
                                onChange={this.switchChangeHandler.bind(this)}
                                checked={this.state.checked}
                            />
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
    actions: bindActionCreators(NewMessageActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewMessage);







