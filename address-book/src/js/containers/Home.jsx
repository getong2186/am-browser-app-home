// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as Contents from 'app/utils/Contents';
import * as HomeActions from 'app/actions/HomeActions';

// 第三方组件和自己封装组件
import { Tabs, ListView, List } from 'antd-mobile';
import Title from '../components/Title/Title';
import Loading from '../components/Loading/Loading';
/*import IndexList from "../components/IndexList/IndexList";*/

// 样式
import '../../styles/home/home.scss';


// 供同事列表的dom承载的容器
function ColleaguesBody(props) {
    return (
        <div className="am-list-body my-body">
            {props.children}
        </div>
    );
}


class Home extends React.Component {

    constructor (props) {
        super(props);

        // 同事所需数据
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
        const dataSource = new ListView.DataSource({
            getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.dataBlob = {};
        this.sectionIDs = [];
        this.rowIDs = [];
        this.colleaguesItemIndex = 0;  // 同事item的当前索引



        // 用于设置listview的宽度和高度
        this.state = {
            tabContentWidth : 0,
            tabContentHeight : 0,

            screen: false,  // 屏幕是否经过了旋转

            dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
        }

        // 当客户端刷新时调用此方法，h5来完成数据请求过程
        window.clientStartRefresh = () => {
            this.refreshData();
        }
    }

    componentWillMount () {
        // 首先通知客户端此页面需不需要下拉刷新
        this.props.actions.settingRefresh(true);
        // 如果此页面没有被渲染过，向后台请求数据，同时修改reducers中 页面是否渲染过 的值为true，
        // 为了处理下一次再打开此页面不需要从后台再重新获取数据了
        let pageIsLoaded = this.props.state.home.pageLoaded;
        if (!pageIsLoaded) {
            this.props.actions.setPageLoaded(true);
            this.props.actions.getCommonUseList(()=>{});
            this.props.actions.getColleaguesList(()=>{
                // 每次获取同事数据后，重新设置数据format和加载状态
                this.genData();
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
                });
                // 处理每页的加载状态
                this.props.actions.setColleaguesLoading(false);
            });
        } else {
            // 由于同事列表的配置数据无法封存到reducers，所以此页面再次渲染并且不是第一次打开时
            // 需要从reducers中取出来配置参数再次初始化组件
            let colleaguesDataBlob = this.props.state.home.colleaguesDataBlob;
            let colleaguesSectionIDs = this.props.state.home.colleaguesSectionIDs;
            let colleaguesRowIDs = this.props.state.home.colleaguesRowIDs;
            for (var key of Object.keys(colleaguesDataBlob)) {
                this.dataBlob[key] = colleaguesDataBlob[key]
            }
            for (var value of colleaguesSectionIDs) {
                this.sectionIDs.push(value);
            }
            for (var value of colleaguesRowIDs) {
                this.rowIDs.push(value);
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
            });
        }

