
// LIB
import React from 'react';
import {View, Image, Text, ScrollView, AppState, Platform} from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';

// COMPONENT
import FormLogin from '../components/FormLogin';
import ButtonImei from '../components/ButtonImei';
import PopupWarning from '../components/PopupWarning';

// LIB CUSTOM
import showLoading from 'app-libs/helpers/showLoading';
import NavigationService from 'app-libs/helpers/NavigationService';
import CustomStatusBar from 'app-libs/components/StatusBar';

// REDUX
import {actions as auth} from '../';
import { hideModalAction, hideModalWarning } from 'app-libs/helpers/showModal';
import { forceStopModalLocal } from 'app-libs/helpers/showModalHelper';
const { login } = auth;

// CONSTANT
import GlobalVariable from '../../../config/globalVariable';

// STYLE
import styles from '../styles'

class Login extends React.Component {

    static navigationOptions = {
        header: null
    }

    /**
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        this.state = {
            appVersion: this.props.appVersion,
            // popupContent: '',
        }

        // Popup Warning
        // this._setPopupWarning = this._setPopupWarning.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * 
     */
    componentDidMount() {

        const alert = this.props.navigation.getParam('alert');
        const { hideModalAction, hideModalWarning, forceStopModalLocal, modalLocal } = this.props;
    
        if (alert && !GlobalVariable.isBackLogin) {
            
            GlobalVariable.isBackLogin = true;
            // MODAL LOCAL - Kiem tra app trước khi bị đẩy ra có đang load modal local không
            if (modalLocal) {
                // Force stop modal local
                forceStopModalLocal(true);
            }

            // MODAL GLOBAL - Nếu bị đẩy ra mà modal global đang mở thì tắt nó.
            hideModalAction();
            hideModalWarning();

            // Hiện modal local
            this.showPopup(alert.message);
        }
    }

    /**
     * 
     */
    componentWillUnmount() {
        // console.log('---------------', AppState.currentState);
    }


    /**
     * 
     * @param {*} data 
     */
    onSubmit(data) {
        
        // Show loading
        this.props.showLoading(true);

        // 
        GlobalVariable.isLogin = true;
        GlobalVariable.isRememberPass = data.Checked;

        // input
        data.deviceToken = this.props.deviceToken;
        data.DeviceIMEI  = this.props.deviceImei;
        data.Platform = Platform.OS === 'android' ? 1 : 2;
        data.CurrentVersion = this.state.appVersion && this.state.appVersion.Version;

        this.props.login(data, this.onLoginSuccess.bind(this), this.onLoginError.bind(this));
    }


    /**
     * 
     */
    onLoginSuccess() {
        const { showLoading } = this.props;

        // 
        GlobalVariable.isLogin = false;
        // Set trạng thái đã login thành công
        GlobalVariable.isLoged = true;
        GlobalVariable.isBackLogin = false;
        
        // OFF LOADING
        showLoading(false);

        // redirect to home
        NavigationService.navigateReset('Home');
    }


    /**
     * 
     * @param {*} error 
     */
    onLoginError(error) {

        // 
        GlobalVariable.isLogin = false;

        // Stop loading
        this.props.showLoading(false);

        if (error.Code === -1) {
            this.showPopup(error.message);
        }
        else {
            // display error
            this.showPopup(strings('dl.dialog.error_connection'));
        }     
    }


    /**
     * // popup OLD
     * @param {*} popup 
     */
    // _setPopupWarning(popup) {
    //     this.PopupWarning = popup;
    // }


    /**
     * 
     * @param {*} message 
     */
    showPopup(message) {
        // popup OLD
        // this.setState({popupContent: message});
        // this.PopupWarning.show();

        // popup NEW
        this.refs['popup'].show(message);
    }


    render() {
        const Version = this.state.appVersion ? this.state.appVersion.Version : null;

        return (
            <ScrollView contentContainerStyle={ styles.container } keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                <CustomStatusBar 
                    backgroundColor="#FFF"
                    barStyle="dark-content"
                />
            
                <PopupWarning
                    // setPopupWarning={this._setPopupWarning}
                    // popupContent={this.state.popupContent}
                    ref="popup"
                />

                <View style={ styles.logo }>
                    <Image source={ require('assets/images/auth/Logo.png') } />
                </View>

                <FormLogin
                    PopupWarning={this.showPopup}
                    onSubmit={this.onSubmit}
                    Username={this.props.Username}
                    rememberPass={GlobalVariable.isRememberPass}
                />
                
                <ButtonImei navigation={this.props.navigation} />

                <Text style={styles.version}>{'MobiSale '}
                    { 
                        // Nếu ko lấy dc IMEI thì ko trả ra version từ server -> lấy version của app thiết bị
                        Version && Version ? Version : this.props.deviceInfo.version
                    }
                </Text>
            </ScrollView>
        );
    }
}

export default connect(
    
    state => {

        return {
            deviceImei: state.splashReducer.deviceImei,
            deviceInfo: state.splashReducer.deviceInfo,
            deviceToken: state.splashReducer.deviceToken,
            appVersion: state.splashReducer.appVersion,
            Username: state.authReducer.Username,
            modalLocal: state.splashReducer.modalLocal
        }
    }, { login, showLoading, hideModalAction, hideModalWarning, forceStopModalLocal })(Login);
