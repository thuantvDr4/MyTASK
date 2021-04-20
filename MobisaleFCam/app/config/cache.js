import React from 'react';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase("cacheFCAM", 
    () => {
        console.log('ok');
    }, (abc) => {
        console.log('error', abc);
    }
);

export default db;

// Document: https://github.com/andpor/react-native-sqlite-storage