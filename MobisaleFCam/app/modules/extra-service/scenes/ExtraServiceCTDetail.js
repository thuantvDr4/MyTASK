/**
 * Man hinh chi tiet hop dong bán thêm
 *
 * @author ThuanDD3
 * @since Jan, 2020
 */

// LIB
import React from "react";
import {
    Platform,
    View,
    ScrollView,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableOpacity,
    Image
} from "react-native";
import {strings} from "locales/i18n";
import {HeaderBackButton} from "react-navigation";
import {connect} from "react-redux";
import moment from 'moment';

// API
import * as api from "../api";
import * as c from "../constants";

// LIB CUSTOM
import NavigationService from "app-libs/helpers/NavigationService";
import ButtonElement from "app-libs/components/input/ButtonElement";
import PopupWarning from "app-libs/components/PopupWarning";
import TechLoading from "app-libs/components/TechLoading";
import SearchPickerCLKMItem from 'app-libs/components/SearchPickerCLKMItem';

// COMPONENT
import RowInfo from "../components/RowInfo";
import MenuPicker from "../components/MenuPicker";
import HandleHardBackButton from "../../customer-info/components/HandleHardBackButton";

// REDUX
import {actions as customerInfo} from "../../extra-service-infomation";

const {pushDataInfoRegistration_extra} = customerInfo;

// STYLE
import moduleStyle from "../styles";
import ols from "../../../styles/Ola-style";

class ExtraServiceCTDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: strings("contract.contract_detail.title"),
            headerBackTitle: null,
            headerLeft:
                (
                    <HeaderBackButton
                        onPress={() => NavigationService.navigate(navigation.getParam("backScreen"))}
                        tintColor="#fff"
                    />
                ),
            headerRight:
                navigation.state.params && navigation.state.params.isAction
                    ? (
                        <MenuPicker
                            onValueChange={navigation.getParam("selectMenu")}
                            options={navigation.getParam("options", [])}
                        />
                    ) : (<View/>),
        };
    };

    /**
     *
     * @param {*} props
     */
    constructor(props) {
        super(props);

        // Param get from previous screen
        // ---- 1 - bán equip, ip
        // ---- 2 - bán internet
        const {RegID, RegCode, svType, Contract} = this.props.navigation.state.params;

        this.state = {
            params: {
                // RegId: 594713,
                // RegCode: "ZPPFI28004",
                // svType: 2,
                Contract: Contract,
                RegID: RegID,
                RegCode: RegCode,
                svType: svType,
            },
            loadingVisible: false,
            info: {},
            dataSystemApiToken: ""
        };
    }

    /**
     * Xử lý khi màn hình khởi tạo xong
     */
    componentDidMount() {
        // Dang ky event xu ly khi chon menu phai
        this.props.navigation.setParams({selectMenu: this.selectMenu.bind(this)});

        //set màn hình để route khi bấm nút back bên trái
        this.props.navigation.setParams({backScreen: this.props.backScreen});

        // Event load data
        this.props.navigation.addListener("willFocus", this._loadDefaultData.bind(this));
    }

    /**
     * Xoa timeout loading khi focus ra man hinh ben ngoai
     */
    clearTimeoutLoading() {
        // Is our timer running?
        if (this.timerHandle) {
            // Yes, clear it
            clearTimeout(this.timerHandle);
            this.timerHandle = 0;
        }
    }

    /**
     *
     */
    componentWillUnmount() {
        this.clearTimeoutLoading();
    }

    /**
     * Load detail data khi man hinh được focus
     */
    _loadDefaultData() {
        // load detail
        this._showLoading(true);

        //
        const {params} = this.state;

        //
        setTimeout(() => {
            api.loadExtraContractDetail(params, this.loadDetailSuccess.bind(this));
        }, 100);
    }

    /**
     * Xử lý khi load detail success
     *
     * @param {*} isSucess
     * @param {*} data
     * @param {*} msg
     */
    loadDetailSuccess(isSucess, data, msg) {

        if (isSucess) {
            const {ListServiceType} = data[0];
            const serviceItem = ListServiceType[0];

            // Nêu chọn loại service là equipment mới cho tích hẹn, Id: 4
            if (serviceItem.Id !== 3) {
                // ẩn menu tích hẹn nếu khách hàng đã tích hẹn rồi
                this.props.navigation.setParams({
                    isAction: data && data.length > 0 && !data[0].AppointmentDate
                });

                // khoi tao action cua detail
                const menuOption = [
                    {Id: c.ACT_TAKE_APPOINTMENT, label: strings("contract.contract_detail.fn_appointment")}
                ];

                // Gan action cho right menu
                this.props.navigation.setParams({options: menuOption});
            }

            // set data
            this.setState({
                params: {
                    ...this.state.params,
                    Contract: this.state.params.Contract || this.state.params.Contract !== undefined ? this.state.params.Contract : data[0].Contract
                },
                info: {
                    ...data[0],
                    AppointmentDept: data[0].AppointmentDept ? data[0].AppointmentDept : strings("contract.contract_detail.nodata"),
                    AppointmentDate: data[0].AppointmentDate ? data[0].AppointmentDate : strings("contract.contract_detail.nodata"),
                    AppointmentPhone: data[0].AppointmentPhone ? data[0].AppointmentPhone : strings("contract.contract_detail.nodata"),
                    DeploymentStatus: data[0].DeploymentStatus ? data[0].DeploymentStatus : strings("contract.contract_detail.nodata")
                },
                loadingVisible: false
            });

            return;
        }

        // set data
        this.setState({
            loadingVisible: false

        }, () => {

            if (msg.message == "") return;
            this.refs["popup"].getWrappedInstance().show(msg.message);
        });
    }

    /**
     * Xử lý khi click chọn menu phải
     * @param {*} route
     */
    selectMenu(route) {
        NavigationService.navigate(route.Id, {
            ...this.state.params,
            ObjID: this.state.info.ObjId,
            Contract: this.state.info.Contract,
            Pop: this.state.info.GroupPoints,
            RegType: 2
        });
    }

    /**
     * Get token and pass to view image
     */
    _naviToViewDownloadImg() {

        //
        this._showLoading(true);

        // goi API generation Token
        api.getSystemApiToken({}, (success, result, msg) => {
            //
            this._showLoading(false);

            //
            if (success) {
                NavigationService.navigate("ExtraServiceViewImage", {
                    listImage: this.state.info.ImageInfo,
                    dataSystemApiToken: result[0].Token
                });
            } else {
                this.refs["popup"].getWrappedInstance().show(msg);
            }
        });
    }

    /**
     *
     */
    _naviToReceipt() {
        const {info, params} = this.state;

        // chua cap nhat hinh anh - Internet Upgrade
        if (!info.IsUpdateImage && params.svType !== 1) {
            this.refs["popup"].getWrappedInstance().show(strings("dl.list_customer_info.detail.noti"));
            return;
        }

        // Danh cho Equipment và Internet Upgrade
        if (info.ListServiceType[0].Id !== 3) {

            // chua tich hen
            if (!info.AppointmentDate || info.AppointmentDate === "No data" || info.AppointmentDate === "") {
                this.refs["popup"].getWrappedInstance().show(strings("dl.extra_service_detail.noti.err.dep"));
                return;
            }

            // ngay tich hen nhỏ hơn ngày payment
            if (info.AppointmentDate) {
                const now = moment(new Date()).format("MM/DD/YYYY");
                const datePick = moment(new Date(info.AppointmentDate)).format("MM/DD/YYYY");

                if (datePick < now) {
                    this.refs["popup"].getWrappedInstance().show(strings("dl.extra_service_detail.noti.err.depLessPay"));
                    return;
                }
            }
        }

        //
        NavigationService.navigate("ExtraServiceReceipt", params);
    }

    /**
     * xử lí khi bấm vào nut update info
     */
    _handleUpdateInfo = () => {
        const {info, params} = this.state;

        this.props.pushDataInfoRegistration_extra(info).then(() => {

            setTimeout(() => {
                this.props.navigation.replace("CustomerInfoExtra", {
                    titleNav: strings("customer_info.titleNavigation.update"),
                    extraServiceEditInfo: 'fromBtnEditInfo',
                    svType: params.svType
                });
            }, 500);
        });
    };

    /**
     * xử lí khi bấm vào nut update port
     */
    _handleUpdateBookport = () => {
        const {info, params} = this.state;

        //
        this._showLoading(true);

        //
        const myData = {
            RegID: params.RegID,
            RegCode: params.RegCode
        };

        //
        api.GetRegistrationByID(myData, (success, result, msg) => {
            if (success) {
                let objResult = result[0];
                objResult.FullAddress = objResult.Address;

                this.props.pushDataInfoRegistration_extra(objResult).then(() => {
                    this._showLoading(false);

                    setTimeout(() => {
                        NavigationService.navigate("ExSerBookport", {
                            extraServiceEditPort: 'fromBtnEditPort',
                            svType: params.svType
                        });
                    }, 500);
                });
            } else {
                this.refs["popup"].getWrappedInstance().show(msg.message);
            }
        });
    };

    /**
     * action khi bấm nút back cứng
     */
    _handleGoBackButton = () => {
        NavigationService.navigate(this.props.backScreen);
    };

    /**
     * Render Infomation Services
     * @param {*}
     */
    _renderServices(type) {
        const {svType} = this.state.params;

        if (svType === 1) {
            return this._renderInfo_EQ_IP();
        } else {
            return this._renderInfo_INU();
        }
    }

    /**
     *
     */
    _renderInfo_EQ_IP() {
        const {info} = this.state;

        return (
            <View>
                <View style={[moduleStyle.boxInfo, styles.boxFooter]}>
                    <RowInfo
                        label={strings("extra_service.contract_detail.equipments")}
                        text={info.DeviceTotal ? info.DeviceTotal : "0"}
                    />
                    {/** Seperate */}
                    <View style={styles.lineMid}/>

                    {/** ---- EQUIPMENT INFO */}
                    {
                        info &&
                        info.ListDevice &&
                        info.ListDevice.ListEquipment &&
                        info.ListDevice.ListEquipment.length > 0 &&
                        this._renderDevice(info.ListDevice)
                    }

                    <RowInfo
                        label={strings("extra_service.contract_detail.ip")}
                        text={info.ListStaticIP && info.ListStaticIP[0] ? info.ListStaticIP[0].Total : 0}
                    />

                    <RowInfo
                        label={strings("extra_service.contract_detail.type_payment")}
                        text={info.PaymentMethodName && info.PaymentMethodName !== "" ? info.PaymentMethodName : ""}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {strings("extra_service.contract_detail.total")}
                    </Text>
                    <Text style={styles.footerValue}>{info.Total}</Text>
                </View>
            </View>
        )
    }

    /**
     *
     */
    _renderInfo_INU() {
        const {info} = this.state;

        return (
            <View>
                <View style={[moduleStyle.boxInfo, styles.boxFooter]}>

                    <RowInfo
                        label={strings("extra_service.contract_detail.internet_upgrade")}
                        text={info.InternetTotal ? info.InternetTotal : ''}
                    />
                    {/** ---- Seperate */}
                    <View style={styles.lineMid}/>

                    {/** ---- Equipment info */}
                    {this._renderDevice_INU(info)}

                    <RowInfo
                        label={strings("extra_service.contract_detail.old_month")}
                        text={info.InternetUpgrade ? info.InternetUpgrade.OldMonthMoney : ''}
                    />

                    <RowInfo
                        label={strings("extra_service.contract_detail.connection_fee")}
                        text={info.ConnectionFee ? info.ConnectionFee : (info.ConnectionFee === 0 ? info.ConnectionFee : '')}
                    />

                    <RowInfo
                        label={strings("extra_service.contract_detail.vat")}
                        text={info.VAT && info.VAT !== "" ? info.VAT : (info.VAT === 0 ? info.VAT : '')}
                    />

                    <RowInfo
                        label={strings("extra_service.contract_detail.type_payment")}
                        text={info.PaymentMethodName && info.PaymentMethodName !== "" ? info.PaymentMethodName : ""}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {strings("extra_service.contract_detail.total")}
                    </Text>
                    <Text style={styles.footerValue}>{info.Total}</Text>
                </View>

                {
                    /* ---- Prepaid promotion */
                    info && info.PromotionName &&
                    <View>
                        <View style={[moduleStyle.titleBox]}>
                            <Text style={moduleStyle.titleLeft}>
                                {strings("list_customer_info.detail.Prepaid_promotion")}
                            </Text>
                        </View>

                        <SearchPickerCLKMItem
                            Name={info ? info.PromotionName : null}
                            Description={info ? info.PromotionDescription : null}
                            style={{backgroundColor: "#FFF", marginBottom: 0}}
                        />
                    </View>
                }
            </View>
        )
    }

    /**
     * Render thong tin thiết bị
     * @param {*} ListDevice
     */
    _renderDevice(ListDevice) {
        const views = [];

        // valid data
        if (!ListDevice) return;

        const {ListEquipment} = ListDevice;

        for (i in ListEquipment) {
            views.push(
                <View key={ListEquipment[i].Value}>
                    <RowInfo
                        label={strings("extra_service.contract_detail.equipment_name")}
                        text={ListEquipment[i].Name}
                    />
                    <RowInfo
                        text={`${ListEquipment[i].Discount}%`}
                        textStyle={{color: '#9a9a9a', fontSize: 12, lineHeight: 14}}
                        textSub={<Text style={{
                            color: '#9a9a9a',
                            fontSize: 12,
                            lineHeight: 14
                        }}>{strings("extra_service.contract_detail.discount")}</Text>}
                    />
                </View>
            );
        }

        /** Seperate */
        views.push(<View style={styles.lineMid}/>);

        return views;
    }

    /**
     *
     * @param {*}
     */
    _renderDevice_INU(info) {

        return (
            <View>
                {
                    info && info.ListDevice && info.ListDevice.ListEquipment
                        ? info.ListDevice.ListEquipment.map(
                        (itemDevice, index) => (
                            <RowInfo
                                key={index}
                                label={itemDevice.Name}
                                text={itemDevice.TotalPrice}
                            />
                        )
                        )
                        : null
                }
                {
                    /** Seperate */
                    info && info.ListDevice && info.ListDevice.ListEquipment
                        ? <View style={styles.lineMid}/>
                        : null
                }
            </View>
        )
    }

    /**
     * Render button Upload ảnh - View ảnh
     */
    _renderBtn_Up_Down_Image() {
        const {info, params} = this.state;

        return (<View>
                {/** -- Seperate */}
                <View style={styles.lineMid}/>

                {/** -- Button Upload ảnh */}
                <View style={styles.rowInfoContainer}>
                    <Text style={styles.rowInfoLabel}>
                        {strings("list_customer_info.detail.Profile_image")}
                    </Text>

                    <View style={{flexDirection: "row"}}>
                        {/** btn - Upload anh */}
                        <TouchableOpacity onPress={() => {
                            NavigationService.navigate("ExtraServiceUploadImage", params);
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: "500",
                                marginRight: 20,
                                color: info && info.IsUpdateImage ? "#0B76FF" : "#f00",
                            }}>
                                {strings("list_customer_info.detail.upload")}
                            </Text>
                        </TouchableOpacity>

                        {/** btn - View anh */}
                        <TouchableOpacity
                            onPress={info && info.IsUpdateImage ? this._naviToViewDownloadImg.bind(this) : () => {
                            }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: "500",
                                color: info && info.IsUpdateImage ? "#0B76FF" : "#9a9a9a"
                            }}>
                                {strings("list_customer_info.detail.detail")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    /**
     * Render noData
     */
    _renderEmptyNoData() {
        return (
            <View style={ols.dataEmpty}>
                <View style={[ols.wrapImage]}>
                    <Image
                        style={ols.imageNoData}
                        source={require('../../../assets/images/contract-list/report.png')}
                    />
                    <View>
                        <Text style={[ols.fs16, ols.fw500, {marginTop: 26, color: '#D6D6D6'}]}>
                            {strings('all.data.noDataNormal')}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    /**
     * An hien loading
     * @param {*} isShow
     */
    _showLoading(isShow) {
        this.setState({
            loadingVisible: isShow
        });
    }

    /**
     * Render man hinh chinh
     */
    render() {
        const {info, params} = this.state;


        console.log(this.state);
        return (
            <HandleHardBackButton onBack={() => this._handleGoBackButton()}>
                <KeyboardAvoidingView
                    keyboardVerticalOffset={Platform.select({ios: 70, android: 0})}
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={[ols.container_keyboard]}
                >
                    <ScrollView
                        keyboardDismissMode={"on-drag"}
                        contentContainerStyle={[ols.wrapper_scrollview]}
                    >
                        {
                            Object.keys(info).length === 0 && info.constructor === Object

                                ? this._renderEmptyNoData() :

                                <View style={[ols.inner_scrollview, {
                                    justifyContent: "space-between",
                                    backgroundColor: "#F8F9FB"
                                }]}>
                                    <View style={[{paddingBottom: 20}]}>
                                        {
                                            // ---- POP info
                                        }
                                        <View style={moduleStyle.titleBox}>
                                            <Text style={moduleStyle.titleLeft}>
                                                {strings("list_customer_info.detail.info_point_group")}
                                            </Text>
                                            {
                                                // ---- Edit Port
                                                info &&
                                                !info.PaidStatus &&
                                                (!info.AppointmentDate || info.AppointmentDate === "No data" || info.AppointmentDate === "") &&
                                                params.svType !== 1 && (
                                                    <TouchableOpacity onPress={() => this._handleUpdateBookport()}>
                                                        <Text style={moduleStyle.titleRight}>
                                                            {strings("extra_service.contract_detail.title_update")}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </View>
                                        <View style={[moduleStyle.innerbookport]}>
                                            <RowInfo
                                                label={strings("list_customer_info.detail.pop")}
                                                text={info.GroupPoints || ""}
                                            />
                                        </View>

                                        {
                                            // ---- Customer infomation
                                        }
                                        <View style={moduleStyle.titleBox}>
                                            <Text style={moduleStyle.titleLeft}>
                                                {strings("extra_service.contract_detail.cus_info")}
                                            </Text>
                                            {
                                                // ---- Edit Information
                                                info && info.PaidStatus === 0 && (
                                                    <TouchableOpacity onPress={() => this._handleUpdateInfo()}>
                                                        <Text style={moduleStyle.titleRight}>
                                                            {strings("extra_service.contract_detail.title_update")}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                        </View>

                                        <View style={moduleStyle.boxInfo}>
                                            <RowInfo
                                                label={strings("extra_service.contract_detail.status")}
                                                text={info.RegStatus || ""}
                                                textStyle={{color: info.PaidStatus ? "#83d300" : "#ff5050"}}
                                            />

                                            <RowInfo
                                                label={strings("extra_service.contract_detail.cus_name")}
                                                text={info.FullName}
                                            />

                                            <RowInfo
                                                label={strings("extra_service.contract_detail.contract_no")}
                                                text={info.Contract}
                                            />

                                            <RowInfo
                                                label={strings("extra_service.contract_detail.regis_code")}
                                                text={info.RegCode}
                                            />

                                            <RowInfo
                                                label={strings("extra_service.contract_detail.cus_phone")}
                                                text={info.Phone1}
                                            />

                                            <RowInfo
                                                label={strings("extra_service.contract_detail.address")}
                                                text={info.Address}
                                            />

                                            <RowInfo
                                                label={strings("extra_service.contract_detail.appointmentDept")}
                                                text={info.AppointmentDept}
                                            />

                                            <RowInfo
                                                label={strings("extra_service.contract_detail.appointmentDate")}
                                                text={info.AppointmentDate}
                                            />

                                            <RowInfo
                                                label={strings("extra_service.contract_detail.appointmentPhone")}
                                                text={info.AppointmentPhone}
                                            />

                                            <RowInfo
                                                label={strings("extra_service.contract_detail.deploymentStatus")}
                                                text={info.DeploymentStatus}
                                            />

                                            {
                                                // ---- Show cho bán internet upgrade
                                                info && !info.PaidStatus && params.svType !== 1 ? this._renderBtn_Up_Down_Image() : null
                                            }

                                        </View>

                                        {
                                            // ---- DETAIL PAYMENT
                                        }
                                        <Text style={[moduleStyle.textTitle, moduleStyle.boxSpace]}>
                                            {strings("extra_service.contract_detail.service_list")}
                                        </Text>

                                        {
                                            // ---- RENDER - EQUIPMENT, IP, INTERNET UPGRADE
                                            this._renderServices()
                                        }
                                    </View>

                                    {/** Button Payment */}
                                    <View>
                                        {
                                            !info.PaidStatus ? (
                                                <View style={moduleStyle.buttonContainer}>
                                                    <ButtonElement
                                                        title={strings("extra_service.contract_detail.btnPayment")}
                                                        onPress={() => this._naviToReceipt()}
                                                    />
                                                </View>
                                            ) : null
                                        }
                                    </View>
                                </View>
                        }
                    </ScrollView>

                    <PopupWarning ref="popup"/>
                    <TechLoading visible={this.state.loadingVisible}/>
                </KeyboardAvoidingView>
            </HandleHardBackButton>
        );
    }
}

/**************************************************
 * FUNCTION: REDUX
 ***************************************************/
function mapStateToProps(state) {
    const extraServiceState = state.extraServiceInfoReducer;

    return {
        backScreen: extraServiceState.backScreenDetail
    };
}

export default connect(mapStateToProps, {pushDataInfoRegistration_extra})(ExtraServiceCTDetail);

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 40,
        maxHeight: 40,
        backgroundColor: "rgba(158, 201, 255, 0.3)",
        borderColor: "#9ec9ff",
        borderWidth: 1,
        paddingHorizontal: 12,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        borderTopWidth: 0
    },
    boxFooter: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0
    },
    footerText: {
        color: "#323232",
        fontSize: 14,
        fontWeight: "500"
    },
    footerValue: {
        color: "#0b76ff",
        fontSize: 18,
        fontWeight: "500",
        textAlign: "right"
    },
    clkmBox: {
        paddingVertical: 8
    },
    clkmText: {
        color: "#0b76ff",
        fontSize: 14,
        textAlign: "center"
    },
    buttonContainer: {
        marginBottom: 24
    },

    //
    rowInfoContainer: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowInfoLabel: {
        color: '#9a9a9a',
        fontSize: 12,
        lineHeight: 14,
    },
    lineMid: {
        borderTopWidth: 1, borderTopColor: '#9EC9FF',
        marginBottom: 8, marginTop: 8,
    },
});
