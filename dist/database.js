"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
// Configura o banco de dados SQLite
const dbPath = path_1.default.resolve(__dirname, '..', 'database.sqlite');
const initDatabase = async () => {
    const db = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database,
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
exports.initDatabase = initDatabase;
