// LIB
import React, { Component } from "react";
import {
	View,
	Text,
	TouchableWithoutFeedback,
	BackHandler,
	Alert
} from "react-native";
import { strings } from "locales/i18n";
import { NavigationActions } from "react-navigation";

// REDUX
import { connect } from "react-redux";

// ACTION
import { actions as customerInfoExtra } from "..";

// STYLE
import styles from "../../customer-info/styles";

// LIB CUSTOM
import NavigationService from "app-libs/helpers/NavigationService";

// COMPONENT
import HandleHardBackButton from "../../customer-info/components/HandleHardBackButton";

// CONST
const { nextStep } = customerInfoExtra;

class TabbarRegExtraService extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isTabF: true,
			isTabS: false,
			isTabT: false,
			isScreen: this.props.isScreen
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
		var dataStep = { step: 3 };
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
					};
					this._jumpTo(jumpTo, tabName);
					this.props.nextStep(dataStep);
				}
				break;

			case 1:
				if (this.state.isTabS) {
					dataStep = {
						step: 2,
						isScreen: tabName
					};
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
	onBack = () => {
		const { isScreen } = this.state;
		const { navigation, jumpTo, FormDataUpdated } = this.props;
		var dataStep = {};

		if (isScreen == "ciAmountExtra") {
			dataStep = {
				step: 2, isScreen: "ciServiceTypeExtra"
			};

			this._jumpTo(jumpTo, "ciServiceTypeExtra");
			this.props.nextStep(dataStep);

		} else if (isScreen == "ciServiceTypeExtra") {
			dataStep = {
				step: 1, isScreen: "ciInfoExtra"
			};

			this._jumpTo(jumpTo, "ciInfoExtra");
			this.props.nextStep(dataStep);

		} else {

			Alert.alert(
				strings("customer_info.dialog.title"),
				strings("dl.extra_service_info.goBack"),
				[
					{
						text: strings("dialog.btnCancel"),
						onPress: () => {},
						style: "cancel"
					},
					{
						text: strings("dialog.btnOK"),
						onPress: () => {
							if (!FormDataUpdated.RegCode) {
								NavigationService.navigate("ContractListExtraService");

							} else {
								NavigationService.navigate("ExtraServiceCTDetail", {
									RegID: FormDataUpdated.RegId,
									RegCode: FormDataUpdated.RegCode,
									svType: navigation.getParam('svType')
								});
							}
						}
					}
				],
				{ cancelable: false }
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
			navigation,
			renderIcon,
			activeTintColor,
			inactiveTintColor,
			jumpToIndex,
			jumpTo
		} = this.props;

		const { routes } = navigation.state;

		const tab1tit = strings("customer_info.tabbar.cus_info");
		const tab2tit = strings("customer_info.tabbar.type_ser");
		const tab3tit = strings("customer_info.tabbar.total");

		return (
			<HandleHardBackButton onBack={this.onBack}>
				<View style={[styles.nv_container]}>
					{routes &&
						routes.map((route, index) => {
							const focused = index === navigation.state.index;
							const tintColor = focused ? activeTintColor : inactiveTintColor;
							let isTab;
							let tabTitle;

							switch (route.key) {
								case "ciInfoExtra":
									tabTitle = tab1tit;
									isTab = this.state.isTabF;
									break;

								case "ciServiceTypeExtra":
									tabTitle = tab2tit;
									isTab = this.state.isTabS;
									break;

								case "ciAmountExtra":
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
										<Text
											style={[
												!(isTab || focused)
													? styles.nv_text
													: styles.nv_text_act
											]}
										>
											{tabTitle}
										</Text>
										<View
											style={[
												!(isTab || focused)
													? styles.nv_circle
													: styles.nv_circle_act
											]}
										>
											<Text style={[styles.nv_num]}>{index + 1}</Text>
										</View>
									</View>
								</TouchableWithoutFeedback>
							);
						})}
				</View>
			</HandleHardBackButton>
		);
	}
}

function mapStateToProps(state) {
	const stateCIExtra = state.extraServiceInfoReducer;

	return {
		isStep: stateCIExtra.isStep,
		isStepFDone: stateCIExtra.isStepFDone,
		isStepSDone: stateCIExtra.isStepSDone,
		isStepTDone: stateCIExtra.isStepTDone,
		isScreen: stateCIExtra.isScreen,
		FormDataUpdated: stateCIExtra.formData
	};
}

export default connect(mapStateToProps, { nextStep })(TabbarRegExtraService);
