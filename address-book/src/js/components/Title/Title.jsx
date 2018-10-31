import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Title.scss';

export default class Title extends React.Component {
    constructor (props) {
        super(props);
    }

    render() {
        const { title, click } = this.props;

        return (
            <div className={styles.package} style={{background: this.props.bgColor}}>
                <div className={styles.title_pack}>
                    <span className={styles.title}>{title}</span>

                </div>
                <div className={styles.icon_pack} onClick={click}>
                    <div className={styles.content_pack}>
                        <img src={require('./search.png')}></img>
                    </div>
                </div>
            </div>
        )
    }
}

Title.propTypes = {
    title: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired,
    bgColor: PropTypes.string.isRequired,
}