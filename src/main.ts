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

  // Registrar embaixada
  ipcMain.handle('registrar-embaixada', async (_, nome: string) => {
    await db.run('INSERT INTO EMBAIXADA (nome) VALUES (?)', [nome]);
    return { success: true };
  });

  // Buscar todas as embaixadas
  ipcMain.handle('buscar-embaixadas', async () => {
    const embaixadas = await db.all('SELECT id, nome FROM EMBAIXADA');
    return embaixadas;
  });

  // Buscar todas as categorias
  ipcMain.handle('buscar-categorias', async () => {
    const categorias = await db.all('SELECT id, nome FROM CATEGORIA ORDER BY nome');
    return categorias;
  });

  // Registrar nova categoria
  ipcMain.handle('registrar-categoria', async (_, nome: string) => {
    try {
      const result = await db.run('INSERT INTO CATEGORIA (nome) VALUES (?)', [nome]);
      return { success: true, id: result.lastID };
    } catch (error) {
      console.error('Erro ao registrar categoria:', error);
      return { success: false, error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error) };
    }
  });

  // Registrar embaixador (atualizado para usar categoria_id)
  ipcMain.handle('registrar-embaixador', async (_, nome: string, categoriaId: number, embaixadaId: number) => {
    console.log(`Registrando embaixador: ${nome}, categoria ID: ${categoriaId}, embaixada ID: ${embaixadaId}`);
    
    try {
      await db.run(
        'INSERT INTO EMBAIXADOR (nome, categoria_id, embaixada_id) VALUES (?, ?, ?)',
        [nome, categoriaId, embaixadaId]
      );
      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar embaixador:', error);
      return { success: false, error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error) };
    }
  });

  // Buscar embaixadores por nome da embaixada (com JOIN para pegar nome da categoria)
  ipcMain.handle('buscar-embaixadores', async (_, nomeEmbaixada: string) => {
    try {
      const embaixadores = await db.all(`
        SELECT e.nome, c.nome as categoria 
        FROM EMBAIXADOR e
        JOIN EMBAIXADA em ON e.embaixada_id = em.id
        JOIN CATEGORIA c ON e.categoria_id = c.id
        WHERE em.nome = ?
      `, [nomeEmbaixada]);
      return embaixadores;
    } catch (error) {
      console.error('Erro ao buscar embaixadores:', error);
      return [];
    }
  });

  // Registrar embaixador por nome da embaixada (atualizado)
  ipcMain.handle('registrar-embaixador-por-nome', async (_, nome: string, categoriaId: number, nomeEmbaixada: string) => {
    try {
      const embaixada = await db.get('SELECT id FROM EMBAIXADA WHERE nome = ?', [nomeEmbaixada]);
      if (!embaixada) {
        return { success: false, error: 'Embaixada não encontrada.' };
      }

      await db.run('INSERT INTO EMBAIXADOR (nome, categoria_id, embaixada_id) VALUES (?, ?, ?)', [nome, categoriaId, embaixada.id]);
      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar embaixador por nome:', error);
      return { success: false, error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error) };
    }
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