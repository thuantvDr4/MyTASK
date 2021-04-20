import React, {Component} from 'react';
import {StyleSheet, View, Text, Modal, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';

import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import TextInput from 'app-libs/components/input/TextInput';
import ButtonElement from 'app-libs/components/input/ButtonElement';

import { checkModalLocal, forceStopModalLocal } from 'app-libs/helpers/showModalHelper';

import Dialog, { 
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation, } from 'react-native-popup-dialog';

import * as api from '../api';

class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            loadingVisible: false,
            data: {
                Username: this.props.Username,
                CurrentPass: "",
                NewPass: "",
                ReNewPass: ""
            }
        };

        this.hide = this.hide.bind(this);
    }

    // set
    isCancel = false;


    /**
     * Description: Get new Props
     */
    componentWillReceiveProps(nextProps) {
        
        // Nếu modal đang show, mà modal global tới thì xử lý tắt nếu modal global comfirm
        if (nextProps.forceStopModalLocalStatus != this.props.forceStopModalLocalStatus) {
            if (nextProps.forceStopModalLocalStatus) {
                this.forceHide();
            }
        }
    }


    clear() {
        api.clearHD(this.state.data.Username, () => {
            alert('ok');
        });
    }


    hide() {
        this.setState({
            visible: false
        }, () => {  
            // Dua tinh trang load modal vao redux store
            this.props.checkModalLocal(false); 
        });
    }


    /**
     * Force hide
     */
    forceHide() {
        this.setState({
            visible: false,
        }, () => {
            // Dua tinh trang load modal vao redux store
            this.props.checkModalLocal(false);

            // Reset force stop data vao redux store
            this.props.forceStopModalLocal(false);
        });        
    }


    show() {
        this.setState({
            visible: true
        }, () => {  
            // Dua tinh trang load modal vao redux store
            this.props.checkModalLocal(true);
        });
        
    }


    onChangeText(name, value) {
        const {data} = this.state;
        data[name] = value;

        this.setState({
            data: data
        });
    }


    onSubmit() {
        if (! this.isValidData()) {
            return;
        }

        this.showLoading(true);
        const {data} = this.state;
        
        api.changePassword(data, (isSuccess, data, msg) => {

            this.showLoading(false);
            
            if (isSuccess) {
                this.setState({
                    data: {
                        ...this.state.data,
                        CurrentPass: "",
                        NewPass: "",
                        ReNewPass: ""
                    }
                });

                this.refs['popup'].getWrappedInstance().show(
                    strings('dl.home.change_password.noti.change_success'), 
                    () => {
                        this.hide();
                    }
                );
                
            } else {
                this.refs['popup'].getWrappedInstance().show(msg.message);
            }
        });
    }


    isValidData() {
        const {data} = this.state;
        let errorList = [];

        // Check CurrentPass
        if (! data.CurrentPass) {
            this.refs['CurrentPass'].setValid(false);

            errorList.push({
                name: 'CurrentPass',
                msg: strings('dl.home.change_password.noti.current_pass_err')
            });
        }
        else {
            this.refs['CurrentPass'].setValid(true);
        }

        // Check NewPass
        if (! data.NewPass || data.NewPass.length < 6) {
            this.refs['NewPass'].setValid(false);

            errorList.push({
                name: 'NewPass',
                msg: strings('dl.home.change_password.noti.new_pass_err')
            });
        }
        else {
            this.refs['NewPass'].setValid(true);
        }

        // Check ReNewPass
        if (! data.ReNewPass) {
            this.refs['ReNewPass'].setValid(false);

            errorList.push({
                name: 'ReNewPass',
                msg: strings('dl.home.change_password.noti.re_new_pass_err')
            });
        }
        else if (data.ReNewPass !== data.NewPass) {
            this.refs['ReNewPass'].setValid(false);

            errorList.push({
                name: 'ReNewPass',
                msg: strings('dl.home.change_password.noti.re_new_pass_not_match')
            });
        }
        else {
            this.refs['ReNewPass'].setValid(true);
        }        


        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }


    /**
     * An hien loading
     * 
     * @param boolean isShow 
     */
    showLoading(isShow) {
        this.setState({
            loadingVisible: isShow
        });
    }


    render() {
        return (
            <View style={styles.dialog}>
                <Dialog
                    ref={(popupDialog) => {
                        this.dialog = popupDialog;
                    }}
                    visible={this.state.visible}
                    width={0.9}
                    dialogStyle={styles.dialogContainer}
                    containerStyle={{ zIndex: 100, elevation: 10 }}
                    onDismiss={() => {}}
                    onTouchOutside={() => {
                        this.hide();
                    }}
                    dialogTitle={
                        <DialogTitle 
                            title={strings('home.change_password.title')} 
                            style={styles.dialogTitleContainer} 
                            textStyle={styles.dialogTitleTextStyle} />}
                    footer={
                        <DialogFooter style={styles.dialogButtonContainer}>
                            <DialogButton
                                text={strings('home.change_password.btn_confirm')}
                                onPress={this.onSubmit.bind(this)}    
                                style={[styles.dialogButtonStyle]}
                                textStyle={[styles.dialogButtonTextStyle]}
                                key="button-1"
                            />
                        </DialogFooter>
                    }
                >
                    <DialogContent style={styles.dialogContentContainer}>
                        <TextInput
                            ref="CurrentPass"
                            label = { strings('home.change_password.current_pass') }
                            placeholder = { strings('home.change_password.current_pass_placeholder') }
                            onChangeText={(text) => this.onChangeText("CurrentPass", text)}
                            value={this.state.data.CurrentPass}
                            secureTextEntry={true}
                        />

                        <TextInput
                            ref="NewPass"
                            label = { strings('home.change_password.new_pass') }
                            placeholder = { strings('home.change_password.new_pass_placeholder') }
                            onChangeText={(text) => this.onChangeText("NewPass", text)}
                            value={this.state.data.NewPass}
                            secureTextEntry={true}
                        />

                        <TextInput
                            ref="ReNewPass"
                            label = { strings('home.change_password.re_new_pass') }
                            placeholder = { strings('home.change_password.re_new_pass_placeholder') }
                            onChangeText={(text) => this.onChangeText("ReNewPass", text)}
                            secureTextEntry={true}
                            value={this.state.data.ReNewPass}
                        />
                    </DialogContent>
                </Dialog>
                <PopupWarning ref="popup"/>
            </View>



            // <Modal 
            //     visible={this.state.visible}
            //     onRequestClose={() => {}}
            //     transparent={true}
            // >
            //     <TouchableWithoutFeedback onPress={this.hide.bind(this)}>
            //         <View style={styles.dialog}>
                        
            //             <View style={styles.dialogInner}>
            //                 <View style={styles.dialogTitleStyle}>
            //                     <Text style={styles.dialogTitleTextStyle}>{ strings('home.change_password.title') }</Text>
            //                 </View>
            //                 <View style={styles.dialogContentView}>
            //                     <TextInput
            //                         ref="CurrentPass"
            //                         label = { strings('home.change_password.current_pass') }
            //                         placeholder = { strings('home.change_password.current_pass_placeholder') }
            //                         onChangeText={(text) => this.onChangeText("CurrentPass", text)}
            //                         value={this.state.data.CurrentPass}
            //                         secureTextEntry={true}
            //                     />

            //                     <TextInput
            //                         ref="NewPass"
            //                         label = { strings('home.change_password.new_pass') }
            //                         placeholder = { strings('home.change_password.new_pass_placeholder') }
            //                         onChangeText={(text) => this.onChangeText("NewPass", text)}
            //                         value={this.state.data.NewPass}
            //                         secureTextEntry={true}
            //                     />

            //                     <TextInput
            //                         ref="ReNewPass"
            //                         label = { strings('home.change_password.re_new_pass') }
            //                         placeholder = { strings('home.change_password.re_new_pass_placeholder') }
            //                         onChangeText={(text) => this.onChangeText("ReNewPass", text)}
            //                         secureTextEntry={true}
            //                         value={this.state.data.ReNewPass}
            //                     />

            //                     { this.state.error !== "" ?
            //                         <View style={styles.errorContent}>
            //                             <Text style={{textAlign: 'center'}}>{this.state.error}</Text>
            //                         </View>
            //                         : null
            //                     }
    
            //                     <View style={styles.buttonContent}>
            //                         <ButtonElement 
            //                             title={strings('home.change_password.btn_confirm')}
            //                             onPress={this.onSubmit.bind(this)}
            //                         />
            //                     </View>
            //                 </View>
            //             </View>
            //         </View>
            //     </TouchableWithoutFeedback>
            //     <PopupWarning ref="popup"/>
            //     <TechLoading visible={this.state.loadingVisible}/>
            // </Modal>
        );
    }
}

