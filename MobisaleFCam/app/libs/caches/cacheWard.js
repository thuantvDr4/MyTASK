import db from '../../config/cache';

const cache = (province, district, data) => {
    return new Promise(function(resolve) {
        db.executeSql(
            "INSERT OR REPLACE INTO Ward(province, district, data) VALUES(?, ?, ?)", 
            [province, district, JSON.stringify(data)], 
            (tx, results) => {
                resolve(results);
            }
        );
    });
}

const getCache = (province, district) => {
    return new Promise(function(resolve) {
        db.transaction((tx) => {
            tx.executeSql("SELECT data FROM Ward WHERE province = ? AND district = ?", [province, district], (tx, results) => {
                if (results.rows.length == 0) {
                    resolve([]);
                }
                resolve(JSON.parse(results.rows.item(0).data));
            }, (err) => {
                db.executeSql(
                    `CREATE TABLE IF NOT EXISTS Ward (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        province integer, 
                        district integer, 
                        data TEXT
                    );`,
                    [],
                    () => {
                        db.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_ukey ON Ward (province, district);");
                    }
                );
                
                resolve([]);
            });
        });
    });
}

const clearCache = (province, district) => {
    return new Promise(function(resolve) {
        db.executeSql("DELETE FROM Ward WHERE province = ? AND district = ?", [province, district], (tx, results) => {
                resolve(results);
            }
        );
    });
}

const clearAll = () => {
    return new Promise(function(resolve) {
        db.executeSql("DROP TABLE Ward", [], (tx, results) => {
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