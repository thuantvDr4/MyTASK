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
    KeyboardAvoidingView, Alert, Keyboard, WebView,
} from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {HeaderBackButton} from 'react-navigation';

// API
import * as api from '../api';

// LIB COMPONENT CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import PopupAction from 'app-libs/components/PopupAction';
import TechLoading from 'app-libs/components/TechLoading';
import phoneCall from 'app-libs/helpers/phoneCall';
import NavigationService from 'app-libs/helpers/NavigationService';

// COMPONENT
import InputArea from 'app-libs/components/input/InputArea';
import ButtonO from 'app-libs/components/input/ButtonO';
import MenuPicker from '../components/MenuPicker';

// REDUX ACTION
import {actions as a, constants as c} from '../';

const {updateInfoRegistration, resetAllDataBookport} = a;

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

// FAKE KEYBOARD PERSIST TAP
const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class DetailCustomers extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: strings('potentianl_customer.detail_po.title'),
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>,
            headerRight: (
                <MenuPicker
                    onValueChange={navigation.getParam('selectMenu')}
                    options={navigation.getParam('options', [])}/>
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
                fontSize: 16,
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
        "Description": "fdafsdaf"
    };

    //-------------------------------------- DEMO DATA - Xoa

    constructor(props) {
        super(props);

        this.state = {
            PotentialCusId: this.props.navigation.getParam('PotentialCusId', "0"),
            data: {},
            // data: this.dataTest,
            heightOffset: null,
            loadingVisible: false,
            showButton: true,
            fadeD: new Animated.Value(0),
            fadeO: new Animated.Value(1),
            // flag cho phép scroll container hay không (áp dụng trường hợp nhấn vào note, decs thì tắt scroll container để scroll chính nó)
            isScrollWrapper: true
        };
    }

    /**
     *
     */
    componentDidMount() {
        // Dang ky event xu ly khi chon menu phai
        this.props.navigation.setParams({selectMenu: this.selectMenu.bind(this)});

        // LOAD API FIRST
        this.props.navigation.addListener('willFocus', () => {
            this._defaultLoad();
        });
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
     * FUNCTION: _defaultLoad (LOAD API)
     * DESC: Load API data detail
     * @param
     * @private
     ***************************************************/
    _defaultLoad() {
        // loading
        this._loading(true);

        // variable
        const myInput = {
            PotentialObjId: this.state.PotentialCusId
        }

        // call API
        api.getDetailPoCus(myInput, (success, result, msg) => {
            this._loading(false);
            if (success) {
                this.setState({
                    data: {
                        ...this.state.data,
                        ...result[0],
                    }
                }, () => this._registerMenu());

            } else {
                this._error(msg);
            }
        });
    }


    /**************************************************
     * FUNCTION: _handleCall
     * DESC: Call phone num
     * @param
     * @private
     ***************************************************/
    _handleCall = () => {

        const {PhoneNumber} = this.state.data;
        const args = {
            number: PhoneNumber, // String value with the number to call
            prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call
        }

        phoneCall(args, (success) => {
            if (success) {
                this._logTimecal();
            }
        }).catch((msg) => {
            this.refs['popup'].getWrappedInstance().show(msg);
        });
    }


    /**************************************************
     * FUNCTION: _logTimecal
     * DESC: call api log time call phone
     * @param
     * @private
     ***************************************************/
    _logTimecal() {
        // variable
        const myInput = {
            PotentialCusId: this.state.PotentialCusId
        }

        // call API
        api.callTime(myInput, (success, result, msg) => {

            if (success) {

            } else {
                this._error(msg);
            }
        });
    }


    /**************************************************
     * FUNCTION: _handleCreateContract
     * DESC: Tạo KHTN
     * @param
     * @private
     ***************************************************/
    _handleCreateContract() {

        const {data} = this.state;

        if (data.EnableCreateCusInfo === 0) {
            this.refs['popup'].getWrappedInstance().show(strings('dl.potentianl_customer.detail.noti.create'));
            return;
        }

        const infoAddress = {
            // City
            LocationId: data.LocationId,
            BillTo_City: data.BillTo_City,
            // District
            DistrictId: data.DistrictId ? data.DistrictId : null,
            BillTo_District: data.BillTo_District,
            // Ward
            WardId: data.WardId ? data.WardId : null,
            BillTo_Ward: data.BillTo_Ward,
            // Street
            StreetId: data.StreetId ? data.StreetId : null,
            BillTo_Street: data.BillTo_Street,
            // Number
            BillTo_Number: data.BillTo_Number,
            // Type House
            TypeHouse: data.TypeHouse,
            TypeHouseName: data.HomeTypeName,
            // Building
            BuildingId: data.BuildingId ? data.BuildingId : null,
            BuildingName: data.BuildingName,
            // Personal
            Address: data.Address,
            Email: data.Email,
            FullName: data.Name,
            Phone1: data.PhoneNumber,
            // Phan biet tao tu KHTN hoặc tạo mới
            PotentialObjID: data.PotentialObjId,
            // them telegram
            Telegram: data.Telegram,
        };

        // Reset Data Global Redux State
        this.props.resetAllDataBookport();

        // Cap nhat Data moi vào Global Redux State
        this.props.updateInfoRegistration(infoAddress, () => {
            NavigationService.navigate('SaleNew', {bookportForward: true});
        });
    }


    /**************************************************
     * FUNCTION: _error
     * DESC: Hien thi popup error
     * @param err
     * @private
     ***************************************************/
    _registerMenu() {
        // khoi tao action cua detail
        const menuOption = [];
        // cho phep cap nhat thong tin
        // menuOption = [{Id: c.ACT_UPDATE_INFO, label: strings('potentianl_customer.detail_po.menu.updateInfo')}];

        // cho phep ket qua tu van
        menuOption.push({Id: c.ACT_ADV_RESULT, label: strings('potentianl_customer.detail_po.menu.advisoryResults')});
        menuOption.push({Id: 'pcReCare', label: strings('potentianl_customer.detail_po.menu.reCare')});
        // Gan action cho right menu
        this.props.navigation.setParams({options: menuOption});
    }


    /**************************************************
     * FUNCTION: find_dimesions
     * DESC: OFFSET DÀN NÚT BẤM
     * @param object
     * @public
     ***************************************************/
    _find_dimesions(layout) {
        this.setState({heightOffset: layout.height - 50});
    }


    /**************************************************
     * FUNCTION: keyboardDown & up
     * @param
     * @private
     ***************************************************/
    _keyboardDidShow() {
        this._fadeDown();
        if (this.state.showButton) {
            this.setState({...this.state, showButton: false});
        }
    }

    _keyboardDidHide() {
        this._fadeUp();
        this.setState({...this.state, showButton: true});
    }


    /**************************************************
     * FUNCTION: Animation Button
     * @param
     * @private
     ***************************************************/
    _fadeDown() {
        let offSet = parseFloat(this.state.heightOffset).toFixed(2) * -1;

        Animated.parallel([
            Animated.timing(this.state.fadeD, {toValue: offSet, duration: 300,}),
            Animated.timing(this.state.fadeO, {toValue: 1, duration: 300,}),
        ]).start();
    }

    _fadeUp() {
        Animated.parallel([
            Animated.timing(this.state.fadeD, {toValue: 0, duration: 300,}),
            Animated.timing(this.state.fadeO, {toValue: 1, duration: 300,}),
        ]).start();
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
        this._loading(false);
        if (!err.message) return;
        this.refs['popup'].getWrappedInstance().show(err.message);
    }


    /****************************************************************************************************
     * FUNCTION: selectMenu
     * DESC: Xử lý khi click chọn menu phải
     * @param err
     * @private
     *****************************************************************************************************/
    selectMenu(route) {
        // if (route.Id === c.ACT_UPDATE_INFO) {
        //     return;
        // }

        NavigationService.navigate(route.Id, {
            ...this.state.params,
            PotentialCusId: this.state.PotentialCusId,
        });
    }


    /*
    * function: handleUpdate
    * thuantv: 02/10/2020
    * */
    handleUpdate = () => {
        NavigationService.navigate('pcAddCustomer',
            {
                'bookportForward': false,
                'potentialUpdate': true,
                'payload': this.state.data
            }
        );
    }


    /*.
    *
    * */
    render() {
        const {data} = this.state;
        // console.log('----------------', data);

        return (
            <View style={{flex: 1, position: 'relative', backgroundColor: '#F8F9FB'}}>
                <Animated.View style={[ols.container_keyboard, {
                    width: '100%', height: '100%', position: 'absolute',
                    top: this.state.fadeD, opacity: this.state.fadeO
                }]}>

                            <View style={[{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}]}>
                                <View style={[{flex: 2 / 3, paddingHorizontal: 24,}]}>

                                    {
                                        /*
                                            Info
                                        */
                                    }
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                                            {strings('potentianl_customer.detail_po.form.headline.info')}
                                        </Text>

                                        {/*..button-update..*/}
                                        <TouchableOpacity
                                            onPress={() => this.handleUpdate()}
                                            style={{paddingHorizontal: 4}}>
                                            <Text
                                                style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500, {color: '#0B76FF'}]}>
                                                {strings('potentianl_customer.detail_po.form.btnUpdate')}
                                            </Text>
                                        </TouchableOpacity>

                                    </View>


                                    <View style={styles.infoContact}>

                                        <View style={[styles.oneInfoN, {marginTop: 10}]}>
                                            <Text style={styles.infoTitle}>{strings('dplment.item.lblCusName')}</Text>
                                            <Text style={styles.infoValue}>{data && data.Name ? data.Name : ""}</Text>
                                        </View>

                                        <View style={styles.oneInfoN}>
                                            <Text style={styles.infoTitle}>{strings('dplment.item.lblPhoNum')}</Text>
                                            <Text
                                                style={styles.infoValue}>{data && data.PhoneNumber ? data.PhoneNumber : ""}</Text>
                                        </View>
                                        <View style={[styles.oneInfoN, {marginBottom: 15}]}>
                                            <Text style={styles.infoTitle}>{strings('dplment.item.lblInsAdd')}</Text>
                                            <Text
                                                style={styles.infoValue}>{data && data.Address ? data.Address : ""}</Text>
                                        </View>
                                    </View>


                                    {
                                        /*
                                            Form
                                        */
                                    }
                                    <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                                        {strings('potentianl_customer.detail_po.form.headline.note')}
                                    </Text>
                                    {Platform.OS === 'ios' ?
                                        <View>
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
                                                // numberOfLines={4}
                                                // maxLength={4000}
                                                // onChangeText={(text) => this._onChangeText('Note', text)}
                                                value={data && data.Description ? data.Description : ""}
                                                onSubmitEditing={Keyboard.dismiss}
                                                blurOnSubmit={true}
                                                editable={false}
                                            />
                                        </View>
                                        :
                                        <View style={[]}
                                              onTouchStart={() => this.setState({ isScrollWrapper: false })}
                                              onTouchCancel={() => this.setState({ isScrollWrapper: true })}>
                                            <ScrollView style={[ styles.fakeInput,{ minHeight: 100, maxHeight: 200, }]} scrollEnabled={true}>
                                                <Text
                                                    style={[styles.textInputFake]}
                                                >
                                                    {data && data.Description ? data.Description : ""}
                                                </Text>
                                            </ScrollView>
                                        </View>


                                    }

                                </View>

                                <View
                                    onLayout={(event) => {
                                        this._find_dimesions(event.nativeEvent.layout)
                                    }}
                                    ref="btnWrap"
                                    style={[{
                                        flex: 1 / 3,
                                        marginBottom: 24,
                                        alignItems: 'center',
                                        justifyContent: 'flex-end'
                                    }]}>
                                    <ButtonO
                                        label={strings('potentianl_customer.detail_po.form.btnCall')}
                                        style={{marginBottom: 12}}
                                        styleBtn={[ols.btnFullLine]}
                                        styleBtnText={[ols.btnTextLine, ols.btnShadow]}
                                        onPress={this._handleCall}/>

                                    <ButtonO
                                        label={strings('potentianl_customer.detail_po.form.btnCreate')}
                                        styleBtnText={[ols.btnText]}
                                        styleBtn={[ols.btnFull, ols.btnShadow]}
                                        onPress={this._handleCreateContract.bind(this)}/>

                                </View>
                            </View>

                    {
                        /*
                            Popup and loading
                        */
                    }
                    <PopupWarning ref="popup"/>
                    <PopupAction ref="popup_action_OK"
                                 actionText="OK"
                                 actionCallback={() => {
                                 }}
                                 showBtnCancel={true}
                    />

                    <TechLoading visible={this.state.loadingVisible}/>
                </Animated.View>
            </View>
        );
    }
}

export default connect(null, {
    updateInfoRegistration,
    resetAllDataBookport,
})(DetailCustomers);
