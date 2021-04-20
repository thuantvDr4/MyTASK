import React from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {strings} from 'locales/i18n';

import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';

import * as api from '../api';

class FormBookportAddress extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            data: {},
            showBuilding: false
        };

        this.changeLocation = this.changeLocation.bind(this);
        this.changeDistrict = this.changeDistrict.bind(this);
        this.changeWard = this.changeWard.bind(this);
        this.changeHomeType = this.changeHomeType.bind(this);
        this.changeBuilding = this.changeBuilding.bind(this);
        this.changeStreet = this.changeStreet.bind(this);
        this.changeHouseNumber = this.changeHouseNumber.bind(this);
    }

    /**
     * Ham callback de cho popup lay thong tin Province
     * 
     * @param function callback 
     */
    getLocationData(callback)
    {
        setTimeout(() => {
            callback(this.props.locationOpt);
        }, 0);
    }

    /**
     * Xu ly khi Province thay doi
     * 
     * @param array selectItem [{Id: 123, Name: "abc"}] 
     */
    changeLocation(selectItem)
    {
        if (selectItem == this.state.data.Location) {
            return;
        }

        // Reset lai thong tin District, Ward, Street
        this.setState({
            data: {
                ...this.state.data,
                Location: selectItem,
                District: null,
                Ward: null,
                Street: null
            }
        });
    }

    /**
     * Xu ly khi District thay doi
     * 
     * @param array selectItem [{Id: 123, Name: "abc"}] 
     */
    changeDistrict(selectItem)
    {
        if (selectItem == this.state.data.District) {
            return;
        }

        // Reset lai thong tin Ward, Street
        this.setState({
            data: {
                ...this.state.data,
                District: selectItem,
                Ward: null,
                Street: null
            }
        });
    }

    /**
     * Xu ly khi Ward thay doi
     * 
     * @param array selectItem [{Id: 123, Name: "abc"}] 
     */
    changeWard(selectItem)
    {
        if (selectItem == this.state.data.Ward) {
            return;
        }

        // Reset lai thong tin Street
        this.setState({
            data: {
                ...this.state.data,
                Ward: selectItem,
                Street: null
            }
        });
    }

    /**
     * Xu ly khi Home Type thay doi
     * 
     * @param array selectItem [{Id: 123, Name: "abc"}] 
     */
    changeHomeType(selectItem)
    {
        if (selectItem == this.state.data.HomeType) {
            return;
        }

        // Khoi tao bien an/hien cho building
        let isVisible = false;

        // Neu Home Type = 'building' thi hien chon building
        if (selectItem.Id == c.HOME_TYPE_BUILDING) {
            isVisible = true;
        }

        // Gan state de render lai building
        this.setState({
            data: {
                ...this.state.data,
                HomeType: selectItem,
            },
            showBuilding: isVisible
        });
    }

    /**
     * Xu ly chon building
     * 
     * @param array selectItem [{Id: 123, Name: "abc"}] 
     */
    changeBuilding(selectItem)
    {
        if (selectItem == this.state.data.Building) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                Building: selectItem
            }
        });
    }

    /**
     * Xu ly chon street
     * 
     * @param array selectItem [{Id: 123, Name: "abc"}] 
     */
    changeStreet(selectItem)
    {
        if (selectItem == this.state.data.Street) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                Street: selectItem
            }
        });
    }

    /**
     * Luu thong tin HouseNumber
     * 
     * @param string text
     */
    changeHouseNumber(text)
    {
        this.setState({
            data: {
                ...this.state.data,
                BillTo_Number: text
            }
        });
    }

    /**
     * Render Form
     */
    render()
    {
        return (
            <KeyboardAvoidingView style={{ flex: 0.9}} behavior="position" enabled>
                <PickerSearchInput
                    label = {strings('sale_new.bookport_address.form.city_label')}
                    placeholder = {strings('sale_new.bookport_address.form.city_placeholder')}
                    filterText = {strings('sale_new.bookport_address.form.city_filterText')}
                    getOptionData = {this.getLocationData.bind(this)}
                    value = {this.props.locationOpt[0]}
                    onChange = {this.changeLocation}
                />

                <PickerSearchInput
                    label = {strings('sale_new.bookport_address.form.district_label')}
                    placeholder = {strings('sale_new.bookport_address.form.district_placeholder')}
                    filterText = {strings('sale_new.bookport_address.form.district_filterText')}
                    getOptionData = {api.loadDistrict}
                    value = {this.state.data.District}
                    onChange = {this.changeDistrict}
                    params = {this.state.data.Location ? this.state.data.Location.Id : null}
                />

                <PickerSearchInput
                    label = {strings('sale_new.bookport_address.form.ward_label')}
                    placeholder = {strings('sale_new.bookport_address.form.ward_placeholder')}
                    filterText = {strings('sale_new.bookport_address.form.ward_filterText')}
                    getOptionData = {api.loadWard}
                    value = {this.state.data.Ward}
                    onChange = {this.changeWard}
                    params = {this.state.data.District ? {Location: this.state.data.Location.Id, District : this.state.data.District.Id} : null}
                />

                <PickerSearchInput
                    label = {strings('sale_new.bookport_address.form.home_type_label')}
                    placeholder = {strings('sale_new.bookport_address.form.home_type_placeholder')}
                    filterText = {strings('sale_new.bookport_address.form.home_type_filterText')}
                    getOptionData = {api.loadHomeType}
                    value = {this.state.data.HomeType}
                    onChange = {this.changeHomeType}
                />

                <PickerSearchInput
                    visible = {this.state.showBuilding}
                    label = {strings('sale_new.bookport_address.form.building_label')}
                    placeholder = {strings('sale_new.bookport_address.form.building_placeholder')}
                    filterText = {strings('sale_new.bookport_address.form.building_filterText')}
                    getOptionData = {api.loadBuilding}
                    value = {this.state.data.Building}
                    onChange = {this.changeBuilding}
                    params = {this.state.data.Location ? this.state.data.Location.Id : null}
                />

                <PickerSearchInput
                    label = {strings('sale_new.bookport_address.form.street_label')}
                    placeholder = {strings('sale_new.bookport_address.form.street_placeholder')}
                    filterText = {strings('sale_new.bookport_address.form.street_filterText')}
                    getOptionData = {api.loadStreet}
                    value = {this.state.data.Street}
                    onChange = {this.changeStreet}
                    params = {this.state.data.Ward ? {Location: this.state.data.Location.Id, District : this.state.data.District.Id, Ward: this.state.data.Ward.Id} : null}
                />

                <TextInput
                    label = { strings('sale_new.bookport_address.form.apartment_no_label') }
                    placeholder = { strings('sale_new.bookport_address.form.apartment_no_placeholder') }
                    onChangeText={this.changeHouseNumber}
                    underlineColorAndroid='rgba(0,0,0,0)'
                />
            </KeyboardAvoidingView>
        );
    }
}

export default FormBookportAddress;