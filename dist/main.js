"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
let mainWindow;
electron_1.app.on('ready', async () => {
    const db = await (0, database_1.initDatabase)();
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    // Carrega o arquivo index.html na raiz
    mainWindow.loadFile(path_1.default.join(__dirname, '..', 'index.html'));
    electron_1.ipcMain.handle('registrar-embaixada', async (_, nome) => {
        await db.run('INSERT INTO EMBAIXADA (nome) VALUES (?)', [nome]);
        return { success: true };
    });
    electron_1.ipcMain.handle('registrar-embaixador', async (_, nome, categoria, embaixadaId) => {
        console.log(`Registrando embaixador: ${nome}, categoria: ${categoria}, embaixada: ${embaixadaId}`);
        await db.run('INSERT INTO EMBAIXADOR (nome, categoria, embaixada_id) VALUES (?, ?, ?)', [nome, categoria, embaixadaId]);
        return { success: true };
    });
    electron_1.ipcMain.handle('buscar-embaixadores', async (_, nomeEmbaixada) => {
        const embaixada = await db.get('SELECT id FROM EMBAIXADA WHERE nome = ?', [nomeEmbaixada]);
        if (!embaixada)
            throw new Error('Embaixada não encontrada.');
        const embaixadores = await db.all('SELECT nome, categoria FROM EMBAIXADOR WHERE embaixada_id = ?', [embaixada.id]);
        return embaixadores; // Retorna uma lista de embaixadores
    });
    electron_1.ipcMain.handle('registrar-embaixador-por-nome', async (_, nome, categoria, nomeEmbaixada) => {
        const embaixada = await db.get('SELECT id FROM EMBAIXADA WHERE nome = ?', [nomeEmbaixada]);
        if (!embaixada)
            throw new Error('Embaixada não encontrada.');
        await db.run('INSERT INTO EMBAIXADOR (nome, categoria, embaixada_id) VALUES (?, ?, ?)', [nome, categoria, embaixada.id]);
        return { success: true };
    });
    electron_1.ipcMain.handle('buscar-embaixadas', async () => {
        const embaixadas = await db.all('SELECT id, nome FROM EMBAIXADA');
        return embaixadas;
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Ativa o hot reload
try {
    require('electron-reload')(path_1.default.join(__dirname, '..'), {
        electron: path_1.default.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit',
    });
}
catch (err) {
    console.log('Falha ao carregar o electron-reload:', err);
}
