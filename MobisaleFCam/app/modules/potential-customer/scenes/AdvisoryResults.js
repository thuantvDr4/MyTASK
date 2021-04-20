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
    View, ScrollView, Animated, Linking,
    Image, Text, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback,
    KeyboardAvoidingView, Alert, Keyboard } from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {HeaderBackButton} from 'react-navigation';
import InputScrollView from 'react-native-input-scroll-view';

// API
import * as api from '../api';

// LIB CUSTOM
import ModalPickerSimple from 'app-libs/components/ModalPickerSimple';
import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';
import PopupWarning from 'app-libs/components/PopupWarning';
import PopupAction from 'app-libs/components/PopupAction';
import NavigationService from 'app-libs/helpers/NavigationService';

// COMPONENT
import InputO from 'app-libs/components/input/InputO';
import InputArea from 'app-libs/components/input/InputArea';
import ButtonO from 'app-libs/components/input/ButtonO';
import TechLoading from 'app-libs/components/TechLoading';

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

class AdvisoryResults extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('potentianl_customer.advisory.title'),
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>,
            headerRight: (
                <View/>
            ),
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
                fontSize    : 20,
                fontWeight: 'bold',
                textAlign: 'center',
                flexGrow: 1
            },
        };
    };

    //-------------------------------------- DEMO DATA - Xoa
    dataTest = {
        "ReturnReason": "Status",
        "Name": "fasfdsaf",
        "Contract": "4231423gadga",
        "PhoneNumber": "0945160061",
        "Address": "customer said his internet very slow need technician go to check,plz help support for customer,thanks",
        "AppointmentDept": "fds sd ca sca",
        "AppointmentDate": "fdafsdaf",
        "Note": "fdafsdaf"
    };
    dataTest2 = [
       {
           "RowNumber": 1,
           "AdvisoryTimes": "Kết quả tư vấn lần 1",
           "AdvisoryResult": "Khách hàng không nghe máy",
           "CreateDate": "11/07/2019 11:48:40"
       },
       {
           "RowNumber": 2,
           "AdvisoryTimes": "Kết quả tư vấn lần 2",
           "AdvisoryResult": "Khách hàng chỉ hỏi tham khảo giá",
           "CreateDate": "11/07/2019 11:48:57"
       },
       {
           "RowNumber": 3,
           "AdvisoryTimes": "Kết quả tư vấn lần 3",
           "AdvisoryResult": "Khách hàng còn hạn trả trước của NCC khác",
           "CreateDate": "11/07/2019 11:49:00"
       },

    ]
    //-------------------------------------- DEMO DATA - Xoa

    /**
     *
     */
    constructor(props) {
        super(props);

        this.state = {
            dataAPI: {
                // apiAdvisoryList: this.dataTest2,
                apiAdvisoryList: []
            },
            data: {
                Note: "",
                PotentialCusId: this.props.navigation.getParam('PotentialCusId', "0"),
            },
            loadingVisible: false,
        };

        this.reloadScreen = this.reloadScreen.bind(this);
        this.changeAdvisory = this.changeAdvisory.bind(this);
    }
    
    /**
     *
     */
    componentDidMount() {
        this._mounted = true;

        // LOAD API FIRST
        // this.props.navigation.addListener('willFocus', () => {});
        this._handleLoadAdvisoryList();
    }


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
        // Hide loading
        this._loading(false);
        if (!err.message) return;
        this.refs['popup'].getWrappedInstance().show(err.message);
    }


    /**************************************************
     * FUNCTION: _isValidData
     * DESC: Kiem tra gia tri co de trang hoac khoang trang hay ko
     * @param text
     * @public
     ***************************************************/
    _isValidData() {
        const { data } = this.state;
        let errorList = [];

        // Check Option
        if (data.result == null) {
            this.refs['selPicker'].setValid(false);

            errorList.push({
                name: 'selPicker',
                msg: strings('dl.potentianl_customer.advisory.err.picker')
            });
        } else {
            this.refs['selPicker'].setValid(true);
        }

        // Check Note
        if (data.result && data.result.Other === 1) {
            if (data.Note == "") {
                this.refs['txtNote'].setValid(false);
    
                errorList.push({
                    name: 'txtNote',
                    msg: strings('dl.potentianl_customer.advisory.err.note')
                });
            } else {
                this.refs['txtNote'].setValid(true);
            }
        }
        

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }


    /**************************************************
     * FUNCTION: _handleLoadAdvisoryList (LOAD API)
     * DESC: Load API data advisory
     * @param
     * @private
     ***************************************************/
    _handleLoadAdvisoryList() {
        // Show loading
        this._loading(true);
        
        // Input data
        const myInput = {
            PotentialCusId: this.state.data.PotentialCusId
        }

        // Get API
        api.getAdvisoryList(myInput, (success, result, msg) => {
            // Hide loading
            this._loading(false);
            
            if (success) {
                this.setState({
                    ...this.state,
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiAdvisoryList: result,
                    }
                });

            } else {
                // Tạm ẩn popup
                // this._error(msg);
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
        if (key === 'Note') {
            this.refs['txt' + key].setValid(true);
        }
    }


    /**************************************************
     * FUNCTION: _onSubmit
     * DESC: Xu ly submit update
     * @param
     * @private
     ***************************************************/
    _onSubmit() {

        if (! this._isValidData()) {
            return;
        }

        // Show loading
        this._loading(true);

        // Input data
        const { data } = this.state;
        const myInput = {
            PotentialCusId: data.PotentialCusId,
            AdvisoryId: data.result.Id,
            AdvisoryValue: data.result.Other === 0 ? data.result.Name : data.Note,
        }

        // Get API
        api.updateAdvisory(myInput, (success, result, msg) => {
            // Hide loading
            this._loading(false);
            
            if (success) {
                this.refs['popup'].getWrappedInstance().show(strings('dl.potentianl_customer.advisory.noti.update'), this.reloadScreen );

            } else {
                this._error(msg);
            }
        });
    }


    /**************************************************
     * FUNCTION: _renderItem
     * DESC: Xu ly render list advisory
     * @param
     * @private
     ***************************************************/
    _renderItem() {
        const { apiAdvisoryList } = this.state.dataAPI;
        let i = 0;
        
        return (
            apiAdvisoryList.map((item) => { // This will render a row for each data element.
                i++;
                return (<View key={i} style={[styles.infoContact, i !== 1 ? {marginTop: 10} : null] }>
                    <View style={[styles.oneInfoN, {marginTop: 10}]}>
                        <Text style={styles.infoTitle}>{strings('potentianl_customer.advisory.form.resultsNo')}</Text>
                        <Text style={styles.infoValue}>{item && item.AdvisoryTimes ? item.AdvisoryTimes : "" }</Text>
                    </View>
                
                    <View style={styles.oneInfoN}>
                        <Text style={styles.infoTitle}>{strings('potentianl_customer.advisory.form.results')}</Text>
                        <Text style={styles.infoValue}>{item && item.AdvisoryResult ? item.AdvisoryResult : "" }</Text>
                    </View>
                    <View style={[styles.oneInfoN, {marginBottom: 15}]}>
                        <Text style={styles.infoTitle}>{strings('potentianl_customer.advisory.form.resultsCallDate')}</Text>
                        <Text style={styles.infoValue}>{item && item.CreateDate ? item.CreateDate : "" }</Text>
                    </View>
                </View>
                )
            })
        )
        
    }


    /****************************************************************************************************
     * FUNCTION: changeAdvisory 
     * DESC: Xu ly khi chon Pikcer (Pass component)
     * @param err
     * @public
     *****************************************************************************************************/
    changeAdvisory(selectItem) {

        if (selectItem == this.state.data.result) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                Note: "",
                result: selectItem
            },
        });
    }

    /****************************************************************************************************
     * FUNCTION: reloadScreen
     * DESC: Pass action khi ok popup (Pass component)
     * @param
     * @private
     *****************************************************************************************************/
    reloadScreen() {
        setTimeout(() => {
            this._handleLoadAdvisoryList();
        }, 400);
    }


    /**************************************************
     * FUNCTION: render 
     ***************************************************/
    render(){
        const { result } = this.state.data;

        return (
            <View style={[ols.container_keyboard]} >
                <InputScrollView 
                    keyboardOffset={(Platform.OS === 'ios') ? 20 : 40} 
                    keyboardDismissMode={'on-drag'}
                    // behavior= {(Platform.OS === 'ios')? "padding" : "padding"} 
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >
                    <View style={[ols.inner_scrollview]}>         
                        {
                            /* 
                                Form
                            */
                        }
                        <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                            {strings('potentianl_customer.advisory.form.headline.info')}
                        </Text>
                        <View style={styles.container}>             
                            <PickerSearchInput
                                ref="selPicker"
                                label = {strings('potentianl_customer.advisory.form.pickerlabel')}
                                placeholder = {strings('potentianl_customer.advisory.form.pickerPlh')}
                                filterText = {strings('potentianl_customer.advisory.form.pickerTitle')}
                                getOptionData = { api.getAdvisoryTemplateList }
                                value = {  this.state.data.result }
                                onChange = { this.changeAdvisory }
                            />
                                {
                                    result && result.Other === 1
                                    ?
                                        <InputArea
                                            ref="txtNote"
                                            style={[styles.textInput, styles.textArea]}
                                            label={strings('')}
                                            placeholder={strings('potentianl_customer.advisory.form.note')}
                                            placeholderTextColor='#9A9A9A'
                                            textAlign={'left'}
                                            textAlignVertical={'top'}
                                            autoCapitalize={'none'}
                                            returnKeyType={'done'}
                                            autoCorrect={false}
                                            multiline={true}
                                            numberOfLines={4}
                                            onChangeText={(text) => this._onChangeText('Note', text)}
                                            onSubmitEditing={Keyboard.dismiss}
                                            blurOnSubmit={true}
                                        />
                                    :
                                        null
                                }
                            
                            <ButtonO
                                label={strings('potentianl_customer.advisory.form.btn')}
                                style={{marginBottom: 24, marginTop: 10}}
                                styleBtnText={[ols.btnText]}
                                styleBtn={[ols.btnFull, {height: 44}]}
                                onPress={() => this._onSubmit()} />
                        </View>
                        
                        {
                            /* 
                                Data render
                            */
                        }
                        <View style={{width: '100%', borderTopWidth: 1, borderTopColor: '#A9A9A9'}}>
                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings('potentianl_customer.advisory.form.headline.list')}
                            </Text>
                        </View>
                        { this.state.dataAPI.apiAdvisoryList ? this._renderItem() : <View></View> }
                        
                    </View>
                </InputScrollView>
                        
                    
                {
                    /* 
                        Popup
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
export default connect(null, {})(AdvisoryResults);