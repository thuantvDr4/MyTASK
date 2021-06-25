
export function makeDataDevice_OS(listDevice)
{
    let dataFrom = [];

    for (let item of listDevice)
    {
        dataFrom.push({
            ID: item.Id,
            Name: item.Name,
            Qty: item.Number,
            Price: item.Price,
            Total: item.Price * item.Number,
        });
    }

    return dataFrom;
}
