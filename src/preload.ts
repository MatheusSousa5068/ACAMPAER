import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  buscarEmbaixadas: () => ipcRenderer.invoke('buscar-embaixadas'),
  registrarEmbaixada: (nome: string) => ipcRenderer.invoke('registrar-embaixada', nome),
  registrarEmbaixador: (nome: string, categoria: string, embaixadaId: number) =>
    ipcRenderer.invoke('registrar-embaixador', nome, categoria, embaixadaId),
  buscarEmbaixadores: (nomeEmbaixada: string) =>
    ipcRenderer.invoke('buscar-embaixadores', nomeEmbaixada),
});

export {};

declare global {
  interface Window {
    api: {
      buscarEmbaixadas: () => Promise<{ id: number; nome: string }[]>;
      registrarEmbaixada: (nome: string) => Promise<{ success: boolean }>;
      registrarEmbaixador: (nome: string, categoria: string, embaixadaId: number) => Promise<{ success: boolean }>;
      buscarEmbaixadores: (nomeEmbaixada: string) => Promise<{ nome: string; categoria: string }[]>;
    };
  }
}
