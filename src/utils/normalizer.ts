export const VALID_BUS = ['BU1', 'BU2', 'BU3', 'BUTEST'] as const;
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
] as const;

type BusinessUnit = typeof VALID_BUS[number];
type Regional = typeof VALID_REGIONALS[number];

// Relacionamento entre BUs e suas Regionais permitidas
export const BU_REGIONAL_MAPPING: Record<BusinessUnit, Regional[]> = {
  'BU1': ['RS NORTE', 'RS SUL', 'PR SUL SC', 'PR NORTE SP EXP'],
  'BU2': ['AC RO MT OESTE', 'MS', 'MT', 'MT SUL', 'GO'],
  'BU3': ['MA PI TO PA', 'CERRADO MG', 'LESTE', 'NORDESTE'],
  'BUTEST': ['REGIONAL TESTE']
};

// Mapeamento de variações comuns para BUs
const BU_MAPPINGS: Record<string, BusinessUnit> = {
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

// Remover este bloco que não é mais necessário
// const REGIONAL_MAPPINGS: Record<string, Regional> = {
//     'reg1': 'REGIONAL1',
//     'regional 1': 'REGIONAL1',
//     // ...
// };

export function normalizeBU(input: string): BusinessUnit | null {
    const cleaned = cleanInput(input);
    return BU_MAPPINGS[cleaned] || (VALID_BUS.includes(cleaned as BusinessUnit) ? cleaned as BusinessUnit : null);
}

export function normalizeRegional(input: string): Regional | null {
    const cleaned = cleanInput(input);
    return VALID_REGIONALS.includes(cleaned as Regional) ? cleaned as Regional : null;
}

function cleanInput(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[^a-z0-9\s]/g, '');
}

// Função para obter regionais de uma BU específica
export function getRegionalsForBU(bu: BusinessUnit): Regional[] {
  return BU_REGIONAL_MAPPING[bu] || [];
}
