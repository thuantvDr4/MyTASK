// LIB
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
    ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import {DrawerActions} from 'react-navigation';
import {strings} from 'locales/i18n';
import {connect} from 'react-redux';

// API
import * as api from '../api';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';

// COMPONENT
import ChangePassword from '../scenes/ChangePassword';

// ACTION REDUX
import {actions as home} from '../';
const {logout, resetAllDataBookport, updateAvatar} = home;

// VARIABLE
import {IDTYPEAVATAR} from '../constants';

// STYLE
import styles from '../MainMenu.style';

class MainMenu extends Component {

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    constructor(props) {
        super(props);

        this.state = {
            appVersion: this.props.appVersion,
        }

        // Mount
        this._handleNavigateTo = this._handleNavigateTo.bind(this);
        this._handlePressSaleNew = this._handlePressSaleNew.bind(this);
        this._signOut = this._signOut.bind(this);
    }
    
    /**
        * FUNCTION: logout
        * @param to
        * @private
    **/
    _signOut() {
        api.signOut(this.props.Username, (success, result, msg) => {
            
            if (success) {
                this.props.logout();
            } else {
                this._error(msg);
            }
        });

    }
    
    // hiển thị avatar
    renderAvatar() {

        if (this.props.avatar) {
            return <Image style={styles.avatar} source={{uri: this.props.avatar}}/>;
        } else {
            return <Image style={styles.avatar} source={require('../../../assets/images/home/ic_48avatar.png')}/>;
        }
    }

    /**
        * FUNCTION: di chuyển đến màn hình tạo bookport 
        * @param to
        * @private
    **/
    _handlePressSaleNew() {
        const navigate = (route) => {
            return {
                type: DrawerActions.CLOSE_DRAWER,
                action: setTimeout(() => {
                    this.props.resetAllDataBookport();
                    NavigationService.navigate(route);
                }, 150)
            };
        }
        const action = navigate('SaleNew');
        this.props.navigation.dispatch(action);
    }

    
    /**
        * FUNCTION: di chuyển đến màn hình khác
        * @param to
        * @private
    **/
    _handleNavigateTo(to) {
        if (to) {
            setTimeout(() => {
                NavigationService.navigate(to);
            }, 150)
            this.props.navigation.closeDrawer();
            return;
        }

        alert(strings('all.data.future'));
    }

    render () {
        const Version = this.state.appVersion ? this.state.appVersion.Version : null;

        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerTop}>
                    {this.renderAvatar()}
                    </View>
                    <View style={[styles.oneHeader]}>
                        <Text style={styles.headerInfoName}>
                            {this.props.Username}
                        </Text>
                    </View>
                    <View style={[styles.oneHeader, {paddingBottom: 2, paddingTop: 4}]}>
                        <Text style={styles.headerInfoPosition}>
                            {
                                // strings('home.main_menu.salesman')
                            }
                        </Text>
                    </View>
                </View>

                <View style={styles.bodyContainer}>
                    <ScrollView>
                        <View style={{paddingLeft: 32, paddingRight: 16, paddingVertical: 32}}>
                            <TouchableOpacity style={styles.oneFunction} onPress={this._handlePressSaleNew}>
                                <Text style={styles.navItemStyle}>
                                    {strings('home.main_menu.creat_cus_info')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.oneFunction} onPress={() => this._handleNavigateTo('ExtraServiceLists')}>
                                <Text style={styles.navItemStyle}>
                                    {strings('home.main_menu.extra_service')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.oneFunction} onPress={() => this._handleNavigateTo('ContractList')}>
                                <Text style={styles.navItemStyle}>
                                    {strings('home.main_menu.contract_list')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.oneFunction} onPress={() => this._handleNavigateTo('Prechecklist')}>
                                <Text style={styles.navItemStyle}>
                                    {strings('home.main_menu.precheck_list')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.oneFunction} onPress={() => this._handleNavigateTo('DivisionLists')}>
                                <Text style={styles.navItemStyle}>
                                    {strings('home.main_menu.division')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.oneFunction} onPress={() => this._handleNavigateTo('DeploymentList')}>
                                <Text style={styles.navItemStyle}>
                                    {strings('home.main_menu.deployment')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.oneFunction} onPress={() => this._handleNavigateTo('hideTabBottomTypeReportChoose')}>
                                <Text style={styles.navItemStyle}>
                                    {strings('home.main_menu.report')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.oneFunction} onPress={() => this._handleNavigateTo('pcListCustomers')}>
                                <Text style={styles.navItemStyle}>
                                    {strings('home.main_menu.potential_customer')}
                                </Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity 
                                style={styles.oneFunction} 
                                onPress={() => {
                                    this.props.navigation.closeDrawer();
                                    this.refs["ChangePassword"].getWrappedInstance().show(); 
                                }}
                            >
                                <Text style={styles.navItemStyle}>
                                    {strings('home.main_menu.change_password')}
                                </Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity style={styles.oneFunction} onPress={() => this._handleNavigateTo('Settings')}>
                                <Text style={styles.navItemStyle}>
                                    {strings('home.main_menu.settings')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.footerContainer}>
                    <View style={styles.footerTextCotainer}>
                        <Text style={styles.footerText}>{'MobiSale '}
                            { 
                                Version && Version ? Version : this.props.deviceInfo.version
                            }
                        </Text>
                    </View>
                    <View style={styles.footerBtnContainer}>
                        <TouchableOpacity
                            style={styles.footerBtn}
                            onPress={ this._signOut }
                        >
                            <Image
                                style={styles.footerImg}
                                source={require('../../../assets/images/home/ic_24Logout.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <ChangePassword ref="ChangePassword" Username={this.props.Username} /> */}
            </View>
        );
    }
}

MainMenu.propTypes = {
    navigation: PropTypes.object
};


export default connect(
    (state) => {
        return {
            Username: state.authReducer.userInfo.UserName,
            avatar:state.authReducer.avatar,
            appVersion: state.splashReducer.appVersion,
            deviceInfo: state.splashReducer.deviceInfo,
        }
    },
    {logout, resetAllDataBookport,updateAvatar}
)(MainMenu);