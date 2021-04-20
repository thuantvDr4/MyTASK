
/**
 * Màn hình tạo prechecklist
 * @uthor thuandd3
 * @dateCreate 14/03/2019
 * @dateEdit ---  
 * @note co animation nut bam neu bi de len field
 */

 // LIB
import React from 'react';
import {
    View, ScrollView, Animated,
    Image, Text, TextInput, TouchableOpacity, Keyboard,
    KeyboardAvoidingView, Alert, Platform} from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import InputScrollView from 'react-native-input-scroll-view';

// API
import * as api from '../api';

// LIB CUSTOM
import ModalPickerSimple from 'app-libs/components/ModalPickerSimple';
import PopupWarning from 'app-libs/components/PopupWarning';
import PopupAction from 'app-libs/components/PopupAction';
import TechLoading from 'app-libs/components/TechLoading';
import NavigationService from 'app-libs/helpers/NavigationService';

// COMPONENT
import InputO from 'app-libs/components/input/InputO';
import InputArea from 'app-libs/components/input/InputArea';
import ButtonO from 'app-libs/components/input/ButtonO';

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

class CreatePreckecklist extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: strings('ctl.nav.titleCrt'),
            // headerLeft: <HeaderBackButton 
            //     onPress={() => NavigationService.navigate('ContractList')} tintColor="#fff"/>,
            headerRight: <View/>,
            navigationOptions: ({navigation}) => ({
                headerStyle: {
                    backgroundColor: '#0B76FF',
                    borderBottomWidth: 0,
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor: 'transparent',
                    elevation: 0
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontSize    :20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    flexGrow: 1
                },
            })
        }
    } 

    //-------------------------------------- DEMO DATA - Xoa
    listId = 
        {
           "FullName": "vutdl test1",
           "Contract": "4423423",
           "Phone1": "0987557633",
           "Address": "3423 St.306, Sangkat Beoung Keng Kang 1, Khan 7Makara, Phnom Penh",
           "ContractStatus": "hihi"
       }
   ;
    //-------------------------------------- DEMO DATA - Xoa

    /**
     *
     */
    constructor(props) {
        super(props);

        this.state = {
            dataItem: this.props.navigation.getParam('data'),
            // dataItem: this.listId,
            dataAPI: {
                apiReasonList: []
            },
            data: {
                ObjID: null,
                Name: "",
                Phone: "",
                ReasonId: null,
                Description: ""
            },
            loadingVisible: false,
            showButton: true,
            fadeD: new Animated.Value(0),
            fadeO: new Animated.Value(1),
        };
    }

    /**
     *
     */
    componentDidMount() {
        this._mounted = true;

        // LOAD API FIRST
        this.props.navigation.addListener('willFocus', () => {
            this._handleLoadReasonList();
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
        Animated.parallel([
            Animated.timing(this.state.fadeD, { toValue: -100, duration: 400, }),
            Animated.timing(this.state.fadeO, { toValue: 0, duration: 400, }),   
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
     * FUNCTION: _handleLoadReasonList (LOAD API)
     * DESC: Load API data ly do loi
     * @param
     * @private
     ***************************************************/
    _handleLoadReasonList() {
        this._loading(true);

        api.loadReasonList({}, (success, result, msg) => {
            this._loading(false);
            
            if (success) {
                let options = [];

                result.map((item)=>{
                    const oneOptions = {
                        label : item.Name,
                        value : item.ID
                    };
                    options.push(oneOptions)
                });

                this.setState({
                    ...this.state,
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiReasonList: options,
                    },
                    loadingVisible: false
                });

            } else {
                this._error(msg);
            }
        });
    }


    /**************************************************
     * FUNCTION: _onSubmit (LOAD API)
     * DESC: Gọi API tao prechecklist
     * @param
     * @private
     ***************************************************/
    _onSubmit() {
        
        // validate form
        if (! this.isValidData()) {
            return;
        }
        
        // show loading
        this._loading(true);

        // var
        const { data, dataItem } = this.state;
        const dataInput = {
            Description: data.Description,
            Name: data.Name,
            ObjID: dataItem.ObjId,
            Phone: data.Phone,
            ReasonID: data.ReasonId
        }  
        
        // push data goi API
        api.createPrechecklist(dataInput, (success, result, msg) => { 
            
            this._loading(false);  
            
            if (success) {
                this.refs['popup'].getWrappedInstance().show(strings('dl.contract_list.noti.createDone'), this.popupAction);
            } else {
                this._error(msg);
            }
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
        if (key != 'Description') {
            this.refs['txt' + key].setValid(true);
        }
    }

    /**************************************************
     * FUNCTION: _onChangeSelect
     * DESC: Xử lý thay đổi chọn select
     * @param
     * @private
     ***************************************************/
    _onChangeSelect(value, kind) {
        switch (kind) {
                
            case 'reason':
                this.setState({
                    data: {        
                        ...this.state.data,
                        ReasonId: value.value,
                    },
                });
                break;

            default:
                break;
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

        // Check ten
        if (data.Name == "") {
            this.refs['txtName'].setValid(false);

            errorList.push({
                name: 'Name',
                msg: strings('dl.contract_list.noti.err.name')
            });
        } else {
            this.refs['txtName'].setValid(true);
        }

        // Check phone
        if (data.Phone == "") {
            this.refs['txtPhone'].setValid(false);

            errorList.push({
                name: 'Phone',
                msg: strings('dl.contract_list.noti.err.phone')
            });
        } else {
            this.refs['txtPhone'].setValid(true);
        }

        // Check phone
        if (data.ReasonId == null) {
            this.refs['optChoice'].setValid(false);

            errorList.push({
                name: 'Reason',
                msg: strings('dl.contract_list.noti.err.reason')
            });
        } else {
            this.refs['optChoice'].setValid(true);
        }

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
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

    /**************************************************
     * FUNCTION: _loading
     * DESC: Hien thi loading
     * @param isShow
     * @private
     ***************************************************/
    _loading(isShow) {
        if(! this._mounted) return;

        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }

    /**************************************************
     * FUNCTION: popupAction
     * DESC: Pass action khi ok popup
     * @param
     * @private
     ***************************************************/
    popupAction() {
        setTimeout(() => {
            // Chi dung navigateBackHome khi tao va chuyen trang
            // Quay ve Home -> Prechecklist List
            NavigationService.navigateBackHome('Prechecklist', {isNew : true})
        }, 400);
    }


    /****************************************************************************************************
     * FUNCTION: render
     * DESC: Render ra giao dien
     *****************************************************************************************************/
    render() {
        const { dataItem, data } = this.state;

        return (
            <View style={[ols.container_keyboard]} >
                <InputScrollView 
                    keyboardOffset={(Platform.OS === 'ios') ? 20 : 40} 
                    keyboardDismissMode={'on-drag'}
                    // behavior= {(Platform.OS === 'ios')? "padding" : "padding"} 
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >
                    <View style={[ols.inner_scrollview]}>
                        
                        <View style={{flex: 3/5}}>
                            {
                                /* 
                                    Info
                                */
                            }
                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('ctl.form.headline.infCon')}</Text>
                            <View style={styles.infoContract}>
                                <View style={[styles.oneInfo, {marginTop: 8}]}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblStatus')}</Text>
                                    <Text style={[styles.infoValue, {color: '#F09C16'}]}>{dataItem.ContractStatus}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblCusName')}</Text>
                                    <Text style={styles.infoValue}>{dataItem.FullName}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblConNum')}</Text>
                                    <Text style={styles.infoValue}>{dataItem.Contract}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblPhoNum')}</Text>
                                    <Text style={styles.infoValue}>{dataItem.Phone1}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblInsAdd')}</Text>
                                    <Text style={styles.infoValue}>{dataItem.Address}</Text>
                                </View>
                            </View>

                            {
                                /* 
                                    Form
                                */
                            }
                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('ctl.form.headline.infPre')}</Text>
                            <View>
                                <View style={styles.container}>
                                    <InputO
                                        ref="txtName"
                                        style={[styles.textInput, ols.fw500]}
                                        label={strings('ctl.form.input.lblConName')}
                                        placeholder={strings('ctl.form.input.plhConName')}
                                        placeholderTextColor='#444444'
                                        textAlign={'right'}
                                        autoCapitalize={'none'}
                                        returnKeyType={'default'}
                                        autoCorrect={false}
                                        value={this.state.data.Name }
                                        onChangeText={(text) => this._onChangeText('Name', text)}
                                        // onFocus={ () => this._onFocus() }
                                        // onBlur={ () => this._onBlur() }
                                        onSubmitEditing={Keyboard.dismiss}
                                    />
                                </View>
                                <View style={styles.container}>
                                    <InputO 
                                        ref="txtPhone"
                                        style={[styles.textInput, ols.fw500]}
                                        label={strings('ctl.form.input.lblPhoNum')}
                                        placeholder={strings('ctl.form.input.plhPhoNum')}
                                        placeholderTextColor='#444444'
                                        textAlign={'right'}
                                        autoCapitalize={'none'}
                                        returnKeyType={'default'}
                                        autoCorrect={false}
                                        keyboardType={'numeric'}
                                        value={ this.state.data.Phone }
                                        onChangeText={(text) => this._onChangeText('Phone', text)}
                                        // onFocus={ () => this._onFocus() }
                                        // onBlur={ () => this._onBlur() }
                                        onSubmitEditing={Keyboard.dismiss}
                                    />
                                </View>
                                <View style={styles.container}>
                                    <ModalPickerSimple
                                        ref="optChoice"
                                        label={strings('ctl.form.input.lblReason')}
                                        placeholder={strings('ctl.form.input.plhReason')}
                                        headerTitle={strings('ctl.popup.titReason')}
                                        options={ this.state.dataAPI.apiReasonList }
                                        getLabel={item => item.label}
                                        onValueChange={value => {
                                            this._onChangeSelect(value, 'reason');
                                        }}
                                        defaultValue={ this.state.data.ReasonId }
                                    />
                                </View>
                                <View style={styles.container}>
                                    <InputArea
                                        ref="txtDesc"
                                        style={[styles.textInput, styles.textArea]}
                                        label={strings('')}
                                        placeholder={strings('ctl.form.input.lblDesc')}
                                        placeholderTextColor='#9A9A9A'
                                        textAlign={'left'}
                                        autoCapitalize={'none'}
                                        returnKeyType={'done'}
                                        autoCorrect={false}
                                        multiline={true}
                                        numberOfLines={4}
                                        onChangeText={(text) => this._onChangeText('Description', text)}
                                        // onFocus={ () => this._onFocus() }
                                        // onBlur={ () => this._onBlur() }
                                        onSubmitEditing={Keyboard.dismiss}
                                        blurOnSubmit={true}

                                    />
                                </View>
                            </View>
                        </View>
                        

                        {
                            // BUTTON FAKE
                            <View style={{flex: 2/5, opacity: 0 }}>
                                <ButtonO
                                    label={strings('ctl.form.btn.create')}
                                    style={{marginBottom: 24,}}
                                    styleBtnText={[ols.btnText]}
                                    styleBtn={[ols.btnFull, ols.btnShadow]}
                                />
                            </View>
                        }
                    </View>
                </InputScrollView>

                {
                    // BUTTON ABSOLUTE
                }
                <Animated.View style={[{marginHorizontal: 24, position: 'absolute', bottom: this.state.fadeD, opacity: this.state.fadeO }]}>
                    <ButtonO
                        label={strings('ctl.form.btn.create')}
                        style={{marginBottom: 24,}}
                        styleBtnText={[ols.btnText]}
                        styleBtn={[ols.btnFull, ols.btnShadow]}
                        onPress={() => this._onSubmit()} />
                </Animated.View>
                        
                    
                {
                    /* 
                        Popup and loading
                    */
                }
                <PopupWarning ref="popup"/>
                <PopupAction ref="popup_action"
                    actionText="OK"
                    actionCallback={() => {}}
                    showBtnCancel={false}
                />
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}

export default connect(null, {})(CreatePreckecklist);