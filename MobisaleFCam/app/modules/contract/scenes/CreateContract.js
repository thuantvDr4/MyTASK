import React from 'react';
import {View, ScrollView, Text, Image, StyleSheet, Alert} from 'react-native';
import {connect} from 'react-redux';
import NavigationService from 'app-libs/helpers/NavigationService';
import {strings} from 'locales/i18n';

import moduleStyle from '../styles';
import RowInfo from '../components/RowInfo';
import ButtonBorder150 from '../components/ButtonBorder150';
import PopupDraw from '../components/PopupDraw';
import ButtonElement from 'app-libs/components/input/ButtonElement';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';

import * as api from '../api';

/**
 * Man hinh tao hop dong
 * 
 * @author DaiDP
 * @since Aug, 2018
 */
class CreateContract extends React.Component
{
    static navigationOptions = {
        title: strings('contract.create_contract.title'),
        headerRight: <View/>
    }

    constructor(props)
    {
        super(props);

        // Lay thong tin hop dong duoc truyen qua tu navigation
        const RegID = this.props.navigation.getParam('RegID');
        const RegCode = this.props.navigation.getParam('RegCode');
        const dataSystemApiToken = this.props.navigation.getParam('dataSystemApiToken');

        this.state = {
            showPopup: false,
            loadingVisible: false,
            imgPath: require('assets/images/contract/sign_empty.png'),
            params: {
                // RegID: 137713, 
                // RegCode: "ZPPFH27009"
                RegID: RegID, 
                RegCode: RegCode
            },
            info: {},
            ImageSignature: null, // Dung de nhan biet co goi API upload hinh nua khong
            dataSystemApiToken: dataSystemApiToken,
            checkCreate: false,
            isDraw: false
        }

        // bind cac function vao class hien tai
        this.offPopup = this.offPopup.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.saveSign = this.saveSign.bind(this);
    }


    /**
     * Goi API lay thong tin hop dong khi lan dau tien render view
     */
    componentDidMount()
    {
        this.showLoading(true);
        api.getRegistrationDetail(this.state.params, this.loadDetailSuccess.bind(this));
    }

    /**
     * Callback Lay thong tin hop dong thanh cong
     * 
     * @param boolean isSucess 
     * @param object data 
     * @param object msg 
     */
    loadDetailSuccess(isSucess, data, msg)
    {
        this.showLoading(false);

        if (isSucess)
        {
            this.setState({
                info: data
            });
            return;
        }

        // Hien thi loi
        this.refs['popup'].getWrappedInstance().show(msg.message);
    }

    /**
     * An hien loading
     * 
     * @param boolean isShow 
     */
    showLoading(isShow)
    {
        this.setState({
            loadingVisible: isShow
        });
    }

    /**
     * Tat popup tao chu ky
     */
    offPopup() {
        this.setState({
            showPopup: false
        });
    }

    /**
     * Hien thi popup tao chu ky
     */
    showPopup() {
        this.setState({
            showPopup: true
        });
    }

    /**
     * Ham callback khi chu ky duoc xac nhan
     * 
     * @param string path 
     */
    saveSign(path, isDraw) {        

        this.setState({
            imgPath: {uri: 'file://' + path},
            showPopup: false,
            isDraw: isDraw
        });
    }

    /**
     * 
     */
    uploadSignuature() {

        const data = {
            image: this.state.imgPath.uri,
            Username: this.props.Username,
            RegID: this.state.params.RegID,
            dataSystemApiToken: this.state.dataSystemApiToken
        };

        this.showLoading(true);
        
        api.uploadSignuature(data, (isSuccess, data, msg) => {
            if (isSuccess)
            {
                this.setState({
                    ImageSignature: data.Id,
                    checkCreate: true,
                }, 
                    () => this.createContract(data.Id)
                );
                return;
            }

            this.showLoading(false);
            this.refs['popup'].getWrappedInstance().show(msg.message);
        });
    }

