/*
* thuantv-create-28/09/2020
* man hinh: Recare-list
* */

import React, {Component,} from 'react';
import {
    Text, ScrollView, View, TouchableOpacity, TextInput, Image, KeyboardAvoidingView,
    Alert, Keyboard, SafeAreaView,
} from 'react-native';
import {HeaderBackButton} from 'react-navigation';
import {strings} from 'locales/i18n';
import {connect} from 'react-redux';
import * as api from '../api';
import {actions as a, constants as c} from '../';

const {updateInfoRegistration, resetAllDataBookport} = a;
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import CustomFlatList from '../../../libs/components/CustomFlatlist';
import {mapLocation} from "app-libs/helpers/mapPicker";
import styles from '../styles';
import {itemStyles as i_styles} from '../styles';
import RowInfo from '../../../libs/components/RowInfo';
import RowInfoIcon from '../../../libs/components/RownInfoIcon';
import {images} from "assets/";
import DateTimePicker from '../../../libs/components/CustomDateTimePicker';
import formatTime from '../../../libs/helpers/FormatTime';
import NavigationService from 'app-libs/helpers/NavigationService';

/*..data tam...*/
const vir_data = [
    {
        PotentialObjID: '1',
        CustomerName: 'customerName',
        Phone: '0918492052',
        Address: 'St.Lom, Sangkat DongKou, Khan Dong Kour, PhomPenh',
    },
    {
        PotentialObjID: '2',
        CustomerName: 'customerName',
        Phone: '0918492052',
        Address: 'St.Lom, Sangkat DongKou, Khan Dong Kour, PhomPenh',
    },
    {
        PotentialObjID: '3',
        CustomerName: 'customerName',
        Phone: '0918492052',
        Address: 'St.Lom, Sangkat DongKou, Khan Dong Kour, PhomPenh',
    },
]

