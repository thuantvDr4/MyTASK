

/**
 * Màn hình bill history
 * @author Tuấn Anh
 * @date 20/09/2019
 */

import React from 'react';
import {
    View, ScrollView,
    Image, Text,
} from 'react-native';
import { strings } from 'locales/i18n';

// API
import * as api from '../api';

// LIB
import moment from 'moment';

// LIB COMPONENT CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';


// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

export default class BillHistory extends React.Component {
    static navigationOptions = () => {
        return {
            title: strings('history.nav.titleBillHistory'),
            // headerLeft: <HeaderBackButton onPress={navigation.getParam('buttonBack')} tintColor="#fff"/>,

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
            this._handleLoadBillHistory();
        });
    }

    /**
     *
     */
    componentWillUnmount() {

    }

    /**************************************************
     * FUNCTION: _handleLoadBillHistory (LOAD API)
     * DESC: Load 3 bill gần nhất
     * @param
     * @private
     ***************************************************/
    _handleLoadBillHistory = () => {
        this._loading(true);

        //payload body
        const payload = {
            Contract: this.state.dataItem.Contract
        }

        api.loadBillHistory(payload, (success, result, msg) => {
            this._loading(false);

            if (success) {

                this.setState({
                    ...this.state,
                    data: result.map(divs => {
                        return {
                            ...divs,
                            /// chuyển sang định dạng dd/mm/yyyy
                            FromDate: divs.FromDate ? moment(divs.FromDate).format('MM/DD/YYYY') : '',
                            ToDate: divs.ToDate ? moment(divs.ToDate).format('MM/DD/YYYY') : '',
                        }
                    }),
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
                            {/* custome lại borderBottomWidth: 1 cho billHistory */}
                            <View style={[styles.infoBox, { borderBottomWidth: 1, borderRadius: 6 }]}>
                                <View style={[styles.oneInfo, { marginTop: 10 }]}>
                                    <Text style={styles.infoTitle}>{strings('history.itemBillHtr.lblBillNum')}</Text>
                                    <Text style={styles.infoValue}>{item.BillNumber}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('history.itemBillHtr.lblFromDate')}</Text>
                                    <Text style={styles.infoValue}>{item.FromDate}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('history.itemBillHtr.lblToDate')}</Text>
                                    <Text style={styles.infoValue}>{item.ToDate}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('history.itemBillHtr.lblSerType')}</Text>
                                    <Text style={styles.infoValue}>{item.ServiceType}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('history.itemBillHtr.lblAmount')}</Text>
                                    <Text style={styles.infoValue}>{item.TotalAmount}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('history.itemBillHtr.lblPaid')}</Text>
                                    <Text style={styles.infoValue}>{item.Paid}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('history.itemBillHtr.lblPayType')}</Text>
                                    <Text style={styles.infoValue}>{item.PaymentType}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('history.itemBillHtr.lblPayDate')}</Text>
                                    <Text style={styles.infoValue}>{item.PaymentDate}</Text>
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
