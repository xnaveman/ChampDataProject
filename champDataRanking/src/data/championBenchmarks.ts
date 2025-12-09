/**
 * ========================================
 * CHAMPION BENCHMARKS - DONNÉES DÉTAILLÉES
 * ========================================
 * 
 * Ce fichier contient les données de benchmark détaillées pour chaque champion.
 * Les scores (0-100%) sont calculés automatiquement en comparant les valeurs
 * avec celles des autres champions.
 * 
 * COMMENT REMPLIR:
 * 1. Trouve le champion par son ID (ex: "Aatrox", "Ahri", "Akali"...)
 * 2. Remplis les données brutes pour chaque catégorie
 * 3. Les scores seront calculés automatiquement
 */

// ========================================
// TYPES DE DONNÉES
// ========================================

export interface DpsData {
  /** Description personnalisée du test DPS */
  description?: string;
  /** DPS sur 10 secondes (tous les spells utilisés) */
  dps10s: number;
  /** DPS constant sur 20 secondes */
  dps20s: number;
}

export interface TankinessData {
  /** Description personnalisée */
  description?: string;
  /** Nombre de coups de tour tankables de base (sans compétences) */
  towerShotsBase: number;
  /** Nombre de coups de tour tankables avec compétences */
  towerShotsWithAbilities: number;
}

export interface BurstData {
  /** Description personnalisée */
  description?: string;
  /** Dégâts totaux du burst (toutes compétences + passif) */
  totalDamage: number;
  /** Pourcentage de PV max infligé si applicable (ex: 0.15 = 15%) */
  maxHpPercent: number;
  /** Temps pour exécuter le combo complet (en secondes) */
  burstTime: number;
}

export interface UtilityData {
  /** Description personnalisée */
  description?: string;
  /** Shield total avec toutes les compétences (une utilisation) */
  shieldTotal: number;
  /** Shield total sur 20 secondes */
  shield20s: number;
  /** Heal total avec toutes les compétences (une utilisation) */
  healTotal: number;
  /** Heal total sur 20 secondes */
  heal20s: number;
  /** Durée totale de CC avec toutes les compétences (en secondes) */
  ccTotal: number;
  /** Durée totale de CC sur 20 secondes */
  cc20s: number;
  /** Efficacité en gold des buffs de stats sur un allié */
  buffGoldEfficiency: number;
}

export interface MobilityData {
  /** Description personnalisée */
  description?: string;
  /** Distance parcourue grâce aux compétences (en unités) */
  dashDistance: number;
  /** Bonus de vitesse grâce aux compétences (en %) */
  speedBonus: number;
  /** Résistance au slow ou ténacité obtenue (en %) */
  slowResistTenacity: number;
}

export interface ChampionBenchmarkData {
  dps?: DpsData;
  tankiness?: TankinessData;
  burst?: BurstData;
  utility?: UtilityData;
  mobility?: MobilityData;
}

// ========================================
// DONNÉES DES CHAMPIONS
// ========================================

