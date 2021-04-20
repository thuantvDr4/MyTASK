// LIB
import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, BackHandler, Alert } from 'react-native';
import { strings } from 'locales/i18n';
import { NavigationActions } from 'react-navigation'

// REDUX
import { connect } from 'react-redux';

// ACTION
import { actions as customerInfo } from '../';

// STYLE
import styles from '../styles';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';

// COMPONENT
import HandleHardBackButton from '../components/HandleHardBackButton';

// CONST
const { nextStep } = customerInfo;

class Tabbar extends Component {

    constructor(props) {
        super(props);

		this.state = {
            isTabF: true,
            isTabS: false,
            isTabT: false,
            isScreen: this.props.isScreen,
        };

        this._onPress = this._onPress.bind(this);
	}

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isStep) {
            this.setState({
                ...this.state,
                isTabF: nextProps.isStepFDone,
                isTabS: nextProps.isStepSDone,
                isTabT: nextProps.isStepTDone,
                isScreen: nextProps.isScreen
            });
        }
    }

    componentWillUnmount() {
        // destroy all state step
        var dataStep = {step: 3};
        this.props.nextStep(dataStep);
    }

    _jumpTo(jumpTo, tabName) {
        return jumpTo(tabName);
    }

    _onPress(jumpTo, tabName, tabIndex) {
        var dataStep = {};

        switch (tabIndex) {
            case 0:
                if (this.state.isTabF) {
                    dataStep = {
                        step: 1,
                        isScreen: tabName
                    }
                    this._jumpTo(jumpTo, tabName);
                    this.props.nextStep(dataStep);
                }
                break;

            case 1:
                if (this.state.isTabS) {
                    dataStep = {
                        step: 2,
                        isScreen: tabName
                    }
                    this._jumpTo(jumpTo, tabName);
                    this.props.nextStep(dataStep);
                }
                break;

            default:
                break;
        }
    }

    /**
     * Pass OnBack to component HandleHardBack
     * @public
     */
    onBack = () =>  {
        const { isScreen } = this.state;
        const { navigation, jumpTo, FormDataUpdated } = this.props;
        var dataStep = {};

        if (isScreen == 'ciAmount') {

            dataStep = {
                step: 2,
                isScreen: 'ciServiceType'
            }
            this._jumpTo(jumpTo, 'ciServiceType');
            this.props.nextStep(dataStep);

        } else if (isScreen == 'ciServiceType') {

            dataStep = {
                step: 1,
                isScreen: 'ciInfo'
            }
            this._jumpTo(jumpTo, 'ciInfo');
            this.props.nextStep(dataStep);

        } else {
            Alert.alert(
                strings('customer_info.dialog.title'),
                strings('dl.customer_info.goBack'),
                [
                    { text: strings('dialog.btnCancel'), onPress: () => {}, style: "cancel" },
                    { text: strings('dialog.btnOK'), onPress: () => {

                            if (!FormDataUpdated.RegCode) {
                                NavigationService.navigate('BookportAddress', {});
                            } else {
                                NavigationService.navigate('lciDetailCustomer', {
                                    RegID : FormDataUpdated.RegId,
                                    RegCode : FormDataUpdated.RegCode
                                });
                            }
                        }
                    },
                ],
                { cancelable: false },
            );
        }
        return true;
	};


    /**
     * Render Component
     * @
     */
    render() {
        const {
            navigation, renderIcon, activeTintColor,
            inactiveTintColor, jumpToIndex, jumpTo
        } = this.props;

        const { routes } = navigation.state;
        console.log('ROUTES---', routes)

        const tab1tit = strings('customer_info.tabbar.cus_info');
        const tab2tit = strings('customer_info.tabbar.type_ser');
        const tab3tit = strings('customer_info.tabbar.total');

        return (
            <HandleHardBackButton onBack={this.onBack}>
                <View style={[styles.nv_container]}>
                    {
                        routes && routes.map( (route, index) => {

                            const focused = index === navigation.state.index;
                            const tintColor = focused ? activeTintColor : inactiveTintColor;
                            let isTab;
                            let tabTitle;

                            switch (route.key) {
                                case "openSafe_ciInfo":
                                    tabTitle = tab1tit;
                                    isTab = this.state.isTabF;
                                    break;

                                case "openSafe_ciServiceType":
                                    tabTitle = tab2tit;
                                    isTab = this.state.isTabS;
                                    break;

                                case "openSafe_ciAmount":
                                    tabTitle = tab3tit;
                                    isTab = this.state.isTabT;
                                    break;

                                default:
                                    break;
                            }

                            return (
                                <TouchableWithoutFeedback
                                    key={route.key}
                                    style={[styles.nv_btn_wrapper]}
                                    onPress={() => this._onPress(jumpTo, route.key, index)}
                                >
                                    <View style={[styles.nv_btn]}>
                                        <Text style={[!(isTab || focused) ? styles.nv_text : styles.nv_text_act]}>{tabTitle}</Text>
                                        <View style={[!(isTab || focused) ? styles.nv_circle : styles.nv_circle_act]}>
                                            <Text style={[styles.nv_num]}>{ index + 1 }</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        } )
                    }

                </View>
            </HandleHardBackButton>
        );
    }
}


function mapStateToProps(state) {

    const stateCI = state.customerInfoReducer;
    const stateSL = state.saleNewReducer.RegistrationObj;

    return {
        isStep: stateCI.isStep,
        isStepFDone: stateCI.isStepFDone,
        isStepSDone: stateCI.isStepSDone,
        isStepTDone: stateCI.isStepTDone,
        isScreen: stateCI.isScreen,
        FormDataUpdated: stateSL
    };
}

export default connect(mapStateToProps, {nextStep})(Tabbar);
