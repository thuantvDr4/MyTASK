// DB
import cacheLogin from "../caches/cacheLogin";

/**
 * 
 * @param {*} callback 
 */
export async function readCacheLogin(callback) {
    
    // get caches noti number
    const dataCache = await cacheLogin.getCache();
    return callback( dataCache );
}

/**
 * 
 * @param {*} num 
 * @param {*} callback 
 */
export function writeCacheLogin(num) {

    // set caches noti number
    cacheLogin.cache(num);
}

/**
 * 
 * @param {*} num 
 * @param {*} callback 
 */
export function removeCacheLogin(callback) {

    // set caches noti number
    cacheLogin.clearAll();
    return callback( true );
}