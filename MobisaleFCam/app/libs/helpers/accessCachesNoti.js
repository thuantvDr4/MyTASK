// DB
import cacheNotiNum from "../caches/cacheNotiNum";

/**
 * 
 * @param {*} callback 
 */
export async function readCacheNotiNum(callback) {
    
    // get caches noti number
    const dataCache = await cacheNotiNum.getCache();
    return callback( dataCache );
}

/**
 * 
 * @param {*} num 
 * @param {*} callback 
 */
export function writeCacheNotiNum(num, callback) {

    // set caches noti number
    cacheNotiNum.cache(num);
    return callback( true );
}