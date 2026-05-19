const Database = require('better-sqlite3');
const db = new Database('dev.db');

const userBadges = db.prepare('SELECT * FROM user_badges').all();
console.log('User Badges found:', userBadges.length);
console.log(JSON.stringify(userBadges, null, 2));

db.close();
