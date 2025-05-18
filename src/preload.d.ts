// filepath: d:\www\ACAMPAER\src\preload.d.ts
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