const Database = require('better-sqlite3');
const db = new Database('dev.db');

const rows = db.prepare('SELECT * FROM badge_definitions').all();
console.log(JSON.stringify(rows, null, 2));

db.close();
