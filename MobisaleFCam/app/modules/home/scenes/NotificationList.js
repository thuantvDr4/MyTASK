/**
 * Màn hình danh sách notification
 * @uthor thuandd3
 * @dateCreate 14/03/2019
 * @dateEdit ---
 */

// LIB
import React from 'react';
import {
    View, ScrollView, ActivityIndicator,
    Image, Text, TextInput, TouchableOpacity, FlatList, Platform,
    KeyboardAvoidingView, Alert,} from 'react-native';
import {strings} from 'locales/i18n';
import {connect} from 'react-redux';
import {HeaderBackButton} from 'react-navigation';

// API
import * as api from '../api';

// LIB CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';

// COMPONENT
import NotificationButton from '../components/NotificationButton';

// ACTION
import { setNotinum } from '../actions';

// HELPER
import NavigationService from 'app-libs/helpers/NavigationService';
import { getRouteName } from 'app-libs/helpers/notificationHelper';


// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

const vir_data = [
    {
        "ID": 0,
        "Source": 0,
        "Type": 99,
        "Title": "Pre-Checklist has created successful!",
        "Content": "Pre-Checklist has created successful! Pre-Checklist has created successful!",
        "JSONExtra": '{"NotiId":5402}',
        "IsRead": 0,
        "SaleName": "isc.detv2",
        "AppType": "1",
        "SendDate": "07/12/2019 4:03:43 PM"
    },
    {
        "ID": 1,
        "Source": 0,
        "Type": 1,
        "Title": "You have get the new potential customer code",
        "Content": "PTC của Hợp đồng HNH439078 bị trả về(HNH439078)",
        "JSONExtra": '{"PotentialObjID":642,"NotiId":5402}',
        "IsRead": 0,
        "SaleName": "isc.detv2",
        "AppType": "1",
        "SendDate": "07/12/2019 4:03:43 PM"
    },
    {
        "ID": 2,
        "Source": 0,
        "Type": 2,
        "Title": "Deployment has returned",
        "Content": "Kỹ thuật thi công hoàn tất hợp đồng = SGH660733",
        "JSONExtra": '{"SupId":114,"NotiId":5402}',
        "IsRead": 0,
        "SaleName": "isc.detv2",
        "AppType": "3",
        "SendDate": "07/12/2019 4:03:43 PM"
    },
    {
        "ID": 3,
        "Source": 0,
        "Type": 3,
        "Title": "Deployment has completed",
        "Content": "Kỹ thuật thi công hoàn tất hợp đồng = SGH660733",
        "JSONExtra": '{"NotiId":5402}',
        "IsRead": 0,
        "SaleName": "isc.detv2",
        "AppType": "3",
        "SendDate": "07/12/2019 4:03:43 PM"
    },
    {
        "ID": 4,
        "Source": 0,
        "Type": 4,
        "Title": "Deployment has appointed",
        "Content": "Kỹ thuật tích hẹn thi công cho hợp đồng =SGH556299,Thời gian hẹn=14-06-2019,Múi giờ hẹn=13:30 - 17:30, Lý do hẹn=Chọn nguyên nhân",
        "JSONExtra": '{"NotiId":5402}',
        "IsRead": 0,
        "SaleName": "isc.detv2",
        "AppType": "3",
        "SendDate": "07/12/2019 4:03:43 PM"
    },
    {
        "ID": 5,
        "Source": 0,
        "Type": 7,
        "Title": "Recare!",
        "Content": "Kỹ thuật tích hẹn thi công cho hợp đồng =SGH556299,Thời gian hẹn=14-06-2019,Múi giờ hẹn=13:30 - 17:30, Lý do hẹn=Chọn nguyên nhân",
        "JSONExtra": '{"NotiId":5402}',
        "IsRead": 0,
        "SaleName": "isc.detv2",
        "AppType": "3",
        "SendDate": "07/12/2019 4:03:43 PM"
    },
    {
        "ID": 6,
        "Source": 0,
        "Type": 8,
        "Title": "Birthday!",
        "Content": "Kỹ thuật tích hẹn thi công cho hợp đồng =SGH556299,Thời gian hẹn=14-06-2019,Múi giờ hẹn=13:30 - 17:30, Lý do hẹn=Chọn nguyên nhân",
        "JSONExtra": '{"NotiId":5402}',
        "IsRead": 0,
        "SaleName": "isc.detv2",
        "AppType": "3",
        "SendDate": "07/12/2019 4:03:43 PM"
    }
];

/*
*
* */
class NotificationList extends React.Component {

