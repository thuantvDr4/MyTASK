

/**
 * TechAppModalAction components
 *
 * - Use react-native-popup-dialog
 * - Document see at:
 *
 * @author ThuanDD3
 * @since Jul, 2019
 */

// LIB
import React, {Component} from 'react';
import {StyleSheet, View, Text, Modal, BackHandler} from 'react-native';
import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    SlideAnimation,
    ScaleAnimation, } from 'react-native-popup-dialog';
import {strings} from 'locales/i18n';
import {connect} from "react-redux";

// LIB CUSTOM
import { showModalAction, hideModalAction } from 'app-libs/helpers/showModal';
import { forceStopModalLocal } from 'app-libs/helpers/showModalHelper';
import { forceStopLoadingLocal } from 'app-libs/helpers/showLoadingHelper';
import NavigationService from 'app-libs/helpers/NavigationService';

class TechAppModalAction extends Component {

    // set
    isCancel = false;

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            popupContent: this.props.content,
            widthPopup: 0.8
        };

        this.hide = this.hide.bind(this)
        this.onConfirmPopup = this.onConfirmPopup.bind(this)
    }

    /**
     *
     */
    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    /**
     *
     */
    componentWillUnmount() {
        this.backHandler.remove()
    }

    /**
     * Description: Get new Props
     */
    componentWillReceiveProps(nextProps) {

        if (nextProps.isShow != this.props.isShow) {
            this.show(nextProps);
        }
    }

    /**
     * Description: Show Modal
     */
    show(nextProps) {
        // New props la true moi show
        if (nextProps.isShow) {
            this.isCancel = false;
            const { loadingLocal, forceStopLoadingLocal} = this.props;

            // Kiem tra app co dang loading local ko
            if (loadingLocal) {
                // Force stop loading local
                forceStopLoadingLocal(true);
            }

            // Thuc hien chuyen man hinh
            setTimeout(() => {
                this.setState({
                    visible: nextProps.isShow,
                    popupContent: nextProps.content,
                });
            }, 10);
        } else {
            this.isCancel = false;
            this.hide();
        }
    }

    /**
     * Description: Hide Modal
     */
    hide() {
        this.setState({
            visible: false,
        }, this.onClosePopup);
    }

    /**
     * Description: Do Action After Modal Close
     */
    onClosePopup() {
        const { hideModalAction, forceStopLoadingLocal} = this.props;

        if (this.isCancel) {
            // Reset back redux modal
            hideModalAction();

            // Reset back Force stop loading local
            forceStopLoadingLocal(false);
        }
    }

    /**
     * Description: Do Action
     */
    onConfirmPopup() {
        const { routeName, params, hideModalAction, modalLocal, forceStopModalLocal, loadingLocal, forceStopLoadingLocal} = this.props;

        if (!this.isCancel) {

            // Kiem tra app co dang load modal local ko
            if (modalLocal) {
                // Force stop modal local
                forceStopModalLocal(true);
            }

            // Kiem tra app co dang loading local ko
            if (loadingLocal) {
                // Force stop loading local
                forceStopLoadingLocal(false);
            }

            // Thuc hien chuyen man hinh
            setTimeout(() => {
                // Navigate screen
                // NavigationService.navigate(routeName, params);
                // NavigationService.navigateReset(routeName, params);
                NavigationService.navigateBackHome(routeName, params); // xu ly cho V2.8

                // Reset back redux modal
                hideModalAction();

                // Reset back Force stop loading local
                forceStopLoadingLocal(false);
            }, 10);
        }
    }

    /**
     * Back android hardware
     */
    handleBackPress = () => {
        if (this.state.visible) {
            this.isCancel = true;
            this.hide();
            return true;
        }
    }

    render() {

        const {actionText} = this.props;

        return (
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
                    this.isCancel = true;
                    this.hide();
                }}
                dialogTitle={
                    <DialogTitle
                        title={strings('dialog.title')}
                        style={styles.dialogTitleContainer}
                        titleTextStyle={styles.dialogTitleTextStyle} />}
                footer={
                    <DialogFooter style={[styles.dialogButtonContainer]}>
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
                <DialogContent style={[styles.dialogContentContainer]}>
                    <Text style={{textAlign: 'center'}}>
                        {this.state.popupContent}
                    </Text>
                </DialogContent>
            </Dialog>
        );
    }
}

export default connect( state => {

    return {
        isShow: state.splashReducer.modalGlobalAction.isShow,
        content: state.splashReducer.modalGlobalAction.content,
        params: state.splashReducer.modalGlobalAction.params,
        routeName: state.splashReducer.modalGlobalAction.routeName,
        modalLocal: state.splashReducer.modalLocal,
        loadingLocal: state.splashReducer.loadingLocal
    }
}, {showModalAction, hideModalAction, forceStopModalLocal, forceStopLoadingLocal}
)(TechAppModalAction);

TechAppModalAction.defaultProps = {
    actionCallback: () => {},
    onCancel: () => {},
    actionText: "Switch Screen",
    showBtnCancel: true
}

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
