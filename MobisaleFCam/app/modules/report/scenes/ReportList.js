import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Image,
    ScrollView, Alert
} from 'react-native';
import {strings} from 'locales/i18n';
import {HeaderBackButton} from 'react-navigation';
import {connect} from 'react-redux';
import NavigationService from 'app-libs/helpers/NavigationService';
import styles from '../ReportList.styles';
import PickerSearchLocation from 'app-libs/components/input/PickerSearchLocation';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import * as api from '../api';


// HELPER
import { mapLocation } from "app-libs/helpers/mapPicker";

class ReportList extends React.PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('report.list.title'),
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>
        };
    };

    constructor(props){
        super(props);
        this.state = {
            loadingVisible : false,
            searchData : {
                ToDate : null,
                FromDate : null,
                Status : null,
            },
            dateShow : {
                ToDate : null,
                FromDate : null,
            },

            data : {
                Location : this.props.locationOpt[0]
            },
            objItem :[]
        };
        this._handleFilter = this._handleFilter.bind(this);
        this._handleSearchData = this._handleSearchData.bind(this);
        this._error = this._error.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
        this._loading = this._loading.bind(this);
        this.changeLocation = this.changeLocation.bind(this);
        this.searchData = this.props.navigation.getParam('searchData');
    }

    componentDidMount(){
        this._handleSearchData(this.searchData);
    }

    _handleFilter(){
        NavigationService.navigate('hideTabBottomReportFilter');
    }

    _handleSearchData(myData){
        const searchData = myData.searchData;
        const dateShow = myData.dateShow;
        dateShow.LocationId = this.state.data.Location.Id;
        dateShow.Status = searchData.Status.value;
        this._loading(true);
        // add param location
        api.reportPTTB(dateShow, (success, result, msg) => {
            
            this._loading(false);
            if(success)
            {
                this.setState({
                    ...this.state,
                    searchData : searchData,
                    dateShow : dateShow,
                    objItem : result
                });
            }
            else
            {
                // console.log(success, result, msg);
                // NavigationService.navigate('TabReport',{error : true, message : msg});
                const { navigation } = this.props;
                navigation.goBack();
                navigation.state.params.onError({ error : true, message : msg.message.toString()});
            }
        });
    }

    convertYMDtoDMY(date){
        const myDate = new Date(date);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = myDate.getFullYear();
        const month = monthNames[myDate.getMonth()];
        const day = myDate.getDate();
        const hours = myDate.getHours();
        const minutes = myDate.getMinutes();
        const seconds = myDate.getSeconds();
        return month + " " + day + ", " + year + " " + hours + ":" + minutes + ":" + seconds;
    }

    convertDMYtoMDY(date){

        if(!date) return;
        const myDate = new Date(date.split("/").reverse().join("-"));
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let dd = myDate.getDate();

        let yyyy = myDate.getFullYear();

        if(dd<10)dd='0'+dd;

        let mm = monthNames[myDate.getMonth()];

        return mm+' '+dd+', '+yyyy;
    }

    
    /**
     * show Loi
     * @param err
     * @private
     */
    _error(err)
    {
        this._loading(false);
        if (! err.message) return;
        this.refs['popup'].getWrappedInstance().show(err.message);
    }


    /*
     * Show message error network
     * @param err
     * @private
     */
    _errorMsg(err)
    {
        this._loading(false);
        if (! err) return;
        this.refs['popup'].getWrappedInstance().show(err.toString());
    }


    /**
     * Loading
     * @param isShow
     * @private
     */
    _loading(isShow)
    {
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
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
        if (selectItem == this.state.data.Location) {
            return;
        }
        this.setState({
            data: {
                ...this.state.data,
                Location: selectItem,
            }
        }, ()=> this._handleSearchData(this.searchData));
        
    }

    //render page
    render(){
        // điều kiện hiển thị trường Dept và Appointment Date
        const coAppointment = "Not yet online";
        return(
            <View style={styles.container}>
                <View style={styles.filterContainer}>
                    <View style={styles.innerFilter}>
                        <View style={styles.dayContainer}>
                            <Text style={styles.txtDay}>
                                {strings('report.list.Date')} : {this.state.dateShow? this.state.dateShow.FromDate : null} - {this.state.dateShow ? this.state.dateShow.ToDate : null}
                            </Text>
                        </View>
                        <View style={[{width: '32%'}]}>
                          <PickerSearchLocation
                                ref="Location"
                                placeholder = {strings('potentianl_customer.add_customers.form.city_placeholder')}
                                filterText = {strings('potentianl_customer.add_customers.form.city_filterText')}
                                getOptionData = {this.getLocationData.bind(this)}
                                value = {this.state.data.Location}
                                onChange = {this.changeLocation}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.statusContainer}>
                    <Text style={styles.statusTitle}>{strings('report.list.Status')}</Text>
                    <Text style={styles.statusValue}>{this.state.searchData.Status ? this.state.searchData.Status.label : null}</Text>
                </View>

                <ScrollView style={styles.scrollView}>
                    {this.state.objItem !== null && this.state.objItem.length > 0 ? this.state.objItem.map((item, index)=>(
                        <View key={index} style={styles.oneList}>
                            <View style={styles.infoBox}>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('report.list.Status')}</Text>
                                    <Text style={{...styles.infoValue, color:"#45D91B"}}>{item.StatusName}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('report.list.Customer_name')}</Text>
                                    <Text style={styles.infoValue}>{item.FullName}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('report.list.Contract_No')}</Text>
                                    <Text style={styles.infoValue}>{item.Contract}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('report.list.Create_contract_date')}</Text>
                                    <Text style={styles.infoValue}>{item.ObjCreateDate}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('report.list.Service_Package')}</Text>
                                    <Text style={styles.infoValue}>{item.LocalTypeName}</Text>
                                </View>
                                { item.StatusName == coAppointment  ?
                                <View style={styles.oneInfo}>
                                     <Text style={styles.infoTitle}>{strings('report.list.Dept')}</Text>
                                     <Text style={styles.infoValue}>{item.AppointmentDept}</Text>
                                 </View> : null
                                 
                                }
                                { item.StatusName ==  coAppointment ?
                                <View style={styles.oneInfo}>
                                     <Text style={styles.infoTitle}>{strings('report.list.Appointment_Date')}</Text>
                                     <Text style={styles.infoValue}>{item.AppointmentDate}</Text>
                                 </View> : null
                                }
                            </View>
                        </View>
                    )) : null}
                </ScrollView>

                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}

/**************************************************
 * FUNCTION: REDUX
 * DESC: Map REDUX STATE vao PROPS
 * @param state
 * @public
 ***************************************************/
function mapStateToProps(state) {

    const locationOpt = state.authReducer.userInfo.ListLocation;

    return {
        locationOpt: mapLocation(locationOpt),
    }
}

export default connect(mapStateToProps)(ReportList);