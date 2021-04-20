/**
 * Màn hình danh sach phieu thi cong
 * @uthor ---
 * @dateCreate ---
 * @dateEdit ---  
 */

// LIB
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Alert, ScrollView } from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {HeaderBackButton} from 'react-navigation';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';

// STYLE
import styles from '../styles';

// API
import * as api from '../api';

class DeploymentList extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('dplment.nav.titleList'),
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>,
            headerRight:<TouchableOpacity  style={{marginRight: 10}}/>
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingVisible : false,
            deploymentList:[]
        };
        // bind event
        this.getDeploymentList = this.getDeploymentList.bind(this);
        this.onDeployListSuccess = this.onDeployListSuccess.bind(this);
        this.onDeployListError = this.onDeployListError.bind(this);
    }

    componentDidMount(){
        // LOAD API FIRST
        this.props.navigation.addListener('willFocus', () => {
            this.getDeploymentList();
        });
    }
        
    // get data deployment list
    getDeploymentList() {
        // loading
        this._loading(true);
        // call API
        api.getDeploymentReturnList({}, (success, result, msg) => {
            this._loading(false);
            if (success) {
                this.onDeployListSuccess(result);
            } else {
                this.onDeployListError(msg);
            }
        });
    }

    //get data deployment list success
    onDeployListSuccess(data){
        this.setState({deploymentList:data, isdataload:true})
    }

    //get data deployment list error
    onDeployListError(error){
        if (!error.message) return;
        this.refs['popup'].getWrappedInstance().show(error.message.toString());
    }
    
    /**
    * Loading
    * @param isShow
    * @private
    */
    _loading(isShow){
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }

    render(){
        return (
            <View style={{...styles.container, flex:1}}>

                <View style={styles.listInfoContainer}>

                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        contentContainerStyle= {[styles.scrollView, this.state.deploymentList.length == 0 ? {flex:1} : null]}>
                        {/* Render data deployment */}
                        { this.state.deploymentList.length > 0 ? this.state.deploymentList.map((deploymentList, index) => (
                            <View key={index} style={styles.oneList}>
                                <View style={styles.infoBox}>
                                    <View style={[styles.oneInfo, {marginTop: 8}]}>
                                        <Text style={styles.infoTitle}>{strings('dplment.list.return_reason')}</Text>
                                        <Text style={[styles.infoValue, {color: '#F09C16'}] }>
                                            {deploymentList && deploymentList.ReturnReason ? deploymentList.ReturnReason : "" }
                                        </Text>
                                    </View>
                                    <View style={styles.oneInfo}>
                                        <Text style={styles.infoTitle}>{strings('dplment.list.customer_name')}</Text>
                                        <Text style={styles.infoValue}>{deploymentList.Name}</Text>
                                    </View>
                                    <View style={styles.oneInfo}>
                                        <Text style={styles.infoTitle}>{strings('dplment.list.contract_number')}</Text>
                                        <Text style={styles.infoValue}>{deploymentList.Contract}</Text>
                                    </View>
                                    <View style={styles.oneInfo}>
                                        <Text style={styles.infoTitle}>{strings('dplment.list.phone_number')}</Text>
                                        <Text style={styles.infoValue}>{deploymentList.Phone}</Text>
                                    </View>
                                    <View style={styles.oneAddress}>
                                        <Text style={styles.infoTitle}>{strings('dplment.list.install_address')}</Text>
                                        <Text style={styles.infoValue}>{deploymentList.Address}</Text>
                                    </View>
                                </View>

                                <View style={styles.createBox}>
                                    <TouchableOpacity
                                        style={styles.btnCreate}
                                        onPress={()=> {
                                            NavigationService.navigate('DeploymentDetail',{
                                                SupID : deploymentList.SupId
                                            });
                                        }}
                                    >
                                        <Text style={styles.txtBtnCreate}>{strings('list_customer_info.list.list.Detail')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            )) :
                            // Render view khi khong co data tra ve
                            <View style={styles.dataEmpty} >
                                <View style={[styles.wrapImage]}>
                                    <Image 
                                    style={styles.imageNoData} 
                                    source={require('../../../assets/images/contract-list/report.png')}
                                    />
                                    <View>
                                        <Text style={[{marginTop: 26, color: '#D6D6D6'}]}>{strings('all.data.noData')}</Text>
                                    </View>
                                </View>
                            </View>
                        }
                    </ScrollView>
                </View>
                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}
export default connect()(DeploymentList)