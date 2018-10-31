import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ListView, List } from 'antd-mobile';


import styles from './IndexList.scss';



export default class IndexList extends React.Component {

    constructor (props) {
        super(props);

        this.colorIndex = -1;
        this.a = 0;
    }


    // 处理不必要的渲染
    shouldComponentUpdate (nextProps, nextState) {
        if (
            JSON.stringify(this.props.dataSource) == JSON.stringify(nextProps.dataSource)
            &&
            // 对比高是因为外部页面每次渲染会重新设置height为0，就会标志此页面再一次打开
            // 否则，如果无法获知外部页面是否再次打开时，就无法渲染组件，导致页面再次打开时组件没有渲染
            this.props.height == nextProps.height
        ) {
            return false;
        }
        console.info(this.props);
        console.info(nextProps);
        this.colorIndex = -1;
        return true;
    }



    headerClick = () => {
        this.props.headerClick();
    }

    itemClick = (rowData, sectionID, rowID) => {
        this.props.itemClick(rowData, sectionID, rowID);
    }

    // 根据uuid渲染常用列表item
    renderItem (rowData, sectionID, rowID) {
        let item = this.getItemByID(rowID);
        let leftPackClass = item.position != '' ? 'left_pack width50' : 'left_pack width100';

        return (
            <div key={rowID} className='item'>
                <div className={leftPackClass}>
                    <div className='avatars'>
                        {item.avatar && item.avatar != null && item.avatar != '' ?
                            <span style={{background: "#74BEF2"}}>
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
    getItemByID (uuid) {
        let item = {};
        for (let i=0, len=this.props.originalData.length; i<len; i++) {
            if (this.props.originalData[i].uuid == uuid) {
                item = this.props.originalData[i];
                break;
            }
        }
        return item;
    }



    render() {
        const { Item } = List;
        this.a = this.props.originalData.length;
        return (
            <div>
                {this.props.height != 0 ?
                    <ListView.IndexedList
                        dataSource={this.props.dataSource}
                        renderHeader={() => (
                            <div onClick={this.headerClick.bind(this)}
                                 className='item'>
                                <div className='left_pack width100'>
                                    <div className='avatars'>
                                        <span>
                                            <img src={require('./header-icon.png')}></img>
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
                                    <div onClick={this.itemClick.bind(this, rowData, sectionID, rowID)}
                                         className='user_item_pack'>
                                        {this.renderItem(rowData, sectionID, rowID)}
                                    </div>
                                </Item>
                            )
                        }}
                        className='common_list'
                        style={{
                            height: this.props.height,
                            width: this.props.width,
                            overflow: 'auto',
                        }}
                        quickSearchBarTop={{'value':' ', 'label':' '}}
                        quickSearchBarStyle={{
                            position: 'absolute',
                            top: '20px',
                            background: '#f7f7f7'
                        }}
                        showQuickSearchIndicator={true}
                        delayTime={100}
                    />
                    :
                    ''
                }
            </div>
        )
    }
}

IndexList.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    originalData: PropTypes.array.isRequired,
    dataSource: PropTypes.object.isRequired,
    headerClick: PropTypes.func.isRequired,
    itemClick: PropTypes.func.isRequired
}