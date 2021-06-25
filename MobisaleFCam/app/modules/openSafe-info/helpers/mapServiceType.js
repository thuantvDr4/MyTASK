
/*
*
* */

import {mapDeviceList_OSUpdate, mapPackageList_OSUpdate} from "../../../libs/helpers/mapPicker";

export default function mapServiceType(RegistrationObj) {

    return {

        Device: {
            List: RegistrationObj.ListOSDevice ? mapDeviceList_OSUpdate(RegistrationObj.ListOSDevice) : [],
            DeviceTotal: RegistrationObj.DeviceTotal
        },

        VAT: RegistrationObj.VAT,

        Package: {
            List: RegistrationObj.ListOSPackage ? mapPackageList_OSUpdate(RegistrationObj.ListOSPackage) : [],
            DeviceTotal: RegistrationObj.PackageTotal?RegistrationObj.PackageTotal: 0
        },
    };
}
