import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Champion } from '../../types/champion';
import { 
  loadChampions, 
  getChampionIconUrl, 
  getChampionSplashUrl,
  calculateStatsAtLevel,
  calculateTankinessScore,
  calculateDpsScore,
  calculateMobilityScore
} from '../../utils/championData';
import './ChampionDetail.css';

export default function ChampionDetail() {
  const { championId } = useParams<{ championId: string }>();
  const [champion, setChampion] = useState<Champion | null>(null);
  const [level, setLevel] = useState(18);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChampions().then(data => {
      if (championId && data[championId]) {
        setChampion(data[championId]);
      }
      setLoading(false);
    });
  }, [championId]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!champion) {
    return (
      <div className="not-found">
        <h2>Champion non trouvé</h2>
        <Link to="/champions">Retour à la liste</Link>
      </div>
    );
  }

  const stats = calculateStatsAtLevel(champion, level);
  const tankinessScore = calculateTankinessScore(champion, level);
  const dpsScore = calculateDpsScore(champion, level);
  const mobilityScore = calculateMobilityScore(champion);

  const roleColors: Record<string, string> = {
    tank: '#4a90a4',
    mage: '#9b59b6',
    assassin: '#e74c3c',
    marksman: '#f39c12',
    support: '#2ecc71',
    fighter: '#e67e22',
  };

  return (
    <div className="champion-detail">
      {/* Header avec splash art */}
      <div 
        className="champion-header"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(18, 18, 20, 0.7), rgba(18, 18, 20, 1)), url(${getChampionSplashUrl(champion.id)})` 
        }}
      >
        <div className="header-content">
          <img 
            src={getChampionIconUrl(champion.id)} 
            alt={champion.name}
            className="champion-portrait"
          />
          <div className="champion-header-info">
            <h1 className="champion-name">{champion.name}</h1>
            <p className="champion-title">{champion.title}</p>
            <div className="champion-tags">
              {champion.tags.map(tag => (
                <span 
                  key={tag} 
                  className="tag"
                  style={{ backgroundColor: roleColors[tag.toLowerCase()] || '#666' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-content">
        {/* Level Selector */}
        <div className="level-selector">
          <label>Niveau:</label>
          <input
            type="range"
            min="1"
            max="18"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value))}
          />
          <span className="level-value">{level}</span>
        </div>

        {/* Benchmark Scores */}
        <section className="section">
          <h2 className="section-title">Scores de Benchmark</h2>
          <div className="scores-grid">
            <div className="score-card">
              <span className="score-icon">🛡️</span>
              <span className="score-label">Tankiness</span>
              <span className="score-value">{tankinessScore.toFixed(1)}</span>
            </div>
            <div className="score-card">
              <span className="score-icon">🔥</span>
              <span className="score-label">DPS</span>
              <span className="score-value">{dpsScore.toFixed(1)}</span>
            </div>
            <div className="score-card">
              <span className="score-icon">💨</span>
              <span className="score-label">Mobility</span>
              <span className="score-value">{mobilityScore.toFixed(1)}</span>
            </div>
          </div>
        </section>

        {/* Base Stats */}
        <section className="section">
          <h2 className="section-title">Stats de Base (Niveau {level})</h2>
          <div className="stats-table">
            <div className="stat-row">
              <span className="stat-name">HP</span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar hp" 
                  style={{ width: `${Math.min(stats.hp / 30, 100)}%` }}
                />
              </div>
              <span className="stat-value">{Math.round(stats.hp)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Mana</span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar mana" 
                  style={{ width: `${Math.min(stats.mp / 20, 100)}%` }}
                />
              </div>
              <span className="stat-value">{Math.round(stats.mp)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Armure</span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar armor" 
                  style={{ width: `${Math.min(stats.armor / 1.5, 100)}%` }}
                />
              </div>
              <span className="stat-value">{Math.round(stats.armor)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Résist. Magique</span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar mr" 
                  style={{ width: `${Math.min(stats.spellblock / 1.2, 100)}%` }}
                />
              </div>
              <span className="stat-value">{Math.round(stats.spellblock)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Attack Damage</span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar ad" 
                  style={{ width: `${Math.min(stats.attackdamage / 2, 100)}%` }}
                />
              </div>
              <span className="stat-value">{Math.round(stats.attackdamage)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Attack Speed</span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar as" 
                  style={{ width: `${Math.min(stats.attackspeed * 80, 100)}%` }}
                />
              </div>
              <span className="stat-value">{stats.attackspeed.toFixed(3)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Vitesse</span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar ms" 
                  style={{ width: `${Math.min((champion.stats.movespeed - 300) / 0.6, 100)}%` }}
                />
              </div>
              <span className="stat-value">{champion.stats.movespeed}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Portée</span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar range" 
                  style={{ width: `${Math.min(champion.stats.attackrange / 6.5, 100)}%` }}
                />
              </div>
              <span className="stat-value">{champion.stats.attackrange}</span>
            </div>
          </div>
        </section>

        {/* Calculated Stats */}
        <section className="section">
          <h2 className="section-title">Stats Calculées</h2>
          <div className="calculated-grid">
            <div className="calc-card">
              <span className="calc-label">HP Effectifs (Physique)</span>
              <span className="calc-value">{Math.round(stats.effectiveHpPhysical)}</span>
            </div>
            <div className="calc-card">
              <span className="calc-label">HP Effectifs (Magique)</span>
              <span className="calc-value">{Math.round(stats.effectiveHpMagic)}</span>
            </div>
            <div className="calc-card">
              <span className="calc-label">DPS de Base</span>
              <span className="calc-value">{Math.round(stats.dps)}</span>
            </div>
            <div className="calc-card">
              <span className="calc-label">HP Regen/5s</span>
              <span className="calc-value">{stats.hpregen.toFixed(1)}</span>
            </div>
          </div>
        </section>

        {/* Info Ratings */}
        <section className="section">
          <h2 className="section-title">Ratings Officiels</h2>
          <div className="ratings-grid">
            <div className="rating-item">
              <span className="rating-label">Attaque</span>
              <div className="rating-dots">
                {[...Array(10)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`dot ${i < champion.info.attack ? 'filled' : ''}`}
                  />
                ))}
              </div>
              <span className="rating-value">{champion.info.attack}/10</span>
            </div>
            <div className="rating-item">
              <span className="rating-label">Défense</span>
              <div className="rating-dots">
                {[...Array(10)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`dot ${i < champion.info.defense ? 'filled' : ''}`}
                  />
                ))}
              </div>
              <span className="rating-value">{champion.info.defense}/10</span>
            </div>
            <div className="rating-item">
              <span className="rating-label">Magie</span>
              <div className="rating-dots">
                {[...Array(10)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`dot ${i < champion.info.magic ? 'filled' : ''}`}
                  />
                ))}
              </div>
              <span className="rating-value">{champion.info.magic}/10</span>
            </div>
            <div className="rating-item">
              <span className="rating-label">Difficulté</span>
              <div className="rating-dots">
                {[...Array(10)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`dot ${i < champion.info.difficulty ? 'filled' : ''}`}
                  />
                ))}
              </div>
              <span className="rating-value">{champion.info.difficulty}/10</span>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="section">
          <h2 className="section-title">Description</h2>
          <p className="champion-blurb">{champion.blurb}</p>
        </section>

        <Link to="/champions" className="back-link">
          ← Retour aux champions
        </Link>
      </div>
    </div>
  );
}
