import React, {Component} from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import Dialog, { 
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation, } from 'react-native-popup-dialog';
import { strings } from 'locales/i18n';
import { connect } from 'react-redux';
import { checkModalLocal, forceStopModalLocal } from 'app-libs/helpers/showModalHelper';
import { AndroidHardwareBack }  from 'app-libs/components/AndroidHardwareBackHandler';

class PopupWarning extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            popupContent: null,
            widthPopup: 0.8
        };

        this.hide = this.hide.bind(this)
    }

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
     * Show popup
     * @param {*} message 
     * @param {*} callbackClose 
     */
    show(message, callbackClose) {

        if (message == '') return;
        
        this.setState({
            visible: true,
            popupContent: message,
            onClose: callbackClose
        });

        // Dua tinh trang load modal vao redux store
        this.props.checkModalLocal(true);
    }

    /**
     * Hide normal
     */
    hide() {
        this.setState({
            visible: false,
        }, () => {
            // Dua tinh trang load modal vao redux store
            this.props.checkModalLocal(false);
            // Xử lý nếu có function pass vào
            this.state.onClose && this.state.onClose();
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
        return (
            <AndroidHardwareBack onBackPress={this.onBackButtonPressAndroid}>
                <Dialog
                    ref={(popupDialog) => {
                        this.dialog = popupDialog;
                    }}
                    visible={this.state.visible}
                    width={this.state.widthPopup}
                    dialogStyle={styles.dialogContainer}
                    containerStyle={{ zIndex: 100, elevation: 10 }}
                    onDismiss={() => {}}
                    onTouchOutside={() => {
                        this.hide();
                    }}
                    dialogTitle={
                        <DialogTitle 
                            title={strings('dialog.title')} 
                            style={styles.dialogTitleContainer} 
                            textStyle={styles.dialogTitleTextStyle} />}
                    footer={
                        <DialogFooter style={styles.dialogButtonContainer}>
                            <DialogButton
                                text={strings('dialog.agree')}
                                onPress={() => {
                                    this.hide();
                                }}    
                                style={[styles.dialogButtonStyle]}
                                textStyle={[styles.dialogButtonTextStyle]}
                                key="button-1"
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

export default connect(
    state => {
        return {
            modalLocal: state.splashReducer.modalLocal,
            forceStopModalLocalStatus: state.splashReducer.forceStopModalLocalStatus
        }
    }, { checkModalLocal, forceStopModalLocal }, null, { withRef: true }
)(PopupWarning);

const styles = StyleSheet.create({  
    dialogContainer: {
        
    },
    dialogTitleContainer: {
        
    },
    dialogTitleTextStyle: {
        fontSize: 18, fontWeight: '500', color: '#000'
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
        fontSize: 14, fontWeight: '500', lineHeight: 40,
        color:'#0B76FF',
        
    }
});