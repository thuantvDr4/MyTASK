
/**
 * Màn hình danh sách hợp đồng
 * @uthor thuandd3
 */

import React from 'react';
import {
    View, ScrollView, 
    Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback,
    KeyboardAvoidingView, Alert, FlatList, BackHandler } from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';

// API
import * as api from '../api';

// REDUX

// LIB
import Icon from 'react-native-vector-icons/FontAwesome';
import NavigationService from 'app-libs/helpers/NavigationService';
import { HeaderBackButton } from 'react-navigation';
import moment from 'moment';

// LIB COMPONENT CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import DateTimePicker from 'react-native-modal-datetime-picker';

// COMPONENT
import ButtonO from 'app-libs/components/input/ButtonO';

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

/**
 * Multiple select picker component
 * 
 * use: 
 * 		this.props.navigation.navigate('SearchMultiPickerDynamic', {
 * 			onChange: (selectedItemList) => {
 * 				// To do: Callback function when picker selected and go back this screen
 * 			}, 
 *          title: "Địa chỉ lắp đặt",
 *          placeholder: "Nhap ten tinh thanh",
 * 			getOptionData: (callback, isRefresh) => {
 *              // To do something
 *              callback(data);
 *          }
 *      })
 * 
 * @author DaiDP
 * @since Aug, 2018
 * @modified ThuanDD3 - Mar, 2019
 */


