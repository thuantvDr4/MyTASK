// LIB
import React from 'react';
import {connect} from 'react-redux';
import {View, ScrollView, WebView, Text, Image,
    StyleSheet, Platform, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import {strings} from 'locales/i18n';
import Icon from 'react-native-vector-icons/FontAwesome';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import ButtonElement from 'app-libs/components/input/ButtonElement';
import TechLoading from 'app-libs/components/TechLoading';
import PopupWarning from 'app-libs/components/PopupWarning';
import PopupAction from 'app-libs/components/PopupAction';
import { AndroidHardwareBack }  from 'app-libs/components/AndroidHardwareBackHandler';

// API
import * as api from '../api';

// STYLE
import moduleStyle from '../styles';
import ols from '../../../styles/Ola-style';


class PaymentQrCode extends React.Component
{
    static navigationOptions = ({navigation}) => {
        
        return {
            title: strings('contract.Qr_code.title'),
            headerLeft: <View/>,

            headerRight: (
                navigation.getParam('btn') ?
                    <TouchableOpacity 
                        onPress={() => navigation.getParam('btn')(1)} 
                        style={{marginRight: 10}}>
                        <Icon name="refresh" size={24} style={{color: '#fff'}}/>
                    </TouchableOpacity>    
                : <View/>
            )
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            params: this.props.navigation.state.params,
            // params: {Contract:"PPFI20153",ObjID:2210263},
            data: null,
            loadingVisible: false,
        }
    }

    /**
     * Khi render man hinh lan dau tien
     */
    componentDidMount() {
        // load detail
        this.props.navigation.addListener('willFocus', () => {
            this._loadData();
        });
    }

    /**
     * 
     */
    _loadData() {
        // 
        this._loading(true);

        // 
        const myData = this.state.params;

        // 
        api.getPaymentCode(myData, (isSuccess, data, msg) => {
            // 
            this._loading(false);

            if (isSuccess) {
                this.setState({
                    ...this.state,
                    data: data,
                    loadingVisible: false
                }, () => {
                    this.props.navigation.setParams({btn: this.refreshQR.bind(this)});
                })

            } else {
                // Hien thi popup khi co loi xay ra
                this.refs['popup'].getWrappedInstance().show(msg.message);
            }
            
        });
    }

    /**
     * 
     */
    refreshQR() {
        this._loadData();
    }

    /**
     * Render qr
     */
    _renderData() {     
        if (this.state.data) {
            
            return (
                <View style={{flex: 1}}>
                    <View style={{flex: 1, flexDirection:'column', justifyContent: 'center'}}>  
                        <View style={{flex: 5/6, justifyContent: 'center', alignItems: 'center'}}>
                            <Image 
                                source={{uri: this.state.data.Link}} 
                                style={styles.imageStyle} 
                                resizeMode="contain" 
                                resizeMethod="auto"/> 
                            
                            {
                                //     <WebView 
                                //     source = {{uri: this.state.data.Link}}
                                //     scalesPageToFit = {true}
                                //     onLoad = {() => { this._loading(false)}}
                                //     onNavigationStateChange={(e)=>{ !e.loading ? () => {} : this._loading(e.loading)}}
                                //     originWhitelist = {['*']}
                                // />
                            }
                        </View>

                        <View style={{flex: 1/6, position: 'relative', justifyContent: 'center', alignItems:'center'}}>
                            <Text style={[ols.fs38, ols.fw500, {marginTop: 0, color: '#000'}] }>{this.state.data.PaymentCode}</Text>
                        </View>
                    </View>

                    <View style={{justifyContent: 'flex-end', alignContent: "center"}}>
                        <View style={styles.buttonContainer}>
                            <ButtonElement 
                                title={strings('contract.Qr_code.btnConfirm')}
                                onPress={this.onSubmit.bind(this)}
                            />
                        </View>
                    </View>
                </View>
            )
        } else {
            return this._renderEmptyNoData()
        }
    }

    /**
     * Render noData
     */
    _renderEmptyNoData() {
        return (
            <View style={ols.dataEmpty} >
                <View style={[ols.wrapImage]}>
                    <Image 
                        style={ols.imageNoData} 
                        source={require('../../../assets/images/contract-list/report.png')}
                    />
                    <View>
                        <Text style={[ols.fs16, ols.fw500, {marginTop: 26, color: '#D6D6D6'}]}>
                            {strings('all.data.noDataNormal')}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    /**
     * Submit
     */
    onSubmit() {
        NavigationService.navigate('ContractDetail', this.state.params);
    }

    /*
     * Loading
     * @param isShow
     * @private
     */
    _loading(isShow) {
        
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }

    /**
     * 
     */
    onBackButtonPressAndroid = () => {
        // this.refs['popup'].getWrappedInstance().show(strings('contract.Qr_code.back'));
        return true;
    };

    /**
     * Render
     */
    render() {

        return (
            <AndroidHardwareBack onBackPress={this.onBackButtonPressAndroid}>
                <KeyboardAvoidingView 
                keyboardVerticalOffset={Platform.select({ios: 70, android: 0})} 
                behavior= {(Platform.OS === 'ios')? "padding" : null} 
                style={[ols.container_keyboard]} >
                    <ScrollView 
                        keyboardDismissMode={'on-drag'}
                        contentContainerStyle={[ols.wrapper_scrollview, {backgroundColor: '#fff'}]}
                    >
                        <View style={[ols.inner_scrollview, ols.bgw, {justifyContent: 'space-between'}]}>
                            {
                                this._renderData()
                            }
                        </View>
                    </ScrollView>

                    <TechLoading visible={this.state.loadingVisible}/>
                    <PopupWarning ref="popup"/>
                    <PopupAction
                        ref="popup_confirm"
                    />
                </KeyboardAvoidingView>      
            </AndroidHardwareBack>   
        );
    }
}

export default connect((state) => {
    return {
        Username: state.authReducer.userInfo.UserName
    }
}, null)(PaymentQrCode);

const styles = StyleSheet.create({
    buttonContainer: {
        marginBottom: 24,
    },
    textBold: {
        fontWeight: '500'
    },
    imageStyle: {
        marginTop: 50,
        width: '100%',
        height: '100%'
    }
});