        window.addEventListener("orientationchange", () => {
            // 宣布新方向的数值
            setTimeout(()=>{
                let pageWidth = document.querySelector('.home_page').offsetWidth;
                let pageHeight = document.querySelector('.home_page').offsetHeight;
                let tabHeight = document.querySelector('.am-tabs-tab-bar-wrap').offsetHeight;
                let titleHeight = document.querySelector('.title_pack').offsetHeight;

                this.setState({
                    tabContentWidth: pageWidth,
                    tabContentHeight: pageHeight  - tabHeight - titleHeight
                });
            }, 500);
        }, false);
    }

    componentDidMount () {
        // 页面渲染后动态计算listview所需的高度和宽度
        let pageWidth = document.querySelector('.home_page').offsetWidth;
        let pageHeight = document.querySelector('.home_page').offsetHeight;
        let tabHeight = document.querySelector('.am-tabs-tab-bar-wrap').offsetHeight;
        let titleHeight = document.querySelector('.title_pack').offsetHeight;

        this.setState({
            tabContentWidth: pageWidth,
            tabContentHeight: pageHeight  - tabHeight - titleHeight
        });
        // 设置常用、同事列表的滚动条高度
        setTimeout(()=>{
            this.setScrollTop();
        }, 0);
    }


    /**
     * 刷新、搜索和tab的点击事件
     */

    // 刷新按钮点击事件
    refreshData = () => {
        //if (this.props.state.home.activeTab == 0) {
            // 常用
            this.props.actions.setPageLoaded(true);
            this.props.actions.getCommonUseList();
        //} else {
            // 同事
            this.dataBlob = {};
            this.sectionIDs = [];
            this.rowIDs = [];
            this.colleaguesItemIndex = 0;  // 同事item的当前索引
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
            });

            // 请求状态
            this.props.actions.resetColleaguesList();

            this.props.actions.getColleaguesList(()=>{
                // 每次获取同事数据后，重新设置数据format和加载状态
                this.genData();
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
                });
                // 处理每页的加载状态
                this.props.actions.setColleaguesLoading(false);
            });
        //}
    }

    // 标题点击事件
    titleClickHandler = () => {
        // 存储滚动条和同事数据
        this.saveScrollTop();
        this.saveColleaguesData();

        hashHistory.push({
            pathname: 'search',
            query: {
                'fromPage' : 'home'
            }
        });
    }

    // tab标签点击事件
    tabClick = (key) => {
        this.saveScrollTop();
        // 设置常用、同事列表的滚动条高度
        setTimeout(()=>{
            this.setScrollTop();
        }, 0);
        this.props.actions.setActiveTab(key.sub);



        // if (key.sub == '0') {
        //     let commonListDom = document.querySelector('.common_list');
        //     if (commonListDom.scrollTop == 0) {
        //         this.props.actions.receptionRefresh();
        //     }
        // } else {
        //     let colleaguesListDom = document.querySelector('.colleagues_list');
        //     if (colleaguesListDom.scrollTop == 0) {
        //         this.props.actions.receptionRefresh();
        //     }
        // }
    }




    /**
     * 常用列表功能
     */
    // 根据uuid渲染常用列表item
    renderCommonUseItem (rowData, sectionID, rowID) {
        let item = this.getCommonItemByID(rowID);
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

    // 根据uuid从常用数据中获取对应数据
    getCommonItemByID (uuid) {
        let item = {};
        for (let i=0, len=this.props.state.home.originalCommonList.length; i<len; i++) {
            if (this.props.state.home.originalCommonList[i].uuid == uuid) {
                item = this.props.state.home.originalCommonList[i];
                break;
            }
        }
        return item;
    }

    // 群组item的点击事件
    commonGroupItemTap = () => {
        // 存储滚动条和同事数据
        this.saveScrollTop();
        this.saveColleaguesData();

        hashHistory.push({
            pathname: 'groups',
            query: {
                'fromPage' : 'home'
            }
        });
    }

    // 用户item的点击事件
    commonUserItemTap = (rowData, sectionID, rowID) => {
        // 存储滚动条和同事数据
        this.saveScrollTop();
        this.saveColleaguesData();

        let data = this.getCommonItemByID(rowID);
        data.fromPage = 'home';
        hashHistory.push({
            pathname: '/details',
            query: data
        });
    }



    /**
     * 同事列表功能
     */
    // 渲染同事item
    renderColleaguesItem (rowData, sectionID, rowID) {
        const item = this.props.state.home.analysisColleagues[this.colleaguesItemIndex++];
        let leftPackClass = item.name != undefined ? 'left_pack width100' : 'left_pack width90';
        let avatar = '';
        let name = '';

        if (item.name != undefined) {
            if (item.avatar && item.avatar != null && item.avatar != '') {
                avatar = <span style={{background: "#74BEF2"}}>
                            <img src={item.avatar}></img>
                        </span>;
            } else {
                avatar = <span style={{background: "#74BEF2"}}>
                            {item.name.substr(item.name.length-1, 1)}
                        </span>;
            }
            name = item.name;
        } else {
            avatar = <span>
                        <img src={require('../../images/group-icon.png')}></img>
                    </span>;
            name = item.departmentName;
        }

        return (
            <div key={rowID} className='item'>
                <div className={leftPackClass}>
                    <div className='avatars'>
                        {avatar}
                    </div>
                    <div className='name'>
                        <span>{name}</span>
                    </div>
                </div>

                {item.departmentName != undefined ?
                    <div className='right_pack'>
                        <div className='number'>
                            <span>{item.memberNumber}</span>
                        </div>
                    </div>
                    :
                    ''
                }
            </div>
        );
    };

    // 请求下一个ajax数据列表
    onEndReached = (event) => {
        // 如果当前是加载数据状态或者是当前页数已经大于总页数了，就不再请求数据
        if (this.props.state.home.colleaguesLoading) {
            console.info('加载数据状态!!!');
            return;
        }
        if (this.props.state.home.colleaguesPageIndex + 1 >= this.props.state.home.colleaguesCountPage) {
            console.info('当前页数已经大于总页数!!!');
            return;
        }
        // 设置最新页数和加载状态
        this.props.actions.setColleaguesPageIndex(this.props.state.home.colleaguesPageIndex + 1);
        this.props.actions.setColleaguesLoading(true);

        // 获取最新页的数据
        this.props.actions.getColleaguesList(()=>{
            // 每次获取同事数据后，重新设置数据format和加载状态
            this.genData();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
            });

            this.props.actions.setColleaguesLoading(false);
        });
    }

    // 同事item的点击事件
    colleaguesItemTap = (rowData, sectionID, rowID, colleaguesItemIndex) => {
        // 存储滚动条和同事数据
        this.saveScrollTop();
        this.saveColleaguesData();

        let data = this.props.state.home.analysisColleagues[colleaguesItemIndex];
        if (data.uuid) {
            data.fromPage = 'home';
            hashHistory.push({
                pathname: 'details',
                query: data
            });
        } else {
            data.fromPage = 'home';
            data.pDepartmentId = this.props.state.common.userInfo.departmentId;
            data.pDepartmentName = this.props.state.common.userInfo.departmentName || '全公司';
            hashHistory.push({
                pathname: 'department',
                query: data
            });
        }
    }


    /**
     * 功能方法列表
     */
    // 保存常用、同事列表的滚动条高度，供此页面下一次渲染直接定位
    saveScrollTop () {
        let scrollTop = this.props.state.home.scrollTop;
        let commonScrollTop = scrollTop.common;
        let colleaguesScrollTop = scrollTop.colleagues;

        let commonListDom = document.querySelector('.common_list');
        let colleaguesListDom = document.querySelector('.colleagues_list');

        if (commonListDom) { commonScrollTop = commonListDom.scrollTop }
        if (colleaguesListDom) { colleaguesScrollTop = colleaguesListDom.scrollTop }

        // 保存常用、同事的滚动条位置
        this.props.actions.setScrollTop({'common': commonScrollTop, 'colleagues': colleaguesScrollTop});
    }

    // 设置常用、同事列表的滚动条高度
    setScrollTop () {
        let scrollTop = this.props.state.home.scrollTop;
        let commonListDom = document.querySelector('.common_list');
        let colleaguesListDom = document.querySelector('.colleagues_list');

        if (commonListDom) { commonListDom.scrollTop = scrollTop.common; }
        if (colleaguesListDom) {
            colleaguesListDom.scrollTop = scrollTop.colleagues;
        }
    }

    // 重新组织每次ajax请求后的数据format
    genData () {
        let pIndex = this.props.state.home.colleaguesPageIndex;
        let pageDataCount = this.props.state.home.colleaguesPageCountLength;
        for (let i = 0; i < 1; i++) {
            const ii = (pIndex * 1) + i;
            const sectionName = `Section ${ii}`;

            this.sectionIDs.push(sectionName);
            this.dataBlob[sectionName] = sectionName;
            this.rowIDs[ii] = [];

            for (let jj = 0; jj < pageDataCount; jj++) {
                const rowName = `S${ii}, R${jj}`;
                this.rowIDs[ii].push(rowName);
                this.dataBlob[rowName] = rowName;
            }
        }
        this.sectionIDs = [].concat(this.sectionIDs);
        this.rowIDs = [].concat(this.rowIDs);
    };

    // 存储同事各项数据到reducers中，方便再次渲染时读取
    saveColleaguesData () {
        this.props.actions.setColleaguesDataBlob(this.dataBlob);
        this.props.actions.setColleaguesSectionIDs(this.sectionIDs);
        this.props.actions.setColleaguesRowIDs(this.rowIDs);
    }

    commonScroll (e) {
        if (e.target.scrollTop == 0) {
            this.props.actions.receptionRefresh();
        }
    }

    colleaguesScroll (e) {
        if (e.target.scrollTop == 0) {
            this.props.actions.receptionRefresh();
        }
    }


    render() {
        const tabs = [
            { title: '常用', sub: 0 },
            { title: '同事', sub: 1 }
        ];
        const { Item } = List;
        const { state, actions } = this.props;
        return (
            <div className='home_page'>
                <div className='title_pack'>
                    <Title title={state.common.userInfo.companyName}
                           click={this.titleClickHandler}
                           bgColor={state.common.userInfo.themeColor}/>
                </div>

                <Tabs tabs={tabs}
                      className="tab_item"
                      swipeable = {false}
                      renderTab={tab => <span>{tab.title}</span>}
                      page={state.home.activeTab}
                      onTabClick={this.tabClick}
                      tabBarUnderlineStyle={{
                          background: '#fff',
                          width: '50%!important',
                          border: '0px'
                      }}
                      tabBarBackgroundColor={state.common.userInfo.themeColor}
                      tabBarTextStyle={{
                          color: '#fff',
                      }}
                >
                    <div className='content_pack'>
                        {state.home.commonDataSource !== '' ?
                            <ListView.IndexedList
                                dataSource={state.home.commonDataSource}
                                renderHeader={() => (
                                    <div onClick={this.commonGroupItemTap.bind(this)}
                                         className='item'>
                                        <div className='left_pack width100'>
                                            <div className='avatars'>
                                                <span>
                                                    <img src={require('../../images/group-icon.png')}></img>
                                                </span>
                                            </div>
                                            <div className='name'>
                                                <span>群组</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                renderSectionHeader={sectionData => (<div className='ih'>{sectionData}</div>)}
                                renderRow={(rowData, sectionID, rowID) => {
                                    return (
                                        <Item>
                                            <div onClick={this.commonUserItemTap.bind(this, rowData, sectionID, rowID)}
                                                 className='user_item_pack'>
                                                {this.renderCommonUseItem(rowData, sectionID, rowID)}
                                            </div>
                                        </Item>
                                    )
                                }}
                                className='common_list'
                                style={{
                                    height: this.state.tabContentHeight,
                                    width: this.state.tabContentWidth,
                                    /*width: this.state.tabContentWidth - 23,*/
                                    overflow: 'auto',
                                }}
                                initialListSize={100000000000}
                                pageSize={100000000000}
                                quickSearchBarTop={{'value':'↑', 'label':'↑'}}
                                quickSearchBarStyle={{
                                    position: 'absolute',
                                    top: '20px',
                                    background: '#f7f7f7'
                                }}
                                onScroll={(e) => { this.commonScroll(e) }}
                                showQuickSearchIndicator={true}
                                delayTime={100}
                            />
                            :
                            <Loading color={state.common.userInfo.themeColor}/>
                        }
                    </div>
                    <div className='content_pack'>
                        <ListView ref="lv"
                                  dataSource={this.state.dataSource}
                                  renderFooter={() => (
                                      <div>
                                          {state.home.colleaguesLoading ?
                                              <span>加载中...</span>
                                              :
                                              state.home.colleaguesCount == 0 ?
                                                  <span>暂无数据</span>
                                                  :
                                                  state.home.colleaguesPageIndex+1 != state.home.colleaguesCountPage ?
                                                      <span>上拉加载</span>
                                                      :
                                                      ''
                                          }
                                      </div>
                                  )}
                                  renderBodyComponent={() => <ColleaguesBody />}
                                  renderRow={(rowData, sectionID, rowID) => (
                                      <Item>
                                          <div onClick={this.colleaguesItemTap.bind(this, rowData, sectionID, rowID, this.colleaguesItemIndex)}
                                               className='colleagues_item_pack'>
                                              {/*渲染每一个item*/}
                                              {this.renderColleaguesItem(rowData, sectionID, rowID)}
                                          </div>
                                      </Item>
                                  )}
                                  className="colleagues_list"
                                  style={{
                                      height: this.state.tabContentHeight,
                                      width: this.state.tabContentWidth,
                                      overflow: 'auto',
                                  }}
                                  initialListSize={100000000000}
                                  pageSize={100000000000}
                                  onScroll={(e) => { this.colleaguesScroll(e) }}
                                  scrollRenderAheadDistance={500}
                                  scrollEventThrottle={200}
                                  onEndReached={this.onEndReached}
                                  onEndReachedThreshold={20}
                        />
                    </div>
                </Tabs>
                {/*<div className="refresh_pack">
                    <div className={state.home.commonIsRefresh ? "refresh_loading refresh" : "refresh"}>
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
    actions: bindActionCreators(HomeActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);







