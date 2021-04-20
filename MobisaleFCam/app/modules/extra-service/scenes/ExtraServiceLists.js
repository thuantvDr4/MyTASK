// LIB
import React, {Component} from "react";
import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView
} from "react-native";
import {strings} from "locales/i18n";
import {connect} from "react-redux";

// API
import * as api from "../api";

// REDUX ACTION
import {actions as extraInfoAction} from "../../extra-service-infomation";

const {updateBackScreenDetail} = extraInfoAction;

// LIB COMPONENT CUSTOM
import PopupWarning from "app-libs/components/PopupWarning";
import TechLoading from "app-libs/components/TechLoading";
import NavigationService from "app-libs/helpers/NavigationService";
import SelectPicker from "../../potential-customer/components/SelectPickerList";
import PickerSearchLocation from "app-libs/components/input/PickerSearchLocation";
import ButtonBack from "../../../libs/components/ButtonBack.js";
// HELPER
import {mapLocation} from "app-libs/helpers/mapPicker";

// STYLE
import styles from "../styles";
import ols from "../../../styles/Ola-style";
import TabBarCustom from "../../home/components/TabBarCustom";

const DataDemo = [
    {
        RegID: 321,
        RegCode: "ZPPDH52002",
        ObjID: 115032,
        Contract: "PPDH34001",
        RegStatus: "Not yet Paid",
        Status: 2,
        FullName: "nguyễn thị thúy",
        Address:
            "2y St.143, Sangkat Beoung Keng Kang 3, Khan Chamkamorn, Phnom Penh",
        Email: "",
        Phone1: "12121"
    },
    {
        RegID: 321,
        RegCode: "ZPPDH52002",
        ObjID: 115032,
        Contract: "PPDH34001",
        RegStatus: "Not yet Paid",
        Status: 2,
        FullName: "nguyễn thị thúy",
        Address:
            "2y St.143, Sangkat Beoung Keng Kang 3, Khan Chamkamorn, Phnom Penh",
        Email: "",
        Phone1: "12121"
    },
    {
        RegID: 321,
        RegCode: "ZPPDH52002",
        ObjID: 115032,
        Contract: "PPDH34001",
        RegStatus: "Not yet Paid",
        Status: 2,
        FullName: "nguyễn thị thúy",
        Address:
            "2y St.143, Sangkat Beoung Keng Kang 3, Khan Chamkamorn, Phnom Penh",
        Email: "",
        Phone1: "12121"
    },
    {
        RegID: 321,
        RegCode: "ZPPDH52002",
        ObjID: 115032,
        Contract: "PPDH34001",
        RegStatus: "Not yet Paid",
        Status: 2,
        FullName: "nguyễn thị thúy",
        Address:
            "2y St.143, Sangkat Beoung Keng Kang 3, Khan Chamkamorn, Phnom Penh",
        Email: "",
        Phone1: "12121"
    },
    {
        RegID: 321,
        RegCode: "ZPPDH52002",
        ObjID: 115032,
        Contract: "PPDH34001",
        RegStatus: "Not yet Paid",
        Status: 2,
        FullName: "nguyễn thị thúy",
        Address:
            "2y St.143, Sangkat Beoung Keng Kang 3, Khan Chamkamorn, Phnom Penh",
        Email: "",
        Phone1: "12121"
    }
];

