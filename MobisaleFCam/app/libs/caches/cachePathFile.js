import db from '../../config/cache';

const cache = (type, key, path) => {
    return new Promise(function(resolve) {
        db.executeSql(
            "INSERT OR REPLACE INTO PathFile(type, key, path) VALUES(?, ?, ?)", 
            [type, key, JSON.stringify(path)], 
            (tx, results) => {
                resolve(results);
            }
        );
    });
}

const getCache = (type, key) => {
    return new Promise(function(resolve) {
        db.transaction((tx) => {
            tx.executeSql("SELECT path FROM PathFile WHERE type = ? AND key = ?", [type, key], (tx, results) => {
                if (results.rows.length == 0) {
                    resolve([]);
                }
                resolve(JSON.parse(results.rows.item(0).path));
            }, (err) => {
                db.executeSql(
                    `CREATE TABLE IF NOT EXISTS PathFile (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        type integer, 
                        key integer, 
                        path TEXT
                    );`,
                    [],
                    () => {
                        db.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_ukey ON PathFile (type, key);");
                    }
                );
                
                resolve([]);
            });
        });
    });
}

const clearCache = (type, key) => {
    return new Promise(function(resolve) {
        db.executeSql("DELETE FROM PathFile WHERE type = ? AND key = ?", [type, key], (tx, results) => {
                resolve(results);
            }
        );
    });
}
const deleteAllWithType = (type)=> {
    return new Promise(function(resolve) {
        db.executeSql("DELETE FROM PathFile WHERE type = ?", [type], (tx, results) => {
                resolve(results);
            }
        );
    });
}
const showAllRecordWithType = (type)=> {
    return new Promise(function(resolve) {
        db.transaction((tx) => {
            tx.executeSql("SELECT path FROM PathFile WHERE type = ?", [type], (tx, results) => {
                if (results.rows.length == 0) {
                    resolve([]);
                }
                let listpath = [];
                for (let i = 0; i < results.rows.length; i++) {
                    listpath.push(results.rows.item(i).path);
                }
                resolve(listpath);
            }, (err) => {
                resolve([]);
            });
        });
    });
}

const clearAll = () => {
    return new Promise(function(resolve) {
        db.executeSql("DROP TABLE PathFile", [], (tx, results) => {
                resolve(results);
            }
        );
    });
}

export default {
    cache,
    getCache,
    clearCache,
    deleteAllWithType,
    showAllRecordWithType,
    clearAll
};