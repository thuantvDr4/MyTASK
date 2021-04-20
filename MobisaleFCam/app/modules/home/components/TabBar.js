import React, {Component} from 'react';
import {
    View,
    TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback,
    Image
} from 'react-native';

// LIB
import ViewOverflow from 'react-native-view-overflow';

// CUSTOM LIB
import NavigationService from 'app-libs/helpers/NavigationService';

// REDUX
import {connect} from 'react-redux';
import {actions} from '../';

// STYLE
import styles from '../TabBar.style';

// CONST
const {resetAllDataBookport} = actions;

class TabBar extends React.Component {

    constructor(props) {
        super(props);

        this._handlePressSaleNew = this._handlePressSaleNew.bind(this);
    }

    _handlePressSaleNew() {
        this.props.resetAllDataBookport();
        NavigationService.navigate('SaleNew');
    }

    render () {
        const {
            navigation: {state: {index, routes}},
            style,
            activeTintColor,
            inactiveTintColor,
            renderIcon,
            jumpTo
        } = this.props;

        const currentRouteKey = routes[index].key;

        if(!this.props.showTabBar)
            return null;

        return(
            <ViewOverflow style={styles.container}>
                {/*
                    // ---- Button left
                */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabBodyContainer}>
                        <TouchableOpacity
                            style={styles.oneTab}
                            onPress={() => jumpTo('TabHome')}
                        >
                            <Image style={styles.tabImg}
                                source={currentRouteKey == 'TabHome' 
                                ? require('../../../assets/images/home/ic_32Home_on.png') 
                                : require('../../../assets/images/home/ic_32Home.png')}
                            />
                            <View style={currentRouteKey == 'TabHome' ? [styles.seperator] : ''}></View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.oneTab}
                            onPress={() => jumpTo('TabListCustomerInfo')}
                        >
                            <Image style={styles.tabImg}
                                source={currentRouteKey == 'TabListCustomerInfo' 
                                ? require('../../../assets/images/home/ic_40TDanh_sach_TTKH.png') 
                                : require('../../../assets/images/home/ic_30TTKH_off.png')}
                            />
                            <View style={currentRouteKey == 'TabListCustomerInfo' ? [styles.seperator] : ''}></View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*
                    // ---- Button +
                */}
                <ViewOverflow style={styles.tabPlusContainer}>
                    <ViewOverflow style={styles.tabBodyPlusContainer}>
                        <TouchableOpacity
                            style={styles.oneTabPlus}
                            activeOpacity={1}
                            onPress={this._handlePressSaleNew}
                        >
                            <Image 
                                resizeMode={'stretch'}
                                style={[styles.tabImgPlus]}
                                source={require('../../../assets/images/home/ic_56Ban_hang.png')}/>
                        </TouchableOpacity>
                    </ViewOverflow>
                </ViewOverflow>

                {/*
                    // ---- Button right
                */}
                <View style={styles.tabContainer}>
                    
                    <View style={styles.tabBodyContainer}>
                        <TouchableOpacity
                            style={styles.oneTab}
                            onPress={() => NavigationService.navigate('hideTabBottomTypeReportChoose')}
                        >
                            <Image style={styles.tabImg}
                                source={currentRouteKey == 'TabReport' 
                                ? require('../../../assets/images/home/ic_40Bao_cao.png') 
                                : require('../../../assets/images/home/Bao_cao_off.png')}
                            />
                            <View style={currentRouteKey == 'TabReport' ? [styles.seperator] : ''}></View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.oneTab}
                            onPress={() => NavigationService.navigate('DeploymentList')}
                        >
                            <Image 
                                style={styles.tabImg}
                                source={currentRouteKey == 'TabDeploy' 
                                ? require('../../../assets/images/home/Trien_khai_on.png') 
                                : require('../../../assets/images/home/ic_32TrienKhai_off.png')}
                            />
                            <View style={currentRouteKey == 'TabDeploy' ? [styles.seperator] : ''}></View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ViewOverflow>
        );
    }
}
export default connect((state) => {
    return{
        showTabBar: state.homeReducer.showTabBar
    }
},{resetAllDataBookport})(TabBar);