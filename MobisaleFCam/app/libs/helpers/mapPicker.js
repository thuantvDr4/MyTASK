export function mapLocation(listLocation)
{
    let dataPicker = [];

    for (let item of listLocation)
    {
        dataPicker.push({
            Name: item.Description,
            Id: item.LocationId,
            isDefault: item.IsCurrentLocation
        });
    }

    return dataPicker;
}

export function mapPromotionList(listPromotion)
{
    let dataPicker = [];

    for (let item of listPromotion)
    {
        dataPicker.push({
            Name: item.PromotionName,
            Id: item.PromotionID,
            MonthOfPrepaid: item.MonthOfPrepaid,
            RealPrepaid: item.RealPrepaid,
            PrepaidPromotion: item.PrepaidPromotion,
            Description: item.Description
        });
    }

    return dataPicker;
}

export function mapDeviceList(listDevice)
{
    let dataPicker = [];

    for (let item of listDevice)
    {
        dataPicker.push({
            Name: item.Name,
            Value: item.Value,
            Id: item.Value,
            Price: item.Price,
            Number: item.Number != undefined ? item.Number : 1,
            ChangeNumber: item.ChangeNumber, // cho phep cho so luong hay khong
        });
    }

    return dataPicker;
}

/**
 * Dung map List Device bán thêm
 * 
 * @param array  
 */
export function mapDeviceListExtra(listDevice)
{
    let dataPicker = [];

    for (let item of listDevice)
    {
        dataPicker.push({
            Name: item.Name,
            Value: item.Value,
            Id: item.Value,
            Price: item.Price,
            Number: item.Number != undefined ? item.Number : 1,
            TotalPrice: item.TotalPrice,
            ChangeNumber: item.ChangeNumber, // cho phep cho so luong hay khong
        });
    }

    return dataPicker;
}

/**
 * Dung map List Device bán thêm
 * 
 * @param array  
 */
export function mapDeviceListExtra_type2(listDevice)
{
    let dataPicker = [];

    for (let item of listDevice)
    {
        dataPicker.push({
            Discount: item.Discount,
            EquipID: item.EquipID,
            Name: item.Name,
            Number: item.Number != undefined ? item.Number : 1,
            Price: item.Price,
            Value: item.Value
        });
    }

    return dataPicker;
}

/**
 * Dung map IP
 * 
 * @param array  
 */
export function mapIPList(listIP)
{
    let dataPicker = [];
    let x = 0;

    // console.log(listIP);

    for (let item of listIP)
    {
        if (x == 0) {    
            dataPicker.push({
                ID: item.ID,
                ShortName: item.ShortName,
                Price: item.Price,
                MonthOfPrepaid: item.MonthOfPrepaid,
                Total: item.Total
            });
        }
        x++;
    }

    return dataPicker;
}

/**
 * Dung map IP
 * 
 * @param array  
 */
export function mapPickerIPList(listIP)
{
    let dataPicker = [];

    for (let item of listIP)
    {
        dataPicker.push({
            Id: item.ID,
            Name: item.ShortName,
            Price: item.Price
        });
    }

    return dataPicker;
}

/**
 * Dung map Month
 * 
 * @param array  
 */
export function mapMonthList(month)
{
    let dataPicker = [];

    for (let item of month)
    {
        dataPicker.push({
            Name: item.Name,
            Value: item.Value
        });
    }

    return dataPicker;
}

/**
 * Dung map Gift
 * 
 * @param array  
 */
export function mapGiftList(gift)
{
    let dataPicker = [];

    for (let item of gift)
    {
        dataPicker.push({
            Id: item.Code,
            Name: item.Name
        });
    }

    return dataPicker;
}


/**
 * Dung map cho phi hoa mang, tien dat coc
 * 
 * @param array listFee 
 */
export function mapFeeList(listFee)
{
    let dataPicker = [];

    for (let item of listFee)
    {
        dataPicker.push({
            Name: item.Name,
            Id: item.Name
        });
    }

    return dataPicker;
}

/**
 * Dung map cho advisory result
 * 
 * @param array list advisory result
 */
export function mapListAdvisoryResult(list) {
    let dataPicker = [];

    list.filter((item) => {
        dataPicker.push({
            Id: item.AdvisoryId,
            Name: item.AdvisoryValue,
            Other: item.IsInput
        });
    });

    return dataPicker;
}