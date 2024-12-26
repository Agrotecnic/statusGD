// Constantes de BUs válidas
export const VALID_BUS = ['BU1', 'BU2', 'BU3', 'BUTEST'];

// Constantes de Regionais válidas
export const VALID_REGIONALS = [
  'RS NORTE',
  'RS SUL',
  'PR SUL SC',
  'PR NORTE SP EXP',
  'AC RO MT OESTE',
  'MS',
  'MT',
  'MT SUL',
  'GO',
  'MA PI TO PA',
  'CERRADO MG',
  'LESTE',
  'NORDESTE',
  'REGIONAL TESTE'
];

// Mapeamento único e consolidado de BUs e suas regionais
export const BU_REGIONAL_MAPPING = {
  'BU1': ['RS NORTE', 'RS SUL', 'PR SUL SC', 'PR NORTE SP EXP'],
  'BU2': ['AC RO MT OESTE', 'MS', 'MT', 'MT SUL', 'GO'],
  'BU3': ['MA PI TO PA', 'CERRADO MG', 'LESTE', 'NORDESTE'],
  'BUTEST': ['REGIONAL TESTE'],
};

// Mapeamento de normalizações para Business Units
const BU_NORMALIZATION = {
  'BU1': 'BU1',
  'BU2': 'BU2',
  'BU3': 'BU3',
  'BUTEST': 'BUTEST',
  'bu1': 'BU1',
  'bu 1': 'BU1',
  'business unit 1': 'BU1',
  'bu2': 'BU2',
  'bu 2': 'BU2',
  'business unit 2': 'BU2',
  'bu3': 'BU3',
  'bu 3': 'BU3',
  'business unit 3': 'BU3',
  'butest': 'BUTEST',
  'bu test': 'BUTEST'
};

// Mapeamento de normalizações para Regionais
const REGIONAL_NORMALIZATION = {
  'SP CAPITAL': 'SP CAPITAL',
  'SP INTERIOR': 'SP INTERIOR',
  'RJ/ES': 'RJ/ES',
  'MG': 'MG',
  'PR': 'PR',
  'SC': 'SC',
  'RS': 'RS',
  'MT': 'MT',
  'MS': 'MS',
  'GO': 'GO',
  'BA': 'BA',
  'PE': 'PE',
  'CE': 'CE',
  'MA': 'MA',
  'PA': 'PA',
  'RS NORTE': 'RS NORTE',
  'RS SUL': 'RS SUL',
  'PR SUL SC': 'PR SUL SC',
  'PR NORTE SP EXP': 'PR NORTE SP EXP',
  'AC RO MT OESTE': 'AC RO MT OESTE',
  'MT SUL': 'MT SUL',
  'MA PI TO PA': 'MA PI TO PA',
  'CERRADO MG': 'CERRADO MG',
  'LESTE': 'LESTE',
  'NORDESTE': 'NORDESTE',
  'REGIONAL TESTE': 'REGIONAL TESTE'
};

/**
 * Função auxiliar para limpar o input
 * @param {string} input - Texto para ser limpo
 * @returns {string} Texto limpo
 */
function cleanInput(input) {
  if (!input) return '';
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '');
}

/**
 * Normaliza o nome da Business Unit
 * @param {string} bu - Business Unit para normalizar
 * @returns {string|null} Business Unit normalizada ou null se inválida
 */
export function normalizeBU(bu) {
  if (!bu) return null;
  const normalized = BU_NORMALIZATION[bu.toUpperCase()] || BU_NORMALIZATION[cleanInput(bu)];
  return normalized || null;
}

/**
 * Normaliza o nome da Regional
 * @param {string} regional - Regional para normalizar
 * @returns {string|null} Regional normalizada ou null se inválida
 */
export function normalizeRegional(regional) {
  if (!regional) return null;
  const normalized = REGIONAL_NORMALIZATION[regional.toUpperCase()];
  return normalized || null;
}

/**
 * Retorna as regionais associadas a uma Business Unit
 * @param {string} bu - Business Unit
 * @returns {string[]} Array de regionais
 */
export function getRegionaisByBU(bu) {
  if (!bu) return [];
  return BU_REGIONAL_MAPPING[bu] || [];
}