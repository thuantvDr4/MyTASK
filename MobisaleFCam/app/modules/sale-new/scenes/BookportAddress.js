// LIB
import React from 'react';
import {View, KeyboardAvoidingView, ScrollView, Alert, Text, Platform} from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {HeaderBackButton} from 'react-navigation';
// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import TechLoading from 'app-libs/components/TechLoading';
import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';
// import TextInput from 'app-libs/components/input/TextInput';
import TextInput from '../../../libs/components/input/TextInputVund';
import ButtonElement from 'app-libs/components/input/ButtonElement';
import PopupWarning from 'app-libs/components/PopupWarning';
// API
import * as api from '../api';
// ACTION
import {mapLocation} from 'app-libs/helpers/mapPicker';
import {actions as act, constants as c} from '../';


const {saveInstallAddress, resetAllDataBookport, saveInstallAddress_OpenSafe} = act;

// STYLE
import ols from '../../../styles/Ola-style';

class BookportAddress extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: strings('sale_new.bookport_address.title'),
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>
    })

    constructor(props) {
        super(props);
        //
        this.state = {
            data: {},
            showBuilding: false,
            loadingVisible : false,
            openSafeObj: this.props.openSafeObj
        };

        this.changeLocation = this.changeLocation.bind(this);
        this.changeDistrict = this.changeDistrict.bind(this);
        this.changeWard = this.changeWard.bind(this);
        this.changeHomeType = this.changeHomeType.bind(this);
        this.changeBuilding = this.changeBuilding.bind(this);
        this.changeStreet = this.changeStreet.bind(this);
        this.changeHouseNumber = this.changeHouseNumber.bind(this);
        this._error = this._error.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    /*
    * componentDidMount
    * */
    componentDidMount() {
        //
        this._checkBookportForward();
        //
    }

    /*
    * check-BookportForward
    * */
    _checkBookportForward =()=>{
        //
        const globalData = this.props.RegistrationObj
        const bookportForward = this.props.navigation.getParam('bookportForward', false);
        //
        if (bookportForward) {

            var myData = {};
            if (globalData.FullName) { myData.FullName = globalData.FullName; }
            if (globalData.Phone1) { myData.Phone1 = globalData.Phone1; }
            if (globalData.Email) { myData.Email = globalData.Email; }
            if (globalData.PotentialObjID) { myData.PotentialObjID = globalData.PotentialObjID; }
            if (globalData.BillTo_Number) { myData.BillTo_Number = globalData.BillTo_Number; }
            if (globalData.LocationId || globalData.LocationId == null) {
                myData.Location = { Id: globalData.LocationId, Name: globalData.BillTo_City } }
            if (globalData.DistrictId || globalData.DistrictId == null) {
                myData.District = { Id: globalData.DistrictId, Name: globalData.BillTo_District } }
            if (globalData.WardId || globalData.WardId == null) {
                myData.Ward = { Id: globalData.WardId, Name: globalData.BillTo_Ward } }
            if (globalData.StreetId || globalData.StreetId == null) {
                myData.Street = { Id: globalData.StreetId, Name: globalData.BillTo_Street } }
            if (globalData.BuildingId || globalData.BuildingId == null) {
                myData.Building = { Id: globalData.BuildingId, Name: globalData.BuildingName }
            }
            // add telegram
            if (globalData.Telegram) { myData.Telegram = globalData.Telegram; }

            this.setState({
                ...this.state,
                data: myData
            }, () => {
                if (globalData.TypeHouse) {

                    api.loadHomeType((homeType) => {
                        let TypeHouseName;

                        homeType.map((item) => {

                            if (item.Id == globalData.TypeHouse) {
                                TypeHouseName = item.Name;
                            }
                        });

                        let isVisible = false;

                        if (globalData.TypeHouse == c.HOME_TYPE_BUILDING) {
                            isVisible = true;
                        }

                        this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                HomeType: {
                                    Id: globalData.TypeHouse,
                                    Name: TypeHouseName
                                },
                            },
                            showBuilding: isVisible
                        });
                    }, false);
                }
            });

        } else {

            this.setState({
                data : {
                    Location : this.props.locationOpt[0]
                },
            });
        }
    }


    /**V2.10
     * MOUNT Received Props
     */
    componentWillReceiveProps(nextProps) {
        // Data if change because merge to contructor not update
        if (nextProps.openSafeObj !== this.state.openSafeObj) {
            this.setState({
                openSafeObj : nextProps.openSafeObj
            })
        }

    }


    /*
    * getLocationData
    * */
    getLocationData(callback) {

        setTimeout(() => {
            callback(this.props.locationOpt);
        }, 0);
    }

    changeLocation(selectItem) {

        if (selectItem == this.state.data.Location) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                Location: selectItem,
                District: null,
                Ward: null,
                Street: null
            }
        });
    }

    changeDistrict(selectItem) {

        if (selectItem == this.state.data.District) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                District: selectItem,
                Ward: null,
                Street: null
            }
        });
    }

    changeWard(selectItem) {

        if (selectItem == this.state.data.Ward) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                Ward: selectItem,
                Street: null
            }
        });
    }

    changeHomeType(selectItem) {

        if (selectItem == this.state.data.HomeType) {
            return;
        }

        let isVisible = false;

        if (selectItem.Id == c.HOME_TYPE_BUILDING) {
            isVisible = true;
        }

        this.setState({
            data: {
                ...this.state.data,
                HomeType: selectItem,
            },
            showBuilding: isVisible
        });
    }

    changeBuilding(selectItem) {

        if (selectItem == this.state.data.Building) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                Building: selectItem
            }
        });
    }

    changeStreet(selectItem) {
        if (selectItem == this.state.data.Street) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                Street: selectItem
            }
        });
    }

    changeHouseNumber(text){
        this.setState({
            data: {
                ...this.state.data,
                BillTo_Number: text
            }
        });
    }



    onSubmit() {
        if (! this.isValidData()) {
            return;
        }

        this._loading(true);

        const infoAddress = {
            LocationId  : this.state.data.Location.Id,
            DistrictID  : this.state.data.District.Id,
            WardID      : this.state.data.Ward.Id,
            StreetId    : this.state.data.Street.Id,
            HouseNumber : this.state.data.BillTo_Number,
            HomeType    : this.state.data.HomeType.Id,

        };

        if (this.state.data.HomeType.Id === c.HOME_TYPE_BUILDING) {

            infoAddress.BuildingId = this.state.data.Building ? this.state.data.Building.Id : null;
        }

        // reset
        this.props.resetAllDataBookport();

        // goi API generation
        api.generationAddress(infoAddress, (success, result, msg) => {

            this._loading(false);

            if (success) {

                this.setState({
                    data: {
                        ...this.state.data,
                        Address : result[0]['Result'],
                        FullAddress: result[0]['Result']
                    }
                }, () => {

                    this._gotoNextScreen();

                });

            } else {
                this._errorMsg(msg.message);
            }
        });
    }

    /*
    * _gotoNextScreen
    * */
    _gotoNextScreen =()=>{
        //
        const serviceType = this.props.navigation.getParam('serviceType', null);
        //TH- edit-address
        switch (serviceType) {
            case 'Internet': {
                // save address moi len store
                this.props.saveInstallAddress(this.state.data, () => {
                    //quay lai màn hình BOOk-PORT
                    NavigationService.navigate('BookPort');
                    //
                });

            }
                break;

            case 'OpenSafe': {
                // save address moi len store
                const myData = {
                    ...this.state.openSafeObj,
                    ...this.state.data,
                }
                console.log('-----mydata', myData)
                this.props.saveInstallAddress_OpenSafe(myData, () => {
                    //Quay lại màn hình OPEN-SAFE -info
                    NavigationService.navigate('OpenSafe_Info');
                    //
                });

            }
                break;
            //
            default: {
                //save address moi len store
                this.props.saveInstallAddress(this.state.data, () => {
                    //chuyển tới màn hình chọn loại dịch vu
                    NavigationService.navigate('ChooseServiceType');
                    //
                });
            }
            break;
        }

    }




    /*
    *
    * */
    isValidData() {

        const {data} = this.state;
        let errorList = [];

        // Check Location
        if (data.Location == null) {
            this.refs['Location'].setValid(false);

            errorList.push({
                name: 'Location',
                msg: strings('dl.sale_new.bookport_address.err.Location')
            });
        }
        else {
            this.refs['Location'].setValid(true);
        }

        // Check District
        if (data.District == null) {
            this.refs['District'].setValid(false);

            errorList.push({
                name: 'District',
                msg: strings('dl.sale_new.bookport_address.err.District')
            });
        }
        else {
            this.refs['District'].setValid(true);
        }

        // Check Ward
        if (data.Ward == null) {
            this.refs['Ward'].setValid(false);

            errorList.push({
                name: 'Ward',
                msg: strings('dl.sale_new.bookport_address.err.Ward')
            });
        }
        else {
            this.refs['Ward'].setValid(true);
        }

        // Check HomeType
        if (data.HomeType == null) {
            this.refs['HomeType'].setValid(false);

            errorList.push({
                name: 'HomeType',
                msg: strings('dl.sale_new.bookport_address.err.HomeType')
            });
        }
        else {
            this.refs['HomeType'].setValid(true);
        }

        // Check Building
        if (data.HomeType && data.HomeType.Id == c.HOME_TYPE_BUILDING && data.Building == null) {
            this.refs['Building'].setValid(false);

            errorList.push({
                name: 'Building',
                msg: strings('dl.sale_new.bookport_address.err.Building')
            });
        }
        else {
            this.refs['Building'].setValid(true);
        }

        // Check Street
        if (data.Street == null) {
            this.refs['Street'].setValid(false);

            errorList.push({
                name: 'Street',
                msg: strings('dl.sale_new.bookport_address.err.Street')
            });
        }
        else {
            this.refs['Street'].setValid(true);
        }

        // Check House Number
        if (! data.BillTo_Number) {
            this.refs['HouseNumber'].setValid(false);

            errorList.push({
                name: 'HouseNumber',
                msg: strings('dl.sale_new.bookport_address.err.HouseNumber')
            });
        }
        else {
            this.refs['HouseNumber'].setValid(true);
        }

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
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
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ios: 70, android: 0})}
                behavior= {(Platform.OS === 'ios')? "padding" : null}
                style={[ols.container_keyboard]} >
                <ScrollView
                    keyboardDismissMode={'on-drag'}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >
                    <View style={[ols.inner_scrollview, ols.bgw, {justifyContent: 'space-between'}]}>

                    <View style={{paddingTop: 15}}>
                            <View style={{flexGrow: 1, marginBottom: 10, justifyContent:'center',}}>
                                <Text style={{fontSize:14, fontWeight:'500', color:'#444444'}}>
                                    { strings('sale_new.bookport_address.titleTop') }
                                </Text>
                            </View>
                            <PickerSearchInput
                                ref="Location"
                                label = {strings('sale_new.bookport_address.form.city_label')}
                                placeholder = {strings('sale_new.bookport_address.form.city_placeholder')}
                                filterText = {strings('sale_new.bookport_address.form.city_filterText')}
                                getOptionData = {this.getLocationData.bind(this)}
                                value = {this.state.data.Location ? this.state.data.Location : this.props.locationOpt[0]}
                                onChange = {this.changeLocation}
                                params = {this.state.data.Location ? this.state.data.Location.Id : null}
                            />

                            <PickerSearchInput
                                ref="District"
                                label = {strings('sale_new.bookport_address.form.district_label')}
                                placeholder = {strings('sale_new.bookport_address.form.district_placeholder')}
                                filterText = {strings('sale_new.bookport_address.form.district_filterText')}
                                getOptionData = {api.loadDistrict}
                                value = {this.state.data.District}
                                onChange = {this.changeDistrict}
                                params = {this.state.data.Location ? this.state.data.Location.Id : null}
                            />

                            <PickerSearchInput
                                ref="Ward"
                                label = {strings('sale_new.bookport_address.form.ward_label')}
                                placeholder = {strings('sale_new.bookport_address.form.ward_placeholder')}
                                filterText = {strings('sale_new.bookport_address.form.ward_filterText')}
                                getOptionData = {api.loadWard}
                                value = {this.state.data.Ward}
                                onChange = {this.changeWard}
                                params = {this.state.data.District ? {Location: this.state.data.Location.Id, District : this.state.data.District.Id} : null}
                            />

                            <PickerSearchInput
                                ref="HomeType"
                                label = {strings('sale_new.bookport_address.form.home_type_label')}
                                placeholder = {strings('sale_new.bookport_address.form.home_type_placeholder')}
                                filterText = {strings('sale_new.bookport_address.form.home_type_filterText')}
                                getOptionData = {api.loadHomeType}
                                value = {this.state.data.HomeType}
                                onChange = {this.changeHomeType}
                            />

                            <PickerSearchInput
                                ref="Building"
                                visible = {this.state.showBuilding}
                                label = {strings('sale_new.bookport_address.form.building_label')}
                                placeholder = {strings('sale_new.bookport_address.form.building_placeholder')}
                                filterText = {strings('sale_new.bookport_address.form.building_filterText')}
                                getOptionData = {api.loadBuilding}
                                value = {this.state.data.Building}
                                onChange = {this.changeBuilding}
                                params = {this.state.data.Location ? this.state.data.Location.Id : null}
                            />

                            <PickerSearchInput
                                ref="Street"
                                label = {strings('sale_new.bookport_address.form.street_label')}
                                placeholder = {strings('sale_new.bookport_address.form.street_placeholder')}
                                filterText = {strings('sale_new.bookport_address.form.street_filterText')}
                                getOptionData = {api.loadStreet}
                                value = {this.state.data.Street}
                                onChange = {this.changeStreet}
                                params = {this.state.data.Ward ? {Location: this.state.data.Location.Id, District : this.state.data.District.Id, Ward: this.state.data.Ward.Id} : null}
                            />

                            <TextInput
                                ref="HouseNumber"
                                label = { strings('sale_new.bookport_address.form.apartment_no_label') }
                                placeholder = { strings('sale_new.bookport_address.form.apartment_no_placeholder') }
                                textInputStyle = {{fontSize: 12, fontWeight: '500'}}
                                onChangeText={this.changeHouseNumber}
                                underlineColorAndroid={'rgba(0,0,0,0)'}
                                value={this.state.data.BillTo_Number}
                            />
                        </View>


                        <View style={{paddingBottom: 24}}>
                            <ButtonElement
                                title={ strings('sale_new.bookport_address.form.button_next') }
                                onPress={this.onSubmit}
                            />
                        </View>
                    </View>
                </ScrollView>

                <TechLoading visible={this.state.loadingVisible}/>
                <PopupWarning ref="popup"/>
            </KeyboardAvoidingView>
        );
    }
}

export default connect(
    (state) => {

        return {
            locationOpt: mapLocation(state.authReducer.userInfo.ListLocation),
            RegistrationObj: state.saleNewReducer.RegistrationObj,
            openSafeObj: state.saleNewReducer.openSafeObj
        }
    },
    {
        saveInstallAddress, resetAllDataBookport, saveInstallAddress_OpenSafe
    }
)(BookportAddress);
