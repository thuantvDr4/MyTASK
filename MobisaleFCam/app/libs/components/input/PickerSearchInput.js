import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import NavigationService from 'app-libs/helpers/NavigationService';
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';
import { trimLongText } from  'app-libs/helpers/regex';

/**
 * Picker search with new screen
 *
 * ############# Properties #############
 * 1. label: Label text
 * 2. placeholder: Text display when not choose
 * 3. value: value selected
 * 4. prompt: Title of option dialog
 * 5. filterText: Text display input filter screen
 * 6. getOptionData(callback, params): Call API to get data. When done, call callback(data).
 * 7. params: When call getOptionData, we will call with this params
 *
 * ############# Events #################
 * 1. onChange(value): Event when select change
 *
 *
 * @author DaiDP
 * @since Aug, 2018
 * @edit ThuanDD3
 * @desc Truncate long text, validate more item id
 */
class PickerSearchInput extends React.PureComponent {

    /**
     *
     * @param {*} props
     */
    constructor(props) {
        super(props);

        this.state = {
            selectItem: this.props.value,
            params: this.props.params,
            visible: this.props.visible != undefined ? this.props.visible : true,
            isValid: true,
			widthLabel: 0,
			widthField: 0
        }
    }

    /**
     *
     * @param {*} nextProps
     */
    componentWillReceiveProps(nextProps) {
        let newState = {};

        if (nextProps.params != this.props.params) {
            newState.params = nextProps.params;
        }

        if (nextProps.value != this.props.value) {
            newState.selectItem = nextProps.value;
        }

        if (nextProps.visible != this.props.visible) {
            newState.visible = nextProps.visible;
        }

        this.setState(newState);
    }

    /**
     *
     */
    componentDidMount() {
        if (this.state.selectItem) {
            setTimeout(() => {
                this.props.onChange(this.state.selectItem);
            }, 0);
        }
    }

    /**
     *
     */
    openOptionScreen() {
        NavigationService.navigate('SearchPickerDynamic', {
            getOptionData: this.getOptionData.bind(this),
            onChange: this.onChange.bind(this),
            title: this.props.label,
            placeholder: this.props.filterText,
            allowRefresh: this.props.allowRefresh == undefined ? true : this.props.allowRefresh
        });
    }

    /**
     *
     * @param {*} callback
     * @param {*} isRefresh
     */
    getOptionData(callback, isRefresh) {
        this.props.getOptionData(callback, {
            params: this.state.params,
            isRefresh: isRefresh
        });
    }

    /**
     *
     * @param {*} selectedItem
     */
    onChange(selectedItem) {
        // Update 050820: thêm EquipID tắt validate)
        this.setState({
            selectItem: selectedItem,
            isValid: (selectedItem.Id || selectedItem.EquipID) && !this.state.isValid ? true : this.state.isValid
        });

        this.props.onChange && this.props.onChange(selectedItem);
    }

    /**
     *
     * @param {*} isValid
     */
    setValid(isValid) {
        this.setState({
            isValid: isValid
        })
    }

	/**
     * get width label
     * @param {*} e
     */
	_getWidthLabel = e => {
        const { width } = e.nativeEvent.layout;

		this.setState({
			widthLabel: width
		});
    };

	/**
     * get width toaàn bộ field
     * @param {*} e
     */
	_getWidthField = e => {
        const { width } = e.nativeEvent.layout;

		this.setState({
			widthField: width
		});
	};

    render() {
        if (! this.state.visible) {
            return null;
        }

        const { widthLabel, widthField } = this.state;
        const validStyle = createValidStyleSheet(this.state.isValid);
        const {selectItem} = this.state;

        return (
            <View onLayout={e => this._getWidthField(e)} style={[styles.wrapper, validStyle.validStyleBorder]}>
                <View onLayout={e => this._getWidthLabel(e)}>
                    <Text style={styles.label}>
                        { this.props.label }
                    </Text>
                </View>

                <TouchableOpacity
                    disabled={this.props.disabled}
                    style={
                        [
                            styles.fieldContainer,
                            { width: widthField - widthLabel - 26 }
                        ]
                    }
                    onPress={this.openOptionScreen.bind(this)}>
                        <Text
                            ellipsizeMode={"tail"}
                            numberOfLines={1}
                            style={[styles.textField, validStyle.validStyleText]}>
                                {selectItem ? trimLongText(selectItem.Name) : this.props.placeholder}
                        </Text>
                    <Image style={[styles.ico, { tintColor: '#8a919a'}]} source={require('assets/images/tech-picker/down-arrow.png')} />
                </TouchableOpacity>
            </View>
        );
    }
}

PickerSearchInput.defaultProps = {
    onChange: () => {}
};

export default PickerSearchInput;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection:'row', alignItems: 'center', justifyContent: 'space-between',
        minHeight: 40, paddingHorizontal: 12,
        marginBottom: 12,
        borderColor: '#d0d8e2', borderWidth: 1, borderRadius: 5,
    },
    label: {
        fontSize: 12,
        color: '#9a9a9a'
    },
    fieldContainer: {
        height: 37,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    textField: {
        color: '#444', fontSize: 12, fontWeight: '500',
        marginRight: 15,
    },
    ico: { position: 'absolute', right: 0, top: '50%', marginTop: -5, width: 10, height: 10 },
});
