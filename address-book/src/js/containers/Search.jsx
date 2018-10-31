// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as Contents from 'app/utils/Contents';
import * as SearchActions from 'app/actions/SearchActions';

// 第三方组件和自己封装组件
import { ListView, List, SearchBar } from 'antd-mobile';
import OrdinaryReturnBar from '../components/OrdinaryReturnBar/OrdinaryReturnBar';
import Loading from '../components/Loading/Loading';

// 样式
import '../../styles/search/search.scss';



class Search extends React.Component {

    constructor (props) {
        super(props);

        // 用于设置listview的宽度和高度
        this.state = {
            listWidth : 0,
            listHeight : 0
        }
    }


    componentWillMount () {
        // 首先通知客户端此页面需不需要下拉刷新
        this.props.actions.settingRefresh(false);
        // 每次从url中提取打开源，如果是首页面打开，清空reducers的数据
        // 如果是从详情页返回，就不清空此页面reducers的数据
        let queryData = this.props.location.query;
        if (queryData.fromPage === 'home') {
            this.props.actions.setScrollTop(0);
            this.props.actions.setKeyword('');
            this.props.actions.setOriginalSearch([]);
            this.props.actions.setAnalysisSearch({});
            this.props.actions.setSearchDataSource('');
        }

        window.addEventListener("orientationchange", () => {
            // 宣布新方向的数值
            setTimeout(()=>{
                let pageWidth = document.querySelector('.search_page').offsetWidth;
                let pageHeight = document.querySelector('.search_page').offsetHeight;
                let searchHeight = document.querySelector('.search_pack').offsetHeight;
                let titleHeight = document.querySelector('.title_pack').offsetHeight;

                this.setState({
                    listWidth: pageWidth,
                    listHeight: pageHeight  - titleHeight - searchHeight
                });
            }, 500);
        }, false);
    }

    componentDidMount () {
        // 页面渲染后动态计算listview所需的高度和宽度
        let pageWidth = document.querySelector('.search_page').offsetWidth;
        let pageHeight = document.querySelector('.search_page').offsetHeight;
        let searchHeight = document.querySelector('.search_pack').offsetHeight;
        let titleHeight = document.querySelector('.title_pack').offsetHeight;

        this.setState({
            listWidth: pageWidth,
            listHeight: pageHeight  - titleHeight - searchHeight
        });
        // 如果此页面是从详情页返回，就需要展示跳转之前的页面数据和滚动条top
        if (this.props.location.query.fromPage === 'details') {
            setTimeout(()=>{
                this.setScrollTop();
            }, 0);
        }
    }

    returnBarClickHandler = () => {
        hashHistory.push({
            pathname: '',
            query: {}
        });
    }

    onSearchHandler = (val) => {
        this.props.actions.setKeyword(val);
    }

    onClearHandler = () => {
        this.props.actions.setKeyword('');
    }

    onConfirmHandler = () => {
        this.props.actions.getSearchUseList();
    }

    // 用户item的点击事件
    searchUserItemTap = (rowData, sectionID, rowID) => {
        this.saveScrollTop();
        let data = this.getSearchItemByID(rowID);
        data.fromPage = 'search';
        hashHistory.push({
            pathname: 'details',
            query: data
        });
    }

    // 根据uuid渲染搜索列表item
    renderSearchUseItem (rowData, sectionID, rowID) {
        let item = this.getSearchItemByID(rowID);
        let leftPackClass = item.position != '' ? 'left_pack width50' : 'left_pack width100';
        return (
            <div key={rowID} className='item'>
                <div className={leftPackClass}>
                    <div className='avatars'>
                        {item.avatar && item.avatar != null && item.avatar != '' ?
                            <span>
                                <img src={item.avatar}></img>
                            </span>
                            :
                            <span style={{background: "#74BEF2"}}>{item.name.substr(item.name.length-1, 1)}</span>
                        }
                    </div>
                    <div className='name'>
                        <span>{item.name}</span>
                    </div>
                </div>

                {item.position != '' ?
                    <div className='right_pack'>
                        <div className='position'>
                            <span>{item.position}</span>
                        </div>
                    </div>
                    :
                    ''
                }
            </div>
        );
    }

    // 根据uuid从搜索数据中获取对应数据
    getSearchItemByID (uuid) {
        let item = {};
        for (let i=0, len=this.props.state.search.originalSearchList.length; i<len; i++) {
            if (this.props.state.search.originalSearchList[i].uuid == uuid) {
                item = this.props.state.search.originalSearchList[i];
                break;
            }
        }
        return item;
    }


    /**
     * 功能方法列表
     */
    // 保存搜索列表的滚动条高度，供此页面下一次渲染直接定位
    saveScrollTop () {
        let searchScrollTop = this.props.state.search.scrollTop;
        let searchListDom = document.querySelector('.search_list');
        if (searchListDom) { searchScrollTop = searchListDom.scrollTop }

        // 保存搜索列表的滚动条位置
        this.props.actions.setScrollTop(searchScrollTop);
    }

    // 设置搜索列表的滚动条高度
    setScrollTop () {
        let searchScrollTop = this.props.state.search.scrollTop;
        let searchListDom = document.querySelector('.search_list');

        if (searchListDom) { searchListDom.scrollTop = searchScrollTop; }
    }


    render() {
        const { Item } = List;
        const { state, actions } = this.props;
        return (
            <div className='search_page'>
                <div className='title_pack'>
                    <OrdinaryReturnBar returnUrl='' click={this.returnBarClickHandler} title='搜索' bgColor={state.common.userInfo.themeColor} />
                </div>
                <div className="search_pack">
                    <SearchBar
                        value={state.search.keyword}
                        placeholder="请输入关键字"
                        cancelText="搜索"
                        onChange={this.onSearchHandler}
                        onClear={this.onClearHandler}
                        onCancel={this.onConfirmHandler}
                    />
                </div>
                <div className="list_pack">
                    {state.search.keyword == '' && !state.search.isRequest && state.search.searchDataSource == ''?
                        <div className="tip_pack">
                            <span className="tip">提示：请在输入框搜索联系人</span>
                        </div>
                        :
                        ''
                    }
                    {state.search.searchDataSource != '' ?
                        <ListView.IndexedList
                            dataSource={this.props.state.search.searchDataSource}
                            renderSectionHeader={sectionData => (<div className='ih'>{sectionData}</div>)}
                            renderRow={(rowData, sectionID, rowID) => {
                                return (
                                    <Item>
                                        <div onClick={this.searchUserItemTap.bind(this, rowData, sectionID, rowID)}
                                             className='user_item_pack'>
                                            {/*渲染每一个item*/}
                                            {this.renderSearchUseItem(rowData, sectionID, rowID)}
                                        </div>
                                    </Item>
                                )
                            }}
                            className='search_list'
                            style={{
                                height: this.state.listHeight,
                                width: this.state.listWidth,
                                /*width: this.state.listWidth - 23,*/
                                overflow: 'auto',
                            }}
                            initialListSize={10000000000}
                            pageSize={100000000}
                            quickSearchBarTop={{'value':'↑', 'label':'↑'}}
                            quickSearchBarStyle={{
                                position: 'absolute',
                                top: '20px',
                                background: '#f7f7f7'
                            }}
                            delayTime={100}
                            showQuickSearchIndicator={true}
                        />
                        :
                        state.search.isRequest ?
                            <Loading color={state.common.userInfo.themeColor}/>
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
    actions: bindActionCreators(SearchActions, dispatch)
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);







