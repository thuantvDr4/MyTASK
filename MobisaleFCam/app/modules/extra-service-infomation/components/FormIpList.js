import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';
import TextReadOnlyInput from './TextReadOnlyInput';


class FormIpList extends React.PureComponent
{
	constructor(props)  
	{
		super(props);
		
		this.state = {
			data: {
				ListIP: this.props.value.ListIP,
				ListMonth: this.props.value.ListMonth,
				Total: this.props.value.Total,
				ListStaticIP: this.props.value.ListStaticIP
			},
		}
	}

	/**
	 * 
	 * @param {*} nextProps 
	 */
	componentWillReceiveProps(nextProps) {

		if (nextProps.value != this.props.value) {
			this.setState({
				data: nextProps.value
			});
		}        
	}

	/**
	 * 
	 * @param {*} type, selectedItem 
	 */
	onSelectedItem = (type, selectedItem) => {

		// 
		const data = this.state.data;

		// Compare
		if (data[type] == selectedItem) {
            return;
        }

		// 
		if (type === 'ListIP') {
			if (selectedItem.Id < 0) {
				this.setState({
					data: {
						...this.props.valueDefault,
						ListStaticIP: []
					}
					
				}, () => this.callbackOnChange());

				return true;
			}
		} 

		// 
		data[type] = selectedItem;

		//
        this.setState({
            data: data
        }, () => this.calcTotalAmount());
	}

	/**
	 * 
	 * @param {*} val 
	 */
	calcTotalAmount() {
		// 
		const data = this.state.data;

		// Tinh so tien
		let amount = 0;
		amount = data.ListIP.Price * data.ListMonth.Value;
		
		// 
		this.setState({
			data: {
				...this.state.data,
				Total: amount,
				ListStaticIP: [{
					ID: data.ListIP.Id,
					ShortName: data.ListIP.Name,
					Price: data.ListIP.Price,
					MonthOfPrepaid: data.ListMonth.Value,
					Total: amount
				}]
			},
			
		}, () => this.callbackOnChange())
	}

	/**
	 * 
	 */
	callbackOnChange() {
		this.props.onChange && this.props.onChange({
			...this.state.data
		});
	}

	/**
	 * 
	 */
	setValid(valid) {
		this.refs['IPAdd'].setValid(valid);
	}

	/**
	 * 
	 */
	_renderDetail() {
		if (!this.state.data.ListIP) {
			return null;
		}

		return(
			<View>
				<PickerSearchInput
					label = {this.props.labelMo}
					placeholder = {this.props.placeholderMo}
					filterText = {this.props.filterTextMo}
					getOptionData = {this.props.optionDataMo}
					allowRefresh={false}
					value={this.state.data.ListMonth}
					onChange={(e) => this.onSelectedItem('ListMonth', e)}
					key="picker2"
				/>  
				
				<TextReadOnlyInput
					label={this.props.priceLabel}
					value={this.state.data.ListIP.Price}
				/>
			</View>
		);
	}


	/**
	 * 
	 */
	render() {
		const listDetail = this._renderDetail();

		return (
			<React.Fragment>
				<PickerSearchInput
					ref={'IPAdd'}
					label = {this.props.labelIp}
					placeholder = {this.props.placeholderIp}
					filterText = {this.props.filterTextIp}
					getOptionData = {this.props.optionDataIp}
					allowRefresh={false}
					value={this.state.data.ListIP}
					onChange={(e) => this.onSelectedItem('ListIP', e)}
					key="picker1"
				/>  
				

				{
					listDetail
				}
			</React.Fragment>
		);
	}
}

FormIpList.defaultProps = {
	valueDefault: {
		ListIP: null,
		ListMonth: { Value: 1, Name: '1M' },
		Total: null,
		ListStaticIP: []
	},
}

export default FormIpList;


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