
/**
 * Màn hình danh sách hợp đồng
 * @uthor thuandd3
 * @since Mar, 2019
 */

import React from 'react';
import {
    View, ScrollView, 
    Image, Text, TextInput, TouchableOpacity, 
    KeyboardAvoidingView, Alert} from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';

// API
import * as api from '../api';

// REDUX

// LIB
import NavigationService from 'app-libs/helpers/NavigationService';
import { HeaderBackButton } from 'react-navigation';
import moment from 'moment';

// LIB COMPONENT CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';

// COMPONENT
import MenuPicker from '../components/MenuPicker';

// CONSTANTS
import {actions as a, constants as c} from '../';

// STYLE
import ols from '../../../styles/Ola-style';
import styles from '../styles';

class Prechecklist extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: strings('prcl.nav.titlePrcl'),
            /**
             * Chu thich: khong can add nut back o day
             * Mac dinh la khi vao trang nay se back theo step (Home -> Prechecklist List)
             * Khi tao Prechecklist xong (Home -> List Contract -> Create Prechecklist)
             * se Navagate ve Prechecklist List (Home -> List Contract -> Create Prechecklist -> Home -> Prechecklist List)
             * Sau khi xong xuoi se Back theo (Create Precheck List -> Home -> Prechecklist List)
             * Chu ko phai back tu tu nua.
             **/
            
            // headerLeft: <HeaderBackButton onPress={navigation.getParam('buttonBack')} tintColor="#fff"/>,
            headerRight: (
                <MenuPicker
                    getOptionData = {api.loadStatusPrechecklist}
                    onChange = {navigation.getParam('selectMenu')}
                    value = {navigation.getParam('dataFilter')}
                />
            ),
            headerBackTitle: null,
            navigationOptions: ({navigation}) => ({
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
                    fontSize    :20,
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
            "PreCheckListID": 1,
            "ObjID": 0,
            "Name": "THuan Dinh",
            "Contract": "BBDF47006423",
            "Status": 1,
            "StatusName": "Xu Ly",
            "Description": "customer said his internet very slow need technician go to check,plz help support for customer,thanks"
        }, {
            "PreCheckListID": 2,
            "ObjID": 0,
            "Name": "Binh Chua",
            "Contract": "BBDF47006643643",
            "Status": 2,
            "StatusName": "Chua Xu Ly",
            "Description": "ahihi ahuhu"
        }, {
            "PreCheckListID": 3,
            "ObjID": 0,
            "Name": "Phuoc Dai",
            "Contract": "BBDF4700634456",
            "Status": 2,
            "StatusName": "Chua Xu Ly",
            "Description": "ahihi ahuhu ahehehe"
        },
   ];
    //-------------------------------------- DEMO DATA - Xoa

    /**
     *
     */
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dataFilter: null,
            dataEmpty: true,
            searchData: {
                ToDate: null,
                FromDate: null,
                StatusID: null,
            },
            loadingVisible: false
        };

        this._handleLoadPrechecklist = this._handleLoadPrechecklist.bind(this);
    }

    /**
     *
     */
    componentDidMount() {
        // setup nut back, ko can dung nua
        // const { navigation } = this.props;
        // const isNew = navigation.getParam('isNew', false);
        
        // LOAD API FIRST
        this.props.navigation.addListener('willFocus', () => {
            this._handleLoadPrechecklist();
        });

        this.props.navigation.setParams({
            selectMenu: this.changeFilter.bind(this), 
            dataFilter: this.state.dataFilter,
            // buttonBack: (() => {isNew ? NavigationService.navigateBackHome('Home') : NavigationService.navigateGoBack()}),
        });
    }

    /**
     *
     */
    componentWillUnmount () {
        
    }

    /**************************************************
     * FUNCTION: _handleLoadSearchType (LOAD API)
     * DESC: Load API data search theo loai
     * @param
     * @private
     ***************************************************/
    _handleLoadPrechecklist() {
        this._loading(true);
        
        const searchData = this.state.searchData;

        api.loadPrechecklist(searchData, (success, result, msg) => {
            this._loading(false);
            
            if (success) {
                
                this.setState({
                    ...this.state,
                    data: result,
                    dataEmpty: false,
                });

            } else {
                this._error(msg);
            }
        });
    }

    /**************************************************
     * FUNCTION: changeFilter
     * DESC: load lai data khi thay doi filter
     * @param
     * @private
     ***************************************************/

    changeFilter(selectItem) {
        const searchData = selectItem;
        // console.log(selectItem);

        this.setState({
            ...this.state,
            dataFilter: selectItem.selectedItemList,
            searchData: {
                ToDate: searchData.ToDate,
                FromDate: searchData.FromDate,
                StatusID: searchData.StatusID,
            },
        }, () => this._handleLoadPrechecklist);
    }

    /**************************************************
     * FUNCTION: _error
     * DESC: Hien thi popup error
     * @param err
     * @private
     ***************************************************/
    _error(err) {
        this._loading(false);
        if (! err.message) return;
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
        const { data }  = this.state;

        var dataItem = !this.state.dataEmpty && Object.keys(data).length > 0 
        ?
            // Render view khi co data tra ve
            <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom:20}} >
            {
                Object.keys(data).length > 0 ? data.map((item, index) => (
                    
                    <View key={index} style={styles.oneList}>
                        <View style={styles.infoBox}>
                            <View style={[styles.oneInfo, {marginTop: 10}]}>
                                <Text style={styles.infoTitle}>{strings('prcl.item.lblStatus')}</Text>
                                <Text style={ item.Status == 1 ? 
                                    [styles.infoValue, {color: '#83D300'}] : 
                                    [styles.infoValue, {color: '#F09C16'}] }>{item.StatusName}</Text>
                            </View>
                            <View style={styles.oneInfo}>
                                <Text style={styles.infoTitle}>{strings('prcl.item.lblCusName')}</Text>
                                <Text style={styles.infoValue}>{item.Name}</Text>
                            </View>
                            <View style={styles.oneAddress}>
                                <Text style={styles.infoTitle}>{strings('prcl.item.lblConNum')}</Text>
                                <Text style={styles.infoValue}>{item.Contract}</Text>
                            </View>
                        </View>

                        <View style={styles.createBox}>
                            <TouchableOpacity 
                                style={styles.btnCreate} 
                                onPress={
                                    () => {
                                        setTimeout(() => {
                                            NavigationService.navigate(c.prcl_route_dt, {
                                                PreCheckListID: item.PreCheckListID
                                            });
                                        }, 0);
                                    }
                                }
                                >
                                <Text style={styles.txtBtnCreate}>{strings('prcl.item.lblSee')}</Text>
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
                        <Text style={[ols.fs16, ols.fw500, {marginTop: 26, color: '#D6D6D6'}]}>{strings('all.data.noData')}</Text>
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
    
    return {
        
    };
}

export default connect()(Prechecklist);