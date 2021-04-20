
/**
 * Màn hình danh sách hợp đồng
 * @uthor thuandd3
 */

import React from 'react';
import {
    View, ScrollView, Text
} from 'react-native';
import { connect } from 'react-redux';
import { strings } from 'locales/i18n';

// API
import * as api from '../api';

// LIB COMPONENT CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';

// COMPONENT
import InputArea from 'app-libs/components/input/InputArea';

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

class DivisionDetail extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('dvs.nav.titleDetail'),
            headerRight: <View />,
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

    constructor(props) {
        super(props);

        this.state = {
            data: this.props.navigation.getParam('divisionItem'),
            loadingVisible: false,
            // flag cho phép scroll container hay không (áp dụng trường hợp nhấn vào note, decs thì tắt scroll container để scroll chính nó)
            isScrollWrapper: true
        };
    }

    /**
     *
     */
    componentDidMount() {
        // LOAD API FIRST
        this.props.navigation.addListener('willFocus', () => {
            // this._handleLoadPrechecklistDetail();
        });
    }

    /**
     *
     */
    componentWillUnmount() {

    }

    // /**************************************************
    //  * FUNCTION: _handleLoadSearchType (LOAD API)
    //  * DESC: Load API data search theo loai
    //  * @param
    //  * @private
    //  ***************************************************/
    // _handleLoadPrechecklistDetail() {
    //     this._loading(true);

    //     const inputData = this.state.IDPreCheckList;

    //     api.loadPrechecklistDetail(inputData, (success, result, msg) => {
    //         this._loading(false);

    //         if (success) {

    //             this.setState({
    //                 ...this.state,
    //                 data: result,
    //             });

    //         } else {
    //             this._error(msg);
    //         }
    //     });
    // }

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
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }


    render() {
        const { data } = this.state;
        // console.log(data);

        return (
            <View style={styles.container}>

                <View style={styles.infoContainer}>
                    <ScrollView style={[styles.scrollViewCreate, { paddingTop: 0 }]} scrollEnabled={this.state.isScrollWrapper}>

                        <View style={[styles.oneList]}>
                            {
                                /* 
                                    Info
                                */
                            }
                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('dvs.form.headline.infDvs')}</Text>
                            <View style={styles.infoContact}>
                                <View style={[styles.oneInfo, { marginTop: 10 }]}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblStatus')}</Text>
                                    <Text style={data && data.Status == 1 ?
                                        [styles.infoValue, { color: '#83D300' }] :
                                        [styles.infoValue, { color: '#F09C16' }]}>{data && data.Status ? data.Status : ""}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblCusName')}</Text>
                                    <Text style={styles.infoValue}>{data && data.CustomerName ? data.CustomerName : ""}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblId')}</Text>
                                    <Text style={styles.infoValue}>{data && data.ID ? data.ID : ""}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblPhoNum')}</Text>
                                    <Text style={styles.infoValue}>{data && data.CustomerPhone ? data.CustomerPhone : ""}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblSubject')}</Text>
                                    <Text style={styles.infoValue}>{data && data.Subject ? data.Subject : ""}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblDepart')}</Text>
                                    <Text style={styles.infoValue}>{data && data.Department ? data.Department : ""}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblDateCre')}</Text>
                                    <Text style={styles.infoValue}>{data && data.CreatedDate ? data.CreatedDate : ""}</Text>
                                </View>
                            </View>

                            {
                                /* 
                                    Form
                                */
                            }
                            {/* Note */}
                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('dvs.form.headline.hlNote')}</Text>
                            <View style={[styles.fakeInput]} onTouchStart={() => this.setState({ isScrollWrapper: false })} onTouchCancel={() => this.setState({ isScrollWrapper: true })}>
                                <ScrollView style={{ height: 80 }}>
                                    <Text
                                        style={[styles.textInputFake]}
                                    >
                                        {data && data.Note ? data.Note : ""}
                                    </Text>
                                </ScrollView>
                            </View>

                            {/* Description */}

                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('dvs.form.headline.hlDescription')}</Text>
                            <View>
                                <View style={[styles.fakeInput]} onTouchStart={() => this.setState({ isScrollWrapper: false })} onTouchCancel={() => this.setState({ isScrollWrapper: true })}>
                                    <ScrollView style={{ height: 80 }}>
                                        <Text
                                            style={[styles.textInputFake]}
                                        >
                                            {data && data.Description ? data.Description : ""}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                </View>


                {
                    /* 
                        Popup and loading
                    */
                }
                <PopupWarning ref="popup" />
                <TechLoading visible={this.state.loadingVisible} />
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

export default connect(mapStateToProps, {})(DivisionDetail);