/**
 *
 * @uthor thuantv11
 * @dateCreate 30/09/2020
 * @dateEdit ---
 * @note
 */

// LIB
import React from 'react';
import {
    View, ScrollView, Animated, Linking,
    Image, Text, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback,
    KeyboardAvoidingView, Alert, Keyboard, SafeAreaView, FlatList,
} from 'react-native';
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
import RowInfo from '../../../libs/components/RowInfo';
import InputO from 'app-libs/components/input/InputO';
import InputArea from 'app-libs/components/input/InputArea';
import ButtonO from 'app-libs/components/input/ButtonO';
import TechLoading from 'app-libs/components/TechLoading';

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';
import DateTimePicker from "../../../libs/components/CustomDateTimePicker";
import {itemStyles as i_styles} from '../styles';
import formatTime from "../../../libs/helpers/FormatTime";


const vir_data = [
    {
        STT: '1st',
        ID: '1',
        PotentialObjID: '0',
        ScheduleDate: '30/09/2020',
        ScheduleDescription: 'Customer is hesitate and saying they will call back later.'
    },
    {
        STT: '2st',
        ID: '2',
        PotentialObjID: '0',
        ScheduleDate: '30/09/2020',
        ScheduleDescription: 'Customer is hesitate and saying they will call back later.'
    },
    {
        STT: '3st',
        ID: '3',
        PotentialObjID: '0',
        ScheduleDate: '30/09/2020',
        ScheduleDescription: 'Customer is hesitate and saying they will call back later.'
    },
    {
        STT: '3st',
        ID: '3',
        PotentialObjID: '0',
        ScheduleDate: '30/09/2020',
        ScheduleDescription: 'Customer is hesitate and saying they will call back later.'
    },
    {
        STT: '3st',
        ID: '3',
        PotentialObjID: '0',
        ScheduleDate: '30/09/2020',
        ScheduleDescription: 'Notes......'
    },
]

