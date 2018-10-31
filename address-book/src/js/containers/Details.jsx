// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as Contents from 'app/utils/Contents';
import * as DetailsActions from 'app/actions/DetailsActions';

// 第三方组件和自己封装组件
import OrdinaryReturnBar from '../components/OrdinaryReturnBar/OrdinaryReturnBar';
import Switch from 'rc-switch';
import { SingleImgView } from 'react-imageview';


// 样式
import '../../styles/details/details.scss';
import '../../styles/switch.scss';
import 'react-imageview/dist/react-imageview.min.css';


class Details extends React.Component {

    constructor (props) {
        super(props);
    }

    componentWillMount () {
        // 首先通知客户端此页面需不需要下拉刷新
        this.props.actions.settingRefresh(false);
        this.props.actions.setOpenedMembers(this.props.location.query);
        this.props.actions.queryIsCommon();
    }

    // 返回bar点击事件
    returnBarClickHandler = () => {
        let queryData = this.props.location.query;
        if (queryData.fromPage === 'search') {
            hashHistory.push({
                pathname: 'search',
                query: {
                    'fromPage' : 'details'
                }
            });
        } else if (queryData.fromPage === 'home') {
            hashHistory.push({
                pathname: ''
            });
        } else if (queryData.fromPage === 'department') {
            queryData.fromPage = 'details';
            hashHistory.push({
                pathname: 'department',
                query: queryData
            });
        }
    }

    openViewer (e) {
        e.persist();
        let imagelist = [this.props.state.details.openedMembers.avatar];
        SingleImgView.show({
            imagelist,
            close: () => { SingleImgView.hide() }
        });
    }

    // switch点击事件
    switchChangeHandler = (value) => {
        this.props.actions.setCommon(value, this.props.state.details.openedMembers.uuid, (status) => {
            if (status) {
                // 设置页面check的样式颜色
                let $dom = document.querySelector('.rc-switch');
                let color = this.props.state.common.userInfo.themeColor;
                if (value) {
                    $dom.style.border = '1px solid ' + color;
                    $dom.style.background = color;
                } else {
                    $dom.style.border = '1px solid #ccc';
                    $dom.style.background = '#ccc';
                }
            }
        });
    }

    telClickHandler  = () => {
        window.location.href = 'tel:' + this.props.state.details.openedMembers.tel;
    }

    mailClickHandler  = () => {
        window.location.href = 'mailto:' + this.props.state.details.openedMembers.email;
    }

    imClickHandler = () => {
        this.props.actions.openIm();
    }



    render() {
        const { state, actions } = this.props;
        return (
            <div className='details_page'>
                <div className='title_pack'>
                    <OrdinaryReturnBar click={this.returnBarClickHandler}
                                       returnUrl={this.props.location.query.fromPage}
                                       title={this.props.location.query.department}
                                       bgColor={state.common.userInfo.themeColor} />
                </div>
                <div className="head_pack">
                    <div className="item_list">
                        <div className='avatars'>
                            {state.details.openedMembers.avatar && state.details.openedMembers.avatar != null && state.details.openedMembers.avatar != '' ?
                                <span>
                                    <img onClick={this.openViewer.bind(this)} src={state.details.openedMembers.avatar}></img>
                                </span>
                                    :
                                    <span style={{background: "#74BEF2"}}>
                                        {
                                            state.details.openedMembers.name ?
                                                state.details.openedMembers.name.substr(state.details.openedMembers.name.length-1, 1)
                                                :
                                                ''
                                        }
                                    </span>
                            }
                        </div>
                        <div className="name">
                        <span>
                            {state.details.openedMembers.name}
                        </span>
                        </div>
                        <div className="position">
                        <span>
                            {state.details.openedMembers.position}
                        </span>
                        </div>
                    </div>
                </div>
                <div className="btn_pack">
                    <div className="btn_item">
                        <a onClick={this.telClickHandler.bind(this)}>
                            <img src={require('../../images/tel-btn.png')}></img>
                        </a>
                    </div>
                    <div className="btn_item">
                        <a onClick={this.mailClickHandler.bind(this)}>
                            <img src={require('../../images/msg-btn.png')}></img>
                        </a>
                    </div>
                    <div className="btn_item">
                        <a onClick={this.imClickHandler.bind(this)}>
                            <img src={require('../../images/im-btn.png')}></img>
                        </a>
                    </div>
                </div>
                <div className="info_pack">
                    <div className="info_item">
                        <img src={require('../../images/department.png')}></img>
                        <span>{state.details.openedMembers.department}</span>
                    </div>
                    <div className="info_item">
                        <img src={require('../../images/tel.png')}></img>
                        <span>{state.details.openedMembers.tel}</span>
                    </div>
                    <div className="info_item">
                        <img src={require('../../images/msg.png')}></img>
                        <span>{state.details.openedMembers.email}</span>
                    </div>
                </div>
                <div className="settings_pack">
                    <span className="settings_label">设为常用联系人</span>
                    <Switch
                        onChange={this.switchChangeHandler.bind(this)}
                        defaultChecked={state.details.checked}
                        checked={state.details.checked}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    state: state
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(DetailsActions, dispatch)
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Details);







