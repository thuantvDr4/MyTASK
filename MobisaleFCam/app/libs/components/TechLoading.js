import React, {Component} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

// REDUX
import { connect } from 'react-redux';
import { checkLoadingLocal } from 'app-libs/helpers/showLoadingHelper';

/**
 * TechLoading components
 * 
 * - Use react-native-loading-sprinner-overlay
 * - Document see at: https://www.npmjs.com/package/react-native-loading-spinner-overlay
 * 
 * @author DaiDPa
 * @since Aug, 2018
 * @modify - ThuanDD3
 * @modifyDate - Jul, 2019
 * @modifiedNote - Update force stop if loading global display
 * 
 */
class TechLoading extends Component {
    /**
     * 
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible != this.props.visible) {
            this._updateLoadingLocalToStore(nextProps.visible);
        }
    }

    /**
     * Dua tinh trang loading local vao redux store
     * @param {*} visible 
     */
    _updateLoadingLocalToStore(visible) {
        this.props.checkLoadingLocal(visible);
    }

    render() {
        const forceStopLoadingLocal = this.props.forceStopLoadingLocal;
        const loadingVisible = this.props.visible;
        
        // console.log("loadingVisible", loadingVisible);
        // console.log("forceStopLoadingLocal", forceStopLoadingLocal);
        return (
            <Spinner {...this.props} visible={!forceStopLoadingLocal ? loadingVisible : !forceStopLoadingLocal } />
        );
    }
}

export default connect(
    
    state => {
        return {
            forceStopLoadingLocal: state.splashReducer.forceStopLoadingLocal
        }
    }, { checkLoadingLocal }
)(TechLoading);