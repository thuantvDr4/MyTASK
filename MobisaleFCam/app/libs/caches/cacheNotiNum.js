import db from '../../config/cache';

const cache = (data) => {
    return new Promise(function(resolve) {
        db.executeSql(
            "INSERT OR REPLACE INTO NotiNum(num, data) VALUES(?, ?)", 
            [1, data], 
            (tx, results) => {
                resolve(results);
            }
        );
    });
}

const getCache = () => {
    return new Promise(function(resolve) {
        db.transaction((tx) => {
            tx.executeSql("SELECT data FROM NotiNum WHERE num = ?", [1], (tx, results) => {
                if (results.rows.length == 0) {
                    resolve([]);
                }

                resolve(JSON.parse(results.rows.item(0).data));
            }, (err) => {
                db.executeSql(
                    `CREATE TABLE IF NOT EXISTS NotiNum (
                        num INTEGER PRIMARY KEY, 
                        data TEXT
                    );`
                );
                
                resolve([]);
            });
        });
    });
}

const clearCache = () => {
    return new Promise(function(resolve) {
        db.executeSql("DELETE FROM NotiNum WHERE num = ?", [1], (tx, results) => {
                resolve(results);
            }
        );
    });
}

const clearAll = () => {
    return new Promise(function(resolve) {
        db.executeSql("DROP TABLE NotiNum", [], (tx, results) => {
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