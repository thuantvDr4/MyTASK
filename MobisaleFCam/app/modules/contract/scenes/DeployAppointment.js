/**
 * Màn hình thông tin khách hàng
 * @uthor thuanDD3
 * @date 2018
 */
import React from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, KeyboardAvoidingView, Alert, Platform, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { strings } from 'locales/i18n';

// API
import * as api from '../api';

// LIB
import NavigationService from 'app-libs/helpers/NavigationService';
import moment from 'moment';

// LIB COMPONENT CUSTOM
import ModalDatePicker from 'app-libs/components/ModalDatePicker';
import ModalPicker from 'app-libs/components/ModalPicker';
import ModalPickerSimple from 'app-libs/components/ModalPickerSimple';
import PopupWarning from 'app-libs/components/PopupWarning';
import PopupAction from 'app-libs/components/PopupAction';
import TechLoading from 'app-libs/components/TechLoading';

// COMPONENT
import InputO from 'app-libs/components/input/InputO';
import ButtonO from 'app-libs/components/input/ButtonO';

// GLOBAL STYLE
import ols from '../../../styles/Ola-style';
import HandleHardBackButton from '../../customer-info/components/HandleHardBackButton';

class DeployAppointment extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('contract.DeployAppointment.titleNavigation'),
            headerRight: <View />
        }
    }

    /**
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        this.state = {
            data: {
                ...this.props.FormData,
                ObjId: this.props.navigation.getParam('ObjID'),
                RegCode: this.props.navigation.getParam('RegCode'),
                Pop: this.props.navigation.getParam('Pop'),
                RegType: this.props.navigation.getParam('RegType'),
            },
            dataAPI: {
                apiAbility: [],
                subteam: [],
                dated: [],
                timezones: []
            },
            renderTable: false,
            loadingVisible: false,
            cameFrom: this.props.navigation.getParam('routeName', false),
            dataCusInf: null
        };

    }

    /**
     * MOUNT Process API
     */
    componentDidMount() {
        this._mounted = true;

        const data = this.props.navigation.state.params;

        this.setState({
            dataCusInf: data
        })

        // LOAD API FIRST
        this.props.navigation.addListener('willFocus', () => {

            // get dated
            this._getDated();
        });
    }

    /**
     * 
     */
    componentWillUnmount() {
        this._mounted = false
    }

    /**
     * SELECT CHANGE
     * @param 
     * @private
     */
    _onChange(key, text) {
        var state = this.state;
        state.data[key] = text;
        this.setState(state);
    }

    /**
     * PASS FUNC TO CHILD
     * @param 
     * @private
     */
    _onChangeFromChild = (key, text) => {
        let state = this.state;
        state.data[key] = text;
        this.setState(state);
    }

    /**
     * SELECT CHANGE TYPE
     * @param 
     * @private
     */
    _onChangeSel(value, kind) {
        switch (kind) {

            case 'time':
                this.setState({
                    data: {
                        ...this.state.data,
                        Timezone: value,
                    },
                });
                break;

            case 'dated':
                this.setState({
                    data: {
                        ...this.state.data,
                        AppointmentDate: value,
                    },
                });
                break;

            default:
                break;
        }
    }

    /**
     * @param data
     * @param dataTemp
     * @private
     */
    _onShowAbility() {
        if (!this.isValidData()) {
            return;
        }

        this._getAbility4Days();
    }

    /**
     * DISPATCH
     */
    _onSubmit() {
        const { data } = this.state;

        // validate
        if (!this.isValidData()) {
            return;
        }

        // show loading
        this._loading(true);

        // PUSH DATA
        api.createDeployAppo(data, (success, result, msg) => {
            this._loading(false);

            if (success) {
                this.refs['popup'].getWrappedInstance().show(result.data[0].Result, this.popupAction);
            } else {
                // this._error();
                this.refs['popup'].getWrappedInstance().show(result.message);
            }
        });
    }

    /**
     * VALIDATE FORM
     */
    isValidData(temp) {
        const { data } = this.state;
        let errorList = [];

        // Check ngay hen
        if (data.AppointmentDate == "") {
            this.refs['DateAppo'].setValid(false);

            errorList.push({
                name: 'DateAppo',
                msg: strings('dl.contract.DeployAppointment.err.dated')
            });
        } else {
            this.refs['DateAppo'].setValid(true);
        }

        // Check khung gio
        if (data.Timezone == "") {
            this.refs['DateZone'].setValid(false);

            errorList.push({
                name: 'DateZone',
                msg: strings('dl.contract.DeployAppointment.err.timezone')
            });
        } else {
            this.refs['DateZone'].setValid(true);
        }

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }

    /**
     * GET API NANG LUC TRIEN KHAI
     * @param
     * @private
     */
    _getAbility4Days() {
        const { data } = this.state;

        // show loading
        this._loading(true);

        // goi API
        api.getAbility4Days(data, (success, result, msg) => {
            this._loading(false);

            if (success) {
                this.setState({
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiAbility: result,
                    },
                    renderTable: true,
                });
            } else {
                this.refs['popup'].getWrappedInstance().show(msg.message);
            }
        });
    }

    /**
     * GET API DATED
     * @param
     * @private
     */
    _getDated() {
        // const { data } = this.state;

        // show loading
        this._loading(true);

        // goi API 
        api.getDated({}, (success, result, msg) => {
            this._loading(false);

            if (success) {
                this.setState({
                    dataAPI: {
                        ...this.state.dataAPI,
                        dated: result,
                    }
                });

            } else {
                this.refs['popup'].getWrappedInstance().show(msg.message);
            }

            // get timezones
            this._getTimezones();
        });
    }

    /**
     * GET API TIMEZONES
     * @param
     * @private
     */
    _getTimezones() {
        // const { data } = this.state;

        // show loading
        this._loading(true);

        // goi API 
        api.getTimezones({}, (success, result, msg) => {
            this._loading(false);

            if (success) {

                this.setState({
                    dataAPI: {
                        ...this.state.dataAPI,
                        timezones: result,
                    }
                });

            } else {
                // Back lai vi ko lay dc time
                this.refs['popup'].getWrappedInstance().show(msg.message, this.popupAction);
            }

            // get subteam
            this._getSubTeam();
        });
    }

    /**
     * GET API TO DOI
     * @param
     * @private
     */
    _getSubTeam() {
        const { data } = this.state;

        // show loading
        this._loading(true);

        // goi API 
        api.getSubTeam(data, (success, result, msg) => {
            this._loading(false);

            if (success) {

                this.setState({
                    dataAPI: {
                        ...this.state.dataAPI,
                        subteam: result[0],
                    },
                    data: {
                        ...this.state.data,
                        DeptID: result[0].ResultCode,
                        SubID: result[0].ResultSubID,
                    }
                });
            } else {
                // back lai vi ko lay duoc subteam
                this.refs['popup'].getWrappedInstance().show(msg.message, this.popupAction);
            }
        });
    }

    /**
     * show Loi
     * @param err
     * @private
     */
    _error(err) {
        // alert(JSON.stringify(err));
        alert(err);
    }

    /**
     * Loading
     * @param isShow
     * @private
     */
    _loading(isShow) {
        if (!this._mounted) return;
        this.setState({
            loadingVisible: isShow
        });
    }

    /**
     * 
     * Create Table
     */
    renderTable() {
        const data = this.state.dataAPI.apiAbility;
        const timezones = this.state.dataAPI.timezones;

        var tempData = [], tempData2 = [], tempData3 = [];
        var i = 0;

        for (var index = 0; index < data.length; index++) {
            if (index % 2 == 0) {
                tempData.push(moment(data[index].DateEffect).format('MMM DD'));
                tempData2.push(data[index].Ability);

            } else {
                tempData3.push(data[index].Ability);
            }
        }

        return (

            <View style={[ols.tableContainer]}>
                <View style={[ols.tHead]}>
                    <View style={[ols.tH,]}>
                        <View style={[ols.tD, ols.tDborder, { flex: 3 / 6, alignItems: 'center', paddingVertical: 5 }]}><Text style={[ols.tHColor]}>Time Zone</Text></View>
                        {
                            tempData.map((datum) => { // This will render a row for each data element.
                                i++;
                                return this.renderCol(datum, i, 'onlyTH');
                            })
                        }
                    </View>
                </View>
                <View style={[ols.tbody]}>
                    <View style={[ols.tR,]}>
                        <View style={[ols.tD, ols.tDborder, { flex: 3 / 6, alignItems: 'center', paddingVertical: 5 }]}><Text style={[ols.cl444]}>{timezones[0]}</Text></View>
                        {
                            tempData2.map((datum) => { // This will render a row for each data element.
                                i++;
                                return this.renderCol(datum, i);
                            })
                        }
                    </View>
                    <View style={[ols.tR,]}>
                        <View style={[ols.tD, ols.tDborder, { flex: 3 / 6, alignItems: 'center', paddingVertical: 5 }]}><Text style={[ols.cl444]}>{timezones[1]}</Text></View>
                        {
                            tempData3.map((datum) => { // This will render a row for each data element.  
                                i++;
                                return this.renderCol(datum, i);
                            })
                        }
                    </View>
                </View>
            </View>
        );
    }

    /**
     * Create Cell
     */
    renderCol(datum, index, onlyTH) {
        const tHColor = onlyTH;
        return (
            <View key={index} style={[ols.tD, ols.tDborder, { flex: 1 / 4, alignItems: 'center', paddingVertical: 5 }]}>
                <Text style={[tHColor ? ols.tHColor : '']}>{datum}</Text>
            </View>
        );
    }

    /**************************************************
     * FUNCTION: popupAction
     * DESC: Pass action khi ok popup
     * @param
     * @private
     ***************************************************/
    popupAction() {
        setTimeout(() => {
            NavigationService.navigateGoBack();
        }, 500);
    }


    render() {
        const { subteam, timezones, dated } = this.state.dataAPI;

        return (
        <HandleHardBackButton onBack={() => this.props.navigation.goBack()}>
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ ios: 70, android: 0 })}
                behavior={(Platform.OS === 'ios') ? "padding" : null}
                style={[ols.container_keyboard]} >
                <ScrollView
                    keyboardDismissMode={'on-drag'}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >
                    <View style={[ols.inner_scrollview, { justifyContent: 'space-between', backgroundColor:'#F8F9FB' }]}>
                        <View >
                            {/*
                            //-- POP
                            */}
                            <Text style={[ols.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings('list_customer_info.detail.info_point_group')}
                            </Text>
                            <View style={[ols.nm_cols]}>
                                <View style={[ols.nm_field]}>
                                    <Text style={[ols.nm_label, ols.fs12]}>{strings('list_customer_info.detail.pop')}</Text>
                                    <Text style={[ols.nm_value, ols.fs12]}>{this.state.data.Pop}</Text>
                                </View>
                            </View>

                            {/*
                            //-- đối tác triển khai
                            */}
                            <Text style={[ols.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings('contract.DeployAppointment.headline.partner')}
                            </Text>
                            <View style={[ols.nm_cols]}>
                                <View style={[ols.nm_field]}>
                                    <Text style={[ols.nm_label, ols.fs12]}>{strings('contract.DeployAppointment.form.partner.partnerLabel')}</Text>
                                    <Text style={[ols.nm_value, ols.fs12]}>{subteam.ResultDepID}</Text>
                                </View>

                                <View style={[ols.nm_field, ols.mgt05]}>
                                    <Text style={[ols.nm_label, ols.fs12]}>{strings('contract.DeployAppointment.form.partner.partnerGroupLabel')}</Text>
                                    <Text style={[ols.nm_value, ols.fs12]}>{subteam.ResultSubID}</Text>
                                </View>
                            </View>

                            {/*
                            //-- thời gian triển khai
                            */}
                            <Text style={[ols.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('contract.DeployAppointment.headline.date')}</Text>
                            <View style={ols.container}>
                                <InputO
                                    ref="txtSubject"
                                    style={[styles.textInput, ols.fw500]}
                                    label={strings('contract.contract_detail.contract_no')}
                                    placeholder=''
                                    placeholderTextColor='#444444'
                                    textAlign={'right'}
                                    autoCapitalize={'none'}
                                    returnKeyType={'default'}
                                    autoCorrect={false}
                                    value={this.state.dataCusInf ? this.state.dataCusInf.Contract : ''}
                                    editable={false}
                                />
                            </View>
                            <View style={ols.container}>
                                <ModalPickerSimple
                                    ref="DateAppo"
                                    label={strings('contract.DeployAppointment.form.date.dateLabel')}
                                    options={dated}
                                    placeholder={strings('contract.DeployAppointment.form.date.datePlaceHolder')}
                                    headerTitle={strings('contract.DeployAppointment.form.date.dateHeaderTitle')}
                                    onValueChange={value => {
                                        this._onChangeSel(value, 'dated');
                                    }}
                                    defaultValue={this.state.data.AppointmentDate}
                                />
                            </View>

                            <View style={ols.container}>
                                <ModalPickerSimple
                                    ref="DateZone"
                                    label={strings('contract.DeployAppointment.form.date.hourLabel')}
                                    options={timezones}
                                    placeholder={strings('contract.DeployAppointment.form.date.hourPlaceHolder')}
                                    headerTitle={strings('contract.DeployAppointment.form.date.hourHeaderTitle')}
                                    onValueChange={value => {
                                        this._onChangeSel(value, 'time');
                                    }}
                                    defaultValue={this.state.data.Timezone}
                                />
                            </View>

                            {/*
                            //-- năng lực triển khai
                            */}
                            <Text style={[ols.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                                {this.state.renderTable ? strings('contract.DeployAppointment.headline.capacity') : ''}
                            </Text>
                            {this.state.renderTable ? this.renderTable() : <View></View>}
                        </View>

                        <View>
                            {/*
                                //-- next button
                            */}
                            <View>
                                <View style={{ marginBottom: 24 }}>
                                    <ButtonO
                                        label={strings('contract.DeployAppointment.form.btn.view')}
                                        style={{ marginBottom: 16 }}
                                        styleBtn={[ols.btnFullLine]}
                                        styleBtnText={[ols.btnTextLine]}
                                        onPress={() => this._onShowAbility()} />

                                    <ButtonO
                                        label={strings('contract.DeployAppointment.form.btn.send')}
                                        styleBtnText={[ols.btnText]}
                                        styleBtn={[ols.btnFull, ols.btnShadow]}
                                        onPress={() => this._onSubmit()} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <PopupWarning ref="popup" />
                <PopupAction ref="popup_action"
                    actionText="OK"
                    actionCallback={this.popupAction.bind(this)}
                    showBtnCancel={false}
                />
                <TechLoading visible={this.state.loadingVisible} />
            </KeyboardAvoidingView>
        </HandleHardBackButton>
        );
    }
}


function mapStateToProps(state) {
    // GET STATE FROM SALENEW
    const stateUS = state.authReducer.userInfo;

    const FormData = {
        DeptID: '',
        SubID: '',
        Timezone: '',
        AppointmentDate: '',
        UserName: stateUS.UserName,
        RegCode: '',
        ObjId: '',
    }

    return {
        FormData: FormData,
    };
}
const styles = StyleSheet.create({
    textInput: {
        height: 40,
        paddingRight: 12,
        fontSize: 12,
        borderColor: 'transparent',
        borderWidth: 0.5,
        color: 'rgba(0, 0, 0, 0.38)',
    }
})

export default connect(mapStateToProps, {})(DeployAppointment);