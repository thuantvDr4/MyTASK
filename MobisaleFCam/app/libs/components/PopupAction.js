import React, {Component} from 'react';
import {StyleSheet, View, Text, Modal} from 'react-native';
import Dialog, { 
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation, } from 'react-native-popup-dialog';
import {strings} from 'locales/i18n';
import { connect } from 'react-redux';
import { checkModalLocal, forceStopModalLocal } from 'app-libs/helpers/showModalHelper';
import { AndroidHardwareBack }  from 'app-libs/components/AndroidHardwareBackHandler';

class PopupAction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            popupContent: null,
            widthPopup: 0.8
        };

        this.hide = this.hide.bind(this)
        this.onConfirmPopup = this.onConfirmPopup.bind(this)
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

    /**
     * 
     * @param {*} message 
     */
    show(message) {
        if (message == '') return;
            
            this.isCancel = false;
            this.setState({
                visible: true,
                popupContent: message
            });
        
        // Dua tinh trang load modal vao redux store
        this.props.checkModalLocal(true);
    }

    /**
     * 
     */
    hide() {
        this.setState({
            visible: false
        }, this.onClosePopup);
    }

    /**
     * 
     */
    onClosePopup() {
        const { onCancel } = this.props;
        
        // Dua tinh trang load modal vao redux store
        this.props.checkModalLocal(false);
        
        if (this.isCancel) {
            onCancel && onCancel();
        }
    }

    /**
     * 
     */
    onConfirmPopup() {
        const { actionCallback } = this.props;
        
        if (!this.isCancel) {
            setTimeout(() => {
                actionCallback();
                // Dua tinh trang load modal vao redux store
                this.props.checkModalLocal(false);
            }, 200);
        }
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

    /**
     * close modal nếu nhấn back cứng android.
     */
    onBackButtonPressAndroid = () => {
        if (this.state.visible) {
            this.hide();
            return true;
        }
    };

    render() {
        const {actionText, showBtnCancel} = this.props;
        
        return (
            <AndroidHardwareBack onBackPress={this.onBackButtonPressAndroid}>
                <Dialog
                    ref={(popupDialog) => {
                        this.dialog = popupDialog;
                    }}
                    visible={this.state.visible}
                    width={this.state.widthPopup}
                    dialogStyle={styles.dialogContainer}
                    containerStyle={{ zIndex: 101, elevation: 10 }}
                    onDismiss={() => {}}
                    onTouchOutside={() => {
                        this.isCancel = false;
                        this.hide();
                    }}
                    dialogTitle={
                        <DialogTitle 
                        title={strings('dialog.title')} 
                        style={styles.dialogTitleContainer} 
                        titleTextStyle={styles.dialogTitleTextStyle} />
                    }
                    footer={
                        <DialogFooter style={styles.dialogButtonContainer}>
                            { showBtnCancel 
                                ?
                                <DialogButton
                                    text={strings('dialog.skip')}
                                    onPress={() => {
                                        this.isCancel = true;
                                        this.hide();
                                    }}    
                                    style={[styles.dialogButtonStyle]}
                                    textStyle={styles.dialogButtonTextStyle}
                                    key="button-1"
                                />
                                : []
                            }
                            
                            <DialogButton
                                text={actionText}
                                onPress={() => {
                                    this.isCancel = false;
                                    this.hide();
                                    this.onConfirmPopup();
                                }}  
                                style={[styles.dialogButtonStyle]}
                                textStyle={[styles.dialogButtonTextStyle, {fontWeight: 'bold'}]}
                                key="button-2"
                            />
                        </DialogFooter>
                    }
                >
                    <DialogContent style={styles.dialogContentContainer}>
                        <Text style={{textAlign: 'center'}}>{this.state.popupContent}</Text>   
                    </DialogContent>
                </Dialog>
            </AndroidHardwareBack>
        );
    }
}

PopupAction.defaultProps = {
    actionCallback: () => {},
    actionText: "Confirm",
    onCancel: () => {},
    showBtnCancel: true
}

export default connect(
    state => {
        return {
            modalLocal: state.splashReducer.modalLocal,
            forceStopModalLocalStatus: state.splashReducer.forceStopModalLocalStatus
        }
    }, { checkModalLocal, forceStopModalLocal }, null, { withRef: true }
)(PopupAction);

const styles = StyleSheet.create({  
    dialogContainer: {
        
    },
    dialogTitleContainer: {
        
    },
    dialogTitleTextStyle: {
        fontSize: 18, fontWeight:'500', 
        color: '#444'
    },
    dialogContentContainer: {
        paddingTop: 10
    },
    dialogButtonContainer: {
        paddingVertical: 5, marginHorizontal: 15,
    },
    dialogButtonStyle: {
        height: 40,
    },
    dialogButtonTextStyle: {
        height: 40, 
        fontSize: 14, fontWeight: '300', lineHeight: 40,
        color:'#0B76FF',
    }
});