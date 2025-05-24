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
    // Registrar embaixada
    electron_1.ipcMain.handle('registrar-embaixada', async (_, nome) => {
        await db.run('INSERT INTO EMBAIXADA (nome) VALUES (?)', [nome]);
        return { success: true };
    });
    // Buscar todas as embaixadas
    electron_1.ipcMain.handle('buscar-embaixadas', async () => {
        const embaixadas = await db.all('SELECT id, nome FROM EMBAIXADA');
        return embaixadas;
    });
    // Buscar todas as categorias
    electron_1.ipcMain.handle('buscar-categorias', async () => {
        const categorias = await db.all('SELECT id, nome FROM CATEGORIA ORDER BY nome');
        return categorias;
    });
    // Registrar nova categoria
    electron_1.ipcMain.handle('registrar-categoria', async (_, nome) => {
        try {
            const result = await db.run('INSERT INTO CATEGORIA (nome) VALUES (?)', [nome]);
            return { success: true, id: result.lastID };
        }
        catch (error) {
            console.error('Erro ao registrar categoria:', error);
            return { success: false, error: typeof error === 'object' && error !== null && 'message' in error ? error.message : String(error) };
        }
    });
    // Registrar embaixador (atualizado para usar categoria_id)
    electron_1.ipcMain.handle('registrar-embaixador', async (_, nome, categoriaId, embaixadaId) => {
        console.log(`Registrando embaixador: ${nome}, categoria ID: ${categoriaId}, embaixada ID: ${embaixadaId}`);
        try {
            await db.run('INSERT INTO EMBAIXADOR (nome, categoria_id, embaixada_id) VALUES (?, ?, ?)', [nome, categoriaId, embaixadaId]);
            return { success: true };
        }
        catch (error) {
            console.error('Erro ao registrar embaixador:', error);
            return { success: false, error: typeof error === 'object' && error !== null && 'message' in error ? error.message : String(error) };
        }
    });
    // Buscar embaixadores por nome da embaixada (com JOIN para pegar nome da categoria)
    electron_1.ipcMain.handle('buscar-embaixadores', async (_, nomeEmbaixada) => {
        try {
            const embaixadores = await db.all(`
        SELECT e.nome, c.nome as categoria 
        FROM EMBAIXADOR e
        JOIN EMBAIXADA em ON e.embaixada_id = em.id
        JOIN CATEGORIA c ON e.categoria_id = c.id
        WHERE em.nome = ?
      `, [nomeEmbaixada]);
            return embaixadores;
        }
        catch (error) {
            console.error('Erro ao buscar embaixadores:', error);
            return [];
        }
    });
    // Registrar embaixador por nome da embaixada (atualizado)
    electron_1.ipcMain.handle('registrar-embaixador-por-nome', async (_, nome, categoriaId, nomeEmbaixada) => {
        try {
            const embaixada = await db.get('SELECT id FROM EMBAIXADA WHERE nome = ?', [nomeEmbaixada]);
            if (!embaixada) {
                return { success: false, error: 'Embaixada não encontrada.' };
            }
            await db.run('INSERT INTO EMBAIXADOR (nome, categoria_id, embaixada_id) VALUES (?, ?, ?)', [nome, categoriaId, embaixada.id]);
            return { success: true };
        }
        catch (error) {
            console.error('Erro ao registrar embaixador por nome:', error);
            return { success: false, error: typeof error === 'object' && error !== null && 'message' in error ? error.message : String(error) };
        }
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
