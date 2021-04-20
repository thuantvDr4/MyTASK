/**
 * Màn hình chi tiet phieu thi cong
 * @uthor thuandd3
 * @dateCreate 31-05-19
 * @dateEdit ---  
 * @note co animation view (fake keyboardavoiding view) neu bi de len field
 */

 // LIB
import React from 'react';
import {
    View, ScrollView, Animated,
    Image, Text, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback,
    KeyboardAvoidingView, Alert, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {HeaderBackButton} from 'react-navigation';

// API
import * as api from '../api';

// LIB COMPONENT CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import PopupAction from 'app-libs/components/PopupAction';
import TechLoading from 'app-libs/components/TechLoading';
import NavigationService from 'app-libs/helpers/NavigationService';

// COMPONENT
import InputArea from 'app-libs/components/input/InputArea';
import ButtonO from 'app-libs/components/input/ButtonO';

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

// FAKE KEYBOARD PERSIST TAP
const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class DeploymentDetail extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Deployment Detail',
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>,
            headerRight: <View/>,
        };
    };

    //-------------------------------------- DEMO DATA - Xoa
    dataTest = {
        "ReturnReason": "Status",
        "Name": "fasfdsaf",
        "Contract": "4231423gadga",
        "Phone": "fasdfsaf",
        "Address": "customer said his internet very slow need technician go to check,plz help support for customer,thanks",
        "AppointmentDept": "fds sd ca sca",
        "AppointmentDate": "fdafsdaf",
        "Note": "fdafsdaf"
    };
    //-------------------------------------- DEMO DATA - Xoa

    constructor(props) {
        super(props);

        this.state = {
            SupID: this.props.navigation.getParam('SupID'),
            data: {
                Note: ""
            },
            // data: this.dataTest,
            heightOffset: null,
            loadingVisible: false,
            showButton: true,
            fadeD: new Animated.Value(0),
            fadeO: new Animated.Value(1),
        };
    }

    /**
     *
     */
    componentDidMount(){
        // LOAD API FIRST
        this.props.navigation.addListener('willFocus', () => {
            this._loadDeployDetail();
        });
    }

    /**
     *
     */
    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    
    /**
     *
     */
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this._mounted = false
    }

    /**************************************************
     * FUNCTION: _loadDeployDetail (LOAD API)
     * DESC: Load API data detail
     * @param
     * @private
     ***************************************************/
    _loadDeployDetail() {
        // loading
        this._loading(true);

        // variable
        const { SupID } = this.state;

        // call API
        api.getDeployDetail(SupID, (success, result, msg) => {
            this._loading(false);
            
            if (success) {
                
                this.setState({
                    data: {
                        ...this.state.data,
                        ...result[0],
                    }
                });

            } else {
                this._error(msg);
            }
        });
    }

    /**************************************************
     * FUNCTION: _goToDeploy (Navigate)
     * DESC: Navigate den man hinh tich hen
     * @param
     * @private
     ***************************************************/
    _goToDeploy() {
        NavigationService.navigate('DeployAppointment', {
            'routeName' : 'DeploymentDetail',
            'RegCode': this.state.data.RegCode,
            'ObjID': this.state.data.ObjId
        });
    }

    /**************************************************
     * FUNCTION: _onChangeText
     * DESC: Xử lý thay đổi text input
     * @param
     * @private
     ***************************************************/
    _onChangeText(key, text) {
        var state = this.state;

        state.data[key] = text;
        this.setState(state);

        // Set validate
        if (key === 'Note') {
            this.refs['txt' + key].setValid(true);
        }
    }

    /**************************************************
     * FUNCTION: isValidData
     * DESC: Kiem tra gia tri co de trang hoac khoang trang hay ko
     * @param text
     * @public
     ***************************************************/
    isValidData(temp) {
        const { data } = this.state;

        let errorList = [];

        // Check Note
        if (data.Note == "") {
            this.refs['txtNote'].setValid(false);

            errorList.push({
                name: 'Name',
                msg: strings('dl.deployment.noti.err')
            });
        } else {
            this.refs['txtNote'].setValid(true);
        }

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }

    /**************************************************
     * FUNCTION: _submitTransfer (Xử lý API)
     * DESC: Xử lý API
     * @param
     * @private
     ***************************************************/
    submitTransfer() {
        const { data } = this.state;
        const dataInput = {
            ReturnId: data.ReturnId,
            ObjId: data.ObjId,
            SupId: data.SupId,
            StatusResult: 1,
            Note: data.Note,
            RegCode: data.RegCode,
        }
        
        // validate form
        if (! this.isValidData()) {
            return;
        }

        // show loading
        this._loading(true);

        // call api
        api.DeploymentReturnUpdate(dataInput, (success, result, msg) => {
            this._loading(false);

            if (success) {
                this.refs['popup'].getWrappedInstance().show(strings('dl.deployment.noti.transfer'), this.popupActionFinish);
            } else {
                this._error(msg);
            }
        });
    }

    /**************************************************
     * FUNCTION: _submitNotOK (Xử lý API)
     * DESC: Xử lý API
     * @param
     * @private
     ***************************************************/
    submitNotOK() {
        const { data } = this.state;
        const dataInput = {
            ReturnId: data.ReturnId,
            ObjId: data.ObjId,
            SupId: data.SupId,
            StatusResult: 2,
            Note: data.Note,
            RegCode: data.RegCode,
        }

        // show loading
        this._loading(true);

        // call api
        api.DeploymentReturnUpdate(dataInput, (success, result, msg) => {
            this._loading(false);

            if (success) {
                this.refs['popup'].getWrappedInstance().show(strings('dl.deployment.noti.notOK'), this.popupActionFinish);
            } else {
                this._error(msg);
            }
        });
    }

    /**************************************************
     * FUNCTION: popupAction
     * DESC: Navigate Back sau khi got it
     * @param
     * @private
     ***************************************************/
    popupActionFinish() {  
        setTimeout(() => {
            NavigationService.navigateGoBack();
        }, 400);
    }

    /**************************************************
     * FUNCTION: isValidData
     * DESC: OFFSET DÀN NÚT BẤM
     * @param object
     * @public
     ***************************************************/
    find_dimesions(layout) {
        this.setState({ 
            heightOffset: layout.height });
    }
    
    /**************************************************
     * FUNCTION: keyboardDown
     * @param
     * @private
     ***************************************************/
    _keyboardDidShow () {
        this._fadeDown();
        if (this.state.showButton) { this.setState({ ...this.state, showButton: false }); }
    }
    
    /**************************************************
     * FUNCTION: keyboardUp
     * @param
     * @private
     ***************************************************/
    _keyboardDidHide () {
        this._fadeUp();
        this.setState({ ...this.state, showButton: true });
    }

    /**************************************************
     * FUNCTION: Animation Button
     * @param
     * @private
     ***************************************************/
    _fadeDown() {
        let offSet = parseFloat(this.state.heightOffset).toFixed(2) * -1;

        Animated.parallel([
            Animated.timing(this.state.fadeD, { toValue: offSet, duration: 300, }),
            Animated.timing(this.state.fadeO, { toValue: 1, duration: 300, }),   
        ]).start();
    }

    _fadeUp() {
        Animated.parallel([
            Animated.timing(this.state.fadeD, { toValue: 0, duration: 300, }),
            Animated.timing(this.state.fadeO, { toValue: 1, duration: 300, }),
        ]).start();
    }

    /**************************************************
     * FUNCTION: Focus and Blur Text Input
     * @param
     * @private
     ***************************************************/
    _onFocus() { this.setState({ ...this.state, showButton: false }); }
    _onBlur() { this.setState({ ...this.state, showButton: true }); }

    /**************************************************
     * FUNCTION: _loading
     * DESC: Hien thi loading
     * @param isShow
     * @private
     ***************************************************/
    _loading(isShow) {
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }

    /**************************************************
     * FUNCTION: _error
     * DESC: Hien thi popup error
     * @param err
     * @private
     ***************************************************/
    _error(err) {
        this._loading(false);
        if (! err.message) return;
        this.refs['popup'].getWrappedInstance().show(err.message);
    }

    render(){
        const data = this.state.data;
        // console.log('----------------', data);

        return (
            <View style={{flex: 1, position: 'relative', backgroundColor:'#F8F9FB'}}>
                <Animated.View style={[ols.container_keyboard, {width: '100%', height: '100%', position: 'absolute',
                top: this.state.fadeD, opacity: this.state.fadeO}]}>
                    <DismissKeyboard>
                        <KeyboardAvoidingView style={styles.container} 
                            behavior={(Platform.OS === 'ios') ? null : null}
                            keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
                            enabled >

                            <View style={[{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}]} >
                                <View style={[{flex: 2/3, paddingHorizontal: 24, }]}>
                                    <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{
                                        strings('dplment.form.headline.inf')}
                                    </Text>
                                    {/* 
                                        Info
                                    */}
                                    <View style={styles.infoContact}>
                                        <View style={[styles.oneInfoN, {marginTop: 10}]}>
                                            <Text style={styles.infoTitle}>{strings('dplment.item.lblRtrs')}</Text>
                                            <Text style={[styles.infoValue, {color: '#F09C16'}] }>
                                                {data && data.ReturnReason ? data.ReturnReason : "" }
                                            </Text>
                                        </View>
                                        <View style={styles.oneInfoN}>
                                            <Text style={styles.infoTitle}>{strings('dplment.item.lblCusName')}</Text>
                                            <Text style={styles.infoValue}>{data && data.Name ? data.Name : "" }</Text>
                                        </View>
                                        <View style={styles.oneInfoN}>
                                            <Text style={styles.infoTitle}>{strings('dplment.item.lblConNum')}</Text>
                                            <Text style={styles.infoValue}>{data && data.Contract ? data.Contract : "" }</Text>
                                        </View>
                                        <View style={styles.oneInfoN}>
                                            <Text style={styles.infoTitle}>{strings('dplment.item.lblPhoNum')}</Text>
                                            <Text style={styles.infoValue}>{data && data.Phone ? data.Phone : "" }</Text>
                                        </View>
                                        <View style={styles.oneInfoN}>
                                            <Text style={styles.infoTitle}>{strings('dplment.item.lblInsAdd')}</Text>
                                            <Text style={styles.infoValue}>{data && data.Address ? data.Address : "" }</Text>
                                        </View>
                                        <View style={styles.oneInfoN}>
                                            <Text style={styles.infoTitle}>{strings('dplment.item.lblDept')}</Text>
                                            <Text style={styles.infoValue}>{data && data.AppointmentDept ? data.AppointmentDept : "" }</Text>
                                        </View>
                                        <View style={[styles.oneInfoN, {marginBottom: 15}]}>
                                            <Text style={styles.infoTitle}>{strings('dplment.item.lblAppo')}</Text>
                                            <Text style={styles.infoValue}>{data && data.AppointmentDate ? data.AppointmentDate : "" }</Text>
                                        </View>
                                    </View>
                               
                                    {/* 
                                        Form
                                    */}
                                    <View style={[ols.mgt15]}>
                                        <InputArea
                                            ref="txtNote"
                                            style={[styles.textInput, styles.textArea]}
                                            label={strings('')}
                                            placeholder={strings('dplment.item.lblNote')}
                                            placeholderTextColor='#9A9A9A'
                                            textAlign={'left'}
                                            textAlignVertical={'top'}
                                            autoCapitalize={'none'}
                                            returnKeyType={'done'}
                                            autoCorrect={false}
                                            multiline={true}
                                            numberOfLines={4}
                                            onChangeText={(text) => this._onChangeText('Note', text)}
                                            // onFocus={ () => this._onFocus() }
                                            // onBlur={ () => this._onBlur() }
                                            onSubmitEditing={Keyboard.dismiss}
                                            blurOnSubmit={true}
                                        />
                                    </View>
                                </View>

                                <View 
                                    onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}
                                    ref="btnWrap"
                                    style={[{flex: 1/3, marginBottom: 24, alignItems: 'center', justifyContent: 'flex-end'}]}>
                                    <ButtonO
                                        label={strings('dplment.form.btn.btnDeploy')}
                                        style={{marginBottom: 12}}
                                        styleBtn={[ols.btnFullLine]}
                                        styleBtnText={[ols.btnTextLine, ols.btnShadow]}
                                        onPress={() => this._goToDeploy()} />
                                    
                                    <ButtonO
                                        label={strings('dplment.form.btn.btnTransfer')}
                                        style={{marginBottom: 12}}
                                        styleBtnText={[ols.btnText]}
                                        styleBtn={[ols.btnFull, ols.btnShadow]}
                                        onPress={() => this.refs['popup_action_OK'].getWrappedInstance().show(strings('dl.deployment.noti.cfiTransfer')) } />

                                    <ButtonO
                                        label={strings('dplment.form.btn.btnNotOk')}
                                        styleBtnText={[ols.btnText]}
                                        styleBtn={[ols.btnFull, ols.btnShadow]}
                                        onPress={() => this.refs['popup_action_notOK'].getWrappedInstance().show(strings('dl.deployment.noti.cfiNotOK')) } />
                                    
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </DismissKeyboard>
                    
                    {
                        /* 
                            Popup and loading
                        */
                    }
                    <PopupWarning ref="popup"/>
                    <PopupAction ref="popup_action_OK"
                        actionText="OK"
                        actionCallback={this.submitTransfer.bind(this)}
                        showBtnCancel={true}
                    />
                    <PopupAction ref="popup_action_notOK"
                        actionText="OK"
                        actionCallback={this.submitNotOK.bind(this)}
                        showBtnCancel={true}
                    />
                    
                    <TechLoading visible={this.state.loadingVisible}/>
                </Animated.View>
            </View>
        );
    }
}
export default connect(null, {})(DeploymentDetail)