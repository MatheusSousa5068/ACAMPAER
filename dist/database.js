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
exports.initDatabase = initDatabase;
