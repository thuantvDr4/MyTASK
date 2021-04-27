// LIB
import React from 'react';
import { Platform, View, ScrollView, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { strings } from 'locales/i18n';
import { requestPermission } from 'react-native-android-permissions';

// API
import * as api from '../api';
import * as apiToken from '../../list-customer-info/api';
import * as c from '../constants';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import ButtonElement from 'app-libs/components/input/ButtonElement';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import SearchPickerCLKMItem from 'app-libs/components/SearchPickerCLKMItem';

// COMPONENT
import RowInfo from '../components/RowInfo';
import MenuPicker from '../components/MenuPicker';

// Style
import moduleStyle from '../styles';
import ols from '../../../styles/Ola-style';

/**
 * Man hinh chi tiet hop dong
 *
 * @author DaiDP
 * @since Aug, 2018
 */
class ContractDetail extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('contract.contract_detail.title'),
            headerRight: (
                navigation.state.params.isAction ?
                    <MenuPicker onValueChange={navigation.getParam('selectMenu')} options={navigation.getParam('options', [])} /> :
                    <View />
            ),
            headerBackTitle: null,

        }
    }

    constructor(props) {
        super(props);

        const { ObjID, Contract } = this.props.navigation.state.params;

        this.state = {
            loadingVisible: false,
            params: {
                ObjID: ObjID,
                Contract: Contract
            },
            info: {},
            dataSystemApiToken: ''
        }
    }

    /**
     * Xử lý khi màn hình khởi tạo xong
     */
    componentDidMount() {
        // Dang ky event xu ly khi chon menu phai
        this.props.navigation.setParams({ selectMenu: this.selectMenu.bind(this) });
        // Event load data
        this.props.navigation.addListener('willFocus', this.loadData.bind(this));
        this.props.navigation.addListener('willBlur', this.clearTimeoutLoading.bind(this));

        // Goi API generation Token
        apiToken.getSystemApiToken({}, (success, result, msg) => {
            if (success) {
                this.setState({
                    ...this.state,
                    dataSystemApiToken: result[0].Token
                });
            } else {
                this._error(msg);
            }
        });
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


    componentWillUnmount() {
        this.clearTimeoutLoading();
    }

    /**
     * Load detail data khi man hinh được focus
     */
    loadData() {
        // load detail
        this.showLoading(true);

        // Sau khoan thoi gian 15s neu loading khong xong thi tu tat
        this.timerHandle = setTimeout(() => {
            this.showLoading(false);
            this.timerHandle = 0;
        }, 15000);

        setTimeout(() => {
            api.getContractDetail(this.state.params, this.loadDetailSuccess.bind(this));
        }, 500);

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
            this.props.navigation.setParams({ isAction: data.RegId || (data.RegCode || data.RegCode !== "")})

            // khoi tao action cua detail
            const menuOption = [{ Id: c.ACT_TAKE_APPOINTMENT, label: strings('contract.contract_detail.fn_appointment') }];

            // Cho phep cap nhat tong tien
            // menuOption.push({ Id: c.ACT_UPDATE_TOTAL, label: strings('contract.contract_detail.fn_update_amount') });
            menuOption.push({ Id: c.ACT_DOWNLOAD_PDF, label: strings('contract.contract_detail.fn_download_pdf') });

            // Gan action cho right menu
            this.props.navigation.setParams({ options: menuOption });

            // set data
            this.setState({
                info: {
                    ...data,
                    AppointmentDept: data.AppointmentDept ? data.AppointmentDept : strings('contract.contract_detail.nodata'),
                    AppointmentDate: data.AppointmentDate ? data.AppointmentDate : strings('contract.contract_detail.nodata'),
                    AppointmentPhone: data.AppointmentPhone ? data.AppointmentPhone : strings('contract.contract_detail.nodata')
                },
                loadingVisible: false
            });

            return;
        }

        // set data
        this.setState({
            loadingVisible: false
        }, () => {
            if (msg.message == '') return;
            this.refs['popup'].getWrappedInstance().show(msg.message);
        });

    }

    /**
     * Xử lý khi click chọn menu phải
     *
     * @param {*} route
     */
    selectMenu(route) {
        if (route.Id === c.ACT_DOWNLOAD_PDF) {

            if (Platform.OS == 'android') {
                setTimeout(() => {
                    requestPermission("android.permission.WRITE_EXTERNAL_STORAGE").then((result) => {
                        this.processDownloadPDF();
                    }, (result) => {
                        this.refs['popup'].getWrappedInstance().show(strings('dl.dialog.request_rule'));
                    });
                }, 0);
            }
            else {
                this.processDownloadPDF();
            }
            return;
        }

        NavigationService.navigate(route.Id, {
            ...this.state.params,
            RegCode: this.state.info.RegCode,
            RegID: this.state.info.RegID,
            Pop: this.state.info.GroupPoints,
            RegType: 1
        });
    }

    processDownloadPDF() {
        const downloadData = {
            urlDownload: this.props.navigation.getParam('pdfDownloadLink'),
            dataSystemApiToken: this.state.dataSystemApiToken,
            RegId: this.state.info.RegId,
            Contract: this.state.info.Contract
        }
        this.showLoading(true);

        api.downloadFile(downloadData, (isDone, path, err) => {
            this.showLoading(false);
            if (isDone) {
                this.refs['popup'].getWrappedInstance().show(strings('dl.contract.contract_detail.noti.download_done'));
                return;
            }

            this.refs['popup'].getWrappedInstance().show(strings('dl.contract.contract_detail.noti.download_undone'));
        });
    }

    /**
     * An hien loading
     *
     * @param {*} isShow
     */
    showLoading(isShow) {
        this.setState({
            loadingVisible: isShow
        });
    }

    /**
     * Render thong tin thiết bị
     *
     * @param {*} ListDevice
     */
    _renderDevice(ListDevice) {
        const views = [];

        for (i in ListDevice) {
            views.push(
                <RowInfo
                    key={ListDevice[i].Value}
                    label={ListDevice[i].Name}
                    text={ListDevice[i].TotalPrice}
                />
            );
        }

        return views;
    }

    /**
     * Render man hinh chinh
     */
    render() {
        const { info } = this.state;

        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ ios: 70, android: 0 })}
                behavior={(Platform.OS === 'ios') ? "padding" : null}
                style={[ols.container_keyboard]} >

                <ScrollView
                    keyboardDismissMode={'on-drag'}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >

                    <View style={[ols.inner_scrollview, { justifyContent: 'space-between', backgroundColor:'#F8F9FB' }]} >
                        <View style={[{ paddingVertical: 15 }]}>
                            {/*
                                // ---- POP info
                            */}
                            <Text style={moduleStyle.textTitle}>
                                {strings('list_customer_info.detail.info_point_group')}
                            </Text>
                            <View style={[moduleStyle.innerbookport]}>
                                <RowInfo
                                    label={strings('list_customer_info.detail.pop')}
                                    text={info.GroupPoints || ''}
                                />
                            </View>

                            {/*
                                // ---- Customer infomation
                            */}
                            <Text style={[moduleStyle.textTitle, moduleStyle.boxSpace]}>
                                {strings('contract.contract_detail.cus_info')}
                            </Text>
                            <View style={moduleStyle.boxInfo}>
                                <RowInfo
                                    label={strings('contract.contract_detail.status')}
                                    text={info.RegStatus || ''}
                                    textStyle={{ color: info.PaidStatus ? '#83d300' : '#ff5050' }}
                                />

                                <RowInfo
                                    label={strings('contract.contract_detail.cus_name')}
                                    text={info.FullName}
                                />

                                <RowInfo
                                    label={strings('contract.contract_detail.contract_no')}
                                    text={info.Contract}
                                />

                                <RowInfo
                                    label={strings('contract.contract_detail.cus_phone')}
                                    text={info.Phone1}
                                />

                                <RowInfo
                                    label={strings('contract.contract_detail.address')}
                                    text={info.Address}
                                />

                                <RowInfo
                                    label={strings('contract.contract_detail.appointmentDept')}
                                    text={info.AppointmentDept}
                                />

                                <RowInfo
                                    label={strings('contract.contract_detail.appointmentDate')}
                                    text={info.AppointmentDate}
                                />

                                <RowInfo
                                    label={strings('contract.contract_detail.appointmentPhone')}
                                    text={info.AppointmentPhone}
                                />
                            </View>

                            {
                                // ----
                            }
                            <Text style={[moduleStyle.textTitle, moduleStyle.boxSpace]}>
                                {strings('contract.contract_detail.service_list')}
                            </Text>
                            <View style={[moduleStyle.boxInfo, styles.boxFooter]}>
                                <RowInfo
                                    label={strings('contract.contract_detail.internet')}
                                    text={info.InternetTotal}
                                />

                                {
                                    info
                                    && info.ListDevice
                                    && info.ListDevice.length > 0
                                    ?
                                        <View style={styles.lineMid} />
                                    : null
                                }

                                {this._renderDevice(info.ListDevice)}

                                {
                                    info
                                    && info.ListStaticIP
                                    && info.ListStaticIP.length > 0
                                    ?
                                        <View>
                                            <View style={styles.lineMid} />
                                            <RowInfo
                                                label={strings("list_customer_info.detail.IpAddress")}
                                                text={
                                                    info.ListStaticIP[0].Total
                                                        ? info.ListStaticIP[0].Total
                                                        : 0
                                                }
                                            />
                                        </View>
                                    : null
                                }

                                <View style={styles.lineMid} />

                                <RowInfo
                                    // style={{ borderTopColor: '#9eceff', borderTopWidth: 2, paddingTop: 9, marginTop: 9 }}
                                    label={strings('contract.contract_detail.connection_fee')}
                                    text={info.ConnectionFee}
                                />

                                <RowInfo
                                    label={strings('contract.contract_detail.deposit_fee')}
                                    text={info.DepositFee}
                                />

                                <RowInfo
                                    label={strings('contract.contract_detail.vat')}
                                    text={info.VAT}
                                />

                                <RowInfo
                                    label={strings('contract.contract_detail.type_payment')}
                                    text={info.PaymentMethodPerMonthName}
                                />
                            </View>
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>{strings('contract.contract_detail.total')}</Text>
                                <Text style={styles.footerValue}>{info.Total}</Text>
                            </View>

                            {
                                // ---- PROMOTION
                            }
                            {
                                info && info.PromotionName &&
                                <View>
                                    <Text style={[moduleStyle.textTitle, moduleStyle.boxSpace]}>
                                        {strings('contract.contract_detail.promotion')}
                                    </Text>
                                    <SearchPickerCLKMItem
                                        Name={info.PromotionName}
                                        Description={info.PromotionDescription}
                                        style={{backgroundColor:'#FFF'}}
                                    />
                                </View>
                            }

                            {
                                // ---- GIFT
                            }
                            {
								info && info.ListGift && info.ListGift.length > 0 &&

								<View>
									<View style={[styles.titleBox]}>
										<Text style={styles.titleLeft}>
											{strings("list_customer_info.detail.gift")}
										</Text>
									</View>

									<View style={[{ justifyContent: 'center', alignItems:'center', borderWidth: 1,  borderColor: '#0b76ff', borderRadius: 5, marginBottom: 12,}]}>
										<Text style={[{textAlign: 'center', paddingHorizontal: 10, paddingVertical: 10, color: '#0b76ff', fontSize: 16, marginVertical: 5, fontWeight: 'bold'}]}>
											{ info
												? info.ListGift[0].Name
												: null }
										</Text>
									</View>
								</View>
							}
                        </View>

                        {
                            // ---- BTN
                        }
                        <View>
                            {
                                !info.PaidStatus ?
                                    <View style={moduleStyle.buttonContainer}>
                                        <ButtonElement
                                            title={strings('contract.contract_detail.btnPayment')}
                                            onPress={() => {
                                                NavigationService.navigate('ContractInvoiceDetail', this.state.params);
                                            }}
                                        />
                                    </View>
                                    : null
                            }
                        </View>
                    </View>
                </ScrollView>

                <PopupWarning ref="popup" />
                <TechLoading visible={this.state.loadingVisible} />
            </KeyboardAvoidingView>
        );
    }
}

export default ContractDetail;


const styles = StyleSheet.create({
    footer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 40,
        maxHeight: 40,
        backgroundColor: 'rgba(158, 201, 255, 0.3)',
        borderColor: '#9ec9ff',
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
        color: '#323232',
        fontSize: 14,
        fontWeight: '500'
    },
    footerValue: {
        color: '#0b76ff',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'right'
    },
    clkmBox: {
        paddingVertical: 8
    },
    clkmText: {
        color: '#0b76ff',
        fontSize: 14,
        textAlign: 'center'
    },
    buttonContainer: {
        marginBottom: 24,
    },
    lineMid: {
        borderTopWidth:1, borderTopColor:'#9EC9FF',
        marginBottom: 6, marginTop: 6,
    },
    titleBox: {
        flexDirection:'row',
        marginTop: 0, marginBottom: 8,
    },
    titleLeft: {
        flex:1,
        fontSize:14, fontWeight:'500', color:'#444444',
    },
    titleRight: {
        flex:1,
        fontSize:14, fontWeight:'500', color:'#0B76FF',
    },
});
