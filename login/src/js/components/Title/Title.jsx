import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Title.scss';

export default class Title extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        // 父组件传递的参数
        const { name, bgColor } = this.props;
        return (
            <div className={styles.package} style={{background: bgColor}}>
                <div className={styles.title_pack}>
                    <span className={styles.title}>{name}</span>
                </div>
            </div>
        )
    }
}

Title.propTypes = {
    name: PropTypes.string.isRequired,
}