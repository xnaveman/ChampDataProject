// Types pour les données des champions League of Legends

export interface ChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}

export interface ChampionImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChampionInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

export interface Champion {
  version: string;
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: ChampionInfo;
  image: ChampionImage;
  tags: string[];
  partype: string;
  stats: ChampionStats;
}

export interface ChampionData {
  type: string;
  format: string;
  version: string;
  data: Record<string, Champion>;
}

// Rôles pour le benchmark
export type BenchmarkRole = 'tank' | 'mage' | 'assassin' | 'marksman' | 'support' | 'fighter';

// Catégories de benchmark
export type BenchmarkCategory = 
  | 'tankiness' 
  | 'burst_damage' 
  | 'dps' 
  | 'utility' 
  | 'mobility'
  | 'base_stats';

// Score de benchmark pour un champion
export interface ChampionBenchmark {
  champion: Champion;
  role: BenchmarkRole;
  scores: {
    tankiness: number;
    burstDamage: number;
    dps: number;
    utility: number;
    mobility: number;
    overall: number;
  };
  rank: number;
}

// Stats calculées pour un niveau donné
export interface CalculatedStats {
  hp: number;
  mp: number;
  armor: number;
  spellblock: number;
  attackdamage: number;
  attackspeed: number;
  hpregen: number;
  mpregen: number;
  effectiveHpPhysical: number;
  effectiveHpMagic: number;
  dps: number;
}
