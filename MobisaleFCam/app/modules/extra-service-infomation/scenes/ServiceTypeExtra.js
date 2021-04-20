/**
 * Màn hình service type bán thêm
 * Create: AnhPT24 (Bán thêm equipment)
 * Date created: 2019
 * Modifed: ThuanDD3 (Bán thêm ip - internet Upgrade)
 * Date modifed: 07/2020
 */

import React, {Component} from "react";
import {View, Text, ScrollView, Platform, Image, Keyboard, Animated} from "react-native";
import {strings} from "locales/i18n";
import {TouchableOpacity} from "react-native-gesture-handler";
import {HeaderBackButton} from "react-navigation";

// API
import * as api from "../api";

// REDUX
import {connect} from "react-redux";

// REDUX ACTION
import {actions} from "..";

const {nextStep, updateInfoExtraServiceForm} = actions;

// LIB CUSTOM
import ModalPicker from 'app-libs/components/ModalPicker';
import ModalPickerSimpleTruncate from "app-libs/components/ModalPickerSimpleTruncate";
import ModalPickerCustom from "app-libs/components/ModalPickerCustom";
import InputO from "app-libs/components/input/InputO";
import ButtonO from 'app-libs/components/input/ButtonO';
import InputArea from "app-libs/components/input/InputArea";
import NavigationService from "app-libs/helpers/NavigationService";
import PopupWarning from "app-libs/components/PopupWarning";
import TechLoading from "app-libs/components/TechLoading";
import FormIpList from '../components/FormIpList';
// import FormDeviceList from '../components/FormDeviceList';
import FormDeviceList_2 from '../components/FormDeviceList-2';
import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';
import PickerCLKMInput from 'app-libs/components/input/PickerCLKMInput';

// HELPER
import {convertWhiteSpaceNum, removeAllchar_type_02} from "app-libs/helpers/regex";
import {EXTRA_SER_ID} from '../../../config/constants';
import {isReturnOPT, discountDefault, internetUpgradeDefault, staticIPDefault, deviceReturnDefault} from "../constants";
import mapServiceType from '../helpers/mapServiceType';

// STYLE
import styles from "../../customer-info/styles";
import cusInfStyle from "../styles";
import ols from "../../../styles/Ola-style";


