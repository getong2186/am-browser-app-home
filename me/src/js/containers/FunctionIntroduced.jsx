// react、redux引用
import React, { Component } from 'react';
import { connect } from 'react-redux';

// 第三方组件和自己封装组件
import ReturnBar from '../components/ReturnBar/ReturnBar';

// 样式
import '../../styles/functionIntroduced/functionIntroduced.scss';


class FunctionIntroduced extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div className='function_introduced_page'>
                <div className='title_pack'>
                    <ReturnBar returnUrl='about' title='功能介绍' bgColor={this.props.state.common.personalInfo.themeColor} />
                </div>
                <div className="iframe_pack">
                    <div className="scroll-wrapper">
                        <iframe src="https://hub.enterplorer.com/feature_android.html" frameborder="0"  scrolling="yes"></iframe>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    state: state
});

export default connect(
    mapStateToProps
)(FunctionIntroduced);







