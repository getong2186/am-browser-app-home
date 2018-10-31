import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './StepLevel.scss';

export default class StepLevel extends React.Component {

    constructor (props) {
        super(props);

        this.clickHandle = this.clickHandle.bind(this);
    }

    // 处理不必要的渲染
    shouldComponentUpdate (nextProps, nextState) {
        // console.info(this.props);
        // console.info(nextProps);
        return true;
    }

    clickHandle (value, index) {
        this.props.itemClick(value, index);
    }


    render() {
        let rootValue = {'departmentName':'全公司', 'departmentId':'#'};
        // 父组件传递的参数
        let itemList = this.props.nameList.map((value, index) => {
            return (
                <div className={styles.name} key={index} onClick={this.clickHandle.bind(this, value, index)}>
                    <div>
                        <img src={require('./next.png')}></img>
                        <span>{value.departmentName}</span>
                    </div>
                </div>
            );
        });

        return (
            <div className={styles.package} style={{background: this.props.bgColor}}>
                <div className={styles.name} key={-1} onClick={this.clickHandle.bind(this, rootValue, -1)}>
                    <div>
                        <span>{rootValue.departmentName}</span>
                    </div>
                </div>
                {itemList}
            </div>
        )
    }
}

StepLevel.propTypes = {
    nameList: PropTypes.array.isRequired,
    itemClick: PropTypes.func.isRequired,
    bgColor: PropTypes.string.isRequired,
}