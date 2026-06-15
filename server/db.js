const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'concours.db');
let db = null;
let sqlDb = null;
let autoSaveTimeout = null;

function saveDb() {
  if (!sqlDb) return;
  const data = sqlDb.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function scheduleSave() {
  saveDb();
}

function createWrapper(rawDb) {
  sqlDb = rawDb;
  const wrap = {
    prepare(sql) {
      return {
        all(...params) {
          const flat = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const stmt = sqlDb.prepare(sql);
          if (flat.length) stmt.bind(flat);
          const rows = [];
          while (stmt.step()) rows.push(stmt.getAsObject());
          stmt.free();
          return rows;
        },
        get(...params) {
          const flat = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          const stmt = sqlDb.prepare(sql);
          if (flat.length) stmt.bind(flat);
          const row = stmt.step() ? stmt.getAsObject() : null;
          stmt.free();
          return row;
        },
        run(...params) {
          const flat = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
          sqlDb.run(sql, flat);
          scheduleSave();
          const idResult = sqlDb.exec('SELECT last_insert_rowid() as id');
          const lastInsertRowid = idResult?.[0]?.values?.[0]?.[0];
          const changes = sqlDb.getRowsModified();
          return { lastInsertRowid, changes };
        }
      };
    },
    run(sql, params) {
      sqlDb.run(sql, params || []);
      scheduleSave();
    },
    exec(sql) {
      sqlDb.exec(sql);
      scheduleSave();
    }
  };
  return wrap;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user','admin')),
      name TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      exam_type TEXT NOT NULL,
      year INTEGER NOT NULL,
      subject_name TEXT DEFAULT '',
      question_id INTEGER NOT NULL,
      chosen_index INTEGER,
      is_correct BOOLEAN,
      time_taken_seconds INTEGER DEFAULT 0,
      answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title_fr TEXT NOT NULL,
      title_en TEXT DEFAULT '',
      title_ar TEXT DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      content_fr TEXT NOT NULL DEFAULT '',
      content_en TEXT DEFAULT '',
      content_ar TEXT DEFAULT '',
      example_fr TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS bookmarks (
      user_id INTEGER NOT NULL,
      tip_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, tip_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (tip_id) REFERENCES tips(id)
    );
    CREATE TABLE IF NOT EXISTS exam_types (
      id TEXT PRIMARY KEY,
      name_fr TEXT NOT NULL,
      name_en TEXT DEFAULT '',
      name_ar TEXT DEFAULT '',
      description_fr TEXT DEFAULT '',
      description_en TEXT DEFAULT '',
      description_ar TEXT DEFAULT '',
      icon TEXT DEFAULT '📚',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function initDb() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = createWrapper(new SQL.Database(buffer));
  } else {
    db = createWrapper(new SQL.Database());
  }
  initSchema();
  saveDb();
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

module.exports = { initDb, getDb };