/*
*
* */
class ReCare extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: strings('potentianl_customer.reCare.title'),
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
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                flexGrow: 1
            },
        };
    };

    //-------------------------------------- DEMO DATA - Xoa

    /**
     *
     */
    constructor(props) {
        super(props);
        let today = new Date();
            today = formatTime.setTime(today, 'MM/DD/YYYY');

        this.state = {
            dataAPI: {
                apiReCareList: [],
            },
            data: {
                reCareDate: today,
                Note: "",
                PotentialCusId: this.props.navigation.getParam('PotentialCusId', "0"),
            },
            loadingVisible: false,
            isValid: false,
            Today: today,
            item_deleted: null

        };

        this.reloadScreen = this.reloadScreen.bind(this);
    }

    /**
     *
     */
    componentDidMount() {
        this._mounted = true;

        // LOAD API FIRST
        // this.props.navigation.addListener('willFocus', () => {});
        //load recare-list
        this.handleLoadReCareList();
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
        const {data, Today } = this.state;
        let errorList = [];


        // Check recare-date
        if (Today > new Date(data.reCareDate) ) {
           this.setState({
               ...this.state,
               isValid: true
           });

            errorList.push({
                name: 'reCareDate',
                msg: strings('dl.potentianl_customer.recare.err.date')
            });
        } else {
            this.setState({
                ...this.state,
                isValid: false
            });
        }

        // Check Note
        if (data.Note.trim().length ===0) {
            this.refs['txtNote'].setValid(false);

            errorList.push({
                name: 'txtNote',
                msg: strings('dl.potentianl_customer.recare.err.note')
            });
        } else {
            this.refs['txtNote'].setValid(true);
        }


        if (errorList.length === 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }


    /*
    * V2.8
    * thuantv - 30/09/2020
    * function: handleLoadReCareList
    * Load recare-list
    * */
    handleLoadReCareList =()=> {
        // Show loading
        this._loading(true);

        // Input data
        const myInput = {
            PotentialObjID: this.state.data.PotentialCusId
        }
        // Get API
        api.getReCareList(myInput, (success, result, msg) => {
            // Hide loading
            this._loading(false);

            if (success) {
                this.setState({
                    ...this.state,
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiReCareList: result,
                    },
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
        let state = this.state;

        state.data[key] = text;
        this.setState(state);
    }

    /*
    * function: getRecareDate
    * DESC: xu ly thay doi ngay recare
    * */
    changeRecareDate =(date)=> {
        let mDate = formatTime.setTime(date, 'MM/DD/YYYY');
        this.setState({
            data:{
                ...this.state.data,
                reCareDate: mDate,
            }
        })
    }



    /**************************************************
     * FUNCTION: onUpdate
     * DESC: Xu ly submit update
     * @param
     * @private
     ***************************************************/
    onUpdate() {

        if (!this._isValidData()) {
            return;
        }

        // Show loading
        this._loading(true);

        // Input data
        const {data} = this.state;
        const myInput = {
            PotentialObjID: data.PotentialCusId,
            ScheduleDate: data.reCareDate,
            ScheduleDescription: data.Note || '',
        }

        // // Get API
        api.updateRecare(myInput, (success, result, msg) => {
            // Hide loading
            this._loading(false);
                //clear data
                this.setState({
                    ...this.state,
                    data: {
                        ...this.state.data,
                        reCareDate: this.state.Today,
                        Note: ''
                    },
                })
            //
            if (success) {
                //
                this.refs['popup'].getWrappedInstance().show(strings('dl.potentianl_customer.recare.noti.update'), this.reloadScreen);

            } else {
                this._error(msg);
            }
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
            this.handleLoadReCareList();
        }, 400);
    }

    /*
* deleteRecare
* */
    deleteRecare =(item)=> {
        // luu item len local
        this.setState({
            ...this.state,
            item_deleted: item
        });
        //
        this.refs['popup_action'].getWrappedInstance().show(strings('dl.potentianl_customer.recare.noti.delete') )
    }


    /*
    * submit-Delete
    * */
    submitDeleteRecare =(item)=> {
        // Show loading
        this._loading(true);
        // Input data
        const myInput = {
            RecareID: item.ID
        }

        // Get API
        api.deleteRecareItem (myInput, (success, result, msg) => {
            // Hide loading
            this._loading(false);

            if (success) {
               this.reloadScreen();

            } else {
                this._error(msg);
            }
        });
    }

    /******************************/
    /*
    * render form
    * */
    renderForm() {
        return (
            <View style={{flex:1}}>
                <InputScrollView
                    keyboardOffset={(Platform.OS === 'ios') ? 20 : 40}
                    keyboardDismissMode={'on-drag'}
                    // behavior= {(Platform.OS === 'ios')? "padding" : "padding"}
                    contentContainerStyle={[ols.wrapper_scrollview, {}]}
                >
                    <View style={[ols.inner_scrollview, {}]}>
                        {/*..header line..*/}
                        <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                            {strings('potentianl_customer.reCare.headline')}
                        </Text>

                        {/*..picker date..*/}
                        <View style={styles.container}>
                            <DateTimePicker
                                isError={this.state.isValid}
                                mainStyle={{height: 40, marginBottom: 12}}
                                label={strings('potentianl_customer.reCare.form.recareDate_label')}
                                placeholder={strings('potentianl_customer.reCare.form.recareDate_placeholder')}
                                value={this.state.data.reCareDate}
                                getDate={(date) => this.changeRecareDate(date)}
                            />

                            {
                                <InputArea
                                    ref="txtNote"
                                    style={[styles.textInput, styles.textArea]}
                                    label={strings('')}
                                    placeholder={strings('potentianl_customer.reCare.form.note')}
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
                                    value={this.state.data.Note}
                                />
                            }

                            <ButtonO
                                label={strings('potentianl_customer.reCare.form.btn')}
                                style={{marginBottom: 24, marginTop: 10}}
                                styleBtnText={[ols.btnText]}
                                styleBtn={[ols.btnFull, {height: 44}]}
                                onPress={() => this.onUpdate()}/>
                        </View>

                        {/*..divide...*/}
                        <View style={{width: '100%', borderTopWidth: 1, borderTopColor: '#A9A9A9'}}/>

                        {/*..recare-list..*/}
                        {this.renderList(this.state.dataAPI.apiReCareList)}

                    </View>
                </InputScrollView>
            </View>
        )
    }


    /*
    * render List
    * */
    renderList(data) {
        return (
            <View style={{}}>
                <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                    {strings('potentianl_customer.reCare.form.results')}
                </Text>

                <FlatList
                    keyboardDismissMode={'on-drag'}
                    contentContainerStyle={{}}
                    data={data}
                    keyExtractor={(item, index) => 'key' + index}
                    renderItem={({item}) => this.renderItem(item)}
                />
            </View>
        )
    }


    /*
    * renderItems
    * */
    renderItem(item) {
        return (
            <View style={[i_styles.card_view, {borderColor: '#0B76FF'}]}>
                {/*..body..*/}
                <View style={[i_styles.body_ctn]}>

                    <RowInfo
                        mainStyle={{marginTop: 8}}
                        value={item.STT}
                        label={ strings('potentianl_customer.reCare.form.list.status') }/>

                    <RowInfo
                        mainStyle={{marginTop: 8}}
                        value={item.ScheduleDate}
                        label={strings('potentianl_customer.reCare.form.list.recare_date')}/>

                    <View style={[i_styles.note_ctn, {marginVertical: 8}]}>
                        <Text style={[i_styles.note_txt,]}>{item.ScheduleDescription}</Text>
                    </View>

                    {/*..delete-button..*/}
                    <TouchableOpacity
                        onPress={()=>this.deleteRecare(item)}
                        style={[i_styles.delete_ctn]}>
                        <Text style={[i_styles.delete_txt]}>{strings('potentianl_customer.reCare.form.list.delete')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }



    /**************************************************
     * FUNCTION: render
     ***************************************************/
    render() {

        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={[ols.container_keyboard, {backgroundColor: '#F8F9FB'}]}>

                    {/*..render form..*/}
                    {this.renderForm()}

                    {/*..Popup..*/}
                    <PopupWarning ref="popup"/>
                    <PopupAction ref="popup_action"
                                 actionText="OK"
                                 actionCallback={() => {
                                     this.submitDeleteRecare(this.state.item_deleted)
                                 }}
                                 showBtnCancel={true}
                    />
                    <TechLoading visible={this.state.loadingVisible}/>
                </View>
            </SafeAreaView>
        );
    }
}

export default connect(null, {})(ReCare);