/*
*
* */
class BirthdayList extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: strings('potentianl_customer.birthday_list.title'),
            // Ko can add back button o day
            // headerLeft: <ButtonBack navigation={navigation}/>,
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
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    flexGrow: 1
                },
            })
        };
    };

    /**..constructor..*/
    constructor(props) {
        super(props);
        //
        let searchDate = '';
        if(this.props.navigation.getParam('payload')){
            const {SendDate, } = this.props.navigation.getParam('payload');
            searchDate = new Date(SendDate);
            searchDate = formatTime.setTime(searchDate, 'MM/DD/YYYY');
        }else {
            searchDate = new Date();
            searchDate = formatTime.setTime(searchDate, 'MM/DD/YYYY');
        }
        //
        this.state = {
            loadingVisible: false,
            isShowDatePicker: false,
            fromDate: searchDate,
            toDate: searchDate,
            apiData: [],
        };
        this._error = this._error.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
    }

    /*
    * componentDidMount
    * */
    componentDidMount() {
        this._mounted = true;
        // LOAD API FIRST
        this.props.navigation.addListener('willFocus',
            () => this.handleDefaultLoad()
        );  //

    }

    /**
     *
     */
    componentWillUnmount () {
        this._mounted = false
    }


    /*
   *thuantv-05/10/2020
   * function: handleDefaultLoad
   * */
    handleDefaultLoad =()=> {
        //
        const {fromDate, toDate } = this.state;
        //show loading
        this._loading(true);
        //
        const myInput ={
            "FromDate": fromDate,
            "ToDate": toDate
        }
        // Get API
        api.getBirthdayList (myInput, (success, result, msg) => {
            // Hide loading
            this._loading(false);

            if (success) {

                this.setState({
                    ...this.state,
                    apiData: result,
                })

            } else {
                this._error(msg);
            }
        });

    }

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

    /**
     * show Loi
     * @param err
     * @private
     */
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
* viewDetail
* */
    viewDetail = (item) => {
        NavigationService.navigate('pcDetailCustomers', {'PotentialCusId' : item.PotentialObjID})
    }



    /*V2.8
    * function : fromDateChange
    * */
    fromDateChange = (date) => {
        let mDate = formatTime.setTime(date, 'MM/DD/YYYY');
        this.setState({
            ...this.state,
            fromDate: mDate
        }, ()=> this.submitSearch()
            )
    }


    /*V2.8
    * function: toDateChange
    * */
    toDateChange = (date) => {
        let mDate = formatTime.setTime(date, 'MM/DD/YYYY');
        this.setState({
            ...this.state,
            toDate: mDate
        }, ()=> this.submitSearch()
        )
    }




    /*
    * thuantv-05/10/2020
    * function: submitSearch
    * */
    submitSearch = () => {
        const {fromDate, toDate} = this.state;
        const date1 = new Date(fromDate);
        const date2 = new Date(toDate);

        if(date1 > date2){
            this.refs['popup'].getWrappedInstance().show( strings('dl.potentianl_customer.birthDay_list.noti.date_not_match') );
            // xoa data
            this.setState({
                ...this.state,
                apiData: [],
            })

        }else {
            // this.refs['popup'].getWrappedInstance().show('Good....');
            this.handleDefaultLoad();
        }
    }


    /*
* renderBody
* */
    renderBody(data) {
        return (
            <View style={{flex: 1, paddingVertical: 16, paddingHorizontal: 24}}>
                <CustomFlatList
                    renderItem={(item) => this.renderItem(item)}
                    isLoading={this.state.loadingVisible}
                    data={data}
                />
            </View>
        )
    }


    /*
    * renderItems
    * */
    renderItem(item) {
        return (
            <View style={[i_styles.card_view]}>
                {/*..body..*/}
                <View style={[i_styles.body_ctn]}>
                    <RowInfoIcon
                        // imageName={images.birthdayIcon}
                        // iconStyle={{tintColor: '#FD6077'}}
                        mainStyle={{marginTop: 8}}
                        value={item.CustomerName}
                        label={strings('potentianl_customer.birthday_list.form.cusName')}/>

                    <RowInfo
                        mainStyle={{marginTop: 8}}
                        value={item.Phone}
                        label={strings('potentianl_customer.birthday_list.form.phone')}/>

                    <RowInfo
                        mainStyle={{marginTop: 8}}
                        value={item.Address}
                        label={strings('potentianl_customer.birthday_list.form.address')}/>

                </View>

                {/*..divide..*/}
                <View style={i_styles.divide_ctn}/>

                {/*..footer..*/}
                <TouchableOpacity onPress={() => this.viewDetail(item)}>
                    <View style={[i_styles.footer_ctn]}>
                        <Text style={i_styles.title_ft}>{'Detail'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    /*
    * render filter-Bar
    * */
    renderFilterBar() {
        return (
            <View>
                <View style={[i_styles.filterBar_st]}>
                    <Text style={i_styles.label_txt}>{strings('potentianl_customer.birthday_list.label_result')}</Text>
                </View>
                {this.renderDateTimePicker()}
            </View>
        )
    }


    /*
    * render dateTime-picker
    *
    * */
    renderDateTimePicker() {
        return (
            <View>
                <View style={i_styles.dateTime_ctn}>
                    <DateTimePicker
                        mainStyle={{height: 40,}}
                        label={strings('potentianl_customer.birthday_list.form.from_date_label')}
                        placeholder={strings(
                            'potentianl_customer.birthday_list.form.from_date_placeholder',
                        )}
                        value={this.state.fromDate}
                        getDate={(date) => this.fromDateChange(date)}
                    />
                    {/*..*/}
                    <View style={{width: 18}}/>

                    {/*...*/}
                    <DateTimePicker
                        mainStyle={{height: 40,}}
                        label={strings('potentianl_customer.birthday_list.form.to_date_label')}
                        placeholder={strings(
                            'potentianl_customer.birthday_list.form.to_date_placeholder',
                        )}
                        value={this.state.toDate}
                        getDate={(date) => this.toDateChange(date)}
                    />
                </View>

            </View>
        )
    }

    /*
    *
    * */

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    {/*...render-filter-Bar..*/}
                    {this.renderFilterBar()}
                    {/*....*/}
                    {this.renderBody(this.state.apiData)}
                    {/*...*/}
                    <PopupWarning ref="popup"/>
                </View>
            </SafeAreaView>
        );
    }
}

export default connect((state) => {
    return {}
}, {})(BirthdayList);
