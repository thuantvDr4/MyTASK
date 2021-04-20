import React, {Component} from 'react';
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
import {mapLocation} from "app-libs/helpers/mapPicker";
import formatTime from '../../../libs/helpers/FormatTime';
import CustomFlatList from "../../../libs/components/CustomFlatlist";
import {itemStyles as i_styles} from "../styles";
import RowInfo from "../../../libs/components/RowInfo";


/*..data tam...*/
const vir_data = [
    {
        "RegID": 311,
        "RegCode": "ZPPDH52001",
        "ObjID": 115032,
        "Contract": "PPDH34001",
        "RegType": 2,
        "ObjCreateDate": "08/31/2018",
        "Status": 0,
        "StatusName": "Default",
        "FullName": "isc test",
        "LocalTypeName": "ADSL - HomeBasic - Flat",
        "AppointmentDept": null,
        "AppointmentDate": null,
        "ListServiceType": "[{\"Id\":1,\"Name\":\"Internet\"},{\"Id\":2,\"Name\":\"Devices\"}]",
        "IPisActive": 0
    },
    {
        "RegID": 322,
        "RegCode": "ZPPDH52001",
        "ObjID": 115032,
        "Contract": "PPDH34001",
        "RegType": 2,
        "ObjCreateDate": "08/31/2018",
        "Status": 1,
        "StatusName": "Completed",
        "FullName": "isc test",
        "LocalTypeName": "ADSL - HomeBasic - Flat",
        "AppointmentDept": null,
        "AppointmentDate": null,
        "ListServiceType": "[{\"Id\":1,\"Name\":\"Internet\"},{\"Id\":2,\"Name\":\"Devices\"}]",
        "IPisActive": 0
    },
    {
        "RegID": 333,
        "RegCode": "ZPPDH52001",
        "ObjID": 115032,
        "Contract": "PPDH34001",
        "RegType": 2,
        "ObjCreateDate": "08/31/2018",
        "Status": 2,
        "StatusName": "Processing",
        "FullName": "isc test",
        "LocalTypeName": "ADSL - HomeBasic - Flat",
        "AppointmentDept": null,
        "AppointmentDate": null,
        "ListServiceType": "[{\"Id\":1,\"Name\":\"Internet\"},{\"Id\":2,\"Name\":\"Devices\"}]",
        "IPisActive": 0
    },
    {
        "RegID": 344,
        "RegCode": "ZPPDH52001",
        "ObjID": 115032,
        "Contract": "PPDH34001",
        "RegType": 2,
        "ObjCreateDate": "08/31/2018",
        "Status": 0,
        "StatusName": "Default",
        "FullName": "isc test",
        "LocalTypeName": "ADSL - HomeBasic - Flat",
        "AppointmentDept": null,
        "AppointmentDate": null,
        "ListServiceType": "[{\"Id\":1,\"Name\":\"Internet\"},{\"Id\":2,\"Name\":\"Devices\"}]",
        "IPisActive": 0
    },
]

/*
*
* */
class ExtraServiceReportList extends React.PureComponent {

    static navigationOptions = ({navigation}) => {
        return {
            title: strings('report.extraService.title'),
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>
        };
    };

    /*
    *
    * */
    constructor(props) {
        super(props);
        //
        let _fromDate = '';
        let _toDate = '';
        let _status = null;
        let _service = null;

        if (this.props.navigation.getParam('payload')) {
            const {fromDate, toDate, Status, Service,} = this.props.navigation.getParam('payload');

            _fromDate = new Date(fromDate);
            _toDate = new Date(toDate);
            _fromDate = formatTime.setTime(_fromDate, 'MM/DD/YYYY');
            _toDate = formatTime.setTime(_toDate, 'MM/DD/YYYY');
            _status = Status;
            _service = Service;

        } else {
            _fromDate = new Date();
            _toDate = new Date();
            _fromDate = formatTime.setTime(_fromDate, 'MM/DD/YYYY');
            _toDate = formatTime.setTime(_toDate, 'MM/DD/YYYY');
        }
        //
        this.state = {
            loadingVisible: false,
            ToDate: _toDate,
            FromDate: _fromDate,
            Status: _status,
            Service: _service,
            //
            data: {
                Location: this.props.locationOpt[0]
            },
            //
            apiReportList: [] //[],
            //
        };

        this._error = this._error.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
    }

    /*
    *
    * */
    componentDidMount() {
        this._mounted = true;
        // LOAD API FIRST
        this.props.navigation.addListener('willFocus',
            () => this.loadDefaultSearch()
        );  //
    }


