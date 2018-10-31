import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './DepartmentReturnBar.scss';

export default class DepartmentReturnBar extends React.Component {

    constructor (props) {
        super(props);

        this.clickHandle = this.clickHandle.bind(this);
    }

    clickHandle () {
        this.props.click(this.props.id, this.props.name, this.props.pId);
    }

    render() {
        // console.info(this.props.id);
        // console.info(this.props.name);
        // console.info(this.props.pId);
        return (
            <div className={styles.package} style={{background: this.props.bgColor}}>
                <div className={styles.icon_pack} onClick={this.clickHandle.bind(this)}>
                    <img src={require('./return.png')}></img>
                    <span className={styles.tip}>返回</span>
                </div>
                <div className={styles.title_pack}>
                    <span className={styles.title}>{this.props.name}</span>
                </div>
            </div>
        )
    }
}

DepartmentReturnBar.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    pId: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired,
    bgColor: PropTypes.string.isRequired,
}