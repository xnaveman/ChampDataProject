import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Champion } from '../../types/champion';
import { 
  loadChampions, 
  calculateTankinessScore,
  calculateDpsScore,
  calculateMobilityScore,
  getChampionRole
} from '../../utils/championData';
import { 
  calculateDpsScores,
  calculateTankinessScores,
  calculateBurstScores,
  calculateUtilityScores,
  calculateMobilityScores
} from '../../data/championBenchmarks';
import type { BenchmarkRole } from '../../types/champion';
import { Link } from 'react-router-dom';
import { getChampionIconUrl } from '../../utils/championData';
import './Rankings.css';

// Import benchmark icons
import mobilityIcon from '../../assets/icons/benchmark/CelerityTemp.png';
import tankinessIcon from '../../assets/icons/benchmark/Overgrowth.png';
import dpsIcon from '../../assets/icons/benchmark/LethalTempoTemp.png';
import burstIcon from '../../assets/icons/benchmark/CheapShot.png';
import utilityIcon from '../../assets/icons/benchmark/GlacialAugment.png';

type ScoreCategory = 'dps' | 'tankiness' | 'burst' | 'utility' | 'mobility';

const SCORE_ICONS: Record<string, string> = {
  dps: dpsIcon,
  tankiness: tankinessIcon,
  burst: burstIcon,
  utility: utilityIcon,
  mobility: mobilityIcon,
};

const SCORE_CATEGORIES: { id: ScoreCategory; name: string; description: string }[] = [
  { id: 'dps', name: 'DPS', description: 'DPS soutenu sur 10-20 secondes' },
  { id: 'tankiness', name: 'Tankiness', description: 'Résistance aux dégâts' },
  { id: 'burst', name: 'Burst', description: 'Potentiel de burst' },
  { id: 'utility', name: 'Utility', description: 'Shield, heal, CC, buffs' },
  { id: 'mobility', name: 'Mobility', description: 'Dash, vitesse, ténacité' },
];

interface ChampionRanking {
  champion: Champion;
  role: BenchmarkRole;
  tankiness: number;
  dps: number;
  mobility: number;
  overall: number;
  customScore?: number;
}

function getCustomScore(championId: string, category: ScoreCategory): number {
  switch (category) {
    case 'dps':
      return calculateDpsScores(championId)?.overallScore || 0;
    case 'tankiness':
      return calculateTankinessScores(championId)?.overallScore || 0;
    case 'burst':
      return calculateBurstScores(championId)?.overallScore || 0;
    case 'utility':
      return calculateUtilityScores(championId)?.overallScore || 0;
    case 'mobility':
      return calculateMobilityScores(championId)?.overallScore || 0;
    default:
      return 0;
  }
}

