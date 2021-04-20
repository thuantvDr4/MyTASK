/**
 * Màn hình danh sách hợp đồng
 * @uthor thuandd3
 * @dateCreate 14/03/2019
 * @dateEdit ---  
 */

// LIB
import React from 'react';
import {
    View, ScrollView,
    Image, Text, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Alert
} from 'react-native';
import { strings } from 'locales/i18n';
import { HeaderBackButton } from 'react-navigation';

// REDUX
import { connect } from 'react-redux';

// API
import * as api from '../api';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import PickerSearchLocation from 'app-libs/components/input/PickerSearchLocation';

// COMPONENT
import PickerList from '../components/PickerList';
import PickerManage from '../components/PickerManage';

// CONSTANTS
import * as con from '../constants';

// HELPER
import { mapLocation } from "app-libs/helpers/mapPicker";

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

class ContractList extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('ctl.nav.titleCtl'),
            headerLeft: <HeaderBackButton onPress={() => NavigationService.navigateGoBack()} tintColor="#fff" />,
            headerRight: <View />,
            headerBackTitle: null,
            navigationOptions: ({ navigation }) => ({
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
        }
    }

    //-------------------------------------- DEMO DATA - Xoa
    listId = [
        {
            "FullName": "vutdl test1",
            "Contract": "4423423",
            "Phone1": "0987557633",
            "Address": "3423 St.306, Sangkat Beoung Keng Kang 1, Khan 7Makara, Phnom Penh",
            "ContractStatus": "Normal"
        }, {
            "FullName": "vutdl test2",
            "Contract": "543232345",
            "Phone1": "0987557633",
            "Address": "3423 St.306, Sangkat Beoung Keng Kang 1, Khan 7Makara, Phnom Penh",
            "ContractStatus": "Normal"
        }, {
            "FullName": "vutdl test3",
            "Contract": "13543543",
            "Phone1": "0987557633",
            "Address": "3423 St.306, Sangkat Beoung Keng Kang 1, Khan 7Makara, Phnom Penh",
            "ContractStatus": "Normal"
        }
    ];
    //-------------------------------------- DEMO DATA - Xoa


    /**
     * 
     */
    constructor(props) {
        super(props);

        this.state = {
            dataSearch: {
                SearchType: 1,
                SearchContent: '',
                SearchLocation: this.props.locationOpt[0]
            },
            dataAPI: {
                apiTypeSearch: []
            },
            dataEmpty: true,
            dataAll: [],
            placeholderFilter: strings('ctl.search.plhname'),
            loadingVisible: false
        };

        // Bind Function
        this._handleLoadSearchDataAll = this._handleLoadSearchDataAll.bind(this);
        this._handleChangeSearchType = this._handleChangeSearchType.bind(this);
        this._handleChangeSearchContent = this._handleChangeSearchContent.bind(this);
        this._handleSubmitSearch = this._handleSubmitSearch.bind(this);
        this.changeLocation = this.changeLocation.bind(this);

        // Dang ky event xu ly khi chon menu tu manage contract
        this.props.navigation.setParams({ handleSelectMenuManage: this.handleSelectMenuManage.bind(this) });
    }

    /**
     * 
     */
    componentDidMount() {
        // this._mounted = true;

        // LOAD API FIRST
        this._handleLoadSearchType();

        // khoi tao action cua Manage Contract
        const menuOption = [{
            id: con.ACT_CREATE_PCL,
            label: strings('ctl.nav.titleCrt')
        },
        {
            id: con.ACT_CREATE_DVS,
            label: strings('dvs.nav.titleCrt')
        },
        {
            id: con.ACT_BILL_HISTORY,
            label: strings('history.nav.titleBillHistory')
        },
        {
            id: con.ACT_CHANGE_STT_HISTORY,
            label: strings('history.nav.titleChangeSTT')
        }
        ];

        // Gan action cho Manage Contract Button
        this.props.navigation.setParams({ options: menuOption });

        // //debug tạm thời sẽ xóa
        // this._handleSubmitSearch();
    }

    /**
     * 
     */
    componentWillUnmount() {
        // this._mounted = false
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
        if (selectItem == this.state.dataSearch.SearchLocation) {
            return;
        }

        this.setState({
            dataSearch: {
                ...this.state.dataSearch,
                SearchLocation: selectItem,
            }
        });
    }

    /**************************************************
     * FUNCTION: _handleLoadSearchType (LOAD API)
     * DESC: Load API data search theo loai
     * @param
     * @private
     ***************************************************/
    _handleLoadSearchType() {
        this._loading(true);

        api.loadSearchType({}, (success, result, msg) => {
            this._loading(false);

            if (success) {
                let options = [];

                result.map((item) => {
                    const oneOptions = {
                        label: item.Name,
                        value: item.Id
                    };
                    options.push(oneOptions)
                });

                this.setState({
                    ...this.state,
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiTypeSearch: options,
                    }
                });

            } else {
                this._error(msg);
            }
        });
    }

    /**************************************************
     * FUNCTION: _handleLoadSearchDataAll (LOAD API)
     * DESC: Load API data sau khi search
     * @param
     * @private
     ***************************************************/
    _handleLoadSearchDataAll() {
        // if (! this.isValidData()) {
        //     return;
        // }

        this._loading(true);

        const inputData = {
            SearchType: this.state.dataSearch.SearchType,
            SearchContent: this.state.dataSearch.SearchContent,
            SearchLocation: this.state.dataSearch.SearchLocation,
        };

        api.loadSearchDataAll(inputData, (success, result, msg) => {
            this._loading(false);

            if (success) {

                this.setState({
                    ...this.state,
                    dataAll: result,
                    dataEmpty: Object.entries(result).length === 0 ? true : false,
                });

            } else {
                this._error(msg);
            }
        });
    }

    /**************************************************
     * FUNCTION: _handleChangeSearchType
     * DESC: Bam nut filter de chon kieu search
     * @param value
     * @private
     ***************************************************/
    _handleChangeSearchType(value) {

        let pl = '';

        switch (value.value) {
            case 1: pl = strings('ctl.search.plhname'); break;
            case 2: pl = strings('ctl.search.plhcon'); break;
            case 3: pl = strings('ctl.search.plhphone'); break;
            default: pl = strings('ctl.search.plhpp'); break;
        }

        this.setState({
            ...this.state,
            dataSearch: {
                ...this.state.dataSearch,
                SearchType: value.value,
            },
            placeholderFilter: pl,
        });
    }

    /**************************************************
     * FUNCTION: _handleChangeSearchContent
     * DESC: Dien gia tri can tim vao o search
     * @param text
     * @private
     ***************************************************/
    _handleChangeSearchContent(text) {
        this.setState({
            ...this.state,
            dataSearch: {
                ...this.state.dataSearch,
                SearchContent: text
            }
        });
    }

    /**************************************************
     * FUNCTION: handleSelectMenuManage
     * DESC: Xu ly goi menu chuyen man hinh khi chon vao nut manage
     * NOTE: hien tai ko dung, vi ko chuyen data tung item dc
     * @param route (item cua tung menu)
     * @public
     ***************************************************/
    handleSelectMenuManage(route) {
        NavigationService.navigate(route.id, {
            // data: item
        });
    }

    /**************************************************
     * FUNCTION: _handleSubmitSearch
     * DESC: Nhan enter de tim kiem 
     * @param event
     * @private
     ***************************************************/
    _handleSubmitSearch(event) {

        this.setState({
            ...this.state,
            dataSearch: {
                ...this.state.dataSearch,
                SearchContent: event.nativeEvent.text
                // sửa code để test, sẽ xóa sau
                // SearchContent: 'anh'
            }
        }, () => {
            this._handleLoadSearchDataAll();
        });
    }

    /**************************************************
     * FUNCTION: isValidData
     * DESC: Kiem tra gia tri co de trang hoac khoang trang hay ko
     * @param text
     * @public
     ***************************************************/
    isValidData(temp) {
        const { dataSearch } = this.state;
        let errorList = [];

        if (dataSearch.SearchContent.replace(/^\s\s*/, '').replace(/\s+$/, '') === "") {

            errorList.push({
                name: 'txtSearchContent',
                msg: strings('dl-contract_list.noti.err.fieldEmpty')
            });
        }

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }

    /**************************************************
     * FUNCTION: _error
     * DESC: Hien thi popup error
     * @param err
     * @private
     ***************************************************/
    _error(err) {
        this._loading(false);
        if (!err.message) return;
        this.refs['popup'].getWrappedInstance().show(err.message);
    }

    /**************************************************
     * FUNCTION: _loading
     * DESC: Hien thi loading
     * @param isShow
     * @private
     ***************************************************/
    _loading(isShow) {
        // if(! this._mounted) return;

        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }


    /****************************************************************************************************
     * FUNCTION: render
     * DESC: Render ra giao dien
     * @param 
     * @private
     *****************************************************************************************************/
    render() {
        const data = this.state.dataAll;
        const { navigation } = this.props;

        var dataItem = !this.state.dataEmpty && Object.keys(data).length > 0
            ?
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardDismissMode={'on-drag'}
            >
                {
                    data ? data.map((item, index) => (
                        // Render view khi co data tra ve
                        <View key={index} style={styles.oneList}>
                            <View style={styles.infoBox}>
                                <View style={[styles.oneInfo, { marginTop: 8 }]}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblStatus')}</Text>
                                    <Text style={[styles.infoValue, { color: '#F09C16' }]}>{item.ContractStatus}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblCusName')}</Text>
                                    <Text style={styles.infoValue}>{item.FullName}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblConNum')}</Text>
                                    <Text style={styles.infoValue}>{item.Contract}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblPhoNum')}</Text>
                                    <Text style={styles.infoValue}>{item.Phone1}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('ctl.item.lblInsAdd')}</Text>
                                    <Text style={styles.infoValue}>{item.Address}</Text>
                                </View>
                            </View>

                            <PickerManage
                                titleHeader={strings('ctl.popup.titManage')}
                                option={navigation.getParam('options', [])}
                                // onValueChange = { navigation.getParam('handleSelectMenuManage') }
                                onValueChange={value => {
                                    setTimeout(() => {
                                        NavigationService.navigate(value.id, {
                                            data: item,
                                        });
                                    }, 400);
                                }}
                                stylesView={styles.createBox}
                                stylesButton={styles.btnCreate}
                                stylesText={styles.txtBtnCreate}
                            />

                        </View>

                    )) : null
                }
            </ScrollView>
            :
            // Render view khi khong co data tra ve
            <View style={styles.dataEmpty} >
                <View style={[styles.wrapImage]}>
                    <Image
                        source={require('../../../assets/images/contract-list/report.png')}
                    />
                    <View>
                        <Text style={[ols.fs16, ols.fw500, { marginTop: 26, color: '#D6D6D6' }]}>{strings('all.data.noDataContractList')}</Text>
                    </View>
                </View>
            </View>
            ;

        return (

            <View style={styles.container}>

                {/* 
                    Search bar
                */}
                <KeyboardAvoidingView behavior="padding" enabled>
                    <View style={[styles.searchContainer, {
                        paddingRight: 24, paddingLeft: 24,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }]}>
                        <View style={[styles.boxSearch, { width: '65%' }]}>
                            <View style={styles.viewInputSearch} >

                                <TouchableOpacity style={styles.iconSearchBox} onPress={this._handleLoadSearchDataAll}>
                                    <Image style={styles.iconSearch} source={require('../../../assets/images/potential-customer/ic_16Search_off.png')} />
                                </TouchableOpacity>

                                <View style={styles.inputSearchBox}>

                                    <View style={styles.innerInputSearchBox}>
                                        <TextInput
                                            ref="txtSearchContent"
                                            style={styles.inputSearch}
                                            placeholderTextColor="#878787"
                                            placeholder={this.state.placeholderFilter}
                                            underlineColorAndroid='rgba(0,0,0,0)'
                                            onChangeText={this._handleChangeSearchContent}
                                            onSubmitEditing={this._handleSubmitSearch}
                                        />
                                    </View>

                                    <View style={styles.searchBorder}></View>
                                </View>

                                <View style={styles.iconFilterBox}>
                                    <PickerList
                                        titleHeader={strings('ctl.popup.titFilter')}
                                        option={this.state.dataAPI.apiTypeSearch}
                                        onValueChange={this._handleChangeSearchType}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={[{ width: '32%' }]}>
                            <PickerSearchLocation
                                ref="Location"
                                label={strings('potentianl_customer.add_customers.form.city_label')}
                                placeholder={strings('potentianl_customer.add_customers.form.city_placeholder')}
                                filterText={strings('potentianl_customer.add_customers.form.city_filterText')}
                                getOptionData={this.getLocationData.bind(this)}
                                value={this.state.dataSearch.SearchLocation}
                                onChange={this.changeLocation}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>

                {/* 
                    Item loop
                */}
                <View style={styles.listInfoContainer}>
                    {dataItem}
                </View>

                {/* 
                    Popup and loading
                */}
                <PopupWarning ref="popup" />
                <TechLoading visible={this.state.loadingVisible} />
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

export default connect(mapStateToProps)(ContractList);