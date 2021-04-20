import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

// LIB COMPONENT CUSTOM
import {CustomPicker} from 'react-native-custom-picker';

// HELPER
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';

// Gobal Style
import {color, fontSize} from "../../styles/Ola-style";

var styleRe = require('../../styles/Ola-style');

// IMAGE
var souD = require('assets/images/tech-picker/down-arrow.png');
var souU = require('assets/images/tech-picker/up-arrow.png');

const ols = styleRe.default;


/**
 * TechPickup Component
 *
 * - Document Readmore here: https://www.npmjs.com/package/react-native-custom-picker
 * - Common Properties and Events:
 *
 * ############# Properties #############
 * 1. options: Array of options
 * 2. value: default value of TechPickup
 *
 * ############# Events #################
 * 1. onValueChange(value): Event when select change
 *
 * @author ThuanDD3
 * @since Aug, 2020
 */
class ModalPicker extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            isValid: true,					// Validate field
            isPressed: false,				// Kiểm tra bấm và bấm xong, thay đổi icon
            selectItem: this.props.value,	// item được chọn
            wLabel: 0,
            wField: 0
        };
    }

    /**
     *
     */
    componentDidMount() {
        const {selectItem} = this.state;

        if (selectItem) {

            setTimeout(() => {
                this.props.onValueChange && this.props.onValueChange(selectItem);
            }, 0);
        }
    }

    /**
     *
     * @param {*} nextProps
     */
    componentWillReceiveProps(nextProps) {
        let newState = {};

        if (nextProps.value != this.props.value) {
            newState.selectItem = nextProps.value;
        }

        this.setState(newState);
    }

    /**
     *
     */
    _slec() {
        this.setState({
            isPressed: true,
        });
    }

    /**
     *
     */
    _unslec() {
        this.setState({
            isPressed: false,
        });
    }

    //get width label;
    _getWidthLabel = e => {
        const {width} = e.nativeEvent.layout;
        this.setState({
            wLabel: width
        });
    };

    //get width toaàn bộ field;
    _getWidthField = e => {
        const {width} = e.nativeEvent.layout;
        this.setState({
            wField: width
        });
    };

    /**
     *
     * @param {*} selectItem
     */
    _onChange(pickItem) {

        const {getLabel} = this.props;
        const {selectItem, isValid} = this.state;

        //
        if (getLabel(pickItem) === getLabel(selectItem)) {
            return;
        }

        this.setState({
            pickItem: pickItem,
            isValid: (pickItem.Id || pickItem.EquipID) && !isValid ? true : isValid
        });

        this.props.onValueChange && this.props.onValueChange(pickItem);
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

    render() {
        const {isValid, value} = this.state;
        const validStyle = createValidStyleSheet(isValid);

        return (
            <View ref="MPC" style={[ols.field, validStyle.validStyleBorder]} onLayout={e => this._getWidthField(e)}>
                {/** Placeholder field */}
                <Text onLayout={e => this._getWidthLabel(e)} style={[ols.plfake, ols.fs12]}>{this.props.label}</Text>

                {/** CustomPicker  */}
                <CustomPicker
                    {...this.props}
                    fieldTemplate={this.renderField.bind(this)}
                    optionTemplate={this.renderOption.bind(this)}
                    headerTemplate={this.renderHeader.bind(this)}

                    backdropStyle={ols.dD_backDrop}
                    modalStyle={ols.dD_modal}
                    modalAnimationType={'fade'}
                    onFocus={this._slec.bind(this)}
                    onBlur={this._unslec.bind(this)}

                    value={value}
                    onValueChange={value => {
                        this._onChange(value);
                    }}
                />
            </View>
        );
    }

    /**
     *
     * @param {*} settings
     */
    renderField(settings) {
        // Không dùng selectedItem của lib
        const {selectedItem, defaultText, getLabel} = settings;
        const {selectItem, isPressed, isValid, wField, wLabel} = this.state;
        const validStyle = createValidStyleSheet(isValid);


        return (
            <View style={[ols.dD_container, {width: wField - wLabel - 15, alignSelf: "flex-end"}]}>
                <Text ellipsizeMode={"tail"} numberOfLines={1}
                      style={[ols.dD_text, ols.txtR, ols.fw500, ols.cl444, validStyle.validStyleText]}>
                    {!selectItem ? defaultText : getLabel(selectItem)}
                </Text>
                <Image style={[ols.dD_ico, {tintColor: '#8a919a'}]} source={!isPressed ? souD : souU}/>
            </View>
        )
    }

    /**
     *
     */
    renderHeader() {
        if (!this.props.headerTitle) {
            return;
        }

        return (
            <View style={ols.dD_headerContainer}>
                <Text style={ols.dD_headerText}>{this.props.headerTitle}</Text>
            </View>
        )
    }

    /**
     *
     * @param {*} settings
     */
    renderOption(settings) {
        const {item, getLabel} = settings;

        return (
            <View style={ols.dD_optionContainer}>
                <Text style={ols.dD_optionText}>{getLabel(item)}</Text>
            </View>
        )
    }
}

export default ModalPicker;
