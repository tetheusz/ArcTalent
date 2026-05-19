const Database = require('better-sqlite3');
const db = new Database('dev.db');

const proofs = db.prepare("SELECT * FROM on_chain_proofs WHERE entity_type = 'BADGE'").all();
console.log('Proofs found:', proofs.length);
console.log(JSON.stringify(proofs, null, 2));

db.close();
