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
import styles from '../openSafe.styles';
import PickerSearchLocation from 'app-libs/components/input/PickerSearchLocation';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import * as api from '../api';
// HELPER
import {mapLocation} from "app-libs/helpers/mapPicker";
import CustomFlatList from "../../../libs/components/CustomFlatlist";


const DATA = [
    {
        id: '0',
        StatusName: 'Normal',
        FullName: 'HaiPV1',
        Contract: 'PPFI45004',
        Phone: '0909885673',
        Address: '1 St.154, Sangkat Veal Vong, Khan 7Makara, Phnom Penh',
        ServiceType: 'HomeSafe',
    },
    {
        id: '1',
        StatusName: 'Normal',
        FullName: 'HaiPV1',
        Contract: 'PPFI45005',
        Phone: '0909885673',
        Address: '1 St.154, Sangkat Veal Vong, Khan 7Makara, Phnom Penh',
        ServiceType: 'HomeSafe',
    },
    {
        id: '2',
        StatusName: 'Normal',
        FullName: 'HaiPV1',
        Contract: 'PPFI45006',
        Phone: '0909885673',
        Address: '1 St.154, Sangkat Veal Vong, Khan 7Makara, Phnom Penh',
        ServiceType: 'HomeSafe',
    },
    {
        id: '3',
        StatusName: 'Normal',
        FullName: 'HaiPV1',
        Contract: 'PPFI45007',
        Phone: '0909885673',
        Address: '1 St.154, Sangkat Veal Vong, Khan 7Makara, Phnom Penh',
        ServiceType: 'HomeSafe',
    },
]


/*
* RowInfo
* */
const RowInfo =({label = 'LABEL', value = '', valueStyle})=>{
    return(
        <View style={[styles.oneInfo, {marginBottom: 8}]}>
            <Text style={styles.infoTitle}>{label}</Text>
            <Text numberOfLines={3} style={[styles.infoValue, valueStyle]}>{value}</Text>
        </View>
    )
}

/*
*
* CLASS
* */
class OpenSafeList extends React.PureComponent {

    static navigationOptions = ({navigation}) => {
        return {
            title: strings('report.open_safe.title'),
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loadingVisible: false,
            searchData: {
                ToDate: null,
                FromDate: null,
                Status: null,
            },
            dateShow: {
                ToDate: null,
                FromDate: null,
            },

            data: {
                Location: this.props.locationOpt[0]
            },
            objItem: []
        };

        this._handleSearchData = this._handleSearchData.bind(this);
        this._error = this._error.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
        this._loading = this._loading.bind(this);
        this.changeLocation = this.changeLocation.bind(this);

        this.searchData = this.props.navigation.getParam('searchData');
    }

    componentDidMount() {

        this.props.navigation.addListener('willFocus',
            () => this._handleSearchData(this.searchData)
        );  //
    }


    /*
    * _handleSearchData
    * */
    _handleSearchData(myData) {

        const {searchData, dateShow} = myData;
        const data = {
            "LocationId": this.state.data.Location.Id,
            "FromDate": dateShow.FromDate,
            "ToDate": dateShow.ToDate,
            "Status": searchData.Status.value,
        };
        //
        this._loading(true);
        // add param location
        api.reportOpenSafePTTB(data, (success, result, msg) => {
            //console.log('----result-API', result)
            this._loading(false);
            if (success) {
                this.setState({
                    ...this.state,
                    searchData: searchData,
                    dateShow: dateShow,
                    objItem: result //result
                });
            } else {
                // console.log(success, result, msg);
                // NavigationService.navigate('TabReport',{error : true, message : msg});
                const {navigation} = this.props;
                navigation.goBack();
                navigation.state.params.onError({error: true, message: msg.message.toString()});
            }
        });
    }

    /*
    * convertYMDtoDMY
    * */
    convertYMDtoDMY(date) {
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
    changeLocation(selectItem) {
        if (selectItem === this.state.data.Location) {
            return;
        }
        this.setState({
            data: {
                ...this.state.data,
                Location: selectItem,
            }
        }, () => this._handleSearchData(this.searchData));

    }




    /*
    * renderItem
    * */
    RenderItem = (item, index) => {
        const coAppointment = "Not yet online";
        return (
            <View key={index} style={styles.oneList}>
                <View style={styles.infoBox}>
                    {/*...STATUS...*/}
                    <RowInfo
                        label={strings('report.open_safe.form.status')}
                        value={item.StatusName}
                        valueStyle={{color: '#FFC031'}}
                    />
                    {/*...Service-type...*/}
                    <RowInfo
                        label={strings('report.open_safe.form.serviceType')}
                        value={item.LocalTypeName}
                    />
                    {/*...NAME...*/}
                    <RowInfo
                        label={strings('report.open_safe.form.name')}
                        value={item.FullName}
                    />
                    {/*...CONTRACT...*/}
                    <RowInfo
                        label={strings('report.open_safe.form.contract')}
                        value={item.Contract}
                    />
                    {/*...PHONE...*/}
                    <RowInfo
                        label={strings('report.open_safe.form.phone')}
                        value={item.Phone1}
                    />
                    {/*...ADDRESS...*/}
                    <RowInfo
                        label={strings('report.open_safe.form.address')}
                        value={item.Address}
                    />
                    {/*....*/}
                </View>
            </View>
        )
    }

    //render page
    render() {

        return (
            <View style={styles.container}>
                <View style={styles.filterContainer}>
                    <View style={styles.innerFilter}>
                        <View style={styles.dayContainer}>
                            <Text style={styles.txtDay}>
                                {strings('report.list.Date')} : {this.state.dateShow ? this.state.dateShow.FromDate : null} - {this.state.dateShow ? this.state.dateShow.ToDate : null}
                            </Text>
                        </View>
                        <View style={[{width: '32%'}]}>
                            <PickerSearchLocation
                                ref="Location"
                                placeholder={strings('potentianl_customer.add_customers.form.city_placeholder')}
                                filterText={strings('potentianl_customer.add_customers.form.city_filterText')}
                                getOptionData={this.getLocationData.bind(this)}
                                value={this.state.data.Location}
                                onChange={this.changeLocation}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.statusContainer}>
                    <Text style={styles.statusTitle}>{strings('report.list.Status')}</Text>
                    <Text
                        style={styles.statusValue}>{this.state.searchData.Status ? this.state.searchData.Status.label : null}</Text>
                </View>

                <ScrollView style={styles.scrollView}>
                  {/*...LIST...*/}
                    <CustomFlatList
                        renderItem={(item,index) => this.RenderItem(item, index)}
                        isLoading={this.state.loadingVisible}
                        data={this.state.objItem}
                    />

                    {/*..white-safe..*/}
                    <View style={{height:40}}/>
                    {/*....*/}
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

export default connect(mapStateToProps)(OpenSafeList);
