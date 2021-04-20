import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PopupDialog, {DialogButton, DialogTitle} from 'react-native-popup-dialog';
import {strings} from 'locales/i18n';

export default class PopupAction extends Component {

    render()
    {
        return (
            <PopupDialog
                ref={(popupDialog) => {
                    this.dialog = popupDialog;
                    this.props.setPopupAction(popupDialog);
                }}
                width={0.8}
                height={180}
                containerStyle={{ zIndex: 100, elevation: 10 }}
                dialogTitle={<DialogTitle title={strings('dialog.title')} titleStyle={styles.dialogTitleStyle} titleTextStyle={styles.dialogTitleTextStyle}/>}
                actions={[
                    <View
                        key="button-1"
                        style={styles.buttonContent}
                    >
                        <View style={[styles.buttonWrap, styles.buttonLeft]}>
                            <DialogButton
                                text={strings('dialog.skip')}
                                onPress={() => {
                                    this.dialog.dismiss();
                                }}    
                                buttonStyle={styles.dialogButtonStyle}
                                textContainerStyle={styles.dialogTextContainerStyle}
                                textStyle={styles.textStyle}
                            />
                        </View>
                        <View style={styles.buttonWrap}>
                            <DialogButton
                                text={this.props.actionText}
                                onPress={() => {
                                    this.props.actionCallback(this.dialog);
                                }}    
                                buttonStyle={styles.dialogButtonStyle}
                                textContainerStyle={styles.dialogTextContainerStyle}
                                textStyle={styles.textStyle}
                            />
                        </View>
                    </View>
                ]}
            >
                <View style={styles.dialogContentView}>
                    <Text>{this.props.popupContent}</Text>
                </View>
            </PopupDialog>
        );
    }

}

const styles = StyleSheet.create({  
    dialogTitleStyle: {
        maxHeight:46, 
        padding:12
    },
    dialogTitleTextStyle: {
        fontSize: 18, 
        fontWeight:'500', 
        color: '#444'
    },
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', paddingHorizontal: 5,
        //backgroundColor:'#ccc'
    },
    dialogButtonStyle: {
        width: '100%',
        height:40,
        minHeight:40,
        backgroundColor:'#fff', 
        borderBottomLeftRadius: 8, 
        borderBottomRightRadius: 8
    },
    dialogTextContainerStyle: {
        paddingVertical: 10
    },
    textStyle: {
        color:'#0b76ff',
        lineHeight:20,
        fontSize: 14,
    },
    buttonContent: {
        borderTopColor: '#e7ecf3',
        borderTopWidth: 1,
        marginHorizontal: 20,
        flex: 1,
        flexDirection: 'row',
        maxHeight: 48
    },
    buttonWrap: {
        width: '50%',
        maxHeight: 40,
        marginVertical: 4
    },
    buttonLeft: {
        borderRightWidth: 1,
        borderRightColor: '#e7ecf3'
    }
  });