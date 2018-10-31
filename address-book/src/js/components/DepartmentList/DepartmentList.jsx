import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DepartmentList extends React.Component {

    constructor (props) {
        super(props);


    }


    render() {
        return (
            <div className={styles.package}>

            </div>
        )
    }
}

ReturnBar.propTypes = {
    height: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    dataSource: PropTypes.string.object,
    click: PropTypes.func.isRequired,
}