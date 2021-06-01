import React, { Component } from 'react';
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
import DateTimePicker from 'react-native-modal-datetime-picker';
import NavigationService from 'app-libs/helpers/NavigationService';

import styles from '../ReportFilter.styles';
const optionsFilter = [
    {
        label: strings('report.open_safe.filter_option.All'),
        value: '0'
    },
    {
        label: strings('report.open_safe.filter_option.Complete'),
        value: '1'
    },
    {
        label: strings('report.open_safe.filter_option.Processing'),
        value: '2'
    },
];

const defaultProps = {
    optionsFilter: optionsFilter,
};

class OpenSafeFilter extends React.PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('report.open_safe.title'),
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>
        };
    };

    constructor(props){
        super(props);
        this.state = {
            isDateTimePickerFromVisible: false,
            isDateTimePickerToVisible: false,
            searchData : {
                Status : 0,
                ToDate : null,
                FromDate : null
            },
            dateShow : {
                ToDate : null,
                FromDate : null
            },
            error : false,
            message : null,
        };
        this._handleChangeStatus = this._handleChangeStatus.bind(this);
        this._showDateTimePickerTo = this._showDateTimePickerTo.bind(this);
        this._showDateTimePickerFrom = this._showDateTimePickerFrom.bind(this);
        this._hideDateTimeToPicker = this._hideDateTimeToPicker.bind(this);
        this._hideDateTimeFromPicker = this._hideDateTimeFromPicker.bind(this);
        this._handleDateFromPicked = this._handleDateFromPicked.bind(this);
        this._handleDateToPicked = this._handleDateToPicked.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
        this.onError = this.onError.bind(this);
    }

    componentDidMount(){
        const today = this._getYmd(new Date());

        this.props.navigation.addListener('willFocus', () => {
            if(this.state.error)
            {
                this.refs['popup'].getWrappedInstance().show(this.state.message);
            }
        });

        this.setState({
            ...this.state,
            searchData : {
                ...this.state.searchData,
                ToDate : today.toString(),
                FromDate : today.toString()
            },
            dateShow : {
                ...this.state.dateShow,
                ToDate : this.convertDMYtoMDY(today).toString(),
                FromDate : this.convertDMYtoMDY(today).toString()
            }
        });
    }

    _handleChangeStatus(value){
        this.setState({
            ...this.state,
            searchData : {
                ...this.state.searchData,
                Status : value
            }
        });
    }

    _showDateTimePickerFrom(){
        this.setState({
            ...this.state,
            isDateTimePickerFromVisible: true,
        })
    }

    _showDateTimePickerTo(){
        this.setState({
            ...this.state,
            isDateTimePickerToVisible: true,
        })
    }

    _hideDateTimeFromPicker(){

        this.setState({...this.state, isDateTimePickerFromVisible: false })
    }

    _hideDateTimeToPicker(){

        this.setState({...this.state, isDateTimePickerToVisible: false })
    }

    _handleDateFromPicked(date){

        const today = this._getYmd(date);
        this.setState({
            isDateTimePickerFromVisible: false,
            searchData : {
                ...this.state.searchData,
                FromDate : today.toString()
            },
            dateShow : {
                ...this.state.dateShow,
                FromDate : this.convertDMYtoMDY(today).toString()
            }
        });
        //this._hideDateTimeFromPicker();
    }

    _handleDateToPicked(date){

        const today = this._getYmd(date);

        this.setState({
            isDateTimePickerToVisible: false,
            searchData : {
                ...this.state.searchData,
                ToDate : today.toString()
            },
            dateShow : {
                ...this.state.dateShow,
                ToDate : this.convertDMYtoMDY(today).toString(),
            }
        });

        //this._hideDateTimeToPicker();
    }

    onError(data){
        this.refs['popup'].getWrappedInstance().show(data.message);
    };

    _handleSubmit(){
        const {searchData, dateShow, Status}  = this.state;
        const mySearch = {
            searchData : searchData,
            dateShow : dateShow,
            Status : Status
        }
        NavigationService.navigate('hideTabBottomOpenSafeList', {searchData : mySearch, onError : this.onError});
    }

    _getYmd(date){
        let dd = date.getDate();
        let mm = date.getMonth()+1; //January is 0!

        let yyyy = date.getFullYear();

        if(dd<10)dd='0'+dd;

        if(mm<10)mm='0'+mm;

        return yyyy+'-'+mm+'-'+dd;
    }



    convertDMYtoMDY(date){
        if(!date) return;
        const myDate = new Date(date.split("/").reverse().join("-"));
        // const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let dd = myDate.getDate();

        let yyyy = myDate.getFullYear();

        let mm = myDate.getMonth() + 1;

        if(dd<10)dd='0'+dd;

        if(mm<10)mm='0'+mm;

        return mm+'/'+dd+'/'+yyyy;
    }

    _processConvertToDate(date){
        return new Date(date);
    }

    _compareDate(date1, date2){
        if(date1.getTime() > date2.getTime())
        {
            return true;
        }

        return false;
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

    _errorMsg(err)
    {
        this._loading(false);
        if (! err) return;
        this.refs['popup'].getWrappedInstance().show(err.toString());
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.filterContainer}>
                    <Text style={styles.searchTitle}>{strings('report.filter.Search_filter')}</Text>
                    <View style={styles.pickerFilter}>
                        <SelectPicker
                            placeholderDefault={strings('report.filter.Status')}
                            titleHeader={strings('report.filter.filter_option.Choose_contract_status')}
                            defaultValue={this.props.optionsFilter[0]}
                            option={this.props.optionsFilter}
                            onValueChange={this._handleChangeStatus}
                        />
                    </View>
                    <View style={styles.dayContainer}>
                        <TouchableOpacity style={styles.btnFrom} onPress={this._showDateTimePickerFrom}>
                            <Text style={styles.txt}>{strings('report.filter.From')}</Text>
                            <View style={styles.boxIcon}>
                                <Text style={styles.txtDay}>{this.state.dateShow.FromDate}</Text>
                                <Image style={[styles.iconFilter, { tintColor: '#8a919a'}]} source={require('../../../assets/images/report/down-arrow.png')} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnTo} onPress={this._showDateTimePickerTo}>
                            <Text style={styles.txt}>{strings('report.filter.To')}</Text>
                            <View style={styles.boxIcon}>
                                <Text style={styles.txtDay}>{this.state.dateShow.ToDate}</Text>
                                <Image style={[styles.iconFilter, { tintColor: '#8a919a'}]} source={require('../../../assets/images/report/down-arrow.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.innerBtn} onPress={this._handleSubmit}>
                        <Text style={styles.txtBtn}>{strings('report.filter.Confirm')}</Text>
                    </TouchableOpacity>
                </View>

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerFromVisible}
                    onConfirm={this._handleDateFromPicked}
                    onCancel={this._hideDateTimeFromPicker}
                    date={new Date(this.state.searchData.FromDate)}
                />

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerToVisible}
                    onConfirm={this._handleDateToPicked}
                    onCancel={this._hideDateTimeToPicker}
                    date={new Date(this.state.searchData.ToDate)}
                />
                <PopupWarning ref="popup"/>
            </View>
        )
    }
}
OpenSafeFilter.defaultProps = defaultProps;
export default connect()(OpenSafeFilter)
