
/**
 * Màn hình tạo Division
 * @uthor Tuấn Anh
 * @dateCreate 19/09/2019
 * @dateEdit ---  
 * @Note co animation nut bam neu bi de len field
 */

// LIB
import React from 'react';
import {
    View, Animated, Text, Keyboard, Platform, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { strings } from 'locales/i18n';
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
import { TouchableHighlight } from 'react-native-gesture-handler';
import ModalPickerReset from '../../../libs/components/ModalPickerSimpleReset';

// FAKE KEYBOARD PERSIST TAP
const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);
class CreateDivision extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('dvs.nav.titleCrt'),
            // headerLeft: <HeaderBackButton 
            //     onPress={() => NavigationService.navigate('ContractList')} tintColor="#fff"/>,
            headerRight: <View />,
            navigationOptions: ({ navigation }) => ({
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
                    fontSize: 20,
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
                apiRequestList: [],
                apiSubRequestList: [],
                apiDepartmentList: [],
            },
            data: {
                Request: null,
                SubRequest: null,
                Department: null,
                Subject: '',
                Note: ''
            },
            heightOffset: null,
            loadingVisible: false,
            showButton: true,
            fadeD: new Animated.Value(0),
            fadeO: new Animated.Value(1),
            isNewRequest: false
        };
    }

    /**
     *
     */
    componentDidMount() {
        this._mounted = true;

        // LOAD API FIRST
        this._handleLoadRequest();
        // this.props.navigation.addListener('willFocus', () => {});
        
    }

    /**
     *
     */
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    /**
     *
     */
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this._mounted = false
    }

    /**************************************************
     * FUNCTION: keyboardDown
     * @param
     * @private
     ***************************************************/
    _keyboardDidShow() {
        this._fadeDown();
        if (this.state.showButton) { this.setState({ ...this.state, showButton: false }); }
    }

    /**************************************************
     * FUNCTION: keyboardUp
     * @param
     * @private
     ***************************************************/
    _keyboardDidHide() {
        this._fadeUp();
        this.setState({ ...this.state, showButton: true });
    }

    /**************************************************
     * FUNCTION: Animation Button
     * @param
     * @private
     ***************************************************/
    _fadeDown() {
        // trừ thêm 50px để hiện ra button create trên bàn phím
        // let offSet = parseFloat(this.state.heightOffset).toFixed(2) * -1 - 50;

        Animated.parallel([
            Animated.timing(this.state.fadeD, { toValue: 0, duration: 300, }),
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
     * FUNCTION: _handleLoadRequest (LOAD API)
     * DESC: Load danh sách request
     * @param
     * @private
     ***************************************************/
    _handleLoadRequest = () => {
        this._loading(true);

        api.loadRequestList({}, (success, result, msg) => {
            // this._loading(false);

            if (success) {
                let options = [];

                result.map((item) => {
                    const oneOptions = {
                        label: item.Description,
                        value: item.ID
                    };
                    options.push(oneOptions)
                });

                this.setState({
                    ...this.state,
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiRequestList: options,
                    },
                    // loadingVisible: false
                }, () => {
                    this._handleLoadDepartment();
                });

            } else {
                this._error(msg);
                this._loading(false);
            }
        });
    }


    /**************************************************
     * FUNCTION: _handleLoadSubRequest (LOAD API)
     * DESC: Load danh sách Sub Request theo id request đã chọn
     * @param
     * @private
     ***************************************************/
    _handleLoadSubRequest = (RequestID) => {

        this._loading(true);

        api.loadSubRequestList({ RequestID }, (success, result, msg) => {

            // this._loading(false);

            if (success) {
                let options = [];

                result.map((item) => {
                    const oneOptions = {
                        label: item.Description,
                        value: item.Code
                    };
                    options.push(oneOptions)
                });

                setTimeout(() => {
                    this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            Request: RequestID,
                            SubRequest: null
                        },
                        dataAPI: {
                            ...this.state.dataAPI,
                            apiSubRequestList: options,
                        },
                        isNewRequest: true,
                        loadingVisible: false
                    });
                }, 400);
                

            } else {
                this._error(msg);
                this._loading(false);
            }
        });
    }



    /**************************************************
     * FUNCTION: _handleLoadDepartment (LOAD API)
     * DESC: Load danh sách Sub Request theo id request đã chọn
     * @param
     * @private
     ***************************************************/
    _handleLoadDepartment = () => {
        // this._loading(true);

        api.loadDepartmentList({ Contract: this.state.dataItem.Contract }, (success, result, msg) => {
            
            // this._loading(false);
            if (success) {

                let options = [];

                result.map((item) => {
                    const oneOptions = {
                        label: item.Description,
                        value: item.ID
                    };
                    options.push(oneOptions)
                });

                this.setState({
                    ...this.state,
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiDepartmentList: options,
                    },
                    loadingVisible: false
                });

            } else {
                this._error(msg);
                this._loading(false);
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

        // tắt bàn phím nếu đang hiện
        Keyboard.dismiss();


        // validate form
        if (!this.isValidData()) {
            return;
        }

        // show loading
        this._loading(true);

        // // map payload
        const { data, dataItem } = this.state;
        const dataInput = {
            Contract: dataItem.Contract,
            SubRequestID: data.SubRequest,
            DepartmentID: data.Department,
            Subject: data.Subject.trim(),
            Note: data.Note.trim(),
        }

        // push data goi API
        api.createDivision(dataInput, (success, result, msg) => {

            this._loading(false);

            if (success) {
                this.refs['popup'].getWrappedInstance().show(strings('dl.division.noti.createDone'), this.popupAction);
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
        this.refs['txt' + key].setValid(text.trim() !== '');
    }

    /**************************************************
     * FUNCTION: _onChangeSelect
     * DESC: Xử lý thay đổi chọn select
     * @param
     * @private
     ***************************************************/
    _onChangeSelect(value, kind) {
        switch (kind) {
            case 'request':

                /**
                * Kiểm tra nếu người dùng chọn giá trị cũ thì không get lại subrequest nữa
                * và set giá trị cho isNewRequest == true để reset toàn bộ field SubRequest nếu
                * người dùng chọn mới Request.
                */
                if (value.value !== this.state.data.Request) {
                    this._handleLoadSubRequest(value.value);
                }

                break;

            case 'subRequest':
                this.setState({
                    data: {
                        ...this.state.data,
                        SubRequest: value.value,
                    },
                    isNewRequest: false
                });
                break;

            case 'department':
                this.setState({
                    data: {
                        ...this.state.data,
                        Department: value.value,
                    },
                });
                break;

            default:
                break;
        }
    }


    /**************************************************
     * FUNCTION: isValidData
     * DESC: OFFSET DÀN NÚT BẤM
     * @param object
     * @public
     ***************************************************/
    find_dimesions(layout) {
        this.setState({
            heightOffset: layout.height
        });
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


        // Check Request
        if (data.Request == null) {
            this.refs['optRequest'].setValid(false);

            errorList.push({
                name: 'Request',
                msg: strings('dl.division.noti.err.Request')
            });
        } else {
            this.refs['optRequest'].setValid(true);
        }

        // Check SubRequest
        if (data.SubRequest == null && this.refs['optSubRequest']) {
            this.refs['optSubRequest'].setValid(false);

            errorList.push({
                name: 'SubRequest',
                msg: strings('dl.division.noti.err.SubRequest')
            });
        } else {
            if (this.refs['optSubRequest']) {
                this.refs['optSubRequest'].setValid(true);
            }
        }

        // Check Department
        if (data.Department == null) {
            this.refs['optDepartment'].setValid(false);

            errorList.push({
                name: 'Department',
                msg: strings('dl.division.noti.err.Department')
            });
        } else {
            this.refs['optDepartment'].setValid(true);
        }

        // Check subject
        if (data.Subject.trim() == "") {
            this.refs['txtSubject'].setValid(false);

            errorList.push({
                name: 'Subject',
                msg: strings('dl.division.noti.err.Subject')
            });
        } else {
            this.refs['txtSubject'].setValid(true);
        }

        // Check Note
        if (data.Note.trim() == "") {
            this.refs['txtNote'].setValid(false);

            errorList.push({
                name: 'Note',
                msg: strings('dl.division.noti.err.Note')
            });
        } else {
            this.refs['txtNote'].setValid(true);
        }

        // error list
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
        if (!err.message) return;


        this.refs['popup'].getWrappedInstance().show(err.message);
    }

    /**************************************************
     * FUNCTION: _loading
     * DESC: Hien thi loading
     * @param isShow
     * @private
     ***************************************************/
    _loading(isShow) {
        if (!this._mounted) return;

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
            NavigationService.navigateBackHome('DivisionLists', { isNew: true })
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

                        <View style={{ flex: 3 / 5 }}>
                            {
                                /* 
                                    Info
                                */
                            }
                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('dvs.form.headline.infCon')}</Text>
                            <View style={styles.infoContract}>
                                <View style={[styles.oneInfo, { marginTop: 8 }]}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblStatus')}</Text>
                                    <Text style={[styles.infoValue, { color: '#F09C16' }]}>{dataItem.ContractStatus}</Text>
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
                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('dvs.form.headline.infDvs')}</Text>
                            <View>
                                <View style={styles.container}>

                                    <ModalPickerSimple
                                        ref="optRequest"
                                        label={strings('dvs.form.input.lblRequest')}
                                        placeholder={strings('dvs.form.input.plhRequest')}
                                        headerTitle={strings('dvs.popup.titRequest')}
                                        options={this.state.dataAPI.apiRequestList}
                                        getLabel={item => item.label}
                                        onValueChange={value => {
                                            this._onChangeSelect(value, 'request');
                                        }}
                                        defaultValue={this.state.data.Request}
                                    />
                                </View>
                                <View style={styles.container}>
                                    <ModalPickerReset
                                        ref="optSubRequest"
                                        label={strings('dvs.form.input.lblSubRequest')}
                                        placeholder={strings('dvs.form.input.plhSubRequest')}
                                        headerTitle={strings('dvs.popup.titSubRequest')}
                                        options={this.state.dataAPI.apiSubRequestList}
                                        getLabel={item => item.label}
                                        isResetField={this.state.isNewRequest}
                                        onValueChange={value => {
                                            this._onChangeSelect(value, 'subRequest');
                                        }}
                                        defaultValue={this.state.data.SubRequest}
                                    />
                                </View>
                                <View style={styles.container}>
                                    <ModalPickerSimple
                                        ref="optDepartment"
                                        label={strings('dvs.form.input.lblDepartment')}
                                        placeholder={strings('dvs.form.input.plhDepartment')}
                                        headerTitle={strings('dvs.popup.titDepartment')}
                                        options={this.state.dataAPI.apiDepartmentList}
                                        getLabel={item => item.label}
                                        onValueChange={value => {
                                            this._onChangeSelect(value, 'department');
                                        }}
                                        defaultValue={this.state.data.Department}
                                    />
                                </View>
                                <View style={styles.container}>
                                    <InputO
                                        ref="txtSubject"
                                        style={[styles.textInput, ols.fw500, {paddingLeft: 60}]}
                                        label={strings('dvs.form.input.lblSubject')}
                                        // placeholder={strings('dvs.form.input.lblSubject')}
                                        placeholderTextColor='#444444'
                                        textAlign={'right'}
                                        autoCapitalize={'none'}
                                        returnKeyType={'default'}
                                        autoCorrect={false}
                                        value={this.state.data.Subject}
                                        onChangeText={(text) => this._onChangeText('Subject', text)}
                                        // onFocus={ () => this._onFocus() }
                                        // onBlur={ () => this._onBlur() }
                                        onSubmitEditing={Keyboard.dismiss}
                                    />
                                </View>
                                <View style={styles.container}>
                                    <InputArea
                                        ref="txtNote"
                                        style={[styles.textInput, styles.textArea]}
                                        label={strings('')}
                                        placeholder={strings('dvs.form.input.lblNote')}
                                        placeholderTextColor='#9A9A9A'
                                        textAlign={'left'}
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
                                        value={this.state.data.Note}

                                    />
                                </View>
                            </View>
                        </View>


                        {
                            // BUTTON FAKE
                            <View style={{ flex: 2 / 5, opacity: 0 }}>
                                <ButtonO
                                    label={strings('dvs.form.btn.create')}
                                    style={{ marginBottom: 24, }}
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
                <Animated.View style={[{ marginHorizontal: 24, position: 'absolute', bottom: this.state.fadeD, opacity: this.state.fadeO }]}>
                    <ButtonO
                        label={strings('dvs.form.btn.create')}
                        style={{ marginBottom: 24, }}
                        styleBtnText={[ols.btnText]}
                        styleBtn={[ols.btnFull, ols.btnShadow]}
                        onPress={() => this._onSubmit()} />
                </Animated.View>


                {
                    /* 
                        Popup and loading
                    */
                }
                <PopupWarning ref="popup" />
                <PopupAction ref="popup_action"
                    actionText="OK"
                    actionCallback={() => { }}
                    showBtnCancel={false}
                />
                <TechLoading visible={this.state.loadingVisible} />
            </View>
        );
    }
}

export default connect(null, {})(CreateDivision);