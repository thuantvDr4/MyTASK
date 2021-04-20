import db from '../../config/cache';

const cache = (data) => {
    return new Promise(function(resolve) {
        db.executeSql(
            "INSERT OR REPLACE INTO HomeType(id, data) VALUES(?, ?)", 
            [1, JSON.stringify(data)], 
            (tx, results) => {
                resolve(results);
            }
        );
    });
}

const getCache = () => {
    return new Promise(function(resolve) {
        db.transaction((tx) => {
            tx.executeSql("SELECT data FROM HomeType WHERE id = ?", [1], (tx, results) => {
                if (results.rows.length == 0) {
                    resolve([]);
                }

                resolve(JSON.parse(results.rows.item(0).data));
            }, (err) => {
                db.executeSql(
                    `CREATE TABLE IF NOT EXISTS HomeType (
                        id INTEGER PRIMARY KEY, 
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
        db.executeSql("DELETE FROM HomeType WHERE id = ?", [1], (tx, results) => {
                resolve(results);
            }
        );
    });
}

const clearAll = () => {
    return new Promise(function(resolve) {
        db.executeSql("DROP TABLE HomeType", [], (tx, results) => {
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