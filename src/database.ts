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

  // Criar tabela de embaixadas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS EMBAIXADA (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Criar tabela de categorias
  await db.exec(`
    CREATE TABLE IF NOT EXISTS CATEGORIA (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Inserir categorias padrão se não existirem
  await db.exec(`
    INSERT OR IGNORE INTO CATEGORIA (nome) VALUES 
    ('Junior'),
    ('Adolescente'),
    ('Juvenil')
  `);

  // Criar tabela de embaixadores com referência para categoria
  await db.exec(`
    CREATE TABLE IF NOT EXISTS EMBAIXADOR (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria_id INTEGER NOT NULL,
      embaixada_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoria_id) REFERENCES CATEGORIA (id),
      FOREIGN KEY (embaixada_id) REFERENCES EMBAIXADA (id)
    );
  `);

  return db;
};