
/**
 * Màn hình division list
 * @author Tuấn Anh
 * @date 20/09/2019
 */

import React from 'react';
import {
    View, ScrollView,
    Image, Text, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Alert
} from 'react-native';
import { connect } from 'react-redux';
import { strings } from 'locales/i18n';

// API
import * as api from '../api';

// REDUX

// LIB
import NavigationService from 'app-libs/helpers/NavigationService';
import moment from 'moment';

// LIB COMPONENT CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';


// CONSTANTS
import { actions as a, constants as c } from '..';

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

class DivisionLists extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('dvs.nav.titleList'),
            // header right để căn giữa title
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
            ID: 1,
            Status: "Open",
            Subject: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere pariatur esse inventore obcaecati velit consectetur aperiam eius assumenda, corrupti ex quae unde, repudiandae delectus! Sint accusamus fugiat incidunt eligendi alias?",
            CustomerName: "Isc test",
            CustomerPhone: "0123456789",
            CreatedDate: "2019-09-20T09:48:05.8952838+07:00",
            Department: "CUS",
            Note: "Test note, Test note, Test note",
            Description: "Test Description, Test Description, Test Description"
        },
        {
            ID: 1,
            Status: "Open",
            Subject: "Test subject 1",
            CustomerName: "Isc test",
            CustomerPhone: "0123456789",
            CreatedDate: "2019-09-20T09:48:05.8952838+07:00",
            Department: "CUS",
            Note: "Test note, Test note, Test note",
            Description: "Test Description, Test Description, Test Description"
        },
        {
            ID: 1,
            Status: "Open",
            Subject: "Test subject 1",
            CustomerName: "Isc test",
            CustomerPhone: "0123456789",
            CreatedDate: "2019-09-20T09:48:05.8952838+07:00",
            Department: "CUS",
            Note: "Test note, Test note, Test note",
            Description: "Test Description, Test Description, Test Description"
        },
        {
            ID: 1,
            Status: "Open",
            Subject: "Test subject 1",
            CustomerName: "Isc test",
            CustomerPhone: "0123456789",
            CreatedDate: "2019-09-20T09:48:05.8952838+07:00",
            Department: "CUS",
            Note: "Test note, Test note, Test note",
            Description: "Test Description, Test Description, Test Description"
        }
    ];
    //-------------------------------------- DEMO DATA - Xoa

    /**
     *
     */
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dataEmpty: true,
            loadingVisible: false
        };

        this._handleLoadDivisionLists = this._handleLoadDivisionLists.bind(this);
    }

    /**
     *
     */
    componentDidMount() {
        // LOAD API FIRST
        this.props.navigation.addListener('willFocus', () => {
            this._handleLoadDivisionLists();
        });
    }

    /**
     *
     */
    componentWillUnmount() {

    }

    /**************************************************
     * FUNCTION: _handleLoadDivisionLists (LOAD API)
     * DESC: Load ra danh sách division
     * @param
     * @private
     ***************************************************/
    _handleLoadDivisionLists() {
        this._loading(true);

        api.loadDivisionLists({}, (success, result, msg) => {
            this._loading(false);

            if (success) {

                this.setState({
                    ...this.state,
                    data: result.map(divs => {
                        return {
                            ...divs,
                            /// chuyển CreatedDate sang định dạng MM/DD/YYYY
                            CreatedDate: moment(divs.CreatedDate).format('MM/DD/YYYY')
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
                            <View style={styles.infoBox}>
                                <View style={[styles.oneInfo, { marginTop: 10 }]}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblStatus')}</Text>
                                    <Text style={
                                        [styles.infoValue, { color: item.Status == 'Resolved' ? '#83D300' : item.Status == 'Closed' ? 'red' : '#F09C16' }]

                                    }>{item.Status}</Text>
                                </View>
                                <View style={styles.oneInfo}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblCusName')}</Text>
                                    <Text style={styles.infoValue}>{item.CustomerName}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblPhoNum')}</Text>
                                    <Text style={styles.infoValue}>{item.CustomerPhone}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblSubject')}</Text>
                                    <Text style={styles.infoValue}>{item.Subject}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblDepart')}</Text>
                                    <Text style={styles.infoValue}>{item.Department}</Text>
                                </View>
                                <View style={styles.oneAddress}>
                                    <Text style={styles.infoTitle}>{strings('dvs.item.lblDateCre')}</Text>
                                    <Text style={styles.infoValue}>{item.CreatedDate}</Text>
                                </View>
                            </View>

                            <View style={styles.createBox}>
                                <TouchableOpacity
                                    style={styles.btnCreate}
                                    onPress={
                                        () => {
                                            //navigation sang division detail, truyển tất cả data của item sang để hiển thị
                                            NavigationService.navigate(c.SCR_DVS_DETAIL, {
                                                divisionItem: item
                                            });
                                        }
                                    }
                                >
                                    <Text style={styles.txtBtnCreate}>{strings('dvs.item.lblDetail')}</Text>
                                </TouchableOpacity>
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


export default connect()(DivisionLists);