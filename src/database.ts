import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Configura o banco de dados SQLite
const dbPath = path.resolve(__dirname, '..', 'database.sqlite');

export const initDatabase = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS EMBAIXADA (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS EMBAIXADOR (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      embaixada_id INTEGER NOT NULL,
      FOREIGN KEY (embaixada_id) REFERENCES EMBAIXADA (id)
    );
  `);

  return db;
};