import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ReturnBar.scss';

export default class ReturnBar extends React.Component {

    constructor (props) {
        super(props);

        this.clickHandle = this.clickHandle.bind(this);
    }

    clickHandle () {
        this.props.click(this.props.id, this.props.name, this.props.pId);
    }

    render() {
        return (
            <div className={styles.package}>
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

ReturnBar.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    pId: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired,
}