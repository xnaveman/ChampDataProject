import type { Champion, ChampionData, CalculatedStats, BenchmarkRole } from '../types/champion';

// Chemin vers les données Data Dragon
const DATA_DRAGON_PATH = '/datadragon/15.24.1';

// Cache pour les données des champions
let championsCache: Record<string, Champion> | null = null;

/**
 * Charge les données des champions depuis Data Dragon
 */
export async function loadChampions(): Promise<Record<string, Champion>> {
  if (championsCache) {
    return championsCache;
  }

  try {
    const response = await fetch(`${DATA_DRAGON_PATH}/data/en_US/champion.json`);
    const data: ChampionData = await response.json();
    championsCache = data.data;
    return championsCache;
  } catch (error) {
    console.error('Erreur lors du chargement des champions:', error);
    return {};
  }
}

/**
 * Récupère l'URL de l'icône d'un champion
 */
export function getChampionIconUrl(championId: string): string {
  return `${DATA_DRAGON_PATH}/img/champion/${championId}.png`;
}

/**
 * Récupère l'URL du splash art d'un champion
 */
export function getChampionSplashUrl(championId: string, skinNum: number = 0): string {
  return `/datadragon/img/champion/splash/${championId}_${skinNum}.jpg`;
}

/**
 * Récupère l'URL de l'image de chargement d'un champion
 */
export function getChampionLoadingUrl(championId: string, skinNum: number = 0): string {
  return `/datadragon/img/champion/loading/${championId}_${skinNum}.jpg`;
}

/**
 * Calcule les stats d'un champion à un niveau donné
 */
export function calculateStatsAtLevel(champion: Champion, level: number): CalculatedStats {
  const stats = champion.stats;
  const levelMultiplier = level - 1;

  const hp = stats.hp + stats.hpperlevel * levelMultiplier;
  const mp = stats.mp + stats.mpperlevel * levelMultiplier;
  const armor = stats.armor + stats.armorperlevel * levelMultiplier;
  const spellblock = stats.spellblock + stats.spellblockperlevel * levelMultiplier;
  const attackdamage = stats.attackdamage + stats.attackdamageperlevel * levelMultiplier;
  const hpregen = stats.hpregen + stats.hpregenperlevel * levelMultiplier;
  const mpregen = stats.mpregen + stats.mpregenperlevel * levelMultiplier;
  
  // Calcul de l'attack speed (formule LoL)
  const attackspeed = stats.attackspeed * (1 + (stats.attackspeedperlevel * levelMultiplier) / 100);

  // HP effectif contre les dégâts physiques
  const effectiveHpPhysical = hp * (1 + armor / 100);
  
  // HP effectif contre les dégâts magiques
  const effectiveHpMagic = hp * (1 + spellblock / 100);

  // DPS de base (sans crit ni bonus)
  const dps = attackdamage * attackspeed;

  return {
    hp,
    mp,
    armor,
    spellblock,
    attackdamage,
    attackspeed,
    hpregen,
    mpregen,
    effectiveHpPhysical,
    effectiveHpMagic,
    dps,
  };
}

/**
 * Détermine le rôle principal d'un champion basé sur ses tags
 */
export function getChampionRole(champion: Champion): BenchmarkRole {
  const tags = champion.tags;
  
  if (tags.includes('Tank')) return 'tank';
  if (tags.includes('Assassin')) return 'assassin';
  if (tags.includes('Marksman')) return 'marksman';
  if (tags.includes('Mage')) return 'mage';
  if (tags.includes('Support')) return 'support';
  if (tags.includes('Fighter')) return 'fighter';
  
  return 'fighter'; // Par défaut
}

/**
 * Calcule le score de tankiness d'un champion
 */
export function calculateTankinessScore(champion: Champion, level: number = 18): number {
  const stats = calculateStatsAtLevel(champion, level);
  
  // Score basé sur les HP effectifs moyens
  const avgEffectiveHp = (stats.effectiveHpPhysical + stats.effectiveHpMagic) / 2;
  
  // Normalisation (environ 2000-6000 pour les champions)
  return Math.round((avgEffectiveHp / 60) * 10) / 10;
}

/**
 * Calcule le score de DPS d'un champion
 */
export function calculateDpsScore(champion: Champion, level: number = 18): number {
  const stats = calculateStatsAtLevel(champion, level);
  
  // Normalisation (environ 100-400 DPS pour les champions)
  return Math.round((stats.dps / 4) * 10) / 10;
}

/**
 * Calcule le score de mobilité basé sur la vitesse de déplacement
 */
export function calculateMobilityScore(champion: Champion): number {
  // Base sur movespeed (325-355 généralement)
  const baseScore = (champion.stats.movespeed - 325) / 30 * 50 + 50;
  return Math.round(baseScore * 10) / 10;
}

/**
 * Filtre les champions par rôle
 */
export function filterChampionsByRole(
  champions: Record<string, Champion>,
  role: BenchmarkRole | 'all'
): Champion[] {
  const championList = Object.values(champions);
  
  if (role === 'all') {
    return championList;
  }
  
  return championList.filter(champion => {
    const tags = champion.tags.map(t => t.toLowerCase());
    return tags.includes(role);
  });
}

/**
 * Trie les champions par une stat spécifique
 */
export function sortChampionsByStat(
  champions: Champion[],
  stat: keyof CalculatedStats,
  level: number = 18,
  ascending: boolean = false
): Champion[] {
  return [...champions].sort((a, b) => {
    const statsA = calculateStatsAtLevel(a, level);
    const statsB = calculateStatsAtLevel(b, level);
    
    const diff = statsB[stat] - statsA[stat];
    return ascending ? -diff : diff;
  });
}

/**
 * Recherche des champions par nom
 */
export function searchChampions(
  champions: Record<string, Champion>,
  query: string
): Champion[] {
  const lowerQuery = query.toLowerCase();
  
  return Object.values(champions).filter(champion =>
    champion.name.toLowerCase().includes(lowerQuery) ||
    champion.id.toLowerCase().includes(lowerQuery)
  );
}
