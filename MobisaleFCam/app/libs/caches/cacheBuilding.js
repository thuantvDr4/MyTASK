import db from '../../config/cache';

const cache = (province, data) => {
    return new Promise(function(resolve) {
        db.executeSql(
            "INSERT OR REPLACE INTO Building(province, data) VALUES(?, ?)", 
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
            tx.executeSql("SELECT data FROM Building WHERE province = ?", [province], (tx, results) => {
                if (results.rows.length == 0) {
                    resolve([]);
                }

                resolve(JSON.parse(results.rows.item(0).data));
            }, (err) => {
                db.executeSql(
                    `CREATE TABLE IF NOT EXISTS Building (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        province integer, 
                        data TEXT
                    );`,
                    [],
                    () => {
                        db.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_province ON Building (province);");
                    }
                );
                
                resolve([]);
            });
        });
    });
}

const clearCache = (province) => {
    return new Promise(function(resolve) {
        db.executeSql("DELETE FROM Building WHERE province = ?", [province], (tx, results) => {
                resolve(results);
            }
        );
    });
}

const clearAll = () => {
    return new Promise(function(resolve) {
        db.executeSql("DROP TABLE Building", [], (tx, results) => {
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