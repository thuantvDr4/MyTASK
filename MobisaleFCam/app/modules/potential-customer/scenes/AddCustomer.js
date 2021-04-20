/**
 * Màn hình Tạo khách hàng tiềm năng
 * @uthor
 * @dateCreate 2018
 * @modified thuandd3
 * @dateEdit 20/03/2019
 * @note man hinh chuan keyboard
 */

import React from 'react';
import {
    Text, View, ScrollView, KeyboardAvoidingView, Keyboard,
    TouchableOpacity, TouchableWithoutFeedback, Alert, Platform
} from 'react-native';
import {strings} from 'locales/i18n';
import {connect} from 'react-redux';
import {constants as c} from '../';
import * as api from "../api";
import {mapLocation} from "app-libs/helpers/mapPicker";
import NavigationService from 'app-libs/helpers/NavigationService';
import TechLoading from 'app-libs/components/TechLoading';
import ButtonO from 'app-libs/components/input/ButtonO';
import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';
import TextInput from 'app-libs/components/input/TextInputVund';
import PopupWarning from 'app-libs/components/PopupWarning';
import ols from '../../../styles/Ola-style';
import styles from '../AddCustomer.styles';
import DateTimePicker from "../../../libs/components/CustomDateTimePicker";
import formatTime from "../../../libs/helpers/FormatTime";



