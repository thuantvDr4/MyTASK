import React, { Component } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import Dialog, { 
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation, } from 'react-native-popup-dialog';
import { strings } from 'locales/i18n';
import { AndroidHardwareBack }  from 'app-libs/components/AndroidHardwareBackHandler';
import DrawBoard from './DrawBoard';

export default class PopupDraw extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            visible: this.props.visible
        };
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }

    hide() {
        this.setState({
            visible: false
        }, () => {
            this.props.onClose && this.props.onClose();
        });
        
    }

    onSave(saveEvent, isDraw) {
        // this.hide();
        this.setState({
            visible: false
        }, () => {
            this.props.onSave(saveEvent, isDraw);
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
                    visible={this.state.visible}
                    width={0.95}
                    height={390}
                    dialogStyle={styles.dialogContainer}
                    containerStyle={{ zIndex: 10, elevation: 10}}
                    dialogTitle={
                        <DialogTitle 
                            title={strings('contract.create_contract.dialog_title_sign')} 
                            style={styles.dialogTitleContainer} 
                            textStyle={styles.dialogTitleTextStyle}/>
                    }
                    onTouchOutside={() => {
                        this.hide();
                    }}
                >
                    <DialogContent style={styles.dialogContentContainer}>
                        <DrawBoard
                            onSave={this.onSave.bind(this)}
                        />
                    </DialogContent>
                </Dialog>
            </AndroidHardwareBack>
        );
    }
}

const styles = StyleSheet.create({  
    dialogContainer: {

    },
    dialogTitleContainer: {
        // maxHeight:46, 
        // padding:12
    },
    dialogTitleTextStyle: {
        fontSize: 18, fontWeight: '500', color: '#000'
    },
    dialogContentContainer: {
        flex: 1, paddingTop: 20,
        // alignItems: 'center', justifyContent: 'center',
        width: '100%',
        backgroundColor:'#fff',
    },
});