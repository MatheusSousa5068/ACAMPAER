"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
    buscarEmbaixadas: () => electron_1.ipcRenderer.invoke('buscar-embaixadas'),
    registrarEmbaixada: (nome) => electron_1.ipcRenderer.invoke('registrar-embaixada', nome),
    registrarEmbaixador: (nome, categoria, embaixadaId) => electron_1.ipcRenderer.invoke('registrar-embaixador', nome, categoria, embaixadaId),
    buscarEmbaixadores: (nomeEmbaixada) => electron_1.ipcRenderer.invoke('buscar-embaixadores', nomeEmbaixada),
});
