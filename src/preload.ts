import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  buscarEmbaixadas: () => ipcRenderer.invoke('buscar-embaixadas'),
  registrarEmbaixada: (nome: string) => ipcRenderer.invoke('registrar-embaixada', nome),
  buscarCategorias: () => ipcRenderer.invoke('buscar-categorias'),
  registrarCategoria: (nome: string) => ipcRenderer.invoke('registrar-categoria', nome),
  registrarEmbaixador: (nome: string, categoriaId: number, embaixadaId: number) =>
    ipcRenderer.invoke('registrar-embaixador', nome, categoriaId, embaixadaId),
  buscarEmbaixadores: (nomeEmbaixada: string) =>
    ipcRenderer.invoke('buscar-embaixadores', nomeEmbaixada),
});

export {};

declare global {
  interface Window {
    api: {
      buscarEmbaixadas: () => Promise<{ id: number; nome: string }[]>;
      registrarEmbaixada: (nome: string) => Promise<{ success: boolean }>;
      buscarCategorias: () => Promise<{ id: number; nome: string }[]>;
      registrarCategoria: (nome: string) => Promise<{ success: boolean; id?: number; error?: string }>;
      registrarEmbaixador: (nome: string, categoriaId: number, embaixadaId: number) => Promise<{
        error?: string; success: boolean 
}>;
      buscarEmbaixadores: (nomeEmbaixada: string) => Promise<{ nome: string; categoria: string }[]>;
    };
  }
}