class ServiceTypeExtra extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: (
                <HeaderBackButton
                    onPress={() => NavigationService.navigate("ContractListExtraService")}
                    tintColor="#fff"
                />
            )
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            dataTemp: {
                step: 2,
                nextScreen: "ciAmountExtra"
            },
            data: props && props.formData,
            data_inu: props && mapServiceType(props.formData),

            // parse api value
            optDiscount: [],
            listSer: [],
            listDeviceUpgrade: [],

            // canNotAddEqui: kiểm tra xem đucợ phép thêm mới equiment hay không
            canNotAddEqui: false,
            loadingVisible: false,
            showButton: true,
            fadeD: new Animated.Value(0),
            fadeT: new Animated.Value(0),
            fadeO: new Animated.Value(1),
        };
    }

    /**
     *
     */
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    /**
     *
     */
    componentDidMount() {
        this._mounted = true;

        //
        this.props.navigation.addListener("willBlur", () => {

            const {data_inu} = this.state;

            // Dành cho version cũ, cho bán Euipment && Ip
            if (data_inu.ServiceType && data_inu.ServiceType[0].Id !== 5) {
                this.props.updateInfoExtraServiceForm(this.state.data);
            }

            if (data_inu.ServiceType && data_inu.ServiceType[0].Id === 5) {

            }
        });

        //
        this.props.navigation.addListener("willFocus", () => {

            const {data_inu} = this.state;

            // Equipment & Ip
            if (data_inu.ServiceType && data_inu.ServiceType[0].Id !== 5) {
                // Tự động thêm isReturn MAC = true;
                if (!this.props.formData.ListDevice) {
                    this._onChangeSelect({value: true}, 'isReturn')
                }

                setTimeout(() => {
                    this.setState({
                        data: this.props.formData,
                        canNotAddEqui: this.props.formData
                            && this.props.formData.ListDevice
                            && this.props.formData.ListDevice.ListEquipment
                            && this.props.formData.ListDevice.ListEquipment.length === 4
                    });
                }, 300);
            }

            // Internet upgrade
            if (data_inu.ServiceType && data_inu.ServiceType[0].Id === 5) {
                // data bookport
                if (this.props.formData.GroupPoints) {
                    this.setState({
                        data_inu: {
                            ...data_inu,
                            GroupPoints: this.props.formData.GroupPoints
                        },
                    });
                }

                // Tự động sửa format old month money
                if (this.props.formData && this.props.formData.InternetUpgrade) {
                    this._convertMoney('OldMonthMoney');
                }
            }
        });

        //
        this._handleLoadSerType();
    }

    /**
     *
     */
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this._mounted = false
    }

    /**************************************************
     * FUNCTION: keyboardDown
     * @param
     * @private
     ***************************************************/
    _keyboardDidShow() {
        // Nếu keyboard khác thì ko xài
        if (this.refs['txtoldMoney']) return;

        this._fadeDown();
        if (this.state.showButton) {
            this.setState({...this.state, showButton: false});
        }
    }

    /**************************************************
     * FUNCTION: keyboardUp
     * @param
     * @private
     ***************************************************/
    _keyboardDidHide() {
        // Nếu keyboard khác thì ko xài
        if (this.refs['txtoldMoney']) return;

        this._fadeUp();
        this.setState({...this.state, showButton: true});
    }

    /**************************************************
     * FUNCTION: Animation Button
     * @param
     * @private
     ***************************************************/
    _fadeDown() {
        Animated.parallel([
            Animated.timing(this.state.fadeD, {toValue: -100, duration: 400,}),
            Animated.timing(this.state.fadeT, {toValue: Platform.OS === 'ios' ? 200 : 100, duration: 400,}),
            Animated.timing(this.state.fadeO, {toValue: 0, duration: 400,}),
        ]).start();
    }

    _fadeUp() {
        Animated.parallel([
            Animated.timing(this.state.fadeD, {toValue: 0, duration: 300,}),
            Animated.timing(this.state.fadeT, {toValue: 0, duration: 300,}),
            Animated.timing(this.state.fadeO, {toValue: 1, duration: 300,}),
        ]).start();
    }

    /**************************************************
     * FUNCTION: Focus and Blur Text Input
     * @param
     * @private
     ***************************************************/
    _onFocus() {
        this.setState({...this.state, showButton: false});
    }

    _onBlur() {
        this.setState({...this.state, showButton: true});
    }


    /**
     *
     */
    _handleLoadSerType() {
        //
        this._loading(true);
        //
        api.getServiceTypeList(2, (success, result, msg) => {

            if (success) {

                setTimeout(() => {
                    this.setState({
                        ...this.state,
                        listSer: result
                    }, () => {
                        // Load Equipment
                        this._handleLoadDeviceUpgrade();
                    });
                }, 50);

            } else {
                this._error(msg);

                // Load Equipment
                this._handleLoadDeviceUpgrade();
            }
        });
    }

    /**
     * load danh sách thiết bị bán thêm
     */
    _handleLoadDeviceUpgrade = () => {

        api.getDeviceUpgradeList({}, (success, result, msg) => {

            if (success) {
                let options = [];

                result.map(item => {
                    const oneOptions = {
                        label: item.Name,
                        value: item
                    };
                    options.push(oneOptions);
                });

                setTimeout(() => {
                    this.setState({
                        listDeviceUpgrade: options
                    }, () => {
                        // Load discount
                        this._handleLoadDiscountOption();
                    });
                }, 50);

            } else {
                this._error(msg);

                // Load discount
                this._handleLoadDiscountOption();
            }
        });
    };

    /**
     * Load discount option để hiển thị selectbox discount
     */
    _handleLoadDiscountOption = () => {

        api.getDeviceUpgradeDiscountList({}, (success, result, msg) => {
            this._loading(false);

            if (success) {
                let options = [];

                result.map(item => {
                    const oneOptions = {
                        label: item.Name,
                        value: item.Id
                    };
                    options.push(oneOptions);
                });

                // Tự thêm vào 1 picker equipment và discount = 0 nếu data không có
                if ((this.state.data.ListDevice && !this.state.data.ListDevice.ListEquipment) || !this.state.data.ListDevice) {
                    setTimeout(() => {
                        this._onChangeEquiment({value: options.length > 0 ? options[0].value : null}, 'Discount')
                    }, 300);
                }

                setTimeout(() => {
                    this.setState({
                        optDiscount: options
                    });
                }, 50);

            } else {
                this._error(msg);
            }
        });
    };

    /**
     * Bắt sự kiện thay đổi text input, nếu thay đổi trường ngoài cùng của state data thì dùng case default
     */
    _onChangeText = (key, value) => {
        const {data, data_inu} = this.state;

        switch (key) {
            case "MAC":
                this.setState({
                    data: {
                        ...data,
                        ListDevice: {
                            ...data.ListDevice,
                            DeviceReturn: {
                                ...data.ListDevice.DeviceReturn,
                                MAC: value
                            }
                        }
                    }
                });
                break;

            case "oldMoney":
                this.setState({
                    data_inu: {
                        ...data_inu,
                        InternetUpgrade: {
                            ...data_inu.InternetUpgrade,
                            OldMonthMoney: value ? value : ''
                        }
                    }
                });
                break;

                //V2.8-add note - thuantv-06/10/2020
            case "NoteAddress_inu":
                this.setState({
                    data_inu: {
                        ...data_inu,
                        NoteAddress : value? value :''
                    }
                });
                break;

            default:
                this.setState({
                    data: {
                        ...data,
                        [key]: value
                    }
                });
                break;
        }

        // Set validate
        this.refs["txt" + key].setValid(value.trim() !== "");
    };

    /**
     * bắt sự kiện thay đổi selectbox
     */
    _onChangeSelect = (option, key) => {
        const value = option.value;
        const {data, data_inu} = this.state;

        switch (key) {
            case "isReturn":
                // Nếu chọn return thiết bị cũ thì get ra địa chỉ mac của thiết bị và update lại data
                if (value) {
                    const payload = {ObjId: data.ObjId};

                    // loading
                    this._loading(true);

                    // call api
                    api.getMACEquiqment(payload, (success, result, msg) => {


                        setTimeout(() => {
                            if (success) {
                                this._updateIsReturnOldEquiment(value, result && result.length > 0 ? result[0].CallerID : "");

                            } else {
                                this._error(msg);

                                // set timeout để tránh bị xung đột setState dẫn tới treo loading
                                this._updateIsReturnOldEquiment(value);
                            }
                        }, 500);

                    });
                } else {
                    setTimeout(() => {
                        this._updateIsReturnOldEquiment(false);
                    }, 500);

                }
                break;

            // Set Old eqipments
            case 'inu':
                if (data_inu.InternetUpgrade.EquipmentReturn === value) return;

                // Set Old euipment
                this.setState({
                    data_inu: {
                        ...this.state.data_inu,
                        InternetUpgrade: {
                            ...this.state.data_inu.InternetUpgrade,
                            EquipmentReturn: value
                        }
                    }
                });

                break

            default:
                break;
        }
    };

    /**
     * bắt sự kiện thay đỏi các select box phần Equipments
     */
    _onChangeEquiment = (option, key, index = 0) => {
        const value = option.value;

        switch (key) {
            case "ListEquipment":
                if (value && value.Name) {
                    this.refs["optListDevice" + index].setValid(true);
                }

                // update lại dữ liệu, hard code thêm Number = 1 cho body đẩy lên API
                this._handleUpdateEquipment({
                    ...value,
                    Number: 1
                }, index);
                break;

            case "Discount":
                if (value) {
                    this.refs["optDiscount" + index].setValid(true);
                }

                this._handleUpdateEquipment({
                    Discount: value
                }, index);
                break;

            default:
                break;
        }
    };

    /**
     * set state data.DeviceReturnDiscount
     */
    _updateIsReturnOldEquiment = (isReturn, mac = "") => {
        const {data} = this.state;

        this.setState({
            ...this.state,
            loadingVisible: false,
            data: {
                ...data,
                ListDevice: {
                    ...data.ListDevice,
                    DeviceReturn: {
                        isReturn: isReturn,
                        MAC: mac
                    }
                }
            }
        });
    };

    /**
     * setState lại data khi thay đổi equipment
     */
    _handleUpdateEquipment = async (dataUpdate, position) => {
        //clone dữ liệu state
        let dataStateClone = {
            ...this.state.data
        };

        if (dataStateClone.ListDevice &&
            dataStateClone.ListDevice.ListEquipment &&
            dataStateClone.ListDevice.ListEquipment.length > 0) {

            //map lại dữ liệu theo vị trí equiments
            dataStateClone.ListDevice.ListEquipment[position] = {
                ...dataStateClone.ListDevice.ListEquipment[position],
                ...dataUpdate
            };
        } else {
            // nếu state "data" không có ListEquipment thì tạo mới key: value
            dataStateClone = await {
                ...dataStateClone,
                ListDevice: {
                    ...dataStateClone.ListDevice,
                    ListEquipment: [
                        {
                            ...dataUpdate
                        }
                    ]
                }
            };
        }

        this.setState({
            data: dataStateClone
        });
    };

    /**
     * xử lí khi nhấn button Add equiment
     */
    _handleAddEquipment = () => {
        let dataClone = {...this.state.data};

        dataClone.ListDevice.ListEquipment.push({
            Discount: this.state.optDiscount && this.state.optDiscount.length > 0 ? this.state.optDiscount[0].value : 0
        });

        this.setState({
            data: dataClone,
            canNotAddEqui: dataClone && dataClone.ListDevice && dataClone.ListDevice.ListEquipment && dataClone.ListDevice.ListEquipment.length === 4
        });
    };

    /**
     * xử lí khi nhấn button delete equiment
     */
    _handleRemoveEquipment = async position => {

        let dataClone = {...this.state.data};

        // Loading
        this._loading(true);

        // Remove Item
        dataClone.ListDevice.ListEquipment = await dataClone.ListDevice.ListEquipment.filter(
            (e, index) => index !== position
        );

        // Add data Again
        setTimeout(() => {
            this.setState({
                ...this.state,
                data: {
                    ...this.state.data,
                    ListDevice: {
                        ...this.state.data.ListDevice,
                        ListEquipment: null,
                    }
                },
                canNotAddEqui: dataClone && dataClone.ListDevice && dataClone.ListDevice.ListEquipment && dataClone.ListDevice.ListEquipment.length === 4

            }, () => {
                this.setState({
                    ...this.state,
                    loadingVisible: false,
                    data: {
                        ...this.state.data,
                        ListDevice: {
                            ...this.state.data.ListDevice,
                            ListEquipment: dataClone.ListDevice.ListEquipment,
                        }
                    }
                });
            });
        }, 300);
    };

    /**
     *
     * @param {*} name
     * @param {*} selectItem
     */
    _onChangePickerIPValue(name, selectItem) {

        const {data, data_inu} = this.state;

        // FOR STATIC IP SELECT DETAIL
        if (data_inu[name] == selectItem) {
            return;
        }

        //
        data_inu[name] = selectItem;

        //
        this.setState({
            ...this.state,
            data_inu: data_inu,
        });

    }

    /**
     *
     * @param {*} name
     * @param {*} selectItem
     */
    _onChangeServiesType(name, selectItem) {

        const {data, data_inu} = this.state;

        if (name === 'ServiceType') {

            // Force stop if already choose
            if (data_inu[name][0].Id === selectItem.Id) {
                return;
            }

            // If choose internet upgrade
            if (data.LocalTypeKind === 2 && selectItem.Id === 5) {
                // Force change to Sell Equipment if FTTH: 2
                data_inu[name][0] = EXTRA_SER_ID;

                // Show error
                this._error({message: strings('dl.extra_service_info.service_type.err.notUpdate')});

            } else if ((data.WardId === null || data.WardId === undefined || data.WardId === '') && selectItem.Id === 5) {
                // Force change to Sell Equipment if no wardID
                data_inu[name][0] = EXTRA_SER_ID;

                // Show error
                this._error({message: strings('dl.extra_service_info.service_type.err.notUpdate2')});
            } else {
                //
                data_inu[name][0] = selectItem;
            }

            // Reset all
            setTimeout(() => {

                this.setState({
                    ...this.state,
                    data: {
                        ...data,
                        ListDevice: {
                            ...this.state.data.ListDevice,
                            ListEquipment: []
                        },
                        ListStaticIP: [],
                    },
                    data_inu: {
                        ...data_inu,
                        GroupPoints: "",
                        InternetUpgrade: internetUpgradeDefault,
                        ConnectionFee: null,
                        LocalType: null,
                        Promotion: null,
                        Device: {
                            List: [],
                            DeviceReturn: deviceReturnDefault,
                            DeviceTotal: 0
                        },
                        StaticIP: staticIPDefault,
                    },
                })
            }, 100);
        }
    }

    /**
     * Cho Internet Upgrade - Change Local Type
     * @param {*} selectItem
     */
    _onChangeLocalType(selectItem) {

        if (selectItem == this.state.data_inu.LocalType) {
            return;
        }

        this.setState({
            data_inu: {
                ...this.state.data_inu,
                LocalType: selectItem,
                Promotion: null,
                Device: {
                    List: [],
                    DeviceReturn: deviceReturnDefault,
                    DeviceTotal: 0
                }
            }
        });
    }

    /**
     * Cho Internet Upgrade - Change Promotion, Connection Fee, Equipment Device
     * @param {*} name
     * @param {*} selectItem
     */
    _onChangePicker_INU_Value(name, selectItem) {

        const {data_inu} = this.state;

        //
        if (data_inu[name] == selectItem) {
            return;
        }

        //
        if (name === 'Promotion') {
            data_inu['Device'] = {
                List: [],
                DeviceReturn: deviceReturnDefault,
                DeviceTotal: 0
            };
        }

        //
        data_inu[name] = selectItem;

        //
        setTimeout(() => {
            this.setState({
                data_inu: data_inu,
            });
        }, 50);
    }

    /**
     * Cho Internet Upgrade - Map value Return
     */
    _handleMapInternetUpgradeReturn = (val) => {

        const EquipmentReturn =
            val && (val.EquipmentReturn == false || val.EquipmentReturn == true)
                ?
                isReturnOPT.find(
                    e => e.value === val.EquipmentReturn
                )
                :
                isReturnOPT[0];

        return EquipmentReturn;
    }

    /**
     * Cho Internet Upgrade - Bookport
     */
    _handleBookport = () => {
        this._loading(true);
        const {data, data_inu} = this.state;

        const myData = {
            ...this.props.formData,
            FullAddress: this.props.formData.Address
        };

        // Cập nhật data vào store sale-new, để bookport dùng chung
        this.props.updateInfoExtraServiceForm(myData, () => {
            this._loading(false);

            setTimeout(() => {
                NavigationService.navigate("ExSerBookport");
            }, 500);
        });
    }

    /**
     *
     * @param {*} key
     */
    _convertMoney(key) {
        let {data_inu} = this.state;
        let {OldMonthMoney} = data_inu.InternetUpgrade

        if (OldMonthMoney !== '') {

            // trim all char, ',' v.v..
            let amount = removeAllchar_type_02(OldMonthMoney);
            let amountConvert;

            // more than '.',
            // ex: 100.000.000 false
            // ex: 100,000.000 true
            if (amount.split('.').length - 1 <= 1) {
                // convert money
                amountConvert = this._formatMoney(amount);

            } else {
                // error type money
                this._error({message: strings('dl.extra_service_info.service_type.err.OldMonthMoneyWrong')});

                // set value
                amountConvert = this._formatMoney(0);
            }

            // set value
            data_inu.InternetUpgrade[key] = amountConvert;

        } else {

            // filed money === empty, auto field true type
            this._onChangeText("oldMoney", this._formatMoney(0));
            return;
        }

        // set value "string", don't forget to convert to float
        this.setState(data_inu);
        return;
    }

    /**
     *
     * @param {*} amount
     * @param {*} decimalCount
     * @param {*} decimal
     * @param {*} thousands
     */
    _formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            if (amount == 0) {
                return amount.toString();
            }

            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign
                + (j ? i.substr(0, j) + thousands : '')
                + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands)
                + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");

        } catch (e) {
            console.log(e);
            this._error({message: strings('dl.extra_service_info.service_type.err.OldMonthMoneyWrong')});
        }
    };

    /**
     * Validate form Eqipment & IP
     */
    _isValidData = () => {
        const {data, data_inu} = this.state;
        let errorList = [];

        // Validate IP
        if (data_inu.ServiceType[0].Id !== 4) {

            //
            if (data_inu.StaticIP.ListStaticIP == null || data_inu.StaticIP.ListStaticIP.length === 0) {

                this.refs['IPType'].setValid(false);

                errorList.push({
                    name: 'IP',
                    msg: strings('dl.extra_service_info.service_type.err.Ip')
                });
            } else {
                this.refs['IPType'].setValid(true);
            }

        } else {

            // Validate Equiments
            if (data && data.ListDevice && data.ListDevice.ListEquipment && data.ListDevice.ListEquipment.length > 0) {
                data.ListDevice.ListEquipment.forEach((equi, index) => {

                    //validate equiment
                    if (equi.Name) {
                        this.refs["optListDevice" + index].setValid(true);
                    } else {
                        this.refs["optListDevice" + index].setValid(false);
                        errorList.push({
                            name: "",
                            msg: strings("dl.extra_service_info.service_type.err.NewEquipment")
                        });
                    }
                    //validate discount
                    if (equi.Discount >= 0) {
                        this.refs["optDiscount" + index].setValid(true);

                    } else {

                        this.refs["optDiscount" + index].setValid(false);
                        errorList.push({
                            name: "",
                            msg: strings("dl.extra_service_info.service_type.err.Discount")
                        });
                    }
                });
            } else {
                this.refs["optListDevice0"].setValid(false);
                errorList.push({
                    name: "",
                    msg: strings("dl.extra_service_info.service_type.err.NewEquipment")
                });
            }

            // validate NOTE
            if (data && data.NoteAddress && data.NoteAddress.trim() !== "") {
                this.refs["txtNoteAddress"].setValid(true);
            } else {
                this.refs["txtNoteAddress"].setValid(false);
                errorList.push({
                    name: "",
                    msg: strings("dl.extra_service_info.service_type.err.Note")
                });
            }
        }

        // error list
        if (errorList.length == 0) {
            return true;
        }

        this.refs["popup"].getWrappedInstance().show(errorList[0].msg);
        return false;
    };

    /**
     * Validate form Internet Upgrade
     */
    _isValidDataInu = () => {
        const {data_inu} = this.state;
        let errorList = [];

        // Check Local Type
        if (data_inu.LocalType == null) {
            this.refs['LocalType'].setValid(false);

            errorList.push({
                name: 'LocalType',
                msg: strings('dl.extra_service_info.service_type.err.LocalType')
            });

        } else {
            this.refs['LocalType'].setValid(true);
        }

        // Check CLKM
        if (data_inu.Promotion == null) {
            this.refs['Promotion'].setValid(false);

            errorList.push({
                name: 'Promotion',
                msg: strings('dl.extra_service_info.service_type.err.Promotion')
            });

        } else {
            this.refs['Promotion'].setValid(true);
        }

        // Check Connection fee
        if (data_inu.ConnectionFee == null) {
            this.refs['ConnectionFee'].setValid(false);

            errorList.push({
                name: 'ConnectionFee',
                msg: strings('dl.extra_service_info.service_type.err.ConnectionFee')
            });

        } else {
            this.refs['ConnectionFee'].setValid(true);
        }

        // Check Device List
        if (data_inu && data_inu.Device && data_inu.Device.List && data_inu.Device.List.length > 0) {

            data_inu.Device.List.forEach((item, index) => {
                if (index > 0) {
                    if (!item.EquipID) {
                        this.refs['formListDevices'].setValid(index);

                        errorList.push({
                            name: 'formListDevices',
                            msg: strings('dl.extra_service_info.service_type.err.NewEquipment')
                        });
                    } else {
                        this.refs['formListDevices'].setValid(index);
                    }
                }
            });

        } else {
            this.refs['formListDevices'].setValid();
        }

        // Check old money
        if (data_inu.InternetUpgrade.OldMonthMoney === "" || (convertWhiteSpaceNum(data_inu.InternetUpgrade.OldMonthMoney) === "")) {
            this.refs['txtoldMoney'].setValid(false);

            errorList.push({
                name: 'txtoldMoney',
                msg: strings('dl.extra_service_info.service_type.err.OldMonthMoney')
            });

        } else {
            this.refs['txtoldMoney'].setValid(true);
        }

        // V2.8: Check note-txtNoteInternetUpgrade
        if (data_inu && data_inu.NoteAddress && data_inu.NoteAddress.trim() !== "") {
            this.refs["txtNoteAddress_inu"].setValid(true);
        } else {
            this.refs["txtNoteAddress_inu"].setValid(false);
            errorList.push({
                name: "txtNoteAddress_inu",
                msg: strings('dl.extra_service_info.service_type.err.Note')
            });
        }

        // Check bookport
        if (!data_inu.GroupPoints) {
            if (data_inu.GroupPoints === null || data_inu.GroupPoints === "") {
                this.refs['btnBookport'].setValid(false);

                errorList.push({
                    name: 'btnBookport',
                    msg: strings('dl.extra_service_info.service_type.err.Bookport')
                });
            } else {
                this.refs['btnBookport'].setValid(true);
            }
        }

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }

    /**
     * Function gọi khi bấm button NEXT
     */
    _onNextStep = () => {

        // Validate
        if (!this._isValidData()) {
            return;
        }
        //
        const {data, dataTemp, data_inu} = this.state;
        //
        this._loading(true);

        // trim dữ liệu trước khi submit lên store
        const mapData = {
            ...data,
            NoteAddress: data.NoteAddress.trim(),
            ListStaticIP: data_inu.StaticIP && data_inu.StaticIP.ListStaticIP ? data_inu.StaticIP.ListStaticIP : [],
            ListServiceType: data_inu.ServiceType
        };

        this.setState({
                data: mapData
            },
            () => {
                this.props.updateInfoExtraServiceForm(mapData, () => {
                    setTimeout(() => {
                        this._loading(false);
                        this.props.nextStep(dataTemp);
                        NavigationService.navigate(dataTemp.nextScreen);
                    }, 0);
                });
            }
        );
    };

    /**
     *
     * @param {*} type
     */
    _onNextStep_inu = () => {

        //Validate
        if (!this._isValidDataInu()) {
            return;
        }
        //
        this._loading(true);

        //
        const {data, data_inu, dataTemp} = this.state;
        const {golbalData} = this.props;
        let RegistrationObj = {};

        //
        RegistrationObj.SaleId = this.props.saleId;
        // List Service Type
        RegistrationObj.ListServiceType = data_inu.ServiceType;
        // List Local Type
        RegistrationObj.LocalType = data_inu.LocalType.Id;
        RegistrationObj.LocalTypeName = data_inu.LocalType.Name;
        // Promotion
        RegistrationObj.PromotionId = data_inu.Promotion.Id;
        RegistrationObj.PromotionName = data_inu.Promotion.Name;
        RegistrationObj.PromotionDescription = data_inu.Promotion.Description;
        RegistrationObj.MonthOfPrepaid = data_inu.Promotion.MonthOfPrepaid;
        // Connection Fee
        RegistrationObj.ConnectionFee = data_inu.ConnectionFee.Id;
        // Old Money
        RegistrationObj.InternetUpgrade = {
            EquipmentReturn: data_inu.InternetUpgrade.EquipmentReturn,
            OldMonthMoney: parseFloat(removeAllchar_type_02(data_inu.InternetUpgrade.OldMonthMoney)),
        };
        //V2.8-add notes-thuantv-06/10/2020
        RegistrationObj.NoteAddress = data_inu.NoteAddress.trim();
        // List Device
        RegistrationObj.ListDevice = {
            ListEquipment: data_inu.Device.List,
            DeviceReturn: data_inu.Device.DeviceReturn,
        };

        // List Static IP
        ListStaticIP = [];

        // dispatch redux
        this.props.updateInfoExtraServiceForm(RegistrationObj, () => {
            // Chuyen trang
            setTimeout(() => {
                //
                this._loading(false);

                //
                this.props.nextStep(dataTemp);
                //
                NavigationService.navigate(dataTemp.nextScreen);
            }, 0);
        });
    }

    /**
     *
     * @param {*} type
     */
    _renderServices = (type) => {
        switch (type) {
            case 3:
                return this._renderIP();
                break;

            case 4: //4
                return this._renderEquip();
                break;

            case 5: //5
                return this._renderInternetUpgrade();
                break;

            default:
                break;
        }
    }

    /**
     *
     */
    _renderInternetUpgrade() {
        const {data, data_inu} = this.state;

        return (
            <View style={[styles.container]}>
                <Text style={[styles.headline, ols.cl444, ols.fs14, ols.fw500]}>
                    {strings("extra_service.extra_service_info.type_of_service.infomation.block_title")}
                </Text>

                {/** Local Type */}
                <PickerSearchInput
                    ref="LocalType"
                    label={strings('extra_service.extra_service_info.type_of_service.infomation.lb_newPackage')}
                    placeholder={strings('extra_service.extra_service_info.type_of_service.infomation.pl_newPackage')}
                    filterText={strings('extra_service.extra_service_info.type_of_service.infomation.ft_newPackage')}
                    getOptionData={api.loadLocalTypeList}
                    params={
                        {
                            Username: this.props.userName,
                            Kind: this.props.networkType
                        }
                    }
                    allowRefresh={false}
                    value={data_inu.LocalType}
                    onChange={this._onChangeLocalType.bind(this)}
                />

                {/** Promotion */}
                <PickerCLKMInput
                    ref="Promotion"
                    label={strings('extra_service.extra_service_info.type_of_service.infomation.lb_newPromotion')}
                    placeholder={strings('customer_info.service_type.form.promotion_placeholder')}
                    filterText={strings('customer_info.service_type.form.promotion_filterText')}
                    seletedText={strings('customer_info.service_type.form.promotion_seletedText')}
                    getOptionData={api.loadPromotionList}
                    params={
                        {
                            Username: this.props.userName,
                            LocationID: this.props.locationId,
                            LocalTypeID: data_inu.LocalType ? data_inu.LocalType.Id : null
                        }
                    }
                    allowRefresh={false}
                    value={data_inu.Promotion}
                    onChange={(selectedItem) => this._onChangePicker_INU_Value('Promotion', selectedItem)}
                />

                {/** Connection Fee */}
                <PickerSearchInput
                    ref="ConnectionFee"
                    label={strings('customer_info.service_type.form.connectionFee_label')}
                    placeholder={strings('customer_info.service_type.form.connectionFee_placeholder')}
                    filterText={strings('customer_info.service_type.form.connectionFee_filterText')}
                    getOptionData={api.loadConnectionFeeList}
                    params={{LocationId: this.props.locationId}}
                    allowRefresh={false}
                    value={data_inu.ConnectionFee}
                    onChange={(selectedItem) => this._onChangePicker_INU_Value('ConnectionFee', selectedItem)}
                />

                {/** Old Month money */}
                <InputO
                    ref="txtoldMoney"
                    keyboardType={'numeric'}
                    label={strings('extra_service.extra_service_info.type_of_service.infomation.lb_oldMoney')}
                    placeholderTextColor={'#444444'}
                    placeholder={strings('extra_service.extra_service_info.type_of_service.infomation.pl_oldMoney')}
                    textAlign={'right'}
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    style={[styles.textInput, ols.fw500, ols.txtR]}
                    value={data_inu.InternetUpgrade.OldMonthMoney.toString()}
                    editable={true}
                    onChangeText={text => this._onChangeText("oldMoney", text)}
                    onBlur={() => this._convertMoney('OldMonthMoney')}
                />

                {/** Headline */}
                <Text style={[styles.headline, ols.cl444, ols.fs14, ols.fw500]}>
                    {strings('customer_info.service_type.device')}
                </Text>

                {/** Equipments choose & list */}
                <FormDeviceList_2
                    ref={'formListDevices'}
                    getOptionData={api.getDeviceUpgradeListManual}
                    getOptionDataDiscount={this.state.optDiscount}
                    params={{}}
                    warning={this._error.bind(this)}
                    allowRefresh={false}
                    value={data_inu.Device}
                    onChange={(selectedItem) => this._onChangePicker_INU_Value('Device', selectedItem)}
                />

                {/** Old equipment */}
                <ModalPickerSimpleTruncate
                    ref="optIsReturn"
                    label={strings("extra_service.extra_service_info.type_of_service.infomation.lb_old_equi")}
                    placeholder={strings("extra_service.extra_service_info.type_of_service.infomation.lb_old_equi")}
                    headerTitle={strings("extra_service.extra_service_info.type_of_service.infomation.lb_old_equi")}
                    options={isReturnOPT}
                    getLabel={item => item.label}
                    onValueChange={
                        (value) => this._onChangeSelect(value, 'inu')
                    }
                    defaultValue={this._handleMapInternetUpgradeReturn(data_inu.InternetUpgrade)}
                />

                {/*..V2.8-Notes..thuantv-05/10/2020..*/}
                <View style={{}}>
                    <InputArea
                        ref="txtNoteAddress_inu"
                        style={[cusInfStyle.textArea]}
                        placeholder={strings("extra_service.extra_service_info.type_of_service.infomation.lb_note")}
                        placeholderTextColor="#9A9A9A"
                        textAlign={"left"}
                        autoCapitalize={"none"}
                        returnKeyType={"done"}
                        maxLength={1000}
                        autoCorrect={false}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={text => this._onChangeText("NoteAddress_inu", text)}
                        onSubmitEditing={Keyboard.dismiss}
                        blurOnSubmit={true}
                        value={data_inu["NoteAddress"]}
                    />
                </View>

                {/** Bookport */}
                {data &&
                (!data.AppointmentDate || data.AppointmentDate === "No data" || data.AppointmentDate === "") &&
                (
                    <View>
                        <Text style={[styles.headline, ols.cl444, ols.fs14, ols.fw500]}>
                            {strings('list_customer_info.detail.info_point_group')}
                        </Text>

                        <ButtonO
                            ref="btnBookport"
                            label={strings('extra_service.extra_service_info.type_of_service.infomation.btn_bookport')}
                            style={{marginBottom: 16}}
                            styleBtn={[ols.btnFullLine]}
                            styleBtnText={[ols.btnTextLine]}
                            value={data_inu.GroupPoints ? data_inu.GroupPoints : null}
                            onPress={() => this._handleBookport()}/>
                    </View>
                )
                }
            </View>
        )
    }

    /**
     * render Equipment form
     */
    _renderEquip() {
        const {data} = this.state;

        // map default value cho OldEquipment
        const oldEquipMapping =
            data && data.ListDevice && data.ListDevice.DeviceReturn &&
            (data.ListDevice.DeviceReturn.isReturn == false || data.ListDevice.DeviceReturn.isReturn == true)
                ? isReturnOPT.find(
                e => e.value === data.ListDevice.DeviceReturn.isReturn
                )
                : isReturnOPT[0];

        return <View>
            {
                /* Information*/
            }
            <Text style={[styles.headline, ols.cl444, ols.fs14, ols.fw500]}>
                {strings("extra_service.extra_service_info.type_of_service.infomation.block_title")}
            </Text>
            <View>
                <ModalPickerSimpleTruncate
                    ref="optIsReturn"
                    label={strings("extra_service.extra_service_info.type_of_service.infomation.lb_old_equi")}
                    placeholder={strings("extra_service.extra_service_info.type_of_service.infomation.lb_old_equi")}
                    headerTitle={strings("extra_service.extra_service_info.type_of_service.infomation.lb_old_equi")}
                    options={isReturnOPT}
                    getLabel={item => item.label}
                    onValueChange={value => {
                        this._onChangeSelect(value, "isReturn");
                    }}
                    defaultValue={oldEquipMapping}
                />
            </View>

            {
                /* MAC */
            }
            {
                data && data.ListDevice && data.ListDevice.DeviceReturn &&
                data.ListDevice.DeviceReturn.isReturn && (
                    <View>
                        <InputO
                            ref="txtMAC"
                            label={strings("extra_service.extra_service_info.type_of_service.infomation.lb_oldMac")}
                            style={[styles.textInput, ols.fw500, ols.txtR]}
                            placeholder={""}
                            placeholderTextColor="#444444"
                            textAlign={"right"}
                            autoCapitalize={"none"}
                            returnKeyType={"done"}
                            autoCorrect={false}
                            value={data.ListDevice.DeviceReturn.MAC}
                            editable={false}
                            onChangeText={text => this._onChangeText("MAC", text)}
                        />
                    </View>
                )
            }

            {
                /* Equipments */
            }
            <Text style={[styles.headline, ols.cl444, ols.fs14, ols.fw500]}>
                {strings("extra_service.extra_service_info.type_of_service.equipments.block_title")}
            </Text>
            {
                data.ListDevice &&
                data.ListDevice.ListEquipment &&
                data.ListDevice.ListEquipment.length > 0
                    ? data.ListDevice.ListEquipment.map((item, index) =>
                        this._renderItemEquiments(item, index)
                    )
                    : this._renderItemEquiments()
            }
            {
                // ---> show & hide button add
                !this.state.canNotAddEqui && (
                    <View>
                        <TouchableOpacity onPress={() => this._handleAddEquipment()}>
                            <View style={cusInfStyle.rowAlignCenter}>
                                <Image
                                    style={cusInfStyle.icon_form}
                                    source={require("../../../assets/images/extra-service/ic_add.png")}
                                />
                                <Text style={[cusInfStyle.txt_action]}>
                                    Add equipment
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }

            {
                /* Note */
            }
            <View style={ols.mgt10}>
                <InputArea
                    ref="txtNoteAddress"
                    style={[cusInfStyle.textArea]}
                    placeholder={strings("extra_service.extra_service_info.type_of_service.equipments.lb_note")}
                    placeholderTextColor="#9A9A9A"
                    textAlign={"left"}
                    autoCapitalize={"none"}
                    returnKeyType={"done"}
                    maxLength={1000}
                    autoCorrect={false}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => this._onChangeText("NoteAddress", text)}
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={true}
                    value={data["NoteAddress"]}
                />
            </View>
        </View>
    }

    /**
     * render equiments item
     */
    _renderItemEquiments = (item, index = 0) => {
        const {listDeviceUpgrade, optDiscount} = this.state;
        const mapEquipmentValue = item && item.Name
            ?
            {
                label: item.Name,
                value: {
                    Value: item.Value,
                    Name: item.Name,
                    Price: item.Price
                }
            }
            : null;

        const mapDiscountValue = {
            value: item && item.Discount ? item.Discount : 0,
            label: item && item.Discount <= 100
                ? item.Discount + "%" : item && item.Discount > 100
                    ? "Other" : "0%"
        };

        return (
            <View>
                {
                    /* Equiment selectbox */
                }
                <View style={{flexDirection: "row"}}>
                    <View style={{flex: 1}}>
                        <ModalPickerSimpleTruncate
                            ref={"optListDevice" + index}
                            label={strings("extra_service.extra_service_info.type_of_service.equipments.lb_newEqui")}
                            placeholder={strings("extra_service.extra_service_info.type_of_service.equipments.plh_newEqui")}
                            headerTitle={strings("extra_service.extra_service_info.type_of_service.equipments.plh_newEqui")}
                            options={listDeviceUpgrade}
                            getLabel={item => item.label}
                            onValueChange={value => {
                                this._onChangeEquiment(value, "ListEquipment", index);
                            }}
                            defaultValue={mapEquipmentValue}
                        />
                    </View>

                    {
                        /* Button Erase */
                    }
                    {
                        index >= 1 && (
                            <TouchableOpacity
                                onPress={() => this._handleRemoveEquipment(index)}
                                style={cusInfStyle.icon_delete}
                            >
                                <Image
                                    style={{width: 30, height: 30}}
                                    source={require("../../../assets/images/extra-service/ic_delete.png")}
                                />
                            </TouchableOpacity>
                        )
                    }
                </View>

                {
                    /* DISCOUNT */
                }
                <View>
                    <ModalPickerSimpleTruncate
                        ref={"optDiscount" + index}
                        label={strings("extra_service.extra_service_info.type_of_service.equipments.lb_discount")}
                        placeholder={strings("extra_service.extra_service_info.type_of_service.equipments.plh_discount")}
                        headerTitle={strings("extra_service.extra_service_info.type_of_service.equipments.plh_discount")}
                        options={optDiscount}
                        getLabel={item => item.label}
                        onValueChange={value => {
                            this._onChangeEquiment(value, "Discount", index);
                        }}
                        defaultValue={mapDiscountValue}
                    />
                </View>
            </View>
        );
    };

    /**
     * render Ip form
     */
    _renderIP() {
        return <View style={[styles.container, ols.mgt05]}>

            <Text style={[styles.headline, ols.cl444, ols.fs14, ols.fw500, ols.clBlue]}>
                {strings('customer_info.service_type.ipAdd')}
            </Text>
            {
                <FormIpList
                    ref="IPType"
                    labelIp={strings('customer_info.service_type.form.listIP_IPlabel')}
                    placeholderIp={strings('customer_info.service_type.form.listIP_IPplaceholder')}
                    filterTextIp={strings('customer_info.service_type.form.listIP_IPfilterText')}
                    optionDataIp={api.loadIPList}

                    labelMo={strings('customer_info.service_type.form.listIP_Monthlabel')}
                    placeholderMo={strings('customer_info.service_type.form.listIP_Monthplaceholder')}
                    filterTextMo={strings('customer_info.service_type.form.listIP_MonthfilterText')}
                    optionDataMo={api.loadMonthList}

                    priceLabel={strings('customer_info.service_type.form.listIP_pricelabel')}
                    allowRefresh={false}
                    value={this.state.data_inu.StaticIP}
                    onChange={(selectedItem) => this._onChangePickerIPValue('StaticIP', selectedItem)}
                />
            }
        </View>
    }

    /**
     * Show Loi
     * @param {*} err
     */
    _error(err) {
        this._loading(false);
        this.refs["popup"].getWrappedInstance().show(err.message);
    }

    /**
     *
     * @param {*} isShow
     */
    _loading(isShow) {
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }

    /**
     *
     */
    render() {
        const {data, data_inu, listSer} = this.state;

        // console.log('this.state ----data ', data);
        // console.log('this.state ----data_inu ', data_inu);

        return (
            <View style={[ols.container_keyboard]}>

                <ScrollView
                    keyboardDismissMode={'on-drag'}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >
                    <View style={[ols.inner_scrollview]}>

                        <Animated.View style={{flex: 1, position: 'relative', bottom: this.state.fadeT}}>

                            {
                                /* Services */
                            }
                            <View style={[styles.container, ols.mgt15]}>
                                {
                                    !data_inu.RegCode
                                        ?
                                        <ModalPickerCustom
                                            ref="SerType"
                                            label={strings('extra_service.extra_service_info.type_of_service.serType.label')}
                                            placeholder={strings('extra_service.extra_service_info.type_of_service.serType.placeholder')}
                                            headerTitle={strings('extra_service.extra_service_info.type_of_service.serType.label')}
                                            getLabel={item => item.Name}
                                            onValueChange={value => {
                                                this._onChangeServiesType('ServiceType', value);
                                            }}
                                            options={listSer}
                                            value={data_inu.ServiceType[0]}
                                            defaultValue={EXTRA_SER_ID}
                                        />
                                        :
                                        <InputO
                                            label={strings('extra_service.extra_service_info.type_of_service.serType.label')}
                                            placeholder={""}
                                            style={[styles.textInput, ols.fw500, ols.txtR, {
                                                color: '#0B76FF',
                                                fontWeight: 'bold'
                                            }]}
                                            placeholderTextColor="#444444"
                                            textAlign={"right"}
                                            autoCapitalize={"none"}
                                            returnKeyType={"done"}
                                            autoCorrect={false}
                                            editable={false}
                                            value={data_inu.ServiceType[0].Name}
                                        />
                                }
                            </View>

                            {
                                // -- Render form
                                this._renderServices(data_inu.ServiceType[0].Id)
                            }

                        </Animated.View>

                        <Animated.View style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            position: 'relative',
                            bottom: this.state.fadeD
                        }}>
                            <ButtonO
                                label={strings("customer_info.customer_info.form.btnNext_label")}
                                style={{marginBottom: 24,}}
                                styleBtnText={[ols.btnText]}
                                styleBtn={[ols.btnFull, ols.btnShadow]}
                                onPress={() => {
                                    data_inu.ServiceType &&
                                    data_inu.ServiceType[0].Id !== 5
                                        ? this._onNextStep()
                                        : this._onNextStep_inu()
                                }}/>
                        </Animated.View>
                    </View>
                </ScrollView>


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
    const extraServiceState = state.extraServiceInfoReducer;

    return {
        saleId: state.authReducer.userInfo.SaleId,
        userName: state.authReducer.userInfo.UserName,
        networkType: state.saleNewReducer.objBookport.networkType,
        locationId: extraServiceState.formData.LocationId,
        formData: extraServiceState && extraServiceState.formData
    };
}

export default connect(mapStateToProps, {nextStep, updateInfoExtraServiceForm})(ServiceTypeExtra);
