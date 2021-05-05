import React, { Component } from 'react';
import {
    Platform, StyleSheet, Text, ScrollView,
    View, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Alert
} from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';

// API
import * as api from '../api';

// LIB
import {HeaderBackButton} from 'react-navigation';

// LIB CUSTOM
import SelectPicker from '../components/SelectPickerList';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import NavigationService from 'app-libs/helpers/NavigationService';
import PickerSearchLocation from 'app-libs/components/input/PickerSearchLocation';

// COMPONENT
import HeaderLeft from '../components/HeaderLeft';
import HeaderRight from '../components/HeaderRight';

// HELPER
import { mapLocation } from "app-libs/helpers/mapPicker";

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../ListCustomer.styles';


class ListCustomersInfo extends React.Component {
    _subscribe;
    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('list_customer_info.list.title'),
            //headerLeft: <HeaderLeft navigation={navigation}/>,
            //headerRight: <HeaderRight navigation={navigation}/>,
        };
    };

    constructor(props){
        super(props);

        this.state = {
            loadingVisible : false,
            objInfoCus : null,
            dataType : 1,
            searchType : 2,
            searchContent : '',
            searchLocation: this.props.locationOpt[0],
            optionsFilter : [],
            placeholderFilter : strings('list_customer_info.list.filter.placeholder_name'),
            dataEmpty: true,
        };

        this._handleDefaultLoad = this._handleDefaultLoad.bind(this);
        this._handleLoadSearchType = this._handleLoadSearchType.bind(this);
        this._handleSubmitSearch = this._handleSubmitSearch.bind(this);
        this._handleChangeDataType = this._handleChangeDataType.bind(this);
        this._handleChangeSearchType = this._handleChangeSearchType.bind(this);
        this._handleChangeValueSearch = this._handleChangeValueSearch.bind(this);
        this._handleBtnDetail = this._handleBtnDetail.bind(this);

        this._error = this._error.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
        this._loading = this._loading.bind(this);

        this.changeLocation = this.changeLocation.bind(this);
    }

    componentDidMount(){
        this.props.navigation.addListener('willFocus', () => {
            this._handleDefaultLoad();
        });
        this._handleLoadSearchType();
    }

    /**************************************************
     * FUNCTION: getLocationData (Load danh sach location trong API get_info)
     * DESC: Pass function vào component
     * @param
     * @private
     ***************************************************/
    getLocationData(callback) {

        setTimeout(() => {
            callback(this.props.locationOpt);
        }, 0);
    }

    /**************************************************
     * FUNCTION: changeLocation (Select danh sach location)
     * DESC: Pass function vào component
     * @param
     * @private
     ***************************************************/
    changeLocation(selectItem) {
        if (selectItem == this.state.searchLocation) {
            return;
        }

        this.setState({
            ...this.state,
            searchLocation: selectItem,
        });
    }

    _handleLoadSearchType(){
        api.GetRegistrationSearchTypeList((success, result, msg)=>{
            if(success)
            {
                let options = [];

                result.map((item)=>{
                    const oneOptions = {
                        label : item.Name,
                        value : item.Id
                    };
                    options.push(oneOptions)
                });

                this.setState({
                    ...this.state,
                    optionsFilter : options
                });
            }
            else
            {
                this._errorMsg(msg.message);
            }
        });
    }

    _handleSubmitSearch(event){
        this.setState({
            ...this.state,
            searchContent : event.nativeEvent.text
        },()=>{
            this._handleDefaultLoad();
        });
    }

    _handleChangeSearchType(value){

        let pl = '';
        if(value.value == 1)
        {
            pl = strings('list_customer_info.list.filter.placeholder_id');
        }
        else if(value.value==2)
        {
            pl = strings('list_customer_info.list.filter.placeholder_name');
        }
        else
        {
            pl = strings('list_customer_info.list.filter.placeholder_phone');
        }

        this.setState({
            ...this.state,
            searchType : value.value,
            placeholderFilter : pl
        },() => {
            this._handleDefaultLoad();
        });
    }

    _handleChangeDataType(value){
        this.setState({
            ...this.state,
            objInfoCus : [],
            dataType : value
        }, ()=>{
            this._handleDefaultLoad();
        });
    }

    _handleChangeValueSearch(text){
        this.setState({
            ...this.state,
            searchContent : text
        });
    }

    _handleDefaultLoad() {
        this._loading(true);

        const MyData = {
            SearchContent : this.state.searchContent,
            SearchType: this.state.searchType,
            DataType : this.state.dataType,
            LocationId: this.state.searchLocation.Id
        };

        api.GetRegistrationAll(MyData, (success, result, msg) => {
            this._loading(false);

            if(success) {
                this.setState({
                    ...this.state,
                    objInfoCus : result,
                    dataEmpty: Object.entries(result).length === 0 ? true : false,
                });
            } else {
                this._errorMsg(msg.message);
            }
        });
    }

    _handleBtnDetail (data1, data2){

        if (this.state.dataType !== 1) {
            NavigationService.navigate('ContractDetail', {Contract: data1, ObjID: data2, pdfDownloadLink: this.props.pdfDownloadLink});
        } else {
          //NavigationService.navigate('lciDetailCustomer', {RegID : data1, RegCode : data2}); //

            NavigationService.navigate('openSafe_DetailCustomer', {RegID : data1, RegCode : data2}); // for open-safe
        }
    }

    /**
     * show Loi
     * @param err
     * @private
     */
    _error(err) {
        this._loading(false);
        if (! err.message) return;
        this.refs['popup'].getWrappedInstance().show(err.message);
    }

    _errorMsg(err) {
        this._loading(false);
        if (! err) return;
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

    render() {
        var styleStatus = null;

        if (this.state.dataType == 1) {
            styleStatus = styles.infoValue;
        } else if(this.state.dataType == 2) {
            styleStatus = styles.infoValueNotPaid;
        } else {
            styleStatus = styles.infoValuePaid;
        }

        return (
            <View style={styles.container}>

                <View style={styles.listInfoContainer}>

                    <View style={styles.filterContainer2}>
                        {
                            // SEARCH
                        }
                        <KeyboardAvoidingView behavior="padding" enabled>
                            <View style={[styles.searchContainer, {
                                paddingRight:0, paddingLeft:0, paddingBottom: 0,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'}]}>
                                <View style={[styles.boxSearch, {width: '65%'}]}>
                                    <View style={styles.viewInputSearch} >
                                        <TouchableOpacity style={styles.iconSearchBox} onPress={this._handleDefaultLoad}>
                                            <Image style={styles.iconSearch} source={require('../../../assets/images/list-customer-info/ic_16Search_off.png')}/>
                                        </TouchableOpacity>
                                        <View style={styles.inputSearchBox}>

                                            <View style={styles.innerInputSearchBox}>
                                                <TextInput
                                                    style={styles.inputSearch}
                                                    placeholderTextColor="#878787"
                                                    placeholder={this.state.placeholderFilter}
                                                    underlineColorAndroid='rgba(0,0,0,0)'
                                                    onChangeText={this._handleChangeValueSearch}
                                                    onSubmitEditing={this._handleSubmitSearch}
                                                />
                                            </View>

                                            <View style={styles.searchBorder}></View>
                                        </View>
                                        <View style={styles.iconFilterBox}>
                                            <SelectPicker
                                                titleHeader={strings('potentianl_customer.list_customers.filter.header_picker')}
                                                option={this.state.optionsFilter}
                                                onValueChange={this._handleChangeSearchType}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={[{width: '32%'}]}>
                                    <PickerSearchLocation
                                        ref="Location"
                                        label = {strings('potentianl_customer.add_customers.form.city_label')}
                                        placeholder = {strings('potentianl_customer.add_customers.form.city_placeholder')}
                                        filterText = {strings('potentianl_customer.add_customers.form.city_filterText')}
                                        getOptionData = {this.getLocationData.bind(this)}
                                        value = {this.state.searchLocation}
                                        onChange = {this.changeLocation}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>

                        {
                            // FILTER
                        }
                        <View style={styles.filterTypeBox}>
                            <View style={styles.row}>
                                <View style={styles.col}>
                                <TouchableOpacity
                                    style={[styles.btnFilterType, this.state.dataType == 1 ? styles.btnFilterActive:null]}
                                    onPress={() => {this._handleChangeDataType(1)}}
                                >
                                    <Text style={this.state.dataType == 1 ? styles.textFilterTypeActive : styles.textFilterType }>
                                        {strings('list_customer_info.list.filter_tab.Customer_Info')}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                                <View style={styles.col}>
                                <TouchableOpacity
                                    style={[styles.btnFilterType, this.state.dataType == 2 ? styles.btnFilterActive:null]}
                                    onPress={() => {this._handleChangeDataType(2)}}
                                >
                                    <Text style={this.state.dataType == 2 ? styles.textFilterTypeActive : styles.textFilterType }>
                                        {strings('list_customer_info.list.filter_tab.Unpaid_contract')}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                                <View style={styles.col}>
                                <TouchableOpacity
                                    style={[styles.btnFilterType, this.state.dataType == 3 ? styles.btnFilterActive:null]}
                                    onPress={() => {this._handleChangeDataType(3)}}
                                >
                                    <Text style={this.state.dataType == 3 ? styles.textFilterTypeActive : styles.textFilterType }>
                                        {strings('list_customer_info.list.filter_tab.Paid_contract')}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            </View>
                        </View>
                    </View>

                    {
                        // LIST CUSTOMER
                    }
                    <ScrollView
                        contentContainerStyle={[styles.scrollView, {paddingBottom:20}]}
                        keyboardDismissMode={'on-drag'} >
                        {
                            !this.state.dataEmpty && Object.keys(this.state.objInfoCus).length > 0
                            ?
                            this.state.objInfoCus.map((infoCus, index) => (
                                <View style={styles.oneList} key={infoCus.RegCode}>
                                    <View style={styles.infoBox}>
                                        <View style={[styles.oneInfo, {marginTop: 8}]}>
                                            <Text style={styles.infoTitle}>{strings('list_customer_info.list.list.Status')}</Text>
                                            <Text style={[styleStatus, {fontWeight:'700' }]}>{infoCus.RegStatus}</Text>
                                        </View>

                                        {/*....V2.10..update..*/}
                                        <View style={[styles.oneInfo, {marginTop: 8}]}>
                                            <Text style={styles.infoTitle}>{'Service type'}</Text>
                                            <Text style={[styleStatus, {fontWeight:'700' }]}>{infoCus.ServiceType}</Text>
                                        </View>

                                        <View style={styles.oneInfo}>
                                            <Text style={styles.infoTitle}>{!infoCus.FullName ? strings('list_customer_info.list.list.fullname') : strings('list_customer_info.list.list.fullname')}</Text>
                                            <Text style={styles.infoValue}>{!infoCus.FullName ? infoCus.FullName : infoCus.FullName}</Text>
                                        </View>
                                        <View style={styles.oneInfo}>
                                            <Text style={styles.infoTitle}>{!infoCus.Contract ? strings('list_customer_info.list.list.Reg_Code') : strings('list_customer_info.list.list.Contract_No')}</Text>
                                            <Text style={styles.infoValue}>{!infoCus.Contract ? infoCus.RegCode : infoCus.Contract}</Text>
                                        </View>
                                        <View style={styles.oneInfo}>
                                            <Text style={styles.infoTitle}>{strings('list_customer_info.list.list.phone')}</Text>
                                            <Text style={styles.infoValue}>{infoCus.Phone1}</Text>
                                        </View>
                                        <View style={styles.oneAddress}>
                                            <Text style={styles.infoTitle}>{strings('list_customer_info.list.list.address')}</Text>
                                            <Text style={styles.infoValue}>{infoCus.Address}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.createBox}>
                                        <TouchableOpacity
                                            style={styles.btnCreate}
                                            onPress={()=> {
                                                if (this.state.dataType !== 1) {
                                                    this._handleBtnDetail(infoCus.Contract, infoCus.ObjID)
                                                } else {
                                                    this._handleBtnDetail(infoCus.RegID, infoCus.RegCode)
                                                }
                                            }}
                                        >
                                            <Text style={styles.txtBtnCreate}>{strings('list_customer_info.list.list.Detail')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                            :
                            // Render view khi khong co data tra ve
                            <View style={styles.dataEmpty} >
                                <View style={[styles.wrapImage]}>
                                    <Image
                                        style={styles.imageNoData}
                                        source={require('../../../assets/images/contract-list/report.png')}
                                    />
                                    <View>
                                        <Text style={[ols.fs16, ols.fw500, {marginTop: 26, color: '#D6D6D6'}]}>
                                        {strings('all.data.noData')}</Text>
                                    </View>
                                </View>
                            </View>
                        }
                    </ScrollView>
                </View>
                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}
export default connect((state) => {

    const locationOpt = state.authReducer.userInfo.ListLocation;

    return {
        locationOpt: mapLocation(locationOpt),
        objListCustomer : state.customerInfoReducer.objListCustomer,
        pdfDownloadLink: state.authReducer.userInfo.DownloadPdfContractUrl
    }
})(ListCustomersInfo);

