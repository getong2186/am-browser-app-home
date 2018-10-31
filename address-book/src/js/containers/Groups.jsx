// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as GroupsActions from 'app/actions/GroupsActions';

// 第三方组件和自己封装组件
import OrdinaryReturnBar from '../components/OrdinaryReturnBar/OrdinaryReturnBar';
import Loading from '../components/Loading/Loading';

// 样式
import '../../styles/groups/groups.scss';



class Groups extends React.Component {

    constructor (props) {
        super(props);

        // 当客户端刷新时调用此方法，h5来完成数据请求过程
        window.clientStartRefresh = () => {
            this.refreshData();
        }
    }

    componentWillMount () {
        // 首先通知客户端此页面需不需要下拉刷新
        this.props.actions.settingRefresh(true);
        // 获取常用数据列表
        this.props.actions.getGroupsList();
    }

    componentDidMount () {
        document.querySelector('.list_pack').addEventListener('scroll', (e) => {
            if (e.target.scrollTop == 0) {
                this.props.actions.receptionRefresh();
            }
        })
    }

    // 刷新按钮点击事件
    refreshData = () => {
        this.props.actions.getGroupsList();
    }

    returnBarClickHandler = () => {
        if (this.props.location.query.fromPage === 'home') {
            hashHistory.push({
                pathname: ''
            });
        }
    }


    // 用户item的点击事件
    groupsItemTap = (rowData, rowID) => {
        this.props.actions.openIm(rowData);
    }




    render() {
        const { state, actions } = this.props;
        const self = this;
        return (
            <div className='groups_page'>
                <div className='title_pack'>
                    <OrdinaryReturnBar click={this.returnBarClickHandler}
                                       returnUrl={this.props.location.query.fromPage}
                                       title='群组'
                                       bgColor={state.common.userInfo.themeColor} />
                </div>
                {!state.groups.isRefresh && state.groups.groupsList.length == 0 ?
                    <div className="tip_pack">
                        <span className="tip">暂无群组</span>
                    </div>
                    :
                    ''
                }
                <div className="list_pack">
                    {
                        state.groups.groupsList.map(function (item, rowID) {
                            return (
                                <div key={rowID} className='item' onClick={self.groupsItemTap.bind(self, item, rowID)}>
                                    <div className="left_pack">
                                        <div className='avatars'>
                                            {item.avatar && item.avatar != null && item.avatar != '' ?
                                                <span className="left_pack width100">
                                                    <img src={item.avatar}></img>
                                                </span>
                                                :
                                                <span className="left_pack width100">
                                                    <img src={require('../../images/group-icon.png')}></img>
                                                </span>
                                            }
                                        </div>
                                    </div>
                                    <div className="right_pack">
                                        <div className="pack">
                                            <div className='name'>
                                                <span>{item.name}</span>
                                            </div>
                                            <div className="number">
                                                <span>{item.number}/{item.max_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                {/*<div className="refresh_pack">
                    <div className={state.groups.isRefresh ? "refresh_loading refresh" : "refresh"}>
                        <img onClick={this.refreshData.bind(this)} src={require('../../images/refresh.png')}></img>
                    </div>
                </div>*/}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    state: state
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(GroupsActions, dispatch)
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Groups);







