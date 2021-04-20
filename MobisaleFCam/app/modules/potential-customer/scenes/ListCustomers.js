// LIB
import React, { Component } from 'react';
import {
    Text, ScrollView, View, TouchableOpacity, TextInput, Image, KeyboardAvoidingView,
    Alert,
} from 'react-native';
import {HeaderBackButton} from 'react-navigation';
import {strings} from 'locales/i18n';
import {connect} from 'react-redux';

// API
import * as api from '../api';

// REDUX ACTION
import {actions as a, constants as c} from '../';
const { updateInfoRegistration, resetAllDataBookport } = a;

// LIB COMPONENT CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import NavigationService from 'app-libs/helpers/NavigationService';
import SelectPicker from '../components/SelectPickerList';
import ButtonBack from 'app-libs/components/ButtonBack.js';
import PickerSearchLocation from 'app-libs/components/input/PickerSearchLocation';

// HELPER
import { mapLocation } from "app-libs/helpers/mapPicker";

// STYLE
import styles from '../styles';
import ols from '../../../styles/Ola-style';
import MenuPicker from "../components/MenuSelectPicker";

//
const menuOptions =[
    {label: strings('potentianl_customer.list_customers.menu.recare_list'), value: 1, id:'pcReCareList'},
    {label: strings('potentianl_customer.list_customers.menu.birthday_list') , value: 2, id:'pcBirthdayList'},
]