class Filter extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: strings('prcl.nav.titleFilter'),
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
        }
    } 

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);

        let selectedItemList = this.props.navigation.getParam('selectItem', []);
        let selectedDate = this.props.navigation.getParam('selectDate', []);
        
        for (index in selectedItemList) {
            selectedItemList[index].isSelected = true;
        }

        this.state = {
            data: [], // full data from API
            dataSource: [], // Data display option
            text: '', // text search, no use
            selectedItems: selectedItemList,
            isDateTimePickerFromVisible: false,
            isDateTimePickerToVisible: false,
            searchData : {
                FromDate : selectedDate ? selectedDate.FromDate : null,
                ToDate : selectedDate ? selectedDate.ToDate : null,
            },
            dateShow : {
                FromDate : selectedDate ? selectedDate.FromDate : null,
                ToDate : selectedDate ? selectedDate.ToDate : null,
            },
            error : false,
            message : null,
            loadingVisible: true,
        };

        this._showDateTimePickerTo = this._showDateTimePickerTo.bind(this);
        this._showDateTimePickerFrom = this._showDateTimePickerFrom.bind(this);
        this._hideDateTimeToPicker = this._hideDateTimeToPicker.bind(this);
        this._hideDateTimeFromPicker = this._hideDateTimeFromPicker.bind(this);
        this._handleDateFromPicked = this._handleDateFromPicked.bind(this);
        this._handleDateToPicked = this._handleDateToPicked.bind(this);
        // this._handleSubmit = this._handleSubmit.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
        this.onError = this.onError.bind(this);

        this.onConfirm = this.onConfirm.bind(this);
        this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    /**
     * 
     */
    componentDidMount() {
        const today = this._getYmd(new Date());
        const { searchData } = this.state;

        this.props.navigation.addListener('willFocus', () => {
            // console.log(this.state.error)
            if(this.state.error) {
                this.refs['popup'].getWrappedInstance().show(this.state.message);
            }
        });

        this.setState({
            ...this.state,
            searchData : {
                ...this.state.searchData,
                FromDate : searchData.FromDate ? searchData.FromDate : today.toString(),
                ToDate : searchData.ToDate ? searchData.ToDate : today.toString()
            },
            dateShow : {
                ...this.state.dateShow,
                FromDate : searchData.FromDate ? searchData.FromDate : this.convertDMYtoMDY(today).toString(),
                ToDate : searchData.ToDate ? searchData.ToDate : this.convertDMYtoMDY(today).toString()
            }
        });

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );

        this._loadData();
    }

    /**
     * 
     */
    componentWillUnmount() {

        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    /**************************************************
     * FUNCTION:
     * DESC: Android Back
     * @param 
     * @private
     ***************************************************/
    onBackButtonPressAndroid()
    {
        setTimeout(() => this.props.navigation.goBack(), 100);
        return true;
    }

    /**************************************************
     * FUNCTION:
     * DESC: Load du lieu tu API callback
     * @param 
     * @private
     ***************************************************/
    _loadData(isRefresh) {

        const { getOptionData } = this.props.navigation.state.params;

        this.setState({
            loadingVisible: true
        });

        getOptionData((data) => {

            for (i in this.state.selectedItems) {
                index = data.findIndex(item => item.ID === this.state.selectedItems[i].ID);
                if (index >= 0) {
                    data[index].isSelected = true;
                }
            }

            // --------- Neu ko dung Filter text
            this.setState({
                ...this.state,
                data: data,
                loadingVisible: false,
                dataSource: data
            });

            // --------- Neu dung Filter text
            // this.setState({
            //     ...this.state,
            //     data: data,
            //     loadingVisible: false,
            // });

            // this._filterSearch(this.state.text);
        });
    }

    /**************************************************
     * FUNCTION:
     * DESC: Render ra element
     * @param
     * @private
     ***************************************************/
    _renderItem = ({item}) => {
        // console.log('***** render: ', item);
        const isSelected = item.isSelected | false;
        // console.log('***** render item selected: ', isSelected);
        
        if (isSelected)
        {
            return (
                <TouchableWithoutFeedback onPress={() => { this._onSelect(item) }}>
                    <View style={ [styles.optionContainer, styles.optionBorderSeleted] }>
                        <Text style={ [styles.optionText, styles.optionTextSeleted] }>{item.Name}</Text>
                        <Icon name="check" size={16} style={ [styles.optionIcon, styles.optionTextSeleted] }/>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        else
        {
            return (
                <TouchableOpacity onPress={() => { this._onSelect(item) }}>
                    <View style={styles.optionContainer}>
                        <Text style={styles.optionText}>{item.Name}</Text>
                        <Icon name="check" size={16} style={styles.optionIcon}/>
                    </View>
                </TouchableOpacity>
            );
        }
        
    }

    /**************************************************
     * FUNCTION:
     * DESC: Process filter data on list
     * @param {*} text 
     * @private
     ***************************************************/
    _filterSearch(text) {
        const newData = this._getFilterData(text);

        this.setState({
            ...this.state,
            text: text,
            dataSource: newData
        });
    }

    _getFilterData(text) {

        return this.state.data.filter((item) => {
            const itemData = item.Name.toUpperCase();
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1; 
        });
    }

    /**************************************************
     * FUNCTION:
     * DESC: Callback when select item on list
     * @param {*} selectItem 
     * @private
     ***************************************************/
    _onSelect(selectItem) {

        // console.log('=========== select item: ', selectItem);
        // console.log('===========> list select item: ', this.state.selectedItems);
        // Khoi tao data
        let listSelected = this.state.selectedItems || [];
        
        let isSelected   = true;
        let index        = listSelected.findIndex(item => item.ID === selectItem.ID);

        // console.log('=========== index select item: ', index);

        // Kiem tra action la chon hay bo chon
        if (index > -1) {
            listSelected.splice(index, 1);
            isSelected = false;
        }
        else {
            listSelected.push(selectItem);
        }

        // Danh dau trang thai cho dataSource
        let data = this.state.data;
        index = data.findIndex(item => item.ID === selectItem.ID);
        data[index].isSelected = isSelected;

        // Cap nhat list lai
        const newData = this._getFilterData(this.state.text);

        this.setState({
            selectedItems: listSelected,
            dataSource: newData,
            data: data
        });
    }

    /**************************************************
     * FUNCTION:
     * DESC: confirm data and back Father screen
     * @param {*} selectItem 
     * @private
     ***************************************************/
    onConfirm() {

        const { dateShow }  = this.state;
        let selectedItemList = this.state.selectedItems;

        for (index in selectedItemList) {
            delete selectedItemList[index].isSelected;
        }

        // Khoi tao StatusID
        let StatusID;
        
        // Lan dau obj là undefine
        if (!selectedItemList) {
            StatusID = null;
        } else {
            // Neu lan sau obj co chọn item
            StatusID = Object.keys(selectedItemList).length != 1 ? null : selectedItemList[0].ID ;

            // Neu lan sau ko chon item gi het thi tra ra obj rỗng, nen gan lai cho no la null
            selectedItemList = selectedItemList == 0 ? null : selectedItemList;
        }

        const newObj = {
            selectedItemList: selectedItemList,
            FromDate: dateShow.FromDate,
            ToDate: dateShow.ToDate,
            StatusID: StatusID
        }

        this.props.navigation.goBack();
        this.props.navigation.state.params.onChange(newObj);
    }

    /**************************************************
     * FUNCTION:
     * DESC: Process time picker
     * @param
     * @private
     ***************************************************/

    _showDateTimePickerFrom() { this.setState({...this.state, isDateTimePickerFromVisible: true }) }
    _showDateTimePickerTo() { this.setState({...this.state, isDateTimePickerToVisible: true }) }
    _hideDateTimeFromPicker() { this.setState({...this.state, isDateTimePickerFromVisible: false }) }
    _hideDateTimeToPicker() { this.setState({...this.state, isDateTimePickerToVisible: false }) }

    _handleDateFromPicked(date) {
        
        const datePick = this._getYmd(date);
    
        this.setState({
            isDateTimePickerFromVisible: false,
            searchData : {
                ...this.state.searchData,
                FromDate : datePick.toString()
            },
            dateShow : {
                ...this.state.dateShow,
                FromDate : this.convertDMYtoMDY(datePick).toString()
            }
        });
    }

    _handleDateToPicked(date) {

        const datePick = this._getYmd(date);

        this.setState({
            isDateTimePickerToVisible: false,
            searchData : {
                ...this.state.searchData,
                ToDate : datePick.toString()
            },
            dateShow : {
                ...this.state.dateShow,
                ToDate : this.convertDMYtoMDY(datePick).toString(),
            }
        });
    }

    onError(data) {
        this.refs['popup'].getWrappedInstance().show(data.message);
    };

    // _handleSubmit(){
    //     const {searchData, dateShow, Status}  = this.state;
    //     const mySearch = {
    //         searchData : searchData,
    //         dateShow : dateShow,
    //         Status : Status
    //     }
    //     NavigationService.navigate('reportList', {searchData : mySearch, onError : this.onError});
    // }

    _getYmd(date) {
        
        let dd = date.getDate();
        let mm = date.getMonth()+1; //January is 0!

        let yyyy = date.getFullYear();

        if(dd<10)dd='0'+dd;

        if(mm<10)mm='0'+mm;

        return yyyy+'-'+mm+'-'+dd;
    }

    // _getToday(date) {
    //     let dd = date.getDate();
    //     let mm = date.getMonth()+1; //January is 0!

    //     let yyyy = date.getFullYear();

    //     if(dd<10)dd='0'+dd;

    //     if(mm<10)mm='0'+mm;

    //     return dd+'/'+mm+'/'+yyyy;
    // }

    convertDMYtoMDY(date) {

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

    // _processConvertToDate(date) {
    //     return new Date(date);
    // }

    // _compareDate(date1, date2){
    //     if(date1.getTime() > date2.getTime())
    //     {
    //         return true;
    //     }

    //     return false;
    // }

    /**************************************************
     * FUNCTION: _error
     * DESC: Hien thi popup error
     * @param err
     * @private
     ***************************************************/
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


    render() {
        // console.log('------ state: ', this.state);
        // console.log('------ data API: ', this.state.data);
        // console.log('------ data chon: ', this.state.selectedItems);

        return (
            <View style={styles.container}>
                <View style={styles.infoContainer}>       
                    <View style={styles.filterContainer}>
                        
                        {
                            /* 
                                Hai nut trang thai
                            */
                        }
                        <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('prcl.form.headline.filter')}</Text>    
                        <View>
                            <FlatList
                                data={this.state.dataSource}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => index + "_" + item.ID}
                            />
                        </View>

                        {
                            /* 
                                Hai FILL thoi gian
                            */
                        }
                        <View style={styles.dayContainer}>
                            <TouchableOpacity style={styles.btnFrom} onPress={this._showDateTimePickerFrom}>
                                <Text style={styles.txt}>{strings('prcl.form.input.btnFrom')}</Text>
                                <View style={styles.boxIcon}>
                                    <Text style={styles.txtDay}>{this.state.dateShow.FromDate}</Text>
                                    <Image style={[{ tintColor: '#8a919a', width: 10, height: 10, marginTop: 2 }]} source={require('../../../assets/images/tech-picker/down-arrow.png')} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btnTo} onPress={this._showDateTimePickerTo}>
                                <Text style={styles.txt}>{strings('prcl.form.input.btnTo')}</Text>
                                <View style={styles.boxIcon}>
                                    <Text style={styles.txtDay}>{this.state.dateShow.ToDate}</Text>
                                    <Image style={[{ tintColor: '#8a919a', width: 10, height: 10, marginTop: 2 }]} source={require('../../../assets/images/tech-picker/down-arrow.png')} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {
                    /* 
                        Submit FILTER
                    */
                }
                <View style={[ols.posAB, { left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}]}>
                    <ButtonO
                        label={strings('prcl.form.btn.filter')}
                        style={{marginBottom: 24,}}
                        styleBtnText={[ols.btnText]}
                        styleBtn={[ols.btnFull, ols.btnShadow]}
                        onPress={this.onConfirm} />
                </View>

                {
                    /* 
                        DateTimePicker (default hidden)
                    */
                }
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
                
                {
                    /* 
                        Popup and loading
                    */
                }
                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}


function mapStateToProps(state) {
    // GET STATE FROM SALENEW
    const stateUS = state.authReducer.userInfo;


    return {
        
    };
}

export default connect(mapStateToProps, {})(Filter);