class ExtraServiceLists extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: strings("extra_service.list_extra_service.title"),
            // Ko can add back button o day
            //   headerLeft: <ButtonBack navigation={navigation} />,
            headerRight: <View/>,
            navigationOptions: ({navigation}) => ({
                headerStyle: {
                    backgroundColor: "#0B76FF",
                    borderBottomWidth: 0,
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0
                    },
                    shadowColor: "transparent",
                    elevation: 0
                },
                headerTintColor: "#FFFFFF",
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                    flexGrow: 1
                }
            })
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingVisible: false,
            objExtraList: [],
            searchData: {
                DataType: 2,
                SearchType: 2,
                SearchContent: "",
                SearchLocation: this.props.locationOpt[0]
            },
            placeholderFilter: strings(
                "extra_service.list_extra_service.filter_option.fullname"
            ),
            optionsFilter: [],
            dataEmpty: true
        };
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
        this.props.navigation.addListener("willFocus", () => {
            // Call Search Default
            this._handleDefaultLoad();
        });

        //Load các loại tìm kiếm
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
                SearchLocation: selectItem
            }
        });
    }

    _handleLoadSearchType() {
        api.getRegistrationSearchTypeList({}, (success, result, msg) => {
            if (success) {
                let options = [];
                result.map(item => {
                    const oneOptions = {
                        label: item.Name,
                        value: item.Id
                    };
                    options.push(oneOptions);
                });

                this.setState({
                    ...this.state,
                    optionsFilter: options
                });
            } else {
                this._errorMsg(msg.message);
            }
        });
    }

    _handleSubmitSearch(event) {
        this.setState(
            {
                ...this.state,
                searchData: {
                    ...this.state.searchData,
                    SearchContent: event.nativeEvent.text
                }
            },
            () => {
                this._handleDefaultLoad();
            }
        );
    }

    _handleChangeSearchType(value) {
        let pl = "";
        if (value.value == 1) {
            pl = strings("extra_service.list_extra_service.filter_option.id");
        } else if (value.value == 2) {
            pl = strings("extra_service.list_extra_service.filter_option.fullname");
        } else {
            pl = strings("extra_service.list_extra_service.filter_option.phone");
        }

        this.setState(
            {
                ...this.state,
                searchData: {
                    ...this.state.searchData,
                    SearchType: value.value
                },
                placeholderFilter: pl
            },
            () => {
                // this._handleDefaultLoad();
            }
        );
    }

    _handleChangeSearchDataType(val) {
        this.setState(
            {
                ...this.state,
                searchData: {
                    ...this.state.searchData,
                    DataType: val
                },
                objExtraList: [],
                dataEmpty: true
            },
            () => {
                this._handleDefaultLoad();
            }
        );
    }

    _handleChangeValueSearch(text) {
        this.setState({
            ...this.state,
            searchData: {
                ...this.state.searchData,
                SearchContent: text
            }
        });
    }

    _handleDefaultLoad() {
        this._loading(true);

        const myData = {
            SearchContent: this.state.searchData.SearchContent,
            SearchType: this.state.searchData.SearchType,
            DataType: this.state.searchData.DataType,
            LocationId: this.state.searchData.SearchLocation.Id
        };

        api.getListExtraService(myData, (success, result, msg) => {
            //
            this._loading(false);

            //
            if (success) {
                this.setState({
                    ...this.state,
                    objExtraList: result,
                    dataEmpty: Object.entries(result).length === 0 ? true : false
                });
            } else {
                this._errorMsg(msg.message);
            }
        });
    }

    _handleNavigate(payload) {
        //update lại màn hình back lại nếu tới bước detail hợp đồng mới tạo thành công
        this.props.updateBackScreenDetail("ExtraServiceLists");

        //navigate tới màn hình chi tiết hợp đồng bán thêm
        NavigationService.navigate("ExtraServiceCTDetail", payload);
    }

    /**
     * show Loi
     * @param err
     * @private
     */
    _error(err) {
        this._loading(false);
        if (!err.message) return;
        this.refs["popup"].getWrappedInstance().show(err.message);
    }

    /**
     * show Loi
     * @param err
     * @private
     */
    _errorMsg(err) {
        this._loading(false);
        if (!err) return;
        this.refs["popup"].getWrappedInstance().show(err.toString());
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
                        <View
                            style={[styles.searchContainer, {
                                paddingLeft: 0,
                                paddingRight: 0,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }]}
                        >
                            <View style={[styles.boxSearch, {width: "65%"}]}>
                                <View style={styles.viewInputSearch}>
                                    <TouchableOpacity
                                        style={styles.iconSearchBox}
                                        onPress={this._handleDefaultLoad}
                                    >
                                        <Image
                                            style={styles.iconSearch}
                                            source={require("../../../assets/images/potential-customer/ic_16Search_off.png")}
                                        />
                                    </TouchableOpacity>

                                    <View style={styles.inputSearchBox}>
                                        <View style={styles.innerInputSearchBox}>
                                            <TextInput
                                                style={styles.inputSearch}
                                                placeholderTextColor="#878787"
                                                placeholder={this.state.placeholderFilter}
                                                underlineColorAndroid="rgba(0,0,0,0)"
                                                onChangeText={this._handleChangeValueSearch}
                                                onSubmitEditing={this._handleSubmitSearch}
                                            />
                                        </View>

                                        <View style={styles.searchBorder}></View>
                                    </View>

                                    <View style={styles.iconFilterBox}>
                                        <SelectPicker
                                            titleHeader={strings("extra_service.list_extra_service.filter.header_picker")}
                                            option={this.state.optionsFilter}
                                            onValueChange={this._handleChangeSearchType}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={[{width: "32%"}]}>
                                <PickerSearchLocation
                                    ref="Location"
                                    label={strings("extra_service.list_extra_service.filter_city.city_label")}
                                    placeholder={strings("extra_service.list_extra_service.filter_city.city_placeholder")}
                                    filterText={strings("extra_service.list_extra_service.filter_city.city_filterText")}
                                    getOptionData={this.getLocationData.bind(this)}
                                    value={this.state.searchData.SearchLocation}
                                    onChange={this.changeLocation}
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
                                    style={[
                                        styles.btnFilterType,
                                        this.state.searchData.DataType == 2
                                            ? styles.btnFilterActive
                                            : null
                                    ]}
                                    onPress={() => {
                                        this._handleChangeSearchDataType(2);
                                    }}
                                >
                                    <Text
                                        style={
                                            this.state.searchData.DataType == 2
                                                ? styles.textFilterTypeActive
                                                : styles.textFilterType
                                        }
                                    >
                                        {strings("extra_service.list_extra_service.filter_option.unpaid")}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.col}>
                                <TouchableOpacity
                                    style={[
                                        styles.btnFilterType,
                                        this.state.searchData.DataType == 3
                                            ? styles.btnFilterActive
                                            : null
                                    ]}
                                    onPress={() => {
                                        this._handleChangeSearchDataType(3);
                                    }}
                                >
                                    <Text
                                        style={
                                            this.state.searchData.DataType == 3
                                                ? styles.textFilterTypeActive
                                                : styles.textFilterType
                                        }
                                    >
                                        {strings("extra_service.list_extra_service.filter_option.paid")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/** Info */}
                <View style={styles.listInfoContainer}>
                    {!this.state.dataEmpty &&
                    Object.keys(this.state.objExtraList).length > 0 ? (
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={{paddingBottom: 20}}
                        >
                            {this.state.objExtraList.map((item, index) => (
                                <View key={index} style={styles.oneList}>
                                    <View style={styles.infoBox}>
                                        <View style={[styles.oneInfo, {marginTop: 8}]}>
                                            <Text style={styles.infoTitle}>
                                                {strings("extra_service.list_extra_service.list.status")}
                                            </Text>
                                            <Text
                                                style={[styles.infoValue,
                                                    {
                                                        color: item.Status === 3 ? "#83d300" : item.Status === 2 ? "#ff5050" : "#F09C16"
                                                    }
                                                ]}
                                            >
                                                {item.RegStatus}
                                            </Text>
                                        </View>

                                        <View style={[styles.oneInfo]}>
                                            <Text style={styles.infoTitle}>
                                                {strings("extra_service.list_extra_service.list.type")}
                                            </Text>
                                            <Text style={styles.infoValue}>{item.ServiceType}</Text>
                                        </View>

                                        <View style={[styles.oneInfo]}>
                                            <Text style={styles.infoTitle}>
                                                {strings("extra_service.list_extra_service.list.name")}
                                            </Text>
                                            <Text style={styles.infoValue}>{item.FullName}</Text>
                                        </View>

                                        <View style={styles.oneInfo}>
                                            <Text style={styles.infoTitle}>
                                                {strings("extra_service.list_extra_service.list.contract")}
                                            </Text>
                                            <Text style={styles.infoValue}>{item.Contract}</Text>
                                        </View>

                                        <View style={styles.oneInfo}>
                                            <Text style={styles.infoTitle}>
                                                {strings("extra_service.list_extra_service.list.reg_code")}
                                            </Text>
                                            <Text style={styles.infoValue}>{item.RegCode}</Text>
                                        </View>

                                        <View style={styles.oneInfo}>
                                            <Text style={styles.infoTitle}>
                                                {strings("extra_service.list_extra_service.list.phone")}
                                            </Text>
                                            <Text style={styles.infoValue}>{item.Phone1}</Text>
                                        </View>

                                        <View style={styles.oneAddress}>
                                            <Text style={styles.infoTitle}>
                                                {strings("extra_service.list_extra_service.list.address")}
                                            </Text>
                                            <Text style={styles.infoValue}>{item.Address}</Text>
                                        </View>
                                    </View>

                                    {/** Button */}
                                    <View style={styles.createBox}>
                                        <TouchableOpacity
                                            style={styles.btnCreate}
                                            onPress={this._handleNavigate.bind(this, {
                                                Contract: item.Contract,
                                                RegID: item.RegID,
                                                RegCode: item.RegCode,
                                                svType: item.ServiceType !== "Internet Upgrade" ? 1 : 2
                                                // svType
                                                // 1: Bán thêm: Equipment & IP
                                                // 2: Bán thêm: Internet Upgrade
                                            })}
                                        >
                                            <Text style={styles.txtBtnCreate}>
                                                {strings("extra_service.list_extra_service.list.detail")}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        // Render view khi khong co data tra ve
                        <View style={ols.dataEmpty}>
                            <View style={[ols.wrapImage]}>
                                <Image
                                    style={ols.imageNoData}
                                    source={require("../../../assets/images/contract-list/report.png")}
                                />
                                <View>
                                    <Text style={[ols.fs16, ols.fw500, {
                                        marginTop: 26,
                                        color: "#D6D6D6",
                                        textAlign: "center"
                                    }]}>
                                        {strings("all.data.noDataExtraList")}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
                <TabBarCustom
                    navigation={this.props.navigation}
                    routeAddName={"ContractListExtraService"}
                />

                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}

export default connect(
    state => {
        const locationOpt = state.authReducer.userInfo.ListLocation;

        return {
            userInfo: state.authReducer.userInfo,
            locationOpt: mapLocation(locationOpt)
        };
    },
    {updateBackScreenDetail}
)(ExtraServiceLists);
