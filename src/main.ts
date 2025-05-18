import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initDatabase } from './database';

let mainWindow: BrowserWindow | null;

app.on('ready', async () => {
  const db = await initDatabase();

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Carrega o arquivo index.html na raiz
  mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));

  ipcMain.handle('registrar-embaixada', async (_, nome: string) => {
    await db.run('INSERT INTO EMBAIXADA (nome) VALUES (?)', [nome]);
    return { success: true };
  });

  ipcMain.handle('registrar-embaixador', async (_, nome: string, categoria: string, embaixadaId: number) => {
    console.log(`Registrando embaixador: ${nome}, categoria: ${categoria}, embaixada: ${embaixadaId}`);
    await db.run(
      'INSERT INTO EMBAIXADOR (nome, categoria, embaixada_id) VALUES (?, ?, ?)',
      [nome, categoria, embaixadaId]
    );
    return { success: true };
  });

  ipcMain.handle('buscar-embaixadores', async (_, nomeEmbaixada: string) => {
    const embaixada = await db.get('SELECT id FROM EMBAIXADA WHERE nome = ?', [nomeEmbaixada]);
    if (!embaixada) throw new Error('Embaixada não encontrada.');

    const embaixadores = await db.all('SELECT nome, categoria FROM EMBAIXADOR WHERE embaixada_id = ?', [embaixada.id]);
    return embaixadores; // Retorna uma lista de embaixadores
  });

  ipcMain.handle('registrar-embaixador-por-nome', async (_, nome: string, categoria: string, nomeEmbaixada: string) => {
    
    const embaixada = await db.get('SELECT id FROM EMBAIXADA WHERE nome = ?', [nomeEmbaixada]);
    if (!embaixada) throw new Error('Embaixada não encontrada.');

    await db.run('INSERT INTO EMBAIXADOR (nome, categoria, embaixada_id) VALUES (?, ?, ?)', [nome, categoria, embaixada.id]);
    return { success: true };
  });

  ipcMain.handle('buscar-embaixadas', async () => {
    const embaixadas = await db.all('SELECT id, nome FROM EMBAIXADA');
    return embaixadas;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Ativa o hot reload
try {
  require('electron-reload')(path.join(__dirname, '..'), {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit',
  });
} catch (err) {
  console.log('Falha ao carregar o electron-reload:', err);
}