/*
*
* */
class AddCustomer extends React.Component{

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('potentianl_customer.add_customers.title'),
            // Ko can add back button o day
            // headerLeft: <HeaderBackButton onPress={() => NavigationService.navigate('pcListCustomers')} tintColor="#fff"/>,
            headerRight: <View/>,
            headerBackTitle: null,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            data: {},
            showBuilding: false,
            pcIsUpdate : false,
            isValid: true,
        };

        this.changeFullName = this.changeFullName.bind(this);
        this.changeMobile = this.changeMobile.bind(this);
        this.changeLocation = this.changeLocation.bind(this);
        this.changeDistrict = this.changeDistrict.bind(this);
        this.changeWard = this.changeWard.bind(this);
        this.changeHomeType = this.changeHomeType.bind(this);
        this.changeBuilding = this.changeBuilding.bind(this);
        this.changeStreet = this.changeStreet.bind(this);
        this.changeHouseNumber = this.changeHouseNumber.bind(this);
        this.changeNote = this.changeNote.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this._error = this._error.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
    }

    componentDidMount() {

        const { navigation } = this.props;
        const bookportForward = navigation.getParam('bookportForward', false);
        // case: tao potential từ bookPort
        if (bookportForward) {

            var myData = {};

            if (this.props.RegistrationObj.FullName) {
                myData.FullName = this.props.RegistrationObj.FullName;
            }

            if (this.props.RegistrationObj.Phone1) {
                myData.Mobile = this.props.RegistrationObj.Phone1;
            }

            if (this.props.RegistrationObj.BillTo_Number) {
                myData.BillTo_Number = this.props.RegistrationObj.BillTo_Number;
            }

            if (this.props.RegistrationObj.NoteAddress) {
                myData.NoteAddress = this.props.RegistrationObj.NoteAddress;
            }

            if (this.props.RegistrationObj.LocationId) {
                myData.Location = {
                    Id: this.props.RegistrationObj.LocationId,
                    Name: this.props.RegistrationObj.BillTo_City
                }
            }

            if (this.props.RegistrationObj.DistrictId) {
                myData.District = {
                    Id: this.props.RegistrationObj.DistrictId,
                    Name: this.props.RegistrationObj.BillTo_District
                }
            }

            if (this.props.RegistrationObj.WardId) {
                myData.Ward = {
                    Id: this.props.RegistrationObj.WardId,
                    Name: this.props.RegistrationObj.BillTo_Ward
                }
            }

            if (this.props.RegistrationObj.StreetId)
            {
                myData.Street = {
                    Id: this.props.RegistrationObj.StreetId,
                    Name: this.props.RegistrationObj.BillTo_Street
                }
            }

            if (this.props.RegistrationObj.BuildingId)
            {
                myData.Building = {
                    Id: this.props.RegistrationObj.BuildingId,
                    Name: this.props.RegistrationObj.BuildingName
                }
            }

            this.setState({
                    ...this.state,
                    data : myData
                },
                ()=> {
                    if (this.props.RegistrationObj.TypeHouse) {

                        api.loadHomeType((homeType) => {
                            let TypeHouseName;
                            homeType.map((item) => {
                                if (item.Id == this.props.RegistrationObj.TypeHouse) {
                                    TypeHouseName = item.Name;
                                }
                            });

                            let isVisible = false;

                            if (this.props.RegistrationObj.TypeHouse == c.HOME_TYPE_BUILDING) {
                                isVisible = true;
                            }

                            this.setState({
                                ...this.state,
                                data: {
                                    ...this.state.data,
                                    HomeType: {
                                        Id: this.props.RegistrationObj.TypeHouse,
                                        Name: TypeHouseName
                                    },
                                },
                                showBuilding: isVisible
                            });
                        }, false);
                    }
                });
        }
        else {
            //check update from detail
            const pcUpdate = navigation.getParam('potentialUpdate', false);
            const payload = navigation.getParam('payload');

            if( pcUpdate && payload != null){
                //check truong hop potential-customer update thong tin
                this.getDataUpdate(payload);

            }else {
                // truong hop: tao moi hoan toan
                this.setState({
                    data : {
                        Location : this.props.locationOpt[0]
                    },
                });
            }

        }
    }

    componentWillUnmount(){

    }


    /*
    * function: getDataUpdate
    * thuantv: 02/10/2020
    * */
    getDataUpdate =(data)=> {

        const myData = {
            PotentialID : data.PotentialObjId || 0,

            FullName : data.Name || '' ,
            Mobile : data.PhoneNumber || '',

            Address : data.Address || '',
            NoteAddress : data.Description || '',

            Location:{Id: data.LocationId , Name: data.BillTo_City || ''},

            District:{Id: data.DistrictId , Name: data.BillTo_District || ''},

            Ward:{Id: data.WardId  , Name: data.BillTo_Ward || ''},

            Street:{Id: data.StreetId , Name: data.BillTo_Street || ''},

            HomeType:{Id: data.TypeHouse , Name: data.HomeTypeName || ''},

            BillTo_Number : data.BillTo_Number || '',

            Building:{Id: data.BuildingId , Name: data.BuildingName || ''},

            //V2.8
            Email   :   data.Email || '',
            Telegram : data.Telegram || '',
        };

        if( data.Birthday){
            let formatDate = new Date(data.Birthday);
            formatDate = formatTime.setTime(formatDate, 'MM/DD/YYYY');

            myData.Birthday = formatDate;
        }else {
            myData.Birthday = null;
        }

        this.setState({
            ...this.state,
            pcIsUpdate: true,
            showBuilding: data.HomeTypeName ==='Building'? true : false,
            data: myData,
        })

    }

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

        if (selectItem === this.state.data.HomeType) {
            return;
        }

        let isVisible = false;

        if (selectItem.Id === c.HOME_TYPE_BUILDING) {
            isVisible = true;
        }

        this.setState({
            data: {
                ...this.state.data,
                HomeType: selectItem
            },
            showBuilding: isVisible
        });
    }

    changeBuilding(selectItem) {

        if (selectItem === this.state.data.Building) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                Building:{Id: selectItem.Id , Name: selectItem.Name || ''},
            }
        });
    }

    changeStreet(selectItem) {

        if (selectItem === this.state.data.Street) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                Street: selectItem
            }
        });
    }

    changeFullName(text) {
        this.setState({
            data: {
                ...this.state.data,
                FullName: text
            }
        });
    }

    changeMobile(text) {
        this.setState({
            data: {
                ...this.state.data,
                Mobile: text
            }
        });
    }

    changeHouseNumber(text) {
        this.setState({
            data: {
                ...this.state.data,
                BillTo_Number: text
            }
        });
    }

    changeNote(text) {
        this.setState({
            data: {
                ...this.state.data,
                NoteAddress: text
            }
        });
    }

    isValidData() {

        const {data} = this.state;

        let errorList = [];
        // Check Fullname
        if (! data.FullName) {
            this.refs['FullName'].setValid(false);

            errorList.push({
                name: 'FullName',
                msg: strings('dl.potentianl_customer.add_customers.err.FullName')
            });
        }
        else {
            this.refs['FullName'].setValid(true);
        }

        // Check Birth day -> thuantv create: 14/10/2020 V2.8
        if (! data.Birthday) {
            this.setState({...this.state, isValid: false});

            errorList.push({
                name: 'Birthday',
                msg: strings('dl.potentianl_customer.add_customers.err.Birthday')
            });
        }
        else {
            this.setState({...this.state, isValid: true});
        }

        // Check Mobile
        if (! data.Mobile) {
            this.refs['Mobile'].setValid(false);

            errorList.push({
                name: 'Mobile',
                msg: strings('dl.potentianl_customer.add_customers.err.Mobile')
            });
        }
        else {
            this.refs['Mobile'].setValid(true);
        }

        // Check email-type -> thuantv create: 14/10/2020 V2.8
        if (data.Email) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

            if (reg.test(data.Email) === false) {
                this.refs['Email'].setValid(false);

                errorList.push({
                    name: 'Email',
                    msg: strings('dl.potentianl_customer.add_customers.err.Mail')
                });
            }
            else {
                this.refs['Email'].setValid(true);
            }
        } else {
            this.refs['Email'].setValid(true);
        }

        // Check Location
        if (data.Location == null) {
            this.refs['Location'].setValid(false);

            errorList.push({
                name: 'Location',
                msg: strings('dl.potentianl_customer.add_customers.err.Location')
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
                msg: strings('dl.potentianl_customer.add_customers.err.District')
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
                msg: strings('dl.potentianl_customer.add_customers.err.Ward')
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
                msg: strings('dl.potentianl_customer.add_customers.err.HomeType')
            });
        }
        else {
            this.refs['HomeType'].setValid(true);
        }

        // Check Building
        if (data.HomeType && data.HomeType.Id === c.HOME_TYPE_BUILDING && (data.Building == null || data.Building.Name === '' ) ) {
            this.refs['Building'].setValid(false);

            errorList.push({
                name: 'Building',
                msg: strings('dl.potentianl_customer.add_customers.err.Building')
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
                msg: strings('dl.potentianl_customer.add_customers.err.Street')
            });
        }
        else {
            this.refs['Street'].setValid(true);
        }

        // Check House Number
        if (! data.BillTo_Number) {
            this.refs['BillTo_Number'].setValid(false);

            errorList.push({
                name: 'BillTo_Number',
                msg: strings('dl.potentianl_customer.add_customers.err.HouseNumber')
            });
        }
        else {
            this.refs['BillTo_Number'].setValid(true);
        }

        if (errorList.length === 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }

    onSubmit() {

        // validate
        if (! this.isValidData()) {
            return;
        }


        // loading
        this._loading(true);

        // get data
        const {data} = this.state;

        // reset ==> thuantv: edit 15/10/2020 -V2.8 yeu cau khong reset data da nhap

        // this.setState({
        //     data : {
        //         Location : this.props.locationOpt[0]
        //     },
        // });
        // set data
        const infoAddress = {
            LocationId  : data.Location.Id,
            DistrictID  : data.District.Id,
            WardID      : data.Ward.Id,
            StreetId    : data.Street.Id,
            BillTo_Number : data.BillTo_Number,
            HomeType    : data.HomeType.Id,
            BuildingId  :  !this.state.showBuilding? 0 : (data.Building ? data.Building.Id : 0) ,
        };
        // call api gen dia chi
        api.generationAddress(infoAddress, (success, result, msg) => {

            if (success) {
                // set data
                const myData = {
                    //v2.8 bo sung cho tinh nang update
                    PotentialObjID: data.PotentialID || 0,
                    //
                    FullName : data.FullName,
                    PhoneNumber : data.Mobile,
                    Address : result[0]['Result'],
                    Description : data.NoteAddress,
                    LocationId : data.Location.Id,
                    BillTo_City : data.Location.Name,
                    DistrictId : data.District.Id,
                    BillTo_District : data.District.Name,
                    WardId : data.Ward.Id,
                    BillTo_Ward : data.Ward.Name,
                    StreetId: data.Street.Id,
                    BillTo_Street : data.Street.Name,
                    BillTo_Number : data.BillTo_Number,
                    TypeHouse : data.HomeType.Id,
                    BuildingId  : !this.state.showBuilding? 0 : (data.Building ? data.Building.Id : 0) ,
                    //V2.8
                    Email   :   data.Email || '',
                    Telegram : data.Telegram || '',
                    Birthday : data.Birthday || '',
                };
                // call api tao khach hang tiem nang

                api.createPoCus(myData, (success, result, msg) =>{

                    // loading off
                    this._loading(false);

                    // thanh cong thi chuyen trang
                    if (success) {
                        NavigationService.navigateBackHome('pcListCustomers');
                    } else {
                        this._errorMsg(msg.message);
                    }
                })
            }
            else
            {
                this._errorMsg(msg.message);
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

  /*
  * @thuantv-edit-30/09/2020
  * changeBirthday
  * */
    changeBirthday =(date)=>{
        let mDate = formatTime.setTime(date, 'MM/DD/YYYY');
        this.setState({
            data: {
                ...this.state.data,
                Birthday: mDate
            }
        });
    }

    /*
    * changeTelegram
    * */
    changeTelegram =(numb)=> {
        this.setState({
            data: {
                ...this.state.data,
                Telegram: numb
            }
        });
    }

    /*
    * changeEmail
    * */
    changeEmail =(email)=> {
        this.setState({
            data: {
                ...this.state.data,
                Email: email
            }
        });
    }



/*
*
* */
    render() {
        return (
            <KeyboardAvoidingView
                enabled
                keyboardVerticalOffset={Platform.select({ios: 40, android: 0})}
                behavior={ Platform.OS === 'ios'? 'padding': null}
                style={{flexGrow: 1}} >
                <ScrollView
                    // keyboardDismissMode={'on-drag'}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >
                    <View style={[ols.inner_scrollview, ols.bgw, {justifyContent: 'space-between'}]}>
                        <View >
                            <View style={styles.formTitleContainer}>
                                <Text style={styles.txtTitle}>
                                    { strings('potentianl_customer.add_customers.titleTop') }
                                </Text>
                            </View>
                            {/*..Full Name..*/}
                            <TextInput
                                ref="FullName"
                                label = { strings('potentianl_customer.add_customers.form.fullname_lable') }
                                placeholder = { strings('potentianl_customer.add_customers.form.fullname_placehoder') }
                                textInputStyle={{fontWeight:'500', fontSize: 12,}}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={this.state.data.FullName}
                                onChangeText={this.changeFullName}
                            />
                            {/*..birth-day..*/}
                            <DateTimePicker
                                ref ='Birthday'
                                isValid={!this.state.isValid}
                                mainStyle={{height: 40, marginBottom: 12}}
                                label={ strings('potentianl_customer.add_customers.form.birthday_label') }
                                placeholder={ strings('potentianl_customer.add_customers.form.birthday_placeholder') }
                                value={this.state.data.Birthday}
                                getDate={(date) => this.changeBirthday (date)}
                            />
                            {/*..phone...*/}
                            <TextInput
                                keyboardType='numeric'
                                ref="Mobile"
                                label = { strings('potentianl_customer.add_customers.form.phone_lable') }
                                placeholder = { strings('potentianl_customer.add_customers.form.phone_placehoder') }
                                textInputStyle={{fontWeight:'500', fontSize: 12,}}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                editable={!this.state.pcIsUpdate}
                                value={this.state.data.Mobile}
                                onChangeText={this.changeMobile}
                            />

                            {/*..Telegram...*/}
                            <TextInput
                                keyboardType='numeric'
                                ref="Telegram"
                                label = { strings('potentianl_customer.add_customers.form.telegram_label') }
                                placeholder = { strings('potentianl_customer.add_customers.form.telegram_placeholder') }
                                textInputStyle={{fontWeight:'500', fontSize: 12,}}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={this.state.data.Telegram}
                                onChangeText={(number)=>this.changeTelegram(number) }
                            />

                            {/*..Email...*/}
                            <TextInput
                                ref="Email"
                                label = { strings('potentianl_customer.add_customers.form.email_label') }
                                placeholder = { strings('potentianl_customer.add_customers.form.email_placeholder') }
                                textInputStyle={{fontWeight:'500', fontSize: 12,}}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={this.state.data.Email}
                                onChangeText={(email)=>this.changeEmail(email) }
                            />

                            {/*..city..*/}
                            <PickerSearchInput
                                ref="Location"
                                label = {strings('potentianl_customer.add_customers.form.city_label')}
                                placeholder = {strings('potentianl_customer.add_customers.form.city_placeholder')}
                                filterText = {strings('potentianl_customer.add_customers.form.city_filterText')}
                                getOptionData = {this.getLocationData.bind(this)}
                                value = {this.state.data.Location}
                                onChange = {this.changeLocation}
                            />

                            {/*..district..*/}
                            <PickerSearchInput
                                ref="District"
                                label = {strings('potentianl_customer.add_customers.form.district_label')}
                                placeholder = {strings('potentianl_customer.add_customers.form.district_placeholder')}
                                filterText = {strings('potentianl_customer.add_customers.form.district_filterText')}
                                getOptionData = {api.loadDistrict}
                                value = {this.state.data.District}
                                onChange = {this.changeDistrict}
                                params = {this.state.data.Location ? this.state.data.Location.Id : null}
                            />

                            {/*..ward..*/}
                            <PickerSearchInput
                                ref="Ward"
                                label = {strings('potentianl_customer.add_customers.form.ward_label')}
                                placeholder = {strings('potentianl_customer.add_customers.form.ward_placeholder')}
                                filterText = {strings('potentianl_customer.add_customers.form.ward_filterText')}
                                getOptionData = {api.loadWard}
                                value = {this.state.data.Ward}
                                onChange = {this.changeWard}
                                params = {this.state.data.District ? {Location: this.state.data.Location.Id, District : this.state.data.District.Id} : null}
                            />

                            {/*..Home-type..*/}
                            <PickerSearchInput
                                ref="HomeType"
                                label = {strings('potentianl_customer.add_customers.form.home_type_label')}
                                placeholder = {strings('potentianl_customer.add_customers.form.home_type_placeholder')}
                                filterText = {strings('potentianl_customer.add_customers.form.home_type_filterText')}
                                getOptionData = {api.loadHomeType}
                                value = {this.state.data.HomeType}
                                onChange = {this.changeHomeType}
                            />

                            {/*..building..*/}
                            <PickerSearchInput
                                ref="Building"
                                visible = {this.state.showBuilding}
                                label = {strings('potentianl_customer.add_customers.form.building_label')}
                                placeholder = {strings('potentianl_customer.add_customers.form.building_placeholder')}
                                filterText = {strings('potentianl_customer.add_customers.form.building_filterText')}
                                getOptionData = {api.loadBuilding}
                                value = {this.state.data.Building}
                                onChange = {this.changeBuilding}
                                params = {this.state.data.Location ? this.state.data.Location.Id : null}
                            />

                            {/*..street..*/}
                            <PickerSearchInput
                                ref="Street"
                                label = {strings('potentianl_customer.add_customers.form.street_label')}
                                placeholder = {strings('potentianl_customer.add_customers.form.street_placeholder')}
                                filterText = {strings('potentianl_customer.add_customers.form.street_filterText')}
                                getOptionData = {api.loadStreet}
                                value = {this.state.data.Street}
                                onChange = {this.changeStreet}
                                params = {this.state.data.Ward ? {Location: this.state.data.Location.Id, District : this.state.data.District.Id, Ward: this.state.data.Ward.Id} : null}
                            />

                            {/*..home-number..*/}
                            <TextInput
                                ref="BillTo_Number"
                                label = { strings('potentianl_customer.add_customers.form.house_number_label') }
                                placeholder = { strings('potentianl_customer.add_customers.form.house_number_placeholder') }
                                textInputStyle={{fontWeight:'500', fontSize: 12,}}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={this.state.data.BillTo_Number ? this.state.data.BillTo_Number : null}
                                onChangeText={this.changeHouseNumber}
                            />

                            {/*..note address..*/}
                            <TextInput
                                ref="NoteAddress"
                                label = { strings('potentianl_customer.add_customers.form.note_label') }
                                placeholder = { strings('potentianl_customer.add_customers.form.note_placeholder') }
                                textInputStyle={{fontWeight:'500', fontSize: 12, width: '70%'}}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                multiline={true}
                                maxLength={4000}
                                value={this.state.data.NoteAddress ? this.state.data.NoteAddress : null}
                                onChangeText={this.changeNote}
                            />
                        </View>

                        <View >
                            <ButtonO
                                label={ strings('potentianl_customer.add_customers.form.confirm') }
                                style={{marginBottom: 24,}}
                                styleBtnText={[ols.btnText]}
                                styleBtn={[ols.btnFull, ols.btnShadow]}
                                onPress={() => this.onSubmit()} />
                        </View>
                    </View>

                </ScrollView>

                <TechLoading visible={this.state.loadingVisible}/>
                <PopupWarning ref="popup"/>
            </KeyboardAvoidingView>
        );
    }
}
export default connect((state) => {
    return {
        locationOpt: mapLocation(state.authReducer.userInfo.ListLocation),
        RegistrationObj: state.saleNewReducer.RegistrationObj
    }
})(AddCustomer);
