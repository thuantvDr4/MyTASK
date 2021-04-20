/*
* V2.8
* thuantv - create: 06/10/2020
* feature: man hinh Extra service report
* */

import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Image, Alert
} from 'react-native';

import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {HeaderBackButton} from 'react-navigation';
import PopupWarning from 'app-libs/components/PopupWarning';
import SelectPicker from '../components/SelectPicker';
import NavigationService from 'app-libs/helpers/NavigationService';
import styles from '../ReportFilter.styles';
import DateTimePicker from '../../../libs/components/CustomDateTimePicker';
import formatTime from "../../../libs/helpers/FormatTime";
import *as api from '../api';
import TechLoading from 'app-libs/components/TechLoading';
import CustomOptionPicker from '../../../libs/components/CustomOptionPicker';


/*
*
* */
class ExtraServiceReport extends React.PureComponent {

    static navigationOptions = ({navigation}) => {
        return {
            title: strings('report.extraService.title'),
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>
        };
    };

    constructor(props) {
        super(props);
        let today = new Date();
        today = formatTime.setTime(today, 'MM/DD/YYYY');

        this.state = {
            fromDate: today,
            toDate: today,
            Status: {label: null, value: null},
            Service: {label: null, value: null},
            error: false,
            message: null,
            noValid: false,

            loadingVisible: false,
            apiStatusType: [{label: 'Choose a status', value: null}],
            apiServiceType: [{label: 'Choose a service', value: null}],
        };

        this._errorMsg = this._errorMsg.bind(this);
        this.onError = this.onError.bind(this);
    }


    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => {
            if (this.state.error) {
                this.refs['popup'].getWrappedInstance().show(this.state.message);
            }
            else {
                this.loadContractStatusType();
                this.loadContractServiceType();
            }
        });
    }


    onError(data) {
        this.refs['popup'].getWrappedInstance().show(data.message);
    };


    /**
     * show Loi
     * @param err
     * @private
     */
    _error(err) {
        this._loading(false);
        if (!err.message) return;
        this.refs['popup'].getWrappedInstance().show(err.message);
    }

    _errorMsg(err) {
        this._loading(false);
        if (!err) return;
        this.refs['popup'].getWrappedInstance().show(err.toString());
    }

    /**
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


    /*
    * V2.8
    * function: loadContractStatusType
    * */
    loadContractStatusType = () => {
        //
        this._loading(true);
        //
        let data = {
            "RegType": 2 // 1: ban moi || 2: ban them
        }
        //
        api.getContractStatusType(data, (success, result, msg) => {
            this._loading(false);

            if (success) {
                let options = [];
                result.map(item => {
                    const opt = {
                        label: item.Name,
                        value: item.Id
                    }
                    options.push(opt);
                });
                //
                this.setState({
                    ...this.state,
                    apiStatusType: options
                });
            }
            else {
                this._error(msg)
            }
        });
    }


    /*
   * V2.8
   * function: loadServiceType
   * */
    loadContractServiceType = () => {
        //
        this._loading(true);
        //
        let data = {
            "Type": 6 // 1: ban moi || 6: service type
        }
        //
        api.getContractServiceType(data, (success, result, msg) => {
            this._loading(false);

            if (success) {

                let options = [];
                result.map(item => {
                    const opt = {
                        label: item.Name,
                        value: item.Id
                    }
                    options.push(opt);
                });
                //
                this.setState({
                    ...this.state,
                    apiServiceType: options
                })

            }
            else {
                this._error(msg)
            }
        });
    }

    /*
V2.8
* function : conChangeSelected
* */
    onChangeStatusType = (value) => {
        this.setState({
            ...this.state,
            Status: value
        });
    }

    /*
    V2.8
* function : conChangeSelected
* */
    onChangeServiceType = (value) => {
        this.setState({
            ...this.state,
            Service: value
        });
    }


    /*V2.8
    * function : fromDateChange
    * */
    onChangeDatePicker = (key, date) => {
        let mDate = formatTime.setTime(date, 'MM/DD/YYYY');
        this.setState({
                ...this.state,
                [key]: mDate
            }
        )
    }

    /*
    * V2.8
    * function: onConfirm
    * */
    onConfirm = () => {
        const {fromDate, toDate, Status, Service} = this.state;

        if (!Status.label) {
            this.setState({
                ...this.state,
                noValid: true
            },()=> this._errorMsg(strings('dl.report.noti.status') )
            )


        }
        else if(!Service.label){
            this.setState({
                ...this.state,
                noValid: true
            },()=> this._errorMsg(strings('dl.report.noti.service') )
                )

        }

        else if( new Date(fromDate) > new Date(toDate) ){
            this._errorMsg(strings('dl.report.noti.date_err') )
        }
        else {
            this.setState({
                ...this.state,
                noValid: false
            });

            const myData = {
                fromDate, toDate, Status, Service
            }
            //
            NavigationService.navigate('hideTabBottomExtraServiceReportList', {"payload": myData});
        }
    }


    /*
    * component: Search filter
    * */
    renderSearchFilter() {
        const {apiStatusType, apiServiceType, Service, Status, noValid} = this.state;

        return (
            <View>
                <Text style={styles.searchTitle}>{strings('report.extraService.Search_filter')}</Text>
                {/*..Status..*/}
                <CustomOptionPicker
                    isValid={noValid}
                    mainStyle={{marginTop:12,}}
                    labelStyle={{}}
                    valueStyle={{}}
                    label={strings('report.extraService.Status')}
                    placeHolder={ 'choose a Status'}
                    optionList={apiStatusType}
                    titleHeader={strings('report.extraService.filter_option.Choose_contract_status')}
                    onValueChange={ (value) => this.onChangeStatusType(value) }
                    value={ Status.label}/>

                {/*..Service..*/}
                <CustomOptionPicker
                    isValid={noValid}
                    mainStyle={{marginTop:16,}}
                    labelStyle={{}}
                    valueStyle={{}}
                    label={strings('report.extraService.Service')}
                    placeHolder={ 'choose a Service'}
                    optionList={apiServiceType}
                    titleHeader={strings('report.extraService.filter_option.Choose_service')}
                    onValueChange={ (value) => this.onChangeServiceType(value) }
                    value={ Service.label}/>

            </View>
        )
    }


    /*
    * component: date picker
    * */
    renderDatePicker() {
        return (
            <View style={[styles.dayContainer, {}]}>
                <DateTimePicker
                    mainStyle={{height: 40,}}
                    label={strings('report.extraService.From')}
                    placeholder={strings('report.extraService.Placeholder')}
                    value={this.state.fromDate}
                    getDate={(date) => this.onChangeDatePicker('fromDate', date)}
                />
                {/*..*/}
                <View style={{width: 10}}/>

                {/*...*/}
                <DateTimePicker
                    mainStyle={{height: 40,}}
                    label={strings('report.extraService.To')}
                    placeholder={strings('report.extraService.Placeholder')}
                    value={this.state.toDate}
                    getDate={(date) => this.onChangeDatePicker('toDate', date)}
                />
            </View>
        )
    }


    /*
    * component:  render button confirm
    * */
    renderButton() {
        return (
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.innerBtn} onPress={() => this.onConfirm()}>
                    <Text style={styles.txtBtn}>{strings('report.extraService.Confirm')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /*
    *
    * */
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.filterContainer}>
                    {/*..search filter..*/}
                    {this.renderSearchFilter()}

                    {/*..date-picker...*/}
                    {this.renderDatePicker()}

                </View>
                {/*..button ..*/}
                {this.renderButton()}

                <TechLoading visible={this.state.loadingVisible}/>
                <PopupWarning ref="popup"/>
            </View>
        )
    }
}


export default connect()(ExtraServiceReport)
