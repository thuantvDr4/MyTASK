import myNetwork, {encryptPassword} from '../../config/network';
import cacheWard from "../../libs/caches/cacheWard";
import cacheBuilding from "../../libs/caches/cacheBuilding";
import CacheDistrict from "../../libs/caches/cacheDistrict";
import cacheStreet from "../../libs/caches/cacheStreet";
import cacheHomeType from "../../libs/caches/cacheHomeType";
import cachePathFile from "../../libs/caches/cachePathFile";
import { mapListAdvisoryResult } from "app-libs/helpers/mapPicker";



/**
 *
 * @param myData
 * @param callback
 */
export function testDelay({}, callback) {
    myNetwork.post(
        '/Admin/DelayReturn/', {
            Time: 190000
        }
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
        callback(false, null, error);
    });
}

/**
 * get search type
 * @param myData
 * @param callback
 */
export function getSearchTypeList(callback) {
    myNetwork.post(
        '/PotentialCustomer/GetPotentialCustomerSearchTypeList', {}
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
            callback(false, null, {message: error});
        });
}

/**
 * get danh sach KHTN
 * @param myData
 * @param callback
 */
export function getListPoCus(myData, callback) {

    myNetwork.post(
        '/PotentialCustomer/getlist',
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
        callback(false, null, {message: error});
    });
}

/**
 * get chi tiet KHTN
 * @param myData
 * @param callback
 */
export function getDetailPoCus(myData, callback) {

    myNetwork.post(
        '/PotentialCustomer/GetDetail',
        myData,
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
        callback(false, null, {message: error});
    });
}

/**
 * save KHTN
 * @param myData
 * @param callback
 */
export function createPoCus(myData, callback) {

    myNetwork.post(
        '/PotentialCustomer/create',
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
            callback(false, null, {message: error});
        });
}

/**
 * get list advisory picker
 * @param myData
 * @param callback
 */
export function getAdvisoryTemplateList(callback, options) {

    myNetwork.post(
        '/PotentialCustomer/GetAdvisoryTemplateList',
        {}
    )
    .then(response => response.data)
    .then(response => {

        if (response.Code === 1) {
            callback(mapListAdvisoryResult(response.Data));
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
 * get list advisory
 * @param myData
 * @param callback
 */
export function getAdvisoryList(myData, callback) {
    myNetwork.post(
        '/PotentialCustomer/GetAdvisoryList',
        myData
    )
    .then(response => response.data)
    .then(response => {
        // console.log(response);
        if (response.Code === 1) {
            callback(true, response.Data, null);
        }
        else {
            callback(false, null, {Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        callback(false, null, {message: error});
    });
}

/**
 * update advisory
 * @param myData
 * @param callback
 */
export function callTime(myData, callback) {
    myNetwork.post(
        '/PotentialCustomer/CallTime',
        myData
    )
    .then(response => response.data)
    .then(response => {
        // console.log(response);
        if (response.Code === 1) {
            callback(true, response.Data, null);
        }
        else {
            callback(false, null, {Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        callback(false, null, {message: error});
    });
}

/**
 * update advisory
 * @param myData
 * @param callback
 */
export function updateAdvisory(myData, callback) {
    myNetwork.post(
        '/PotentialCustomer/UpdateAdvisory',
        myData
    )
    .then(response => response.data)
    .then(response => {
        // console.log(response);
        if (response.Code === 1) {
            callback(true, response.Data, null);
        }
        else {
            callback(false, null, {Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        callback(false, null, {message: error});
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
 * V2.8
 * update Recare
 * @param myData
 * @param callback
 */
export function updateRecare(myData, callback) {
    myNetwork.post(
        '/PotentialCustomer/Recare_Create',
        myData
    )
        .then(response => response.data)
        .then(response => {
            // console.log(response);
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {Code: response.Code, message: response.Message});
            }
        })
        .catch(error => {
            callback(false, null, {message: error});
        });
}


/**
 * V2.8
 * get list recare
 * @param myData
 * @param callback
 */
export function getReCareList(myData, callback) {
    myNetwork.post(
        '/PotentialCustomer/Recare_ListByKHTN',
        myData
    )
        .then(response => response.data)
        .then(response => {
            // console.log(response);
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {Code: response.Code, message: response.Message});
            }
        })
        .catch(error => {
            callback(false, null, {message: error});
        });
}


/**
 * V2.8
 * post delete item in recare list
 * @param myData
 * @param callback
 */
export function deleteRecareItem(myData, callback) {
    myNetwork.post(
        '/PotentialCustomer/Recare_Delete',
        myData
    )
        .then(response => response.data)
        .then(response => {
            // console.log(response);
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {Code: response.Code, message: response.Message});
            }
        })
        .catch(error => {
            callback(false, null, {message: error});
        });
}


/**
 * thuantv-05/10/2020
 * V2.8
 * post get RecareList_Bydate
 * @param myData
 * @param callback
 */
export function getRecareList_Bydate(myData, callback) {
    myNetwork.post(
        '/PotentialCustomer/Recare_ListByDate',
        myData
    )
        .then(response => response.data)
        .then(response => {
            // console.log(response);
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {Code: response.Code, message: response.Message});
            }
        })
        .catch(error => {
            callback(false, null, {message: error});
        });
}


/**
 * thuantv-05/10/2020
 * V2.8
 * post get Birthday List_Bydate
 * @param myData
 * @param callback
 */
export function getBirthdayList(myData, callback) {
    myNetwork.post(
        '/PotentialCustomer/Birthday_List',
        myData
    )
        .then(response => response.data)
        .then(response => {
            // console.log(response);
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {Code: response.Code, message: response.Message});
            }
        })
        .catch(error => {
            callback(false, null, {message: error});
        });
}
