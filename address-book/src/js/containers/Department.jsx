// react、redux引用
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

// 逻辑和redux业务功能
import * as Contents from 'app/utils/Contents';
import * as DepartmentActions from 'app/actions/DepartmentActions';
import Loading from '../components/Loading/Loading';


// 第三方组件和自己封装组件
import { ListView, List } from 'antd-mobile';
import DepartmentReturnBar from '../components/DepartmentReturnBar/DepartmentReturnBar';
import StepLevel from '../components/StepLevel/StepLevel';

// 样式
import '../../styles/department/department.scss';


// 供同事列表的dom承载的容器
function DepartmentBody(props) {
    return (
        <div className="am-list-body my-body">
            {props.children}
        </div>
    );
}


class Department extends React.Component {

    constructor (props) {
        super(props);


        // 部门所需数据
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
        this.departmentItemIndex = 0;  // 同事item的当前索引



        // 用于设置listview的宽度和高度
        this.state = {
            tabContentWidth : 0,
            tabContentHeight : 0,

            dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
        }

        // 当客户端刷新时调用此方法，h5来完成数据请求过程
        window.clientStartRefresh = () => {
            this.refreshData();
        }
    }


    componentWillMount () {
        // 首先通知客户端此页面需不需要下拉刷新
        this.props.actions.settingRefresh(false);
        // 如果此页面从home页打开，应该请求最新数据，否则就是从详情页返回到部门页，应当显示页面跳转前的数据状态
        let queryData = this.props.location.query;
        if (queryData.fromPage === 'home') {
            // 初始化这个部门的相关数据
            this.props.actions.setCurrentDepartment(queryData);

            this.props.actions.getDepartmentList(()=>{
                // 每次获取同事数据后，重新设置数据format和加载状态
                this.genData();
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
                });

                this.props.actions.setDepartmentLoading(false);
            });
        } else if (queryData.fromPage === 'details') {
            // 由于同事列表的配置数据无法封存到reducers，所以此页面再次渲染并且不是第一次打开时
            // 需要从reducers中取出来配置参数再次初始化组件
            let departmentDataBlob = this.props.state.department.departmentDataBlob;
            let departmentSectionIDs = this.props.state.department.departmentSectionIDs;
            let departmentRowIDs = this.props.state.department.departmentRowIDs;
            for (let key of Object.keys(departmentDataBlob)) {
                this.dataBlob[key] = departmentDataBlob[key];
            }
            for (let value of departmentSectionIDs) {
                this.sectionIDs.push(value);
            }
            for (let value of departmentRowIDs) {
                this.rowIDs.push(value);
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
            });
        }

        window.addEventListener("orientationchange", () => {
            // 宣布新方向的数值
            setTimeout(()=>{
                let pageWidth = document.querySelector('.department_page').offsetWidth;
                let pageHeight = document.querySelector('.department_page').offsetHeight;
                let titleHeight = document.querySelector('.title_pack').offsetHeight;
                let stepHeight = document.querySelector('.step_pack').offsetHeight;
                this.setState({
                    tabContentWidth: pageWidth,
                    tabContentHeight: pageHeight  - titleHeight - stepHeight
                });
            }, 500);
        }, false);
    }

    componentDidMount () {
        // 页面渲染后动态计算listview所需的高度和宽度
        let pageWidth = document.querySelector('.department_page').offsetWidth;
        let pageHeight = document.querySelector('.department_page').offsetHeight;
        let titleHeight = document.querySelector('.title_pack').offsetHeight;
        let stepHeight = document.querySelector('.step_pack').offsetHeight;
        this.setState({
            tabContentWidth: pageWidth,
            tabContentHeight: pageHeight  - titleHeight - stepHeight
        });
        // 设置常用、同事列表的滚动条高度
        setTimeout(()=>{
            this.setScrollTop();
        }, 0);
    }



    /**
     * 刷新、返回和步骤点击事件
     */
    refreshData = () => {
        // 清空当前部门所有状态
        this.resetCurrentDepartmentState();
        this.props.actions.getDepartmentList(()=>{
            // 每次获取同事数据后，重新设置数据format和加载状态
            this.genData();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
            });
            // 处理每页的加载状态
            this.props.actions.setDepartmentLoading(false);
        });
    }

    returnBarClickHandler = (id, name, pId) => {
        // 返回首页
        if (pId === this.props.state.common.userInfo.departmentId) {
            // 返回首页
            this.returnHome();
        } else {
            // 1. 清空当前部门所有状态
            this.resetCurrentDepartmentState();

            // 2. 获取部门列表最后一个部门作为最新当前部门展示
            let listLength = this.props.state.department.departmentList.length;
            let data = this.props.state.department.departmentList[listLength - 1];

            let department = {};
            for (let key of Object.keys(data)) {
                department[key] = data[key];
            }
            this.props.actions.setCurrentDepartment(department);

            // 3. 设置本部门展示数据
            setTimeout(()=>{
                // 恢复当前部门的状态（一切状态）
                this.recoverCurrentDepartmentState();
            }, 0);


            // 4. 部门列表删除最后一个部门
            let list = [];
            // 需要克隆一下才可以
            for (let value of this.props.state.department.departmentList) {
                list.push(value);
            }
            list.pop();
            this.props.actions.setDepartmentList(list);
        }
    }

    stepLevelClickHandler = (clickValue, clickIndex) => {

        let clickDepartmentId = clickValue.departmentId;
        if (clickDepartmentId === '#') {
            // 返回首页
            this.returnHome();
        } else {
            // 1. 清空当前部门所有状态
            this.resetCurrentDepartmentState();

            // 2. 从列表中取出当前部门
            let departmentIndex = 0;
            let departmentList = this.props.state.department.departmentList;
            for (let department of departmentList) {
                if (department.departmentId === clickDepartmentId) {
                    break;
                }
                departmentIndex ++;
            }

            let department = {};
            for (let key of Object.keys(departmentList[departmentIndex])) {
                department[key] = departmentList[departmentIndex][key];
            }
            this.props.actions.setCurrentDepartment(department);

            // 3. 设置本部门展示数据
            setTimeout(()=>{
                // 恢复当前部门的状态（一切状态）
                this.recoverCurrentDepartmentState();
            }, 0);

            // 4. 部门列表删除点击的部门
            let list = [];
            // 需要克隆一下才可以
            for (let i = 0; i < this.props.state.department.departmentList.length; i++) {
                if (i < departmentIndex) {
                    list.push(this.props.state.department.departmentList[i]);
                }
            }

            this.props.actions.setDepartmentList(list);
        }
    }


    /**
     * 部门列表功能
     */
    // 渲染同事item
    renderDepartmentItem (rowData, sectionID, rowID) {
        const item = this.props.state.department.analysisDepartment[this.departmentItemIndex++];
        let leftPackClass = item.name != undefined ? 'left_pack width100' : 'left_pack width90';
        let avatar = '';
        let name = '';

        if (item.name != undefined) {
            if (item.avatar && item.avatar != null && item.avatar != '') {
                avatar = <span>
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
        if (this.props.state.department.departmentLoading) {
            console.info('加载数据状态!!!');
            return;
        }
        if (this.props.state.department.departmentPageIndex + 1 >= this.props.state.department.departmentCountPage) {
            console.info('当前页数已经大于总页数!!!');
            return;
        }
        // 设置最新页数和加载状态
        this.props.actions.setDepartmentPageIndex(this.props.state.department.departmentPageIndex + 1);
        this.props.actions.setDepartmentLoading(true);

        // 获取最新页的数据
        this.props.actions.getDepartmentList(()=>{
            // 每次获取同事数据后，重新设置数据format和加载状态
            this.genData();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
            });

            this.props.actions.setDepartmentLoading(false);
        });
    }

    // 同事item的点击事件
    departmentItemTap = (rowData, sectionID, rowID, departmentItemIndex) => {
        // 存储滚动条和同事数据
        this.saveScrollTop();

        setTimeout(()=>{
            let data = this.props.state.department.analysisDepartment[departmentItemIndex];
            if (data.uuid) {
                this.saveDepartmentData();
                data.fromPage = 'department';
                hashHistory.push({
                    pathname: 'details',
                    query: data
                });
            } else {
                // 把当前的部门（一切状态）保存到部门列表中作为上一级部门
                let object = this.props.state.department.currentDepartment;
                object.scrollTop = this.props.state.department.scrollTop;
                object.departmentPageIndex = this.props.state.department.departmentPageIndex;
                object.analysisDepartment = this.props.state.department.analysisDepartment;
                object.departmentCount = this.props.state.department.departmentCount;
                object.departmentCountPage = this.props.state.department.departmentCountPage;
                object.departmentPageCountLength = this.props.state.department.departmentPageCountLength;
                object.departmentDataBlob = this.dataBlob;
                object.departmentSectionIDs = this.sectionIDs;
                object.departmentRowIDs = this.rowIDs;
                object.departmentItemIndex = this.departmentItemIndex;
                this.props.actions.addDepartmentToList(object);


                // 清空当前部门所有状态
                this.resetCurrentDepartmentState();


                // 把前一个的部门id、name当作pId、pName给将要展示的部门赋值
                // 把点击的这个部门作为当前展示部门显示
                data.pDepartmentId = object.departmentId;
                data.pDepartmentName = object.departmentName;
                this.props.actions.setCurrentDepartment(data);
                this.props.actions.getDepartmentList(()=>{
                    // 每次获取同事数据后，重新设置数据format和加载状态
                    this.genData();
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
                    });

                    this.props.actions.setDepartmentLoading(false);
                });
            }
        }, 0);
    }


    // 重置当前部门的状态（一切状态）
    resetCurrentDepartmentState () {
        this.dataBlob = {};
        this.sectionIDs = [];
        this.rowIDs = [];
        this.departmentItemIndex = 0;

        this.props.actions.setScrollTop(0);
        this.props.actions.setDepartmentPageIndex(0);
        this.props.actions.setAnalysisDepartment([]);
        this.props.actions.setDepartmentCount(0);
        this.props.actions.setDepartmentCountPage(0);
        this.props.actions.setDepartmentPageCountLength(0);

        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
        });
        this.props.actions.setDepartmentLoading(true);
    }

    // 恢复当前部门的状态（一切状态）
    recoverCurrentDepartmentState () {
        // 1. 设置本部门之前的数据
        let list = [];
        for (let value of this.props.state.department.currentDepartment.analysisDepartment) {
            list.push(value);
        }
        this.props.actions.setAnalysisDepartment(list);

        // 2. 设置本部门之前的页数、个数等
        this.props.actions.setDepartmentPageIndex(this.props.state.department.currentDepartment.departmentPageIndex);
        this.props.actions.setDepartmentCount(this.props.state.department.currentDepartment.departmentCount);
        this.props.actions.setDepartmentCountPage(this.props.state.department.currentDepartment.departmentCountPage);
        this.props.actions.setDepartmentPageCountLength(this.props.state.department.currentDepartment.departmentPageCountLength);
        //this.departmentItemIndex = this.props.state.department.currentDepartment.departmentItemIndex;

        // 3. 设置本部门之前的配置
        let departmentDataBlob = this.props.state.department.currentDepartment.departmentDataBlob;
        let departmentSectionIDs = this.props.state.department.currentDepartment.departmentSectionIDs;
        let departmentRowIDs = this.props.state.department.currentDepartment.departmentRowIDs;
        for (let key of Object.keys(departmentDataBlob)) {
            this.dataBlob[key] = departmentDataBlob[key];
        }
        for (let value of departmentSectionIDs) {
            this.sectionIDs.push(value);
        }
        for (let value of departmentRowIDs) {
            this.rowIDs.push(value);
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
        });

        // 4. 设置本部门之前的滚动条
        this.props.actions.setDepartmentLoading(false);
        this.props.actions.setScrollTop(this.props.state.department.currentDepartment.scrollTop);
        this.setScrollTop();
    }

    // 返回首页
    returnHome () {
        // 1. 清空当前部门所有状态
        this.resetCurrentDepartmentState();
        // 2. 清空部门列表数据
        this.props.actions.setDepartmentList([]);
        // 3. 返回首页
        hashHistory.push({
            pathname: '',
            query: {
                'fromPage' : 'department'
            }
        });
    }


    /**
     * 功能方法列表
     */
    // 保存部门列表的滚动条高度，供此页面下一次渲染直接定位
    saveScrollTop () {
        let scrollTop = this.props.state.department.scrollTop;
        let departmentListDom = document.querySelector('.department_list');
        if (departmentListDom) { scrollTop = departmentListDom.scrollTop }

        // 保存部门的滚动条位置
        this.props.actions.setScrollTop(scrollTop);
    }

    // 设置常用、同事列表的滚动条高度
    setScrollTop () {
        let scrollTop = this.props.state.department.scrollTop;
        let departmentListDom = document.querySelector('.department_list');

        if (departmentListDom) { departmentListDom.scrollTop = scrollTop; }
    }

    // 重新组织每次ajax请求后的数据format
    genData () {
        let pIndex = this.props.state.department.departmentPageIndex;
        let pageDataCount = this.props.state.department.departmentPageCountLength;
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
    saveDepartmentData () {
        this.props.actions.setDepartmentDataBlob(this.dataBlob);
        this.props.actions.setDepartmentSectionIDs(this.sectionIDs);
        this.props.actions.setDepartmentRowIDs(this.rowIDs);
    }





    render() {
        const { Item } = List;
        const { state, actions } = this.props;
        return (
            <div className='department_page'>
                <div className='title_pack'>
                    {JSON.stringify(state.department.currentDepartment) !== '{}' ?
                        <DepartmentReturnBar id={state.department.currentDepartment.departmentId}
                                   name={state.department.currentDepartment.departmentName}
                                   pId={state.department.currentDepartment.pDepartmentId}
                                   click={this.returnBarClickHandler}
                                   bgColor={state.common.userInfo.themeColor}/>
                        :''
                    }
                </div>
                <div className='step_pack'>
                    <StepLevel nameList={state.department.departmentList}
                               itemClick={this.stepLevelClickHandler}
                               bgColor={state.common.userInfo.themeColor}/>

                </div>
                <div className="list_pack">
                    <ListView ref="lv"
                          dataSource={this.state.dataSource}
                          renderFooter={() => (
                              <div>
                                  {state.department.departmentLoading ?
                                      <span>加载中...</span>
                                      :
                                      state.department.departmentCount == 0 ?
                                          <span>暂无数据</span>
                                          :
                                          state.department.departmentPageIndex+1 != state.department.departmentCountPage ?
                                              <span>上拉加载</span>
                                              :
                                              ''
                                  }
                              </div>
                          )}
                          renderBodyComponent={() => <DepartmentBody />}
                          renderRow={(rowData, sectionID, rowID) => (
                              <Item>
                                  <div onClick={this.departmentItemTap.bind(this, rowData, sectionID, rowID, this.departmentItemIndex)}
                                       className='department_item_pack'>
                                      {/*渲染每一个item*/}
                                      {this.renderDepartmentItem(rowData, sectionID, rowID)}
                                  </div>
                              </Item>
                          )}
                          className="department_list"
                          style={{
                              height: this.state.tabContentHeight,
                              width: this.state.tabContentWidth,
                              overflow: 'auto',
                          }}
                          initialListSize={10000000000}
                          pageSize={100000000}
                          onScroll={() => { console.log('scroll'); }}
                          scrollRenderAheadDistance={500}
                          scrollEventThrottle={200}
                          onEndReached={this.onEndReached}
                          onEndReachedThreshold={20}
                    />
                </div>
                {/*<div className="refresh_pack">
                    <div className={state.department.departmentIsRefresh ? "refresh_loading refresh" : "refresh"}>
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
    actions: bindActionCreators(DepartmentActions, dispatch)
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Department);