export default connect(
    state => {
        return {
            modalLocal: state.splashReducer.modalLocal,
            forceStopModalLocalStatus: state.splashReducer.forceStopModalLocalStatus
        }
    }, { checkModalLocal, forceStopModalLocal }, null, { withRef: true }
)(ChangePassword);

const styles = StyleSheet.create({  
    dialog: {
        // flex: 1
        // backgroundColor: 'rgba(68,68,68,0.5)',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    dialogInner: {
        // maxHeight: 400,
    },
    dialogTitleStyle: {
        maxHeight:46, 
        minHeight:46, 
        padding:12,
        backgroundColor:'#fff',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        alignItems: 'center',
    },
    dialogTitleTextStyle: {
        fontSize: 18, 
        fontWeight:'500', 
        color: '#444'
    },
    dialogContentView: {
        flex: 1,
        backgroundColor:'#fff',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        padding: 20,
        borderTopColor: '#e7ecf3',
        borderTopWidth: 2
    },
    buttonContent: {
        marginTop: 20
    },


    dialogContainer: {

    },
    dialogTitleContainer: {
        
    },
    dialogTitleTextStyle: {
        fontSize: 18, fontWeight: '500', color: '#000'
    },
    dialogContentContainer: {
        paddingTop: 20
    },
    dialogButtonContainer: {
        paddingVertical: 5, marginHorizontal: 15,
    },
    dialogButtonStyle: {
        height: 40, 
    },
    dialogButtonTextStyle: {
        height: 40, 
        fontSize: 16, fontWeight: '500', lineHeight: 40,
        color:'#0B76FF',
        
    }
});