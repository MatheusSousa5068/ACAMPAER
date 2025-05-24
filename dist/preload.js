"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
    buscarEmbaixadas: () => electron_1.ipcRenderer.invoke('buscar-embaixadas'),
    registrarEmbaixada: (nome) => electron_1.ipcRenderer.invoke('registrar-embaixada', nome),
    buscarCategorias: () => electron_1.ipcRenderer.invoke('buscar-categorias'),
    registrarCategoria: (nome) => electron_1.ipcRenderer.invoke('registrar-categoria', nome),
    registrarEmbaixador: (nome, categoriaId, embaixadaId) => electron_1.ipcRenderer.invoke('registrar-embaixador', nome, categoriaId, embaixadaId),
    buscarEmbaixadores: (nomeEmbaixada) => electron_1.ipcRenderer.invoke('buscar-embaixadores', nomeEmbaixada),
});
