import myNetwork, {encryptPassword} from '../../config/network';
import CacheDistrict from '../../libs/caches/cacheDistrict';
import cacheWard from '../../libs/caches/cacheWard';
import cacheStreet from '../../libs/caches/cacheStreet';
import cacheHomeType from '../../libs/caches/cacheHomeType';
import cacheBuilding from '../../libs/caches/cacheBuilding';

/**
 * Xu ly load danh sach loai nha
 * 
 * @param function callback 
 */
export async function loadHomeType(callback, options) {
    
    if (! options.isRefresh)
    {
        const dataCache = await cacheHomeType.getCache();
        if (dataCache.length) {
            return callback(dataCache);
        }
    }

    myNetwork.post(
        '/Data/GetHomeTypeList',
        {}
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            cacheHomeType.cache(response.Data);
            callback(response.Data);
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        if (error === null) return;
        callback([]);
    });
}

/**
 * Xu ly load danh sach quan/huyen
 * 
 * @param int idProvince 
 * @param function callback 
 */
export async function loadDistrict(callback, options) {

    const idProvince = options.params;

    if (! options.isRefresh)
    {
        const dataCache = await CacheDistrict.getCache(idProvince);
        if (dataCache.length) {
            return callback(dataCache);
        }
    }

    myNetwork.post(
        '/Data/GetDistrictList',
        {
            LocationID: idProvince
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            CacheDistrict.cache(idProvince, response.Data);
            callback(response.Data);
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        if (error === null) return;
        callback([]);
    });
}


/**
 * Xu ly load danh sach phuong/xa
 * 
 * @param function callback 
 * @param object options
 */
export async function loadWard(callback, options) {

    if (! options.params) {
        return callback([]);
    }

    const {Location, District} = options.params;

    if (! options.isRefresh)
    {
        const dataCache = await cacheWard.getCache(Location, District);
        if (dataCache.length) {
            return callback(dataCache);
        }
    }

    myNetwork.post(
        '/Data/GetWardList',
        {
            LocationID: Location,
            DistrictId: District
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            cacheWard.cache(Location, District, response.Data);
            callback(response.Data);
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        if (error === null) return;
        callback([]);
    });
}


/**
 * Xu ly load danh sach ten duong
 * 
 * @param function callback 
 * @param object options
 */
export async function loadStreet(callback, options) {

    if (! options.params) {
        return callback([]);
    }

    const {Ward, Location, District} = options.params;

    if (! options.isRefresh)
    {
        const dataCache = await cacheStreet.getCache(Location, District, Ward);
        if (dataCache.length) {
            return callback(dataCache);
        }
    }

    myNetwork.post(
        '/Data/GetStreetList',
        {
            WardID: Ward,
            LocationID: Location,
            DistrictID: District
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            cacheStreet.cache(Location, District, Ward, response.Data);
            callback(response.Data);
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        if (error === null) return;
        callback([]);
    });
}


/**
 * Xu ly load danh sach toa nha
 * 
 * @param function callback 
 * @param number options
 */
export async function loadBuilding(callback, options) {

    const idLocation = options.params;

    if (! options.isRefresh)
    {
        const dataCache = await cacheBuilding.getCache(idLocation);
        if (dataCache.length) {
            return callback(dataCache);
        }
    }

    myNetwork.post(
        '/Data/GetBuildingList',
        {
            LocationID: idLocation
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            cacheBuilding.cache(idLocation, response.Data);
            callback(response.Data);
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        if (error === null) return;
        callback([]);
    });
}

/**
 * API noi dia chi
 * 
 * @param {*} myData 
 * @param {*} callback 
 */
export function generationAddress(myData, callback) {
    
    myNetwork.post(
        '/Data/GenerationAddress',
        myData
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            callback(true, response.Data, null);
            
        }
        else {
            callback(false, null, {Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        if (error === null) return;
        callback(false, null, {message: error});
    });
}

/**
 * API lay danh sach tap diem
 * 
 * @param {*} myData 
 * @param {*} callback 
 */
export function getListGroupPoint(myData, callback) {
    myNetwork.post(
        '/Bookport/ListOfPoints',
        myData
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data, null);
        }
        else {
            callback(false, null, {Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        if (error === null) return;
        callback(false, null, {message: error});
    });
}

/*
    Xu ly bookport tu dong
 */
export function autoBookport(myData, callback) {
    myNetwork.post(
        '/Bookport/BookPortAuto',
        myData
    )
    .then(response => response.data)
    .then(response => {

        if (response.Code === 1) {
            callback(true, response.Data, null);
        }
        else {
            callback(false, null, {Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        // ---> OLD
        // if (error === null) return;
        // callback(false, null, {message: error});

        // ---> NEW FIX SERVER (2019.09.05)
        if (error === null) {
            callback(false, null, {Code: 504});
        } else {
            callback(false, null, {message: error});
        }
    });
}

/*
    Xu ly bookport bang tay
 */
export function manualBookport(myData, callback) {
    myNetwork.post(
        '/Bookport/BookPortManual',
        myData
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            callback(true, response.Data, null);
        }
        else {
            callback(false, null, {Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        if (error === null) return;
        callback(false, null, {message: error});
    });
}