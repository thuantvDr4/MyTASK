import { mapDeviceList, mapIPList, mapMonthList } from 'app-libs/helpers/mapPicker';
import { INTERNET_ID, EQUIP_ID, INTERNET_EQUIP_ID, IP_MONTH } from '../../../config/constants';

export default function mapServiceType(RegistrationObj) {

    return {
        ServiceType: RegistrationObj.ListServiceType ? RegistrationObj.ListServiceType : [INTERNET_ID, EQUIP_ID],
        LocalType: !RegistrationObj.LocalType ? null : {
            Id: RegistrationObj.LocalType,
            Name: RegistrationObj.LocalTypeName
        },
        Promotion: !RegistrationObj.PromotionId ? null : {
            Id: RegistrationObj.PromotionId,
            Name: RegistrationObj.PromotionName,
            Description: RegistrationObj.PromotionDescription,
            MonthOfPrepaid: RegistrationObj.MonthOfPrepaid
        },
        ConnectionFee: !RegistrationObj.ConnectionFee && RegistrationObj.ConnectionFee != 0 ? null : {
            Id: RegistrationObj.ConnectionFee,
            Name: RegistrationObj.ConnectionFee
        },
        PaymentMethodPerMonth: !RegistrationObj.PaymentMethodPerMonth ? null : {
            Id: RegistrationObj.PaymentMethodPerMonth,
            Name: RegistrationObj.PaymentMethodPerMonthName
        },
        Device: {
            List: RegistrationObj.ListDevice ? mapDeviceList(RegistrationObj.ListDevice) : [],
            DeviceTotal: RegistrationObj.DeviceTotal
        },

        GroupPoints: RegistrationObj.GroupPoints,
        VAT: RegistrationObj.VAT,

        Package: {
            List: RegistrationObj.ListPackage ? mapDeviceList(RegistrationObj.ListPackage) : [],
            DeviceTotal: RegistrationObj.PackageTotal
        },
    };
}
