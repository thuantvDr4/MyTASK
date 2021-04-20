// LIB
import React from "react";
import { Alert } from "react-native";
import { HeaderBackButton } from "react-navigation";
import { strings } from "locales/i18n";

// REDUX
import { connect } from "react-redux";

// LIB CUSTOM
import NavigationService from "app-libs/helpers/NavigationService";

class HandleBackExtraService extends React.Component {
	constructor(props) {
		super(props);

		this._handlePress = this._handlePress.bind(this);
	}

	_handlePress() {
		const { navigation } = this.props;
		const FormDataUpdated = this.props.FormDataUpdated;

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
							NavigationService.navigate("ContractListExtraService", {});

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

		return true;
	}

	render() {
		return <HeaderBackButton onPress={this._handlePress} tintColor="#fff" />;
	}
}

export default connect(state => {
	const stateCIExtra = state.extraServiceInfoReducer;

	return {
		FormDataUpdated: stateCIExtra.formData
	};
})(HandleBackExtraService);