export const championBenchmarks: Record<string, ChampionBenchmarkData> = {
  // ========================================
  // TEMPLATE - Copie ce bloc pour chaque champion
  // ========================================
  /*
  "ChampionId": {
    dps: {
      description: "Description du test DPS...",
      dps10s: 0,      // DPS sur 10s
      dps20s: 0,      // DPS sur 20s
    },
    tankiness: {
      description: "Description...",
      towerShotsBase: 0,          // Coups de tour sans skills
      towerShotsWithAbilities: 0, // Coups de tour avec skills
    },
    burst: {
      description: "Description du combo...",
      totalDamage: 0,    // Dégâts totaux
      maxHpPercent: 0,   // % PV max (0.15 = 15%)
      burstTime: 0,      // Temps du combo en secondes
    },
    utility: {
      description: "Description...",
      shieldTotal: 0,        // Shield one-shot
      shield20s: 0,          // Shield sur 20s
      healTotal: 0,          // Heal one-shot
      heal20s: 0,            // Heal sur 20s
      ccTotal: 0,            // CC duration one-shot
      cc20s: 0,              // CC sur 20s
      buffGoldEfficiency: 0, // Gold efficiency des buffs
    },
    mobility: {
      description: "Description...",
      dashDistance: 0,        // Distance de dash
      speedBonus: 0,          // Bonus de vitesse %
      slowResistTenacity: 0,  // Slow resist/tenacity %
    },
  },
  */

  // ========================================
  // A
  // ========================================
  "Aatrox": {
    dps: {
      description: "",
      dps10s: 0,
      dps20s: 0,
    },
    tankiness: {
      description: "",
      towerShotsBase: 0,
      towerShotsWithAbilities: 0,
    },
    burst: {
      description: "",
      totalDamage: 0,
      maxHpPercent: 0,
      burstTime: 0,
    },
    utility: {
      description: "",
      shieldTotal: 0,
      shield20s: 0,
      healTotal: 0,
      heal20s: 0,
      ccTotal: 0,
      cc20s: 0,
      buffGoldEfficiency: 0,
    },
    mobility: {
      description: "",
      dashDistance: 0,
      speedBonus: 0,
      slowResistTenacity: 0,
    },
  },

  "Ahri": {
    dps: {
      description: "",
      dps10s: 0,
      dps20s: 0,
    },
    tankiness: {
      description: "",
      towerShotsBase: 0,
      towerShotsWithAbilities: 0,
    },
    burst: {
      description: "",
      totalDamage: 0,
      maxHpPercent: 0,
      burstTime: 0,
    },
    utility: {
      description: "",
      shieldTotal: 0,
      shield20s: 0,
      healTotal: 0,
      heal20s: 0,
      ccTotal: 0,
      cc20s: 0,
      buffGoldEfficiency: 0,
    },
    mobility: {
      description: "",
      dashDistance: 0,
      speedBonus: 0,
      slowResistTenacity: 0,
    },
  },

  "Akali": {
    dps: {
      description: "",
      dps10s: 0,
      dps20s: 0,
    },
    tankiness: {
      description: "",
      towerShotsBase: 0,
      towerShotsWithAbilities: 0,
    },
    burst: {
      description: "",
      totalDamage: 0,
      maxHpPercent: 0,
      burstTime: 0,
    },
    utility: {
      description: "",
      shieldTotal: 0,
      shield20s: 0,
      healTotal: 0,
      heal20s: 0,
      ccTotal: 0,
      cc20s: 0,
      buffGoldEfficiency: 0,
    },
    mobility: {
      description: "",
      dashDistance: 0,
      speedBonus: 0,
      slowResistTenacity: 0,
    },
  },

  "Akshan": {
    dps: {
      description: "",
      dps10s: 0,
      dps20s: 0,
    },
    tankiness: {
      description: "",
      towerShotsBase: 0,
      towerShotsWithAbilities: 0,
    },
    burst: {
      description: "",
      totalDamage: 0,
      maxHpPercent: 0,
      burstTime: 0,
    },
    utility: {
      description: "",
      shieldTotal: 0,
      shield20s: 0,
      healTotal: 0,
      heal20s: 0,
      ccTotal: 0,
      cc20s: 0,
      buffGoldEfficiency: 0,
    },
    mobility: {
      description: "",
      dashDistance: 0,
      speedBonus: 0,
      slowResistTenacity: 0,
    },
  },

  "Alistar": {
    dps: {
      description: "",
      dps10s: 0,
      dps20s: 0,
    },
    tankiness: {
      description: "",
      towerShotsBase: 0,
      towerShotsWithAbilities: 0,
    },
    burst: {
      description: "",
      totalDamage: 0,
      maxHpPercent: 0,
      burstTime: 0,
    },
    utility: {
      description: "",
      shieldTotal: 0,
      shield20s: 0,
      healTotal: 0,
      heal20s: 0,
      ccTotal: 0,
      cc20s: 0,
      buffGoldEfficiency: 0,
    },
    mobility: {
      description: "",
      dashDistance: 0,
      speedBonus: 0,
      slowResistTenacity: 0,
    },
  },

  // Ajoute les autres champions ici...
  // Tu peux copier le template ci-dessus pour chaque champion
};

// ========================================
// FONCTIONS DE CALCUL DES SCORES
// ========================================

/**
 * Calcule le score relatif (0-100%) basé sur les valeurs min/max de tous les champions
 */
function calculateRelativeScore(value: number, allValues: number[]): number {
  const validValues = allValues.filter(v => v > 0);
  if (validValues.length === 0 || value === 0) return 0;
  
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  
  if (max === min) return 100;
  
  return Math.round(((value - min) / (max - min)) * 100);
}

/**
 * Calcule le score inversé (pour les valeurs où plus petit = mieux, comme burstTime)
 */
function calculateInverseScore(value: number, allValues: number[]): number {
  const validValues = allValues.filter(v => v > 0);
  if (validValues.length === 0 || value === 0) return 0;
  
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  
  if (max === min) return 100;
  
  return Math.round(((max - value) / (max - min)) * 100);
}

/**
 * Récupère toutes les valeurs d'un champ spécifique pour tous les champions
 */
function getAllValues<T extends keyof ChampionBenchmarkData>(
  category: T,
  field: string
): number[] {
  return Object.values(championBenchmarks)
    .map(data => {
      const categoryData = data[category];
      if (!categoryData) return 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (categoryData as any)[field] as number || 0;
    });
}

// ========================================
// CALCUL DES SCORES PAR CATÉGORIE
// ========================================

export interface DpsScores {
  dps10sScore: number;
  dps20sScore: number;
  overallScore: number;
}

