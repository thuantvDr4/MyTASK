import db from '../../config/cache';

const cache = (province, data) => {
    return new Promise(function(resolve) {
        db.executeSql(
            "INSERT OR REPLACE INTO District(province, data) VALUES(?, ?)", 
            [province, JSON.stringify(data)], 
            (tx, results) => {
                resolve(results);
            }
        );
    });
}

const getCache = (province) => {
    return new Promise(function(resolve) {
        db.transaction((tx) => {
            tx.executeSql("SELECT data FROM District WHERE province = ?", [province], (tx, results) => {
                if (results.rows.length == 0) {
                    resolve([]);
                }

                resolve(JSON.parse(results.rows.item(0).data));
            }, (err) => {
                db.executeSql(
                    `CREATE TABLE IF NOT EXISTS District (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        province integer, 
                        data TEXT
                    );`,
                    [],
                    () => {
                        db.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_province ON District (province);");
                    }
                );
                
                resolve([]);
            });
        });
    });
}

const clearCache = (province) => {
    return new Promise(function(resolve) {
        db.executeSql("DELETE FROM District WHERE province = ?", [province], (tx, results) => {
                resolve(results);
            }
        );
    });
}

const clearAll = () => {
    return new Promise(function(resolve) {
        db.executeSql("DROP TABLE District", [], (tx, results) => {
                resolve(results);
            }
        );
    });
}

export default {
    cache,
    getCache,
    clearCache,
    clearAll
};

/* 

import CacheDistrict from './app/libs/caches/cacheDistrict';


CacheDistrict.cache(1, [{Id: 1, Name: "asdf"}, {Id: 2, Name: "234sfsdf"}]);

CacheDistrict.getCache(1).then((result) => {
    console.log("adf", result);
});
//CacheDistrict.clearCache(1);

*/