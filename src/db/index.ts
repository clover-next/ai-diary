import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('wordless_diary.db');
    }
    return db;
};

export const initDB = async () => {
    const database = await getDB();

    await database.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS diaries (
      id TEXT PRIMARY KEY NOT NULL,
      created_at INTEGER NOT NULL,
      mood_icon TEXT,
      calm_level REAL,
      color TEXT,
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id TEXT PRIMARY KEY NOT NULL,
      created_at INTEGER NOT NULL,
      category TEXT,
      mood_level REAL,
      user_note TEXT
    );
  `);

    console.log('Database initialized');
};
