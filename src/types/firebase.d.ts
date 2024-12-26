// src/types/firebase.d.ts

interface AreasData {
    emAcompanhamento: number;
    aImplantar: number;
    finalizados: number;
    mediaHectaresArea: number;
    areaPotencialTotal: number;
  }
  
  interface VendedorData {
    nome: string;
    regional: string;
    businessUnit: string;
    dataAtualizacao?: string;
  }