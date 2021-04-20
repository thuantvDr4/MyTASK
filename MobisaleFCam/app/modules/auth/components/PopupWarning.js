import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Dialog, { 
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation, } from 'react-native-popup-dialog';
import {strings} from 'locales/i18n';

export default class PopupWarning extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            popupContent: '',
        };
    }

    /**
     * Show popup
     * @param {*} message 
     * @param {*} callbackClose 
     */
    show(mes) {
        if (mes== '') return;
        
        this.setState({
            visible: true,
            popupContent: mes,
        });
    }

    /**
     * Hide normal
     */
    hide() {
        this.setState({
            visible: false,
        });        
    }

    render() {
        return (
            <Dialog
                ref={(popupDialog) => {
                    this.dialog = popupDialog;
                    // this.props.setPopupWarning(popupDialog);
                }}
                visible={this.state.visible}
                width={0.8}
                dialogStyle={styles.dialogContainer}
                containerStyle={{ zIndex: 100, elevation: 10 }}
                dialogTitle={
                    <DialogTitle 
                        title={strings('dialog.title')} 
                        titleStyle={styles.dialogTitleStyle} 
                        titleTextStyle={styles.dialogTitleTextStyle} />
                }
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
        );
    }

};

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