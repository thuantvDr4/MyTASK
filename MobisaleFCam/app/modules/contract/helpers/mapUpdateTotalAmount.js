import {mapDeviceList} from 'app-libs/helpers/mapPicker';

export default function mapUpdateTotalAmount(RegistrationObj)
{
    return {
        LocationId: RegistrationObj.LocationId,
        ServiceType: RegistrationObj.ListServiceType,
        LocalType: !RegistrationObj.LocalType ? null : {
            Id: RegistrationObj.LocalType,
            Name: RegistrationObj.LocalTypeName
        },
        Promotion: !RegistrationObj.PromotionId ? null : {
            Id: RegistrationObj.PromotionId,
            Name: RegistrationObj.PromotionName,
            MonthOfPrepaid: RegistrationObj.MonthOfPrepaid,
            Description: RegistrationObj.PromotionDescription
        },
        ConnectionFee: !RegistrationObj.ConnectionFee && RegistrationObj.ConnectionFee != 0 ? null : {
            Id: RegistrationObj.ConnectionFee,
            Name: RegistrationObj.ConnectionFee
        },
        Device: {
            List: mapDeviceList(RegistrationObj.ListDevice),
            DeviceTotal: RegistrationObj.DeviceTotal
        },
        VAT: {
            Id: RegistrationObj.VAT,
            Name: RegistrationObj.VAT
        },
        DepositFee: {
            Id: RegistrationObj.DepositFee,
            Name: RegistrationObj.DepositFee
        },
        Contract: RegistrationObj.Contract,
        ObjId: RegistrationObj.ObjId,
        Total: RegistrationObj.Total,
        Kind: RegistrationObj.Kind
    };
}