export function calculateDpsScores(championId: string): DpsScores | null {
  const data = championBenchmarks[championId]?.dps;
  if (!data) return null;

  const all10s = getAllValues('dps', 'dps10s');
  const all20s = getAllValues('dps', 'dps20s');

  const dps10sScore = calculateRelativeScore(data.dps10s, all10s);
  const dps20sScore = calculateRelativeScore(data.dps20s, all20s);
  const overallScore = Math.round((dps10sScore + dps20sScore) / 2);

  return { dps10sScore, dps20sScore, overallScore };
}

export interface TankinessScores {
  baseScore: number;
  withAbilitiesScore: number;
  overallScore: number;
}

export function calculateTankinessScores(championId: string): TankinessScores | null {
  const data = championBenchmarks[championId]?.tankiness;
  if (!data) return null;

  const allBase = getAllValues('tankiness', 'towerShotsBase');
  const allWithAbilities = getAllValues('tankiness', 'towerShotsWithAbilities');

  const baseScore = calculateRelativeScore(data.towerShotsBase, allBase);
  const withAbilitiesScore = calculateRelativeScore(data.towerShotsWithAbilities, allWithAbilities);
  const overallScore = Math.round((baseScore + withAbilitiesScore) / 2);

  return { baseScore, withAbilitiesScore, overallScore };
}

export interface BurstScores {
  damageScore: number;
  maxHpScore: number;
  speedScore: number; // Inversé: plus rapide = meilleur
  overallScore: number;
}

export function calculateBurstScores(championId: string): BurstScores | null {
  const data = championBenchmarks[championId]?.burst;
  if (!data) return null;

  const allDamage = getAllValues('burst', 'totalDamage');
  const allMaxHp = getAllValues('burst', 'maxHpPercent');
  const allTime = getAllValues('burst', 'burstTime');

  const damageScore = calculateRelativeScore(data.totalDamage, allDamage);
  const maxHpScore = calculateRelativeScore(data.maxHpPercent, allMaxHp);
  const speedScore = calculateInverseScore(data.burstTime, allTime); // Inversé
  const overallScore = Math.round((damageScore + maxHpScore + speedScore) / 3);

  return { damageScore, maxHpScore, speedScore, overallScore };
}

export interface UtilityScores {
  shieldScore: number;
  healScore: number;
  ccScore: number;
  buffScore: number;
  overallScore: number;
}

export function calculateUtilityScores(championId: string): UtilityScores | null {
  const data = championBenchmarks[championId]?.utility;
  if (!data) return null;

  const allShield = getAllValues('utility', 'shield20s');
  const allHeal = getAllValues('utility', 'heal20s');
  const allCc = getAllValues('utility', 'cc20s');
  const allBuff = getAllValues('utility', 'buffGoldEfficiency');

  const shieldScore = calculateRelativeScore(data.shield20s, allShield);
  const healScore = calculateRelativeScore(data.heal20s, allHeal);
  const ccScore = calculateRelativeScore(data.cc20s, allCc);
  const buffScore = calculateRelativeScore(data.buffGoldEfficiency, allBuff);
  const overallScore = Math.round((shieldScore + healScore + ccScore + buffScore) / 4);

  return { shieldScore, healScore, ccScore, buffScore, overallScore };
}

export interface MobilityScores {
  dashScore: number;
  speedScore: number;
  tenacityScore: number;
  overallScore: number;
}

export function calculateMobilityScores(championId: string): MobilityScores | null {
  const data = championBenchmarks[championId]?.mobility;
  if (!data) return null;

  const allDash = getAllValues('mobility', 'dashDistance');
  const allSpeed = getAllValues('mobility', 'speedBonus');
  const allTenacity = getAllValues('mobility', 'slowResistTenacity');

  const dashScore = calculateRelativeScore(data.dashDistance, allDash);
  const speedScore = calculateRelativeScore(data.speedBonus, allSpeed);
  const tenacityScore = calculateRelativeScore(data.slowResistTenacity, allTenacity);
  const overallScore = Math.round((dashScore + speedScore + tenacityScore) / 3);

  return { dashScore, speedScore, tenacityScore, overallScore };
}

// ========================================
// RÉCUPÉRATION DES DONNÉES
// ========================================

export function getChampionBenchmark(championId: string): ChampionBenchmarkData | null {
  return championBenchmarks[championId] || null;
}

export function hasAnyData(championId: string): boolean {
  const data = championBenchmarks[championId];
  if (!data) return false;
  
  return !!(
    (data.dps && (data.dps.dps10s > 0 || data.dps.dps20s > 0)) ||
    (data.tankiness && (data.tankiness.towerShotsBase > 0 || data.tankiness.towerShotsWithAbilities > 0)) ||
    (data.burst && (data.burst.totalDamage > 0)) ||
    (data.utility && (data.utility.shieldTotal > 0 || data.utility.healTotal > 0 || data.utility.ccTotal > 0)) ||
    (data.mobility && (data.mobility.dashDistance > 0 || data.mobility.speedBonus > 0))
  );
}