    /**
     * 
     * @param {*} idSignuatureImg 
     */
    createContract(idSignuatureImg) {

        // Khoi tao data goi API
        const formData = {
            Username: this.props.Username,
            RegCode: this.state.params.RegCode,
            ImageSignature: idSignuatureImg
        };

        // Goi API tao hop dong
        api.createObject(formData, (isSuccess, data, msg) => {
            // Sau khi tat loading xong thi xu ly chuyen trang
            this.setState({
                loadingVisible: false
            }, () => {
                // xu ly chuyen trang neu thanh cong
                if (isSuccess) {
                    NavigationService.navigateBackHome('ContractDetail', {
                        Contract: data.Contract, 
                        ObjID: data.ObjID, 
                        pdfDownloadLink: this.props.pdfDownloadLink
                    });

                    return;
                }
    
                // Hien thi thong bao loi
                this.refs['popup'].getWrappedInstance().show(msg.message);
            });
        });   
    }

    /**
     * Xu ly submit khi click nut tao hop dong
     */
    onSubmit() {
        //
        if (!this.state.imgPath.uri || !this.state.isDraw) {
            this.refs['popup'].getWrappedInstance().show(strings('dl.contract.create_contract.sign_empty'));
            return;
        }

        if (! this.state.ImageSignature) {
            this.uploadSignuature();
        } else {
            if (! this.state.checkCreate) {
                this.showLoading(true);
                this.createContract(this.state.ImageSignature);
            }
        }
    }

    /**
     * Render view chinh
     */
    render() {
        const {info} = this.state;
        // console.log("uri " + this.state.imgPath.uri);
        // console.log("isDraw " + this.state.isDraw);
        // console.log(this.state);

        return (
            <ScrollView contentContainerStyle={moduleStyle.container}>
                <View style={moduleStyle.innerContainer}>

                    {
                        // CUS INFO
                    }
                    <Text style={moduleStyle.textTitle}>{strings('contract.create_contract.cus_info')}</Text>
                    <RowInfo
                        label={strings('contract.create_contract.cus_name')}
                        text={info.FullName}
                    />
                    <RowInfo
                        label={strings('contract.create_contract.ticket_no')}
                        text={info.RegCode}
                    />
                    <RowInfo
                        label={strings('contract.create_contract.cus_phone')}
                        text={info.Phone1}
                    />
                    <RowInfo
                        label={strings('contract.create_contract.email')}
                        text={info.Email}
                    />
                    <RowInfo
                        label={strings('contract.create_contract.address')}
                        text={info.Address}
                    />

                    {
                        // CONTRACT INFO
                    }
                    <Text style={[moduleStyle.textTitle, moduleStyle.spaceSession]}>{strings('contract.create_contract.contract_info')}</Text>
                    <View style={styles.btnContainer}>
                        <ButtonBorder150
                            title={strings('contract.create_contract.view_detail')}
                            onPress={() => {
                                NavigationService.navigate('ContractPattern', this.state.params);
                            }}
                        />

                        <ButtonBorder150
                            title={strings('contract.create_contract.create_sign')}
                            onPress={this.showPopup}
                        />
                    </View>

                    <View style={styles.signContainer}>
                        <Text>{strings('contract.create_contract.party_a')}</Text>
                        <Text>{strings('contract.create_contract.sign_and_name')}</Text>
                        <Image source={this.state.imgPath} style={{width: 280, height: 150}} resizeMode="center"/>
                        <Text>{info.FullName}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <ButtonElement 
                            title={strings('contract.create_contract.create_contract')}
                            onPress={this.onSubmit.bind(this)}
                        />
                    </View>

                    <PopupDraw
                        visible={this.state.showPopup}
                        onClose={this.offPopup}
                        onSave={this.saveSign}
                    />
                    <PopupWarning ref="popup"/>
                    <TechLoading visible={this.state.loadingVisible}/>
                </View>
            </ScrollView>
        );
    }
}


export default connect((state) => {
    return {
        Username: state.authReducer.userInfo.UserName,
        pdfDownloadLink: state.authReducer.userInfo.DownloadPdfContractUrl
    }
}, null)(CreateContract);

const styles = StyleSheet.create({
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signContainer: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginBottom: 8,
        flex: 1,
        justifyContent: 'flex-end',
        minHeight: 80
    }
});