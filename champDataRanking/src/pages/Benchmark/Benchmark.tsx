import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Champion } from '../../types/champion';
import { 
  loadChampions, 
} from '../../utils/championData';
import {
  calculateDpsScores,
  calculateTankinessScores,
  calculateBurstScores,
  calculateUtilityScores,
  calculateMobilityScores
} from '../../data/championBenchmarks';
import ChampionCard from '../../components/ChampionCard/ChampionCard';
import './Benchmark.css';

// Import benchmark icons from DataDragon-style assets
import mobilityIcon from '../../assets/icons/benchmark/CelerityTemp.png';
import tankinessIcon from '../../assets/icons/benchmark/Overgrowth.png';
import dpsIcon from '../../assets/icons/benchmark/LethalTempoTemp.png';
import burstIcon from '../../assets/icons/benchmark/CheapShot.png';
import utilityIcon from '../../assets/icons/benchmark/GlacialAugment.png';

type BenchmarkType = 'tankiness' | 'burst' | 'dps' | 'utility' | 'mobility' | 'base_stats';
type StatType = 'hp' | 'armor' | 'spellblock' | 'attackdamage' | 'attackspeed' | 'movespeed' | 'effectiveHp' | 'dps';

const BENCHMARKS = [
  { id: 'tankiness', name: 'Tankiness', icon: tankinessIcon },
  { id: 'dps', name: 'DPS', icon: dpsIcon },
  { id: 'burst', name: 'Burst', icon: burstIcon },
  { id: 'utility', name: 'Utility', icon: utilityIcon },
  { id: 'mobility', name: 'Mobility', icon: mobilityIcon },
];

const STATS: { id: StatType; name: string }[] = [
  { id: 'hp', name: 'HP' },
  { id: 'armor', name: 'Armure' },
  { id: 'spellblock', name: 'Résist. Magique' },
  { id: 'attackdamage', name: 'Attack Damage' },
  { id: 'attackspeed', name: 'Attack Speed' },
  { id: 'movespeed', name: 'Vitesse' },
  { id: 'effectiveHp', name: 'HP Effectifs' },
  { id: 'dps', name: 'DPS' },
];

interface RankedChampion {
  champion: Champion;
  score: number;
  rank: number;
}

export default function Benchmark() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [champions, setChampions] = useState<Record<string, Champion>>({});
  const [loading, setLoading] = useState(true);

  const category = (searchParams.get('category') || 'tankiness') as BenchmarkType;
  const stat = (searchParams.get('stat') || 'hp') as StatType;

  useEffect(() => {
    loadChampions().then(data => {
      setChampions(data);
      setLoading(false);
    });
  }, []);

  const setCategory = (cat: BenchmarkType) => {
    setSearchParams({ category: cat });
  };

  const setStat = (s: StatType) => {
    setSearchParams({ category, stat: s });
  };

  // Calcul du classement
  const rankedChampions: RankedChampion[] = (() => {
    const championList = Object.values(champions);
    
    let scored: { champion: Champion; score: number }[] = [];

    switch (category) {
      case 'tankiness':
        scored = championList.map(c => ({
          champion: c,
          score: calculateTankinessScores(c.id)?.overallScore || 0
        }));
        break;
      case 'dps':
        scored = championList.map(c => ({
          champion: c,
          score: calculateDpsScores(c.id)?.overallScore || 0
        }));
        break;
      case 'burst':
        scored = championList.map(c => ({
          champion: c,
          score: calculateBurstScores(c.id)?.overallScore || 0
        }));
        break;
      case 'utility':
        scored = championList.map(c => ({
          champion: c,
          score: calculateUtilityScores(c.id)?.overallScore || 0
        }));
        break;
      case 'mobility':
        scored = championList.map(c => ({
          champion: c,
          score: calculateMobilityScores(c.id)?.overallScore || 0
        }));
        break;
      default:
        scored = championList.map(c => ({ champion: c, score: 0 }));
    }

    // Tri décroissant
    scored.sort((a, b) => b.score - a.score);

    // Ajout du rang
    return scored.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  })();

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="benchmark-page">
      <div className="page-header">
        <h1 className="page-title">Benchmark</h1>
        <p className="page-subtitle">
          Classement des champions par performance
        </p>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="control-group">
          <label className="control-label">Catégorie</label>
          <div className="control-buttons">
            {BENCHMARKS.map(b => (
              <button
                key={b.id}
                className={`control-btn ${category === b.id ? 'active' : ''}`}
                onClick={() => setCategory(b.id as BenchmarkType)}
              >
                <img src={b.icon} alt={b.name} className="btn-icon-img" />
                {b.name}
              </button>
            ))}
          </div>
        </div>

        {category === 'base_stats' && (
          <div className="control-group">
            <label className="control-label">Stat</label>
            <select 
              className="control-select"
              value={stat}
              onChange={(e) => setStat(e.target.value as StatType)}
            >
              {STATS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}


      </div>

      {/* Ranking Table */}
      <div className="ranking-table">
        <div className="table-header">
          <span className="col-rank">#</span>
          <span className="col-champion">Champion</span>
          <span className="col-score">Score</span>
        </div>

        <div className="table-body">
          {rankedChampions.map((item, index) => {
            const maxScore = rankedChampions[0]?.score || 1;
            const percentage = (item.score / maxScore) * 100;
            
            return (
              <div 
                key={item.champion.id} 
                className={`table-row ${index < 3 ? 'top-3' : ''}`}
              >
                <span className={`col-rank rank-${index + 1}`}>
                  {item.rank}
                </span>
                <div className="col-champion">
                  <ChampionCard champion={item.champion} />
                </div>
                <span className="col-score">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
