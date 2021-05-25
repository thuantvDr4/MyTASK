// LIB
import React from 'react';
import { Alert } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { strings } from 'locales/i18n';

// REDUX
import { connect } from "react-redux";

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';


class HandleSoftBackButton extends React.Component {

    constructor(props) {
        super(props);

        this._handlePress = this._handlePress.bind(this);
    }

    _handlePress() {
        const { navigation } = this.props;
        const FormDataUpdated = this.props.FormDataUpdated;

        Alert.alert(
            strings('dl.open_safe.title_dialog'),
            strings('dl.open_safe.goBack'),
			[
				{ text: strings('dialog.btnCancel'), onPress: () => {}, style: "cancel" },
                { text: strings('dialog.btnOK'), onPress: () => {

                        if (!FormDataUpdated.RegCode) {
                            NavigationService.navigate('BookportAddress', {});

                        } else {
                            NavigationService.navigate('openSafe_DetailCustomer', {
                                RegID : FormDataUpdated.RegId,
                                RegCode : FormDataUpdated.RegCode
                            });
                        }
                    }
				},
			],
			{ cancelable: false },
        );

        return true;
    }

    render() {
        return (
            <HeaderBackButton onPress={this._handlePress} tintColor="#fff"/>
        );
    }
}

export default connect( (state) => {
    const stateSL = state.saleNewReducer.openSafeObj;

    return {
        FormDataUpdated: stateSL
    }
})( HandleSoftBackButton );
