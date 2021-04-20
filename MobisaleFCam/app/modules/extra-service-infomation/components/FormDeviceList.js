import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NumericInput from 'app-libs/components/input/NumericInput';
import PickerDeviceInput from './PickerDeviceInput';

class FormDeviceList extends React.PureComponent
{
	constructor(props)  
	{
		super(props);

		this.state = {
			devices: this.props.value.List,
			amount: this.props.value.DeviceTotal,
		}
	}

	componentWillReceiveProps(nextProps)
	{
		if (nextProps.value != this.props.value) {
			this.setState({
				devices: nextProps.value.List,
				amount: nextProps.value.DeviceTotal,
			});
		}        
	}

	onSelectedDevice(selectedItem) {
		/*
		if (selectedItem == this.state.devices) {
			//return;
		}*/
	
		this.setState({
			devices: selectedItem,
			amount: this.calcTotalAmount(selectedItem)
		}, () => this.callbackOnChange());
	}

	callbackOnChange() {

		const devices = this.state.devices;
		
		this.props.onChange && this.props.onChange({
			List: devices,
			DeviceTotal: this.state.amount
		});
	}

	changeAmount(id, val) {

		// Gan so luong cua item
		let devices = this.state.devices;
		const index = devices.findIndex(x => x.Id == id);

		// Gắn số lượng
		devices[index].Number = parseInt(val);
		// Tính tổng tiền 1 thiết bị
		devices[index].TotalPrice = parseInt(val) * devices[index].Price
		
		this.setState({
			devices: devices,
			amount: this.calcTotalAmount(devices)
		}, () => this.callbackOnChange());
	}

	calcTotalAmount(devices)
	{
		// Tinh so tien
		let amount = 0;
		for(x in devices) {
			amount += devices[x].Number * devices[x].Price;
		}

		return amount;
	}


	_renderItem(item, index)
	{
		// console.log(item);
		return (
			<View style={styles.numericContainer} key={"item-" + item.Id}>
				<View style={styles.nameContainer}>
					<Text style={styles.nameLeftText}>{item.Name}</Text>
					<Text style={styles.nameRightText}>{item.Price}</Text>
				</View>
				<View style={styles.amountContainer}>
					<NumericInput
						editable={item.ChangeNumber == 1}
						maxValue={this.props.maxValue}
						value={item.Number}
						onChange={(val) => this.changeAmount(item.Id, val)}
					/>
				</View>
			</View>
		);
	}


	_renderDetail()
	{
		if (this.state.devices.length == 0) {
			return null;
		}

		let listItem = [];
		for (index = 0; index < this.state.devices.length; index++)
		{
			listItem.push( this._renderItem(this.state.devices[index], index) );
		}

		return(
			<React.Fragment>
				<View style={styles.headContainer} key="header">
					<Text style={styles.headText}>{this.props.unitLabel}</Text>
					<Text style={[styles.headText, {width: 76}]}>{this.props.amountLabel}</Text>
				</View>

				{listItem}

				{/*
				<TextReadOnlyInput
					label="Total money equipment"
					value={this.state.amount.toString()}
				/>
				*/}
			</React.Fragment>
		);
	}

	/**
	 * 
	 */
	setValid(valid) {
		this.refs['pickerType'].setValid(valid);
	}


	render() {
		const listDetail = this._renderDetail();

		return (
			<React.Fragment>
				<PickerDeviceInput 
					{...this.props}
					value={this.state.devices}
					onChange={this.onSelectedDevice.bind(this)}
					key="picker"
					ref={'pickerType'}
				/>

				{listDetail}
			</React.Fragment>
		);
	}
}

FormDeviceList.defaultProps = {
	unitLabel: "Unit price",
	amountLabel: "Amount",
	maxValue: 9,
	value: {
		List: [],
		DeviceTotal: 0
	}
}

export default FormDeviceList;


const styles = StyleSheet.create({
	headContainer: {
		flexDirection: 'row', justifyContent: 'space-between',
		// marginVertical: 0,
		marginBottom: 12
	},
	headText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#444444'
	},
	numericContainer: {
		flexDirection: 'row',
		marginBottom: 12
	},
	nameContainer: {
		flex: 1, flexDirection: 'row', justifyContent: 'space-between',
		borderColor: '#d0d8e2', borderWidth: 1, borderRadius: 6,
	},
	amountContainer: {
		marginLeft: 11
	},
	nameLeftText: {
		fontSize: 12,
		lineHeight: 38,
		marginLeft: 12,
		color: '#a9a9a9'
	},
	nameRightText: {
		fontSize: 12,
		lineHeight: 38,
		marginRight: 12,
		color: '#444444'
	}
});