    static navigationOptions = ({navigation}) => {

        return {
            title: strings('noti.navTitle'),
            headerLeft: <HeaderBackButton onPress={() => NavigationService.navigateGoBack()} tintColor="#fff"/>,
            headerRight: (
                <NotificationButton
                    numberUnRead={navigation.getParam('numberUnRead', 0)}
                    onPress={navigation.getParam('numberUnRead') !== 0 ? navigation.getParam('onPress') : null}
                />
            ),
            headerBackTitle: null,
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
                fontSize    : 20,
                fontWeight: 'bold',
                textAlign: 'center',
                flexGrow: 1
            },
        }
    }

    //-------------------------------------- DEMO DATA - Xoa
    list = [
        {
           "ID": 0,
           "Source": 0,
           "Type": 99,
           "Title": "Pre-Checklist has created successful!",
           "Content": "Pre-Checklist has created successful! Pre-Checklist has created successful!",
           "JSONExtra": '{"NotiId":5402}',
           "IsRead": 0,
           "SaleName": "isc.detv2",
           "AppType": "1",
           "SendDate": "07/12/2019 4:03:43 PM"
        },
        {
           "ID": 1,
           "Source": 0,
           "Type": 1,
           "Title": "You have get the new potential customer code",
           "Content": "PTC của Hợp đồng HNH439078 bị trả về(HNH439078)",
           "JSONExtra": '{"PotentialObjID":642,"NotiId":5402}',
           "IsRead": 0,
           "SaleName": "isc.detv2",
           "AppType": "1",
           "SendDate": "07/12/2019 4:03:43 PM"
        },
        {
           "ID": 2,
           "Source": 0,
           "Type": 2,
           "Title": "Deployment has returned",
           "Content": "Kỹ thuật thi công hoàn tất hợp đồng = SGH660733",
           "JSONExtra": '{"SupId":114,"NotiId":5402}',
           "IsRead": 0,
           "SaleName": "isc.detv2",
           "AppType": "3",
           "SendDate": "07/12/2019 4:03:43 PM"
       },
        {
           "ID": 3,
           "Source": 0,
           "Type": 3,
           "Title": "Deployment has completed",
           "Content": "Kỹ thuật thi công hoàn tất hợp đồng = SGH660733",
           "JSONExtra": '{"NotiId":5402}',
           "IsRead": 0,
           "SaleName": "isc.detv2",
           "AppType": "3",
           "SendDate": "07/12/2019 4:03:43 PM"
       },
        {
           "ID": 4,
           "Source": 0,
           "Type": 4,
           "Title": "Deployment has appointed",
           "Content": "Kỹ thuật tích hẹn thi công cho hợp đồng =SGH556299,Thời gian hẹn=14-06-2019,Múi giờ hẹn=13:30 - 17:30, Lý do hẹn=Chọn nguyên nhân",
           "JSONExtra": '{"NotiId":5402}',
           "IsRead": 0,
           "SaleName": "isc.detv2",
           "AppType": "3",
           "SendDate": "07/12/2019 4:03:43 PM"
       }
   ];
    //-------------------------------------- DEMO DATA - Xoa


    /**
     *
     */
    constructor(props) {
        super(props);
        this.page = 0;
        this.state = {
            data: {
                apiData: [], //[], // vir_data
                apiUnRead: null,
                empty: true,
            },
            loadingVisible: false,
            isLoadingMore: false, // Chặn lại khi có ít item
            loadingMore: false, // user list loading
            refreshing: false, //for pull to refresh
        };
    }

    /**
     *
     */
    componentDidMount() {
        this._mounted = true;

        // LOAD API FIRST
        this.props.navigation.addListener('willFocus',
            () => this._handleDefaultLoad(0)
        );  // 0 = page number
    }


    /**
     *
     */
    componentWillUnmount () {
        this._mounted = false
    }


    /**************************************************
     * FUNCTION: _loading
     * DESC: Hien thi loading
     * @param isShow
     * @private
     ***************************************************/
    _loading(isShow) {
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }


    /**************************************************
     * FUNCTION: _errorMsg
     * DESC: Hien thi popup error object
     * @param err
     * @private
     ***************************************************/
    _errorMsg(err) {
        // Hide loading
        this._loading(false);
        if (! err.message) return;
        this.refs['popup'].getWrappedInstance().show(err.message);
    }


    /**************************************************
     * FUNCTION: _errorMsg
     * DESC: Hien thi popup error
     * @param err
     * @private
     ***************************************************/
    _warning(warn) {
        // Hide loading
        this._loading(false);
        if (! warn) return;
        this.refs['popup'].getWrappedInstance().show(warn);
    }


    /**************************************************
     * FUNCTION: _handleDefaultLoad & loadmore (LOAD API)
     * DESC: Load API list noti
     * @param
     * @private
     ***************************************************/
    _handleDefaultLoad(IdLastNotiLog = this.page) {

        // Show loading
        if (!this.state.loadingMore && !this.state.refreshing) {
            this._loading(true);
        }

        // Input API
        const myInput = {
            IdLastNotiLog: !this.state.refreshing ? IdLastNotiLog : 0
        }

        // Call API
        api.getNotiLog(myInput, (success, result, msg) => {

            // console.log('Result--notificaiotn-->', result)
            //
            this._loading(false);
            //
            if ((result.Data.NotiData).length === 30) {
                this.setState({
                    ...this.state,
                    isLoadingMore: true,
                })
            }

            // Data empty - return
            if (result === null || (result.Data.NotiData).length === 0 ) {
                this.setState({
                    ...this.state,
                    loadingMore: false,
                    isLoadingMore: false,
                    loadingVisible: false,
                    refreshing: false
                })
                return;
            }

            // Data Temp for set height each item NotiData
            // let dataTemp = result.Data;
            let dataTemp = result.Data.NotiData;  // thuantv-edit: 15/10/2020: V2.8, api thay đổi cấu trúc data tra ve
            // get Last ID of Item
            let { [Object.keys(dataTemp).pop()]: lastItem } = dataTemp;
            this.page = lastItem.ID;

            // Parse Height each ITEM
            dataTemp.map((item, index) => {
                let shM = false;

                if ((item.Content).length > 200) {
                    shM = true;
                }

                dataTemp[index] = {
                    ...item,
                    'maH': Platform.OS === "ios" ? 50 : 60,
                    'shM': shM
                };
            });

            // Hide loading
            this._loading(dataTemp);
            // this._loading(false);

            // Success
            if (success) {
                this.setState({
                    ...this.state,
                    data: {
                        ...this.state.data,
                        apiData: !this.state.refreshing ? this.state.data.apiData.concat(dataTemp) : dataTemp,
                        apiUnRead: result.Data.CountUnRead, //thuantv-edit: 23/10/2020: V2.8, api thay đổi cấu trúc data tra ve
                    },
                    loadingMore: false,
                    refreshing: false,

                }, () => {
                    // set number read vao redux store
                    this.props.setNotinum(this.state.data.apiUnRead);

                    // Gan action cho right menu & set number vao component
                    setTimeout(() => {
                        this.props.navigation.setParams({numberUnRead: this.props.notiNum});
                        this.props.navigation.setParams({onPress: this.readAllNoti.bind(this)});
                    }, 0);
                });

            } else {
                this._errorMsg(msg);
            }
        });
    }


    /**************************************************
     * FUNCTION: _handleLoadMore
     * DESC: Load More List Noti
     * @param
     * @private
     ***************************************************/
    _handleLoadMore() {

        if (!this.state.loadingMore) {
            this.setState({
                ...this.state,
                loadingMore: true

            }, () => {
                setTimeout(() => {
                    this._handleDefaultLoad();
                }, 1500);
            });
        }
    }

    /**************************************************
     * FUNCTION: _handleRefreshing
     * DESC: Load new ITEM
     * @param
     * @private
     ***************************************************/
    _handleRefreshing() {
        if (!this.state.refreshing) {
            this.setState({
                ...this.state,
                refreshing: true

            }, () => {
                setTimeout(() => {
                    this._handleDefaultLoad();
                }, 1500);
            });
        }
    }


    /**************************************************
     * FUNCTION: _handleShowMore
     * DESC: Show full noti
     * @param
     * @private
     ***************************************************/
    _handleShowMore = ({item, index}, routeName) => {
        // value
        const {apiData} = this.state.data

        apiData[index] = {
            ...item,
            'maH': null,
            'shM': false
        };

        // set value to state
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                apiData: apiData,
            }
        });
    }


    /**************************************************
     * FUNCTION: _handleReadNoti (LOAD API)
     * DESC:
     * @param
     * @private
     ***************************************************/
    _handleReadNoti(item = null, index = null) {
        let { apiData } = this.state.data;
        let numUnread = this.state.data.apiUnRead;
        const JSONExtra = item ? JSON.parse(item.JSONExtra) : null;

        // read noti
        // api: 1 là đã dọc tất cả, 0 là đã đọc 1 tin
        api.readNotiLog(
            item !== null ? { IdNoti: JSONExtra.NotiId, IsReadAll: 0 } : { IdNoti: 0, IsReadAll: 1 },
                (success, result, msg) => {


                if (!success) {
                    this._errorMsg(msg);

                } else {
                    // Modyfi local list noti - not reload api (0 chua doc - 1 da doc)
                    if (item && item.IsRead === 0) {
                        // set cho once item dua vao index
                        apiData[index] = {
                            ...item,
                            "IsRead": 1
                        };

                    } else {
                        // set cho all item theo index
                        apiData.map((item, index) => {
                            apiData[index] = {
                                ...item,
                                "IsRead": 1
                            };
                        });
                    }

                    // set value to state
                    this.setState({
                        data: {
                            ...this.state.data,
                            apiData: apiData,
                            apiUnRead: item !== null ? numUnread - 1 : 0,
                            // apiUnRead: result[0].CountUnread,
                        }
                    }, () => {

                        // set number read vao redux store
                        this.props.setNotinum(this.state.data.apiUnRead);

                        // Gan action cho right menu
                        setTimeout(() => {
                            this.props.navigation.setParams({numberUnRead: this.props.notiNum});
                        }, 0);
                    });
                }
            }
        );
    }


    /**************************************************
     * FUNCTION: _handleCLick (LOAD API)
     * DESC:
     * @param
     * @private
     ***************************************************/
    _handleCLick = ({item, index}, routeName) => {
        // value
        const JSONExtra = JSON.parse(item.JSONExtra);

        // item nao co IsRead = 0 (chua doc) && NotiId > 0, moi set trang thai
        if (item && item.IsRead === 0 && JSONExtra.NotiId > 0) {
            this._handleReadNoti(item, index);
        }

        // xu ly tiep khi click
        this._processNoti(item, routeName);
    }


    /**************************************************
     * FUNCTION: _processNoti (LOAD API)
     * DESC: Xử lý notification item
     * @param
     * @private
     ***************************************************/
    _processNoti(item, routeName = "") {
        // Loại Noti
        const type = '' + item.Type;

        // value
        const model = JSON.parse(item.JSONExtra);

        // Check valid data
        if (! this._checkValidData(type, model)) {
            return;
        }

        // Xu ly theo loai noti
        switch ( type ) {
            // 1: Detail khách hàng tiềm năng
            case "1":
                this._acceptGetPotential(routeName, model);
                break;

            // 2: PTC return
            case "2":
                // Check error if invalid data
                this._reDirectScreen(routeName, {SupId: model.SupId} )
                break;

            // 7: reCare list
            case "7":
                // Check error if invalid data
                this._reDirectScreen(routeName, {'payload': item} )
                break;

            // 8: Birthday-list
            case "8":
                // Check error if invalid data
                this._reDirectScreen(routeName, {'payload': item} )
                break;


            // all
            default: break;
        }

        return;
    }


    /**************************************************
     * FUNCTION: _acceptGetPotential  (LOAD API)
     * DESC: Xử lý accept KHTN cho sale trước khi chuyển màn hình
     * @param
     * @private
     ***************************************************/
    _acceptGetPotential(routeName, model) {

        // Show loading
        this._loading(false);

        // input API
        const myInput = {
            PotentialCusId: model.PotentialObjID,
            // Code: model.Code
        }

        api.acceptPotential(myInput, (success, result, msg) => {
            // Hide loading
            this._loading(false);

            if (success) {
                this._reDirectScreen(routeName, {PotentialCusId: model.PotentialObjID})

            } else {
                this._errorMsg(msg);
            }
        });

    }


    /**************************************************
     * FUNCTION: _reDirectScreen
     * DESC: Xử lý chuyển màn hình kèm input
     * @param
     * @private
     ***************************************************/
    _reDirectScreen(routeName, param = null) {
        NavigationService.navigate(routeName, param);
    }


    /**************************************************
     * FUNCTION: _checkValidData
     * Kiểm tra dữ liệu trong model có tồn tại ko
     * @param
     * @return
     **************************************************/
    _checkValidData(type, model) {
        let errorList = [];

        // Check
        if (type == "1") {
            if (!model.PotentialObjID) {
                errorList.push({
                    name: 'PotentialObjID',
                    msg: strings('dl.notification.dataInvalid')
                });
            }
        }

        if (type == "2") {
            if (!model.SupId) {
                errorList.push({
                    name: 'SupId',
                    msg: strings('dl.notification.dataInvalid')
                });
            }
        }

        // khong co loi = true
        if (errorList.length == 0) {
            return true;
        }

        // co loi = false
        this._warning(errorList[0].msg);
        return false;
    }


    /**************************************************
     * FUNCTION: _renderItem
     * DESC: Render item Notification
     * @param
     * @private
     ***************************************************/
    _renderItem = ({item, index}) => {
        let obj = this._renderIcon(item.Type);

        return (
            <View style={[styles.oneList ]}>
                <TouchableOpacity style={styles.oneListWrap} onPress={this._handleCLick.bind(this, {item, index}, obj.routeName)}>
                    <View style={[styles.oneIco ]}>
                        <Image
                            style={styles.icoNoti}
                            source={obj.icoUri} />
                    </View>
                    <View style={styles.oneInfo}>
                        <View style={[styles.oneInfoWrap, index + 1 === this.state.data.apiData.length ? styles.oneInfoWrapLast : null ]}>
                            <Text style={[styles.infoTitle, item.IsRead === 1 ? {color: '#bcbdc1'} : null ]}>{item.Title}</Text>
                            <View style={[styles.infoContent, {maxHeight: item.maH}]}>
                                <Text style={[styles.infoText, item.IsRead === 1 ? {color: '#bcbdc1'} : null, {maxHeight: item.maH} ]}>{item.Content}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Text style={[styles.infoTime, item.IsRead === 1 ? {color: '#bcbdc1'} : null ]}>{item.SendDate}</Text>
                                {
                                    item.shM
                                    ?
                                        <TouchableOpacity onPress={this._handleShowMore.bind(this, {item, index})}>
                                            <Text style={[styles.infoTime ]}>{'Show more'}</Text>
                                        </TouchableOpacity>
                                    : null
                                }

                            </View>

                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    /**************************************************
     * FUNCTION: _renderIcon
     * DESC: Render item icon Notification
     * @param
     * @private
     ***************************************************/
    _renderIcon(type) {
        return getRouteName(type);
    }


    /**************************************************
     * FUNCTION: _renderFooter
     * DESC: Render footer Icon loading
     * @param
     * @private
     ***************************************************/
    _renderFooter = () => {
        if (!this.state.loadingMore) return null;
        return (
            <ActivityIndicator style={{ color: '#000' }} />
        );
    };


    /**************************************************
     * FUNCTION: _renderFooter
     * DESC: Render footer Icon loading
     * @param
     * @private
     ***************************************************/
    _renderHeader = () => {
        if (!this.state.refreshing) return null;
        return (
            <ActivityIndicator style={{ color: '#000' }} />
        );
    };


    /****************************************************************************************************
     * FUNCTION: readAllNoti
     * DESC: read all noti (pass fn to child component)
     * @param
     * @private
     *****************************************************************************************************/
    readAllNoti() {
        this._handleReadNoti();
    }


    /****************************************************************************************************
     * FUNCTION: render
     * DESC: Render ra giao dien
     * @param
     * @private
     *****************************************************************************************************/
    render() {
        const { data } = this.state;
        const dataItem = data.empty && Object.keys(data.apiData).length > 0
        ?
            <FlatList
                data={data.apiData}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index + "_" + item.ID}
                contentContainerStyle={{paddingHorizontal: 16, paddingTop: 15}}
                onEndReachedThreshold={0.4}
                onEndReached={this.state.isLoadingMore ? this._handleLoadMore.bind(this) : () => {} }
                refreshing={this.state.refreshing}
                onRefresh={this._handleRefreshing.bind(this)}
                // ListHeaderComponent={this._renderHeader.bind(this)}
                ListFooterComponent={this._renderFooter.bind(this)}
            />
        :
            // Render view khi khong co data tra ve
            <View style={styles.dataEmpty} >
                <View style={[styles.wrapImage]}>
                    <Image
                        source={require('../../../assets/images/contract-list/report.png')}
                    />
                    <View>
                        <Text style={[ols.fs16, ols.fw500, {marginTop: 26, color: '#D6D6D6'}]}>
                            {strings('all.data.noDataNotificationList')}
                        </Text>
                    </View>
                </View>
            </View>
        ;

        return (

            <View style={styles.container}>

                {
                    /*
                    Item loop
                    */
                }
                <View style={styles.listNotiContainer}>
                    {dataItem}
                </View>

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

/**************************************************
 * FUNCTION: REDUX
 * DESC: Map REDUX STATE vao PROPS
 * @param state
 * @public
 ***************************************************/
function mapStateToProps(state) {

    // GET STATE
    const numUnreadGlobal = state.homeReducer.notificationNum;

    return {
        notiNum: numUnreadGlobal,
    }
}

export default connect(mapStateToProps, { setNotinum })(NotificationList);
