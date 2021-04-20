

/**
 * Màn hình bill history
 * @author Tuấn Anh
 * @date 20/09/2019
 */

import React from 'react';
import {
    View, ScrollView,
    Image, Text
} from 'react-native';
import { strings } from 'locales/i18n';

// API
import * as api from '../api';

// REDUX

// LIB
import moment from 'moment';

// LIB COMPONENT CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';



// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

export default class ChangeStatusHistory extends React.Component {
    static navigationOptions = () => {
        return {
            title: strings('history.nav.titleChangeSTT'),
            // header right để căn giữa title
            headerRight: <View />,

            headerBackTitle: null,
            navigationOptions: () => ({
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
    // BillList = [
    //     {
    //         OldStatus: "Normal",
    //         NewStatus: "Suspend by fee dispution",
    //         Reason: "System Update",
    //         UpdatedBy: "System",
    //         UpdatedDate: "2019-09-23T14:12:40.2062966+07:00",
    //     },
    //     {
    //         OldStatus: "Suspend by fee dispution",
    //         NewStatus: "Normal",
    //         Reason: "Create new contract",
    //         UpdatedBy: "Ketvv",
    //         UpdatedDate: "2019-09-23T14:12:40.2062966+07:00",
    //     },
    //     {
    //         OldStatus: "Normal",
    //         NewStatus: "Suspend by fee dispution",
    //         Reason: "System Update",
    //         UpdatedBy: "System",
    //         UpdatedDate: "2019-09-23T14:12:40.2062966+07:00",
    //     }

    // ];
    //-------------------------------------- DEMO DATA - Xoa

    /**
     *
     */
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dataItem: this.props.navigation.getParam('data'),
            dataEmpty: true,
            loadingVisible: false
        };
    }

    /**
     *
     */
    componentDidMount() {
        // LOAD API FIRST
        this.props.navigation.addListener('willFocus', () => {
            this._handleLoadChangeStatusHistory();
        });
    }

    /**
     *
     */
    componentWillUnmount() {

    }

    /**************************************************
     * FUNCTION: _handleLoadChangeStatusHistory (LOAD API)
     * DESC: Load 3 bill gần nhất
     * @param
     * @private
     ***************************************************/
    _handleLoadChangeStatusHistory = () => {
        this._loading(true);

        //payload body
        const payload = {
            Contract: this.state.dataItem.Contract
        }

        api.loadChangeStatusHistory(payload, (success, result, msg) => {
            this._loading(false);

            if (success) {
                this.setState({
                    ...this.state,
                    data: result.map(el => ({
                        ...el,
                        UpdatedDate: el.UpdatedDate ? moment(el.UpdatedDate).format('MM/DD/YYYY') : ''
                    })),
                    dataEmpty: false,
                });

            } else {
                this._error(msg);
            }
        });
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
     * @param isShow
     * @private
     *****************************************************************************************************/
    render() {
        const { data } = this.state;

        var dataItem = !this.state.dataEmpty && Object.keys(data).length > 0
            ?
            // Render view khi co data tra ve
            <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }} >
                {
                    Object.keys(data).length > 0 ? data.map((item, index) => (
                        <View key={index} style={styles.oneList}>
                            {/* custome lại borderBottomWidth: 1 cho ChangeStatusHistory */}
                            <View style={[styles.infoBox, { borderBottomWidth: 1, borderRadius: 6 }]}>
                                <View style={[styles.oneInfo, { marginTop: 10 }]}>
                                    <Text style={styles.infoTitle}>{strings('history.itemChangeSTT.lblOldStt')}</Text>
                                    <Text style={item.OldStatus == 'Normal' ?
                                        [styles.infoValue, { color: '#83D300' }] :
                                        [styles.infoValue, { color: '#F09C16' }]}>{item.OldStatus}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('history.itemChangeSTT.lblNewStt')}</Text>
                                    <Text style={item.NewStatus == 'Normal' ?
                                        [styles.infoValue, { color: '#83D300' }] :
                                        [styles.infoValue, { color: '#F09C16' }]}>{item.NewStatus}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('history.itemChangeSTT.lblReason')}</Text>
                                    <Text style={styles.infoValue}>{item.Reason}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('history.itemChangeSTT.lblUpdateBy')}</Text>
                                    <Text style={styles.infoValue}>{item.UpdatedBy}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('history.itemChangeSTT.lblDateCh')}</Text>
                                    <Text style={styles.infoValue}>{item.UpdatedDate}</Text>
                                </View>
                            </View>
                        </View>

                    )) : null
                }
            </ScrollView>
            :
            // Render view khi khong co data tra ve
            <View style={styles.dataEmpty} >
                <View style={[styles.wrapImage]}>
                    <Image
                        style={styles.imageNoData}
                        source={require('../../../assets/images/contract-list/report.png')}
                    />
                    <View>
                        <Text style={[ols.fs16, ols.fw500, { marginTop: 26, color: '#D6D6D6' }]}>{strings('all.data.noData')}</Text>
                    </View>
                </View>
            </View>
            ;

        return (
            <View style={styles.container}>

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