/*
*
* */
class ListCustomer extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('potentianl_customer.list_customers.title'),
            // Ko can add back button o day
            // headerLeft: <ButtonBack navigation={navigation}/>,
            // headerRight: <View/>,
            // thuantv-edit- v2.8
            headerRight: (
                <MenuPicker
                 modalTitle={strings('contract.contract_detail.extens_feature')}
                 optionList={menuOptions}
                 onValueChange={(opt)=>
                     NavigationService.navigate(opt.id, {})
                     }
                />
            ),
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
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingVisible : false,
            objPoCus : [],
            searchData : {
                Source: 1,
                SearchType : 1,
                SearchContent : '',
                SearchLocation: this.props.locationOpt[0]
            },
            placeholderFilter : strings('potentianl_customer.list_customers.filter_option.fullname'),
            optionsFilter : [],
            dataEmpty: true,
        };
        this._handleBtnCreate = this._handleBtnCreate.bind(this);
        this._handleChangeSearchType = this._handleChangeSearchType.bind(this);
        this._handleLoadSearchType = this._handleLoadSearchType.bind(this);
        this._handleSubmitSearch = this._handleSubmitSearch.bind(this);
        this._handleDefaultLoad = this._handleDefaultLoad.bind(this);
        this._handleChangeValueSearch = this._handleChangeValueSearch.bind(this);
        this._error = this._error.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
        this.changeLocation = this.changeLocation.bind(this);
    }

    componentDidMount() {
        // Dang ky event xu ly khi chon menu phai
        // this.props.navigation.setParams({selectMenu: this.selectMenu.bind(this)});

        //
        this.props.navigation.addListener('willFocus', () => {
            // Call Search Default
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
        if (selectItem == this.state.searchData.SearchLocation) {
            return;
        }

        this.setState({
            searchData: {
                ...this.state.searchData,
                SearchLocation: selectItem,
            }
        });
    }

    _handleLoadSearchType() {

        api.getSearchTypeList((success, result, msg)=>{

            if(success) {
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
            } else
            {
                this._errorMsg(msg.message);
            }
        });
    }

    _handleSubmitSearch(event) {
        this.setState({
            ...this.state,
            searchData : {
                ...this.state.searchData,
                SearchContent : event.nativeEvent.text
            }
        }, ()=>{
            this._handleDefaultLoad();
        });
    }

    _handleChangeSearchType(value) {

        let pl = '';
        if(value.value == 1) {
            pl = strings('potentianl_customer.list_customers.filter_option.fullname');
        } else if(value.value==2) {
            pl = strings('potentianl_customer.list_customers.filter_option.phone');
        } else {
            pl = strings('potentianl_customer.list_customers.filter_option.address');
        }

        this.setState({
            ...this.state,
            searchData : {
                ...this.state.searchData,
                SearchType : value.value
            },
            placeholderFilter : pl
        },() => {
            // this._handleDefaultLoad();
        });
    }

    _handleChangeSearchSource(val) {

        this.setState({
            ...this.state,
            searchData : {
                ...this.state.searchData,
                Source : val
            },
            objPoCus : [],
            dataEmpty: true,
        }, () => {
            this._handleDefaultLoad();
        });
    }

    _handleChangeValueSearch(text) {
        this.setState({
            ...this.state,
            searchData : {
                ...this.state.searchData,
                SearchContent : text
            }
        });
    }

    _handleDefaultLoad() {
        this._loading(true);

        const myData = {
            Source: this.state.searchData.Source,
            SearchType: this.state.searchData.SearchType,
            SearchContent: this.state.searchData.SearchContent,
            LocationId: this.state.searchData.SearchLocation.Id,
        };

        api.getListPoCus(myData, (success, result, msg) => {

            this._loading(false);
            if (success) {
                this.setState({
                    ...this.state,
                    objPoCus : result,
                    dataEmpty: Object.entries(result).length === 0 ? true : false,
                });
            } else {
                this._errorMsg(msg.message);
            }
        });
    }

    _handleNavigate(PotentialObjID) {
        NavigationService.navigate('pcDetailCustomers', {'PotentialCusId' : PotentialObjID})
    }

    _handleBtnCreate() {
        NavigationService.navigate('pcAddCustomer', {'bookportForward' : false});
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

    /**
     * show Loi
     * @param err
     * @private
     */
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
        return (
            <View style={styles.container}>
                <View style={styles.containerFilter}>
                    {
                        // SEARCH
                    }
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <View style={[styles.searchContainer, {
                            paddingLeft:0, paddingRight:0,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'}]}>
                            <View style={[styles.boxSearch, {width: '65%'}]}>
                                <View style={styles.viewInputSearch} >
                                    <TouchableOpacity style={styles.iconSearchBox} onPress={this._handleDefaultLoad}>
                                        <Image style={styles.iconSearch} source={require('../../../assets/images/potential-customer/ic_16Search_off.png')}/>
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
                                    value = {this.state.searchData.SearchLocation}
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
                                    style={[styles.btnFilterType, this.state.searchData.Source == 1 ? styles.btnFilterActive:null]}
                                    onPress={() => {this._handleChangeSearchSource(1)}}
                                >
                                    <Text style={this.state.searchData.Source == 1 ? styles.textFilterTypeActive : styles.textFilterType }>
                                        {strings('potentianl_customer.list_customers.filter_option.mylist')}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.col}>
                                <TouchableOpacity
                                    style={[styles.btnFilterType, this.state.searchData.Source == 2 ? styles.btnFilterActive:null]}
                                    onPress={() => {this._handleChangeSearchSource(2)}}
                                >
                                    <Text style={this.state.searchData.Source == 2 ? styles.textFilterTypeActive : styles.textFilterType }>
                                        {strings('potentianl_customer.list_customers.filter_option.system')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.listInfoContainer}>

                        { !this.state.dataEmpty && Object.keys(this.state.objPoCus).length > 0
                            ?
                                <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom:20,}} >
                                {
                                    this.state.objPoCus.map((infoPoCus, index) => (

                                        <View key={index} style={styles.oneList}>
                                            <View style={styles.infoBox}>
                                                <View style={[styles.oneInfo, {marginTop: 8}]}>
                                                    <Text style={styles.infoTitle}>{strings('potentianl_customer.list_customers.list.name')}</Text>
                                                    <Text style={styles.infoValue}>{infoPoCus.Name}</Text>
                                                </View>
                                                <View style={styles.oneInfo}>
                                                    <Text style={styles.infoTitle}>{strings('potentianl_customer.list_customers.list.phone')}</Text>
                                                    <Text style={styles.infoValue}>{infoPoCus.PhoneNumber}</Text>
                                                </View>
                                                <View style={styles.oneAddress}>
                                                    <Text style={styles.infoTitle}>{strings('potentianl_customer.list_customers.list.address')}</Text>
                                                    <Text style={styles.infoValue}>{infoPoCus.Address}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.createBox}>
                                                <TouchableOpacity
                                                    style={styles.btnCreate}
                                                    onPress={this._handleNavigate.bind(this, infoPoCus.PotentialObjID)}
                                                >
                                                    <Text style={styles.txtBtnCreate}>{strings('potentianl_customer.list_customers.list.detail')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))
                                }
                                </ScrollView>
                            :
                                // Render view khi khong co data tra ve
                                <View style={ols.dataEmpty} >
                                    <View style={[ols.wrapImage]}>
                                        <Image
                                            style={ols.imageNoData}
                                            source={require('../../../assets/images/contract-list/report.png')}
                                        />
                                        <View>
                                            <Text style={[ols.fs16, ols.fw500, {marginTop: 26, color: '#D6D6D6', textAlign: 'center'}]}>
                                                {strings('all.data.noDataPotentialCus')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                        }


                    <View style={styles.btnAddBox}>
                        <TouchableOpacity style={{padding:20}} onPress={this._handleBtnCreate}>
                            <Image  style={{width:56, height:56}}
                                    source={require('../../../assets/images/potential-customer/ic_56Ban_hang.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}

export default connect((state)=>{
    const locationOpt = state.authReducer.userInfo.ListLocation;

    return {
        userInfo: state.authReducer.userInfo,
        locationOpt: mapLocation(locationOpt),
    }
}, {updateInfoRegistration, resetAllDataBookport})(ListCustomer);
