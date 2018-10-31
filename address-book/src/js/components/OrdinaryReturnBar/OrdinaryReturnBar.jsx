import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './OrdinaryReturnBar.scss';
import { hashHistory } from 'react-router';


export default class OrdinaryReturnBar extends React.Component {

    constructor (props) {
        super(props);

        this.clickHandle = this.clickHandle.bind(this);
    }

    clickHandle () {
        this.props.click();
        // hashHistory.push({
        //     pathname: this.props.returnUrl,
        //     query: {}
        // });
    }

    render() {
        return (
            <div className={styles.package} style={{background: this.props.bgColor}}>
                <div className={styles.icon_pack} onClick={this.clickHandle.bind(this)}>
                    <img src={require('./return.png')}></img>
                    <span className={styles.tip}>返回</span>
                </div>
                <div className={styles.title_pack}>
                    <span className={styles.title}>{this.props.title}</span>
                </div>
            </div>
        )
    }
}

OrdinaryReturnBar.propTypes = {
    returnUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired,
    bgColor: PropTypes.string.isRequired,
}