import {
    mapDeviceList,
    mapDeviceListExtra,
    mapDeviceListExtra_type2,
    mapIPList,
    mapMonthList } from 'app-libs/helpers/mapPicker';
import { IP_MONTH, EXTRA_SER_ID } from '../../../config/constants';
import { isReturnOPT, discountDefault, internetUpgradeDefault, deviceReturnDefault } from "../constants";

export default function mapServiceType(RegistrationObj) {

    // console.log(RegistrationObj);

    let rListDevice = RegistrationObj.ListDevice;
    let rDeviceTotal = RegistrationObj.DeviceTotal;

    // Nếu bán thêm là Equipment or IP thì reset Lại ListDevice (Vì xài chung parse data lỗi)
    if (RegistrationObj.ListServiceType && RegistrationObj.ListServiceType[0].Id !== 5) {
        rListDevice = null;
        rDeviceTotal = null;
    }

    return {
        RegID: RegistrationObj.RegId,
        RegCode: RegistrationObj.RegCode,
        ServiceType: RegistrationObj.ListServiceType ? RegistrationObj.ListServiceType : [EXTRA_SER_ID],
        InternetUpgrade: RegistrationObj.InternetUpgrade ? RegistrationObj.InternetUpgrade : internetUpgradeDefault,
        GroupPoints: RegistrationObj.GroupPoints,
        //V2.8-thuantv add: 27/10/2020
        NoteAddress: RegistrationObj.NoteAddress,

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
        Device: {
            List: rListDevice ? mapDeviceListExtra_type2(rListDevice.ListEquipment) : [],
            DeviceReturn: rListDevice ? rListDevice.DeviceReturn : deviceReturnDefault,
            DeviceTotal: rDeviceTotal
        },
        StaticIP: {
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
        }
    };
}