export default function Rankings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [champions, setChampions] = useState<Record<string, Champion>>({});
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<BenchmarkRole | 'all'>('all');
  const [level, setLevel] = useState(6);
  
  const scoreType = searchParams.get('scoreType') as ScoreCategory | null;

  useEffect(() => {
    loadChampions().then(data => {
      setChampions(data);
      setLoading(false);
    });
  }, []);

  const ROLES: { id: BenchmarkRole | 'all'; name: string; color: string }[] = [
    { id: 'all', name: 'Tous', color: '#5383e8' },
    { id: 'tank', name: 'Tank', color: '#4a90a4' },
    { id: 'fighter', name: 'Fighter', color: '#e67e22' },
    { id: 'mage', name: 'Mage', color: '#9b59b6' },
    { id: 'assassin', name: 'Assassin', color: '#e74c3c' },
    { id: 'marksman', name: 'Marksman', color: '#f39c12' },
    { id: 'support', name: 'Support', color: '#2ecc71' },
  ];

  // Calcul des rankings
  const rankings: ChampionRanking[] = (() => {
    let championList = Object.values(champions);

    // Filtre par rôle
    if (selectedRole !== 'all') {
      championList = championList.filter(c => 
        c.tags.map(t => t.toLowerCase()).includes(selectedRole)
      );
    }

    // Calcul des scores
    const scored = championList.map(c => {
      const tankiness = calculateTankinessScore(c, level);
      const dps = calculateDpsScore(c, level);
      const mobility = calculateMobilityScore(c);
      const role = getChampionRole(c);
      const customScore = scoreType ? getCustomScore(c.id, scoreType) : undefined;

      // Score global pondéré selon le rôle
      let overall: number;
      switch (role) {
        case 'tank':
          overall = tankiness * 0.6 + dps * 0.2 + mobility * 0.2;
          break;
        case 'assassin':
          overall = tankiness * 0.1 + dps * 0.5 + mobility * 0.4;
          break;
        case 'marksman':
          overall = tankiness * 0.15 + dps * 0.7 + mobility * 0.15;
          break;
        case 'mage':
          overall = tankiness * 0.2 + dps * 0.5 + mobility * 0.3;
          break;
        case 'support':
          overall = tankiness * 0.4 + dps * 0.2 + mobility * 0.4;
          break;
        default: // fighter
          overall = tankiness * 0.35 + dps * 0.4 + mobility * 0.25;
      }

      return { champion: c, role, tankiness, dps, mobility, overall, customScore };
    });

    // Tri par score custom si sélectionné, sinon par score global
    if (scoreType) {
      scored.sort((a, b) => (b.customScore || 0) - (a.customScore || 0));
    } else {
      scored.sort((a, b) => b.overall - a.overall);
    }

    return scored;
  })();

  const currentScoreCategory = scoreType ? SCORE_CATEGORIES.find(c => c.id === scoreType) : null;

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="rankings-page">
      <div className="page-header">
        <h1 className="page-title">
          {currentScoreCategory ? `Rankings: ${currentScoreCategory.name}` : 'Rankings'}
        </h1>
        <p className="page-subtitle">
          {currentScoreCategory 
            ? currentScoreCategory.description 
            : 'Classement global des champions basé sur leurs performances'}
        </p>
      </div>

      {/* Score Type Selector */}
      <div className="score-type-selector">
        <button
          className={`score-type-btn ${!scoreType ? 'active' : ''}`}
          onClick={() => setSearchParams({})}
        >
          Global
        </button>
        {SCORE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`score-type-btn ${scoreType === cat.id ? 'active' : ''}`}
            onClick={() => setSearchParams({ scoreType: cat.id })}
          >
            <img src={SCORE_ICONS[cat.id]} alt={cat.name} className="score-type-icon" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-section">
          <span className="filter-label">Rôle:</span>
          <div className="role-tabs">
            {ROLES.map(role => (
              <button
                key={role.id}
                className={`role-tab ${selectedRole === role.id ? 'active' : ''}`}
                onClick={() => setSelectedRole(role.id)}
                style={{ 
                  '--role-color': role.color 
                } as React.CSSProperties}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <span className="filter-label">Niveau:</span>
          <div className="level-control">
            <input
              type="range"
              min="1"
              max="18"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
            />
            <span className="level-value">{level}</span>
          </div>
        </div>
      </div>

      {/* Rankings Grid */}
      <div className="rankings-grid">
        {/* Top 3 */}
        <div className="top-3">
          {rankings.slice(0, 3).map((item, index) => (
            <Link 
              key={item.champion.id}
              to={`/champion/${item.champion.id}`}
              className={`top-card rank-${index + 1}`}
            >
              <div className="top-rank">
                {index + 1}
              </div>
              <img 
                src={getChampionIconUrl(item.champion.id)}
                alt={item.champion.name}
                className="top-icon"
              />
              <div className="top-info">
                <h3 className="top-name">{item.champion.name}</h3>
                <span className="top-role">{item.role}</span>
              </div>
              <div className="top-score">
                {scoreType ? `${item.customScore || 0}%` : item.overall.toFixed(1)}
              </div>
            </Link>
          ))}
        </div>

        {/* Rest of rankings */}
        <div className="rankings-list">
          {rankings.slice(3).map((item, index) => (
            <Link 
              key={item.champion.id}
              to={`/champion/${item.champion.id}`}
              className="ranking-row"
            >
              <span className="rank-number">{index + 4}</span>
              <img 
                src={getChampionIconUrl(item.champion.id)}
                alt={item.champion.name}
                className="rank-icon"
              />
              <div className="rank-info">
                <span className="rank-name">{item.champion.name}</span>
                <span className="rank-role">{item.role}</span>
              </div>
              {scoreType ? (
                <div className="rank-custom-score">
                  {item.customScore || 0}%
                </div>
              ) : (
                <div className="rank-scores">
                  <div className="mini-score">
                    <span className="mini-label">Tank</span>
                    <span className="mini-value">{item.tankiness.toFixed(0)}</span>
                  </div>
                  <div className="mini-score">
                    <span className="mini-label">DPS</span>
                    <span className="mini-value">{item.dps.toFixed(0)}</span>
                  </div>
                  <div className="mini-score">
                    <span className="mini-label">Mob</span>
                    <span className="mini-value">{item.mobility.toFixed(0)}</span>
                  </div>
                </div>
              )}
              <div className="rank-overall">
                {scoreType ? `${item.customScore || 0}%` : item.overall.toFixed(1)}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {rankings.length === 0 && (
        <div className="no-results">Aucun champion trouvé</div>
      )}
    </div>
  );
}
