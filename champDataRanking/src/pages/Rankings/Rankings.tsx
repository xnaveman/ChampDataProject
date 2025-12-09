import { useState, useEffect } from 'react';
import type { Champion } from '../../types/champion';
import { 
  loadChampions, 
  calculateTankinessScore,
  calculateDpsScore,
  calculateMobilityScore,
  getChampionRole
} from '../../utils/championData';
import type { BenchmarkRole } from '../../types/champion';
import { Link } from 'react-router-dom';
import { getChampionIconUrl } from '../../utils/championData';
import './Rankings.css';

interface ChampionRanking {
  champion: Champion;
  role: BenchmarkRole;
  tankiness: number;
  dps: number;
  mobility: number;
  overall: number;
}

export default function Rankings() {
  const [champions, setChampions] = useState<Record<string, Champion>>({});
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<BenchmarkRole | 'all'>('all');
  const [level, setLevel] = useState(18);

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

      return { champion: c, role, tankiness, dps, mobility, overall };
    });

    // Tri par score global
    scored.sort((a, b) => b.overall - a.overall);

    return scored;
  })();

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="rankings-page">
      <div className="page-header">
        <h1 className="page-title">Rankings</h1>
        <p className="page-subtitle">
          Classement global des champions basé sur leurs performances
        </p>
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
                {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
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
              <div className="top-score">{item.overall.toFixed(1)}</div>
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
              <div className="rank-overall">{item.overall.toFixed(1)}</div>
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
