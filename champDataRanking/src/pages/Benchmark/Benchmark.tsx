import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Champion } from '../../types/champion';
import { 
  loadChampions, 
  calculateStatsAtLevel, 
  calculateTankinessScore,
  calculateDpsScore,
  calculateMobilityScore
} from '../../utils/championData';
import ChampionCard from '../../components/ChampionCard/ChampionCard';
import './Benchmark.css';

type BenchmarkType = 'tankiness' | 'burst' | 'dps' | 'utility' | 'mobility' | 'base_stats';
type StatType = 'hp' | 'armor' | 'spellblock' | 'attackdamage' | 'attackspeed' | 'movespeed' | 'effectiveHp' | 'dps';

const BENCHMARKS = [
  { id: 'tankiness', name: 'Tankiness', icon: '🛡️' },
  { id: 'dps', name: 'DPS', icon: '🔥' },
  { id: 'mobility', name: 'Mobility', icon: '💨' },
  { id: 'base_stats', name: 'Base Stats', icon: '📊' },
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
  const [level, setLevel] = useState(18);

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
          score: calculateTankinessScore(c, level)
        }));
        break;
      case 'dps':
        scored = championList.map(c => ({
          champion: c,
          score: calculateDpsScore(c, level)
        }));
        break;
      case 'mobility':
        scored = championList.map(c => ({
          champion: c,
          score: calculateMobilityScore(c)
        }));
        break;
      case 'base_stats':
        scored = championList.map(c => {
          const stats = calculateStatsAtLevel(c, level);
          let value: number;
          
          switch (stat) {
            case 'hp': value = stats.hp; break;
            case 'armor': value = stats.armor; break;
            case 'spellblock': value = stats.spellblock; break;
            case 'attackdamage': value = stats.attackdamage; break;
            case 'attackspeed': value = stats.attackspeed; break;
            case 'movespeed': value = c.stats.movespeed; break;
            case 'effectiveHp': value = (stats.effectiveHpPhysical + stats.effectiveHpMagic) / 2; break;
            case 'dps': value = stats.dps; break;
            default: value = 0;
          }
          
          return { champion: c, score: value };
        });
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
                <span className="btn-icon">{b.icon}</span>
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

        <div className="control-group">
          <label className="control-label">Niveau</label>
          <input
            type="range"
            min="1"
            max="18"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value))}
            className="level-slider"
          />
          <span className="level-display">{level}</span>
        </div>
      </div>

      {/* Ranking Table */}
      <div className="ranking-table">
        <div className="table-header">
          <span className="col-rank">#</span>
          <span className="col-champion">Champion</span>
          <span className="col-score">Score</span>
          <span className="col-bar">Performance</span>
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
                  {item.score.toFixed(1)}
                </span>
                <div className="col-bar">
                  <div className="performance-bar">
                    <div 
                      className="performance-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
