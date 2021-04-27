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
        StaticIP: {
            // List: RegistrationObj.ListStaticIP ? mapIPList(RegistrationObj.ListStaticIP) : null,
            // Total: RegistrationObj.StaticIPTotal
            ListIP: !RegistrationObj.ListStaticIP || RegistrationObj.ListStaticIP.length === 0 ? null : {
                Id: RegistrationObj.ListStaticIP[0].ID,
                Name: RegistrationObj.ListStaticIP[0].ShortName,
                Price: RegistrationObj.ListStaticIP[0].Price
            },
            ListMonth: !RegistrationObj.ListStaticIP || RegistrationObj.ListStaticIP.length === 0 ? IP_MONTH : {
                Name: RegistrationObj.ListStaticIP[0].MonthOfPrepaid + 'M',
                Value: RegistrationObj.ListStaticIP[0].MonthOfPrepaid
            },
            Total: !RegistrationObj.ListStaticIP || RegistrationObj.ListStaticIP.length === 0 ? null : RegistrationObj.ListStaticIP[0].Total,
            ListStaticIP: RegistrationObj.ListStaticIP ? mapIPList(RegistrationObj.ListStaticIP) : null
        },
        GroupPoints: RegistrationObj.GroupPoints,
        VAT: RegistrationObj.VAT
    };
}