import db from '../../config/cache';

const cache = (province, district, ward, data) => {
    return new Promise(function(resolve) {
        db.executeSql(
            "INSERT OR REPLACE INTO Street(province, district, ward, data) VALUES(?, ?, ?, ?)", 
            [province, district, ward, JSON.stringify(data)], 
            (tx, results) => {
                resolve(results);
            }
        );
    });
}

const getCache = (province, district, ward) => {
    return new Promise(function(resolve) {
        db.transaction((tx) => {
            tx.executeSql("SELECT data FROM Street WHERE province = ? AND district = ? and ward = ?", [province, district, ward], (tx, results) => {
                if (results.rows.length == 0) {
                    resolve([]);
                }

                resolve(JSON.parse(results.rows.item(0).data));
            }, (err) => {
                db.executeSql(
                    `CREATE TABLE IF NOT EXISTS Street (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        province integer, 
                        district integer, 
                        ward integer,
                        data TEXT
                    );`,
                    [],
                    () => {
                        db.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_ukey ON Street (province, district, ward);");
                    }
                );
                
                resolve([]);
            });
        });
    });
}

const clearCache = (province, district, ward) => {
    return new Promise(function(resolve) {
        db.executeSql("DELETE FROM Street WHERE province = ? AND district = ? AND ward = ?", [province, district, ward], (tx, results) => {
                resolve(results);
            }
        );
    });
}

const clearAll = () => {
    return new Promise(function(resolve) {
        db.executeSql("DROP TABLE Street", [], (tx, results) => {
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