    /*
    * V2.8
    * function:
    * */
    loadDefaultSearch = () => {
        //
        const {data, ToDate, FromDate, Status, Service  } = this.state;
        //
        this._loading(true);
        //
        let myData = {
            "LocationId": data.Location.Id,
            "FromDate": FromDate,
            "ToDate": ToDate,
            "Status": Status.value,
            "ServiceType": Service.value,
            //"DayLockView": 0 //app ko can truyen len , mac dinh sau ngay 10 se cam xem bao cao
        };
        api.getReportExtraService (myData, (success, result, msg) => {
            this._loading(false);

            if (success) {
                this.setState({
                    ...this.state,
                    apiReportList: result
                })
            }
            else {
                this._error(msg)
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


    /*
     * Show message error network
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
    changeLocation(item) {
        if (item === this.state.data.Location) {
            return;
        }
        this.setState({
            data: {
                ...this.state.data,
                Location: item,
            }
        }, () => this.loadDefaultSearch());
    }


    /*
    * V2.8
    * component: Search Bar
    * */
    renderSearchBar() {
        return (
            <View style={styles.filterContainer}>
                <View style={styles.innerFilter}>
                    <View style={styles.dayContainer}>
                        <Text style={styles.txtDay}>
                            {strings('report.list.Date')} : {this.state.FromDate + '-' + this.state.ToDate}
                        </Text>
                    </View>
                    <View style={[{width: '32%'}]}>
                        <PickerSearchLocation
                            ref="Location"
                            placeholder={strings('potentianl_customer.add_customers.form.city_placeholder')}
                            filterText={strings('potentianl_customer.add_customers.form.city_filterText')}
                            getOptionData={this.getLocationData.bind(this)}
                            value={this.state.data.Location}
                            onChange={(value) => this.changeLocation(value)}
                        />
                    </View>
                </View>
            </View>
        )
    }

    /*
    * V2.8
    * component:  status bar
    * */
    renderStatusBar() {
        return (
            <View style={{flexDirection:'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF'}}>
                <View style={[styles.statusContainer, {}]}>
                    <Text style={styles.statusTitle}>{strings('report.extraService.Status') + ':'} </Text>
                    <Text style={styles.statusValue}>{ this.state.Status && this.state.Status.label || ''}</Text>
                </View>

                <View style={[styles.statusContainer, {}]}>
                    <Text style={styles.statusTitle}>{strings('report.extraService.Service') + ':' } </Text>
                    <Text style={styles.statusValue}>{ this.state.Service && this.state.Service.label || ''}</Text>
                </View>
            </View>
        )
    }

    /*
    * V2.8
    * component: List items
    * */
    renderListItems(data) {
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
        const colorStatus =  item.Status ===1? '#45D91B' : item.Status ===2? '#EDB151' : '#9A9A9A';
        return (
            <View style={[i_styles.card_view]}>
                {/*..body..*/}
                <View style={[i_styles.body_ctn]}>
                    <RowInfo
                        mainStyle={{marginTop: 8}}
                        value={item.StatusName}
                        styleValue={{color: colorStatus}}
                        label={strings('report.extraService.form.status')}/>

                    <RowInfo
                        mainStyle={{marginTop: 8}}
                        value={item.FullName}
                        label={strings('report.extraService.form.name')}/>

                    <RowInfo
                        mainStyle={{marginTop: 8}}
                        value={item.Contract}
                        label={ strings('report.extraService.form.contract') }/>

                    <RowInfo
                        mainStyle={{marginTop: 8}}
                        value={item.ObjCreateDate}
                        label={strings('report.extraService.form.createDate')}/>

                    <RowInfo
                        mainStyle={{marginTop: 8}}
                        value={item.LocalTypeName}
                        label={strings('report.extraService.form.service')}/>

                    <RowInfo
                        mainStyle={{marginTop: 8}}
                        value={item.AppointmentDept }
                        label={strings('report.extraService.form.dept')}/>

                    <RowInfo
                        mainStyle={{marginTop: 8, marginBottom:8}}
                        value={item.AppointmentDate}
                        label={strings('report.extraService.form.appointmentDate')}/>
                </View>
            </View>
        )
    }

    /*
    *
    * */
    render() {
        const {apiReportList, } = this.state;
        return (
            <View style={[styles.container, {backgroundColor: '#F8F9FB'}]}>

                {this.renderSearchBar()}

                {this.renderStatusBar()}

                {this.renderListItems(apiReportList)}

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

export default connect(mapStateToProps)(ExtraServiceReportList);
