import React, {Component} from 'react';
import {connect} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

/**
 * TechLoading components
 * 
 * - Use react-native-loading-sprinner-overlay
 * - Document see at: https://www.npmjs.com/package/react-native-loading-spinner-overlay
 * 
 * @author DaiDP
 * @since Aug, 2018
 */
class TechAppLoading extends Component
{
    render()
    {
        return (
            <Spinner visible={ this.props.isLoading } />
        );
    }
}

export default connect(
    state => {
        return {
            isLoading: state.splashReducer.isLoading
        }
    }
)(TechAppLoading);