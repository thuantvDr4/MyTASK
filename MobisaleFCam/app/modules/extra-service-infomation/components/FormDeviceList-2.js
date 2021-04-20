/**
 * @desc: Component List Devices Bán thêm
 * @author: ThuanDD3
 * @date: 040820
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { strings } from "locales/i18n";

// Component
import NumericInput from 'app-libs/components/input/NumericInput';
import PickerDeviceInput from './PickerDeviceInput';
import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';
import PickerInputDynamic from 'app-libs/components/input/PickerInputDynamic';
import ModalPickerSimpleTruncate from "app-libs/components/ModalPickerSimpleTruncate";
import InputO from "app-libs/components/input/InputO";

// Styles
import ols from "../../../styles/Ola-style";

class FormDeviceList_2 extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			devices: this.props.value.List.length !== 0 ? this.props.value.List : [],
			amount: this.props.value.DeviceTotal,
			devicesReturn: this.props.value.DeviceReturn
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value != this.props.value) {
			this.setState({
				devices: nextProps.value.List,
				amount: nextProps.value.DeviceTotal,
				devicesReturn: nextProps.value.DeviceReturn
			});
		}        
	}

    /**
     * @desc Back data to father screen
     */
	callbackOnChange() {

        const { devices, amount, devicesReturn } = this.state;
		
		this.props.onChange && this.props.onChange({
			List: devices,
			DeviceTotal: amount,
			DeviceReturn: devicesReturn
		});
	}

	/**
	 * @desc Tính tổng tiền thiết bị
	 * @param {*} devices 
	 */
	_calcTotalAmount(devices) {
		
		// Tinh so tien
		let amount = 0;
		for(x in devices) {
			amount += devices[x].Number * devices[x].Price;
		}

		return amount;
	}

    /**
     * @desc chọn item
     * @param {*} selectedItem 
     */
	_handleSelectEquipment(selectedItem, index) {
		// 
        const { devices } = this.state;

		// 
        if (devices.length !== 0 && selectedItem.Name == devices[index].Name) {
            return;
        }

		// 
        if (index !== -1) {
            devices[index] = {
				// ...devices[index],
				...selectedItem,
				Number: 1,
				Discount: 0
			};
        }
		
		this.setState({
			devices: devices,
            amount: this._calcTotalAmount(devices)
        }, () => this.callbackOnChange());
	}

	/**
	 * 
	 * @param {*} kind 
	 * @param {*} selectedItem 
	 * @param {*} index 
	 */
	_handleUpdateDiscount = (kind, selectedItem, index) => {

		const { devices } = this.state;

		// stop update if choose same
        if (devices.length === 0 || selectedItem.value == devices[index].Discount) {
            return;
		}
		
		// 
		if (index !== -1) {
            devices[index] = {
				...devices[index],
				Discount: selectedItem.value,
			};
        }
		
		// 
		this.setState({
			devices: devices,
            
		}, () => this.callbackOnChange());
	}

	/**
	 * @desc Add thêm thiết bị - max 4
	 */
	_handleAddMoreEquipment = () => {
		const { devices } = this.state;

		if (devices.length === 0) {
			this._error({message: 'Please add one Device before add more'});
			return;
		}

		// 
		devices.push({});
		
		// 
		this.setState({
			devices: devices

		}, () => this.callbackOnChange());
	};

	/**
	 * @desc Xóa thiết bị
	 * @param {*} index
	 */
	_handleRemoveEquipment = (index) => {
		const { devices } = this.state;

		// remove data
		if (index > -1) {
			devices.splice(index, 1);
		}

		// Set data
		this.setState({
			devices: devices

		}, () => this.callbackOnChange())
	}

	/**
	 * @desc Render 1 item
	 * @param {*} item 
	 * @param {*} index 
	 */
	_renderItem(item, index = 0) {

		const mapDiscountValue = {
			value: item && item.Discount ? item.Discount : 0,
			label: item && item.Discount <= 100
				? item.Discount + "%" : item && item.Discount > 100
				? "Other" : "0%"
		};

        return (
			<View key={"item-" + index} style={{flexDirection: 'row'}}>
				
				<View style={{flex: 1}}>
					{ /** ----> picker */ }
					<View>
						<PickerSearchInput
							ref={'pickerEquipment' + index}
							key="picker"
							label = {strings('extra_service.extra_service_info.type_of_service.infomation.lb_newEquipment')}
							placeholder = {strings('customer_info.service_type.form.listDevice_placeholder')}
							filterText = {strings('customer_info.service_type.form.listDevice_filterText')}
							getOptionData={this.props.getOptionData}
							value = {item && item.Name && item}
							onChange = {selectedItem => this._handleSelectEquipment(selectedItem, index)}
						/>
					</View>

					{ /** ----> price & discount */ }
					{
						item && item.EquipID && 
							<View style={ols.rows}>
								<View style={ols.cols}>
									<InputO
										ref=""
										label={'Price'}
										placeholder={'Price'}
										textAlign={'right'}
										autoCapitalize={'none'}
										returnKeyType={'done'}
										autoCorrect={false}
										style={[styles.textInput, ols.fw500, ols.txtR]}
										value={item && item.Price ? item.Price.toString() : '0'}
										editable={false}
										onChangeText={text => {() => {}}}
									/>
								</View>
								<View style={ols.cols}>
									<ModalPickerSimpleTruncate
										ref={"optDiscount" + index}
										label={strings("extra_service.extra_service_info.type_of_service.equipments.lb_discount")}
										placeholder={strings("extra_service.extra_service_info.type_of_service.equipments.plh_discount")}
										headerTitle={strings("extra_service.extra_service_info.type_of_service.equipments.plh_discount")}
										options={this.props.getOptionDataDiscount}
										getLabel={item => item.label}
										onValueChange={ 
											(selectedItem) => this._handleUpdateDiscount('Discount', selectedItem, index)
										}
										value={mapDiscountValue}
										defaultValue={mapDiscountValue}
									/>
								</View>
							</View>
					}
					
				</View>
			
				{ /* Button Erase */ }
				{
					index >= 1 && (
						<TouchableOpacity
							onPress={() => this._handleRemoveEquipment(index)}
							style={styles.deleteIcon}
						>
							<Image
								style={{ width: 30, height: 30 }}
								source={require('../../../assets/images/extra-service/ic_delete.png')}
							/>
						</TouchableOpacity>
					)
				}
			</View>
        )
	}

	/**
	 * @desc Render list item
	 */
	_renderDetail = () => {

        const { devices } = this.state;
		let listItem = [];

        // 
		if (devices.length === 0) { 
			// return null; 
			listItem.push(this._renderItem());
		} else {
			// 
			devices.map((item, index) => {
				listItem.push(this._renderItem(item, index) );
			})
		}

        return (
			<React.Fragment>

				{
					// ---> list
					listItem
				}

				{ 
					// ---> show & hide button add
					devices.length <= 3 
					?
						<TouchableOpacity style={styles.addMoreButton} onPress={() => this._handleAddMoreEquipment()}>
							<Image
								style={styles.addMoreIcon}
								source={require("../../../assets/images/extra-service/ic_add.png")}
							/>
							<Text style={[styles.addMoreText]}>
								Add equipment
							</Text>
						</TouchableOpacity>
					: null
				}
			</React.Fragment>
		);
	}
	
	/**
	 * @desc Show thông báo lỗi
	 */
	_error(message) {
		this.props.warning && this.props.warning(message);
	}

	/**
	 * @desc Validate
	 */
	setValid(index = 0) {
		const { devices } = this.state;
	
		// Item thứ 2 trở lên nếu chưa chọn thì báo
		if (index > 0) {
			if (!devices[index].EquipID) {
				this.refs['pickerEquipment' + index].setValid(false);
			} else {
				this.refs['pickerEquipment' + index].setValid(true);
			}
		}
	}

	/**
	 * Main
	 */
	render() {
        // console.log(this.state)
		const listDetail = this._renderDetail();

		return (
			<React.Fragment>
				{
                    listDetail
                }
			</React.Fragment>
		);
	}
}

/**
 * 
 */
FormDeviceList_2.defaultProps = {
	value: {
		List: [],
		DeviceReturn: null,
		DeviceTotal: 0
	}
}

/**
 * 
 */
export default FormDeviceList_2;

/**
 * 
 */
const styles = StyleSheet.create({
	textInput: {
        height: 40,
        paddingRight: 12, paddingLeft: 12,
        fontSize: 12, color: '#444444',
        borderColor: 'transparent', borderWidth: 0,
    },
	textInputContainer: {
		flexDirection: 'row',
	},
	deleteIcon: {
		justifyContent: 'center', alignItems: "flex-end",
		width: 40,
		marginBottom: 12
	},

	// Button Add
	addMoreButton: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12
	},
	addMoreIcon: {
		width: 20, height: 20
	},
	addMoreText: {
		color: "#3F93FF",
		fontSize: 14,
		fontWeight: "500",
		marginLeft: 10
	},

});