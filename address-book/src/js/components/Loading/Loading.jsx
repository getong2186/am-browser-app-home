import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Loading.scss';

export default class Loading extends React.Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.spinner}>
                <div style={{background: this.props.color}} className={styles.rect1}></div>
                <div style={{background: this.props.color}} className={styles.rect2}></div>
                <div style={{background: this.props.color}} className={styles.rect3}></div>
                <div style={{background: this.props.color}} className={styles.rect4}></div>
                <div style={{background: this.props.color}} className={styles.rect5}></div>
            </div>
        )
    }
}

Loading.propTypes = {
    color: PropTypes.string.isRequired
}