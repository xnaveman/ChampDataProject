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
import {
  getChampionBenchmark,
  calculateDpsScores,
  calculateTankinessScores,
  calculateBurstScores,
  calculateUtilityScores,
  calculateMobilityScores
} from '../../data/championBenchmarks';
import './ChampionDetail.css';

// Import benchmark icons
import mobilityIcon from '../../assets/icons/benchmark/CelerityTemp.png';
import tankinessIcon from '../../assets/icons/benchmark/Overgrowth.png';
import dpsIcon from '../../assets/icons/benchmark/LethalTempoTemp.png';
import burstIcon from '../../assets/icons/benchmark/CheapShot.png';
import utilityIcon from '../../assets/icons/benchmark/GlacialAugment.png';

type BenchmarkCategory = 'dps' | 'tankiness' | 'burst' | 'utility' | 'mobility';

export default function ChampionDetail() {
  const { championId } = useParams<{ championId: string }>();
  const [champion, setChampion] = useState<Champion | null>(null);
  const [level, setLevel] = useState(6);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<BenchmarkCategory>>(new Set());

  const toggleCategory = (category: BenchmarkCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

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

  // Benchmark data
  const benchmarkData = championId ? getChampionBenchmark(championId) : null;
  const dpsScores = championId ? calculateDpsScores(championId) : null;
  const tankinessScores = championId ? calculateTankinessScores(championId) : null;
  const burstScores = championId ? calculateBurstScores(championId) : null;
  const utilityScores = championId ? calculateUtilityScores(championId) : null;
  const mobilityScores = championId ? calculateMobilityScores(championId) : null;

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
              <img src={tankinessIcon} alt="Tankiness" className="score-icon-img" />
              <span className="score-label">Tankiness</span>
              <span className="score-value">{tankinessScore.toFixed(1)}</span>
            </div>
            <div className="score-card">
              <img src={dpsIcon} alt="DPS" className="score-icon-img" />
              <span className="score-label">DPS</span>
              <span className="score-value">{dpsScore.toFixed(1)}</span>
            </div>
            <div className="score-card">
              <img src={mobilityIcon} alt="Mobility" className="score-icon-img" />
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

        {/* Detailed Benchmark Categories */}
        <section className="section">
          <h2 className="section-title">Benchmarks Détaillés</h2>

          {/* DPS */}
          <div className="benchmark-dropdown">
            <button
              className={`benchmark-header ${expandedCategories.has('dps') ? 'expanded' : ''}`}
              onClick={() => toggleCategory('dps')}
            >
              <div className="benchmark-header-left">
                <img src={dpsIcon} alt="DPS" className="benchmark-icon" />
                <span className="benchmark-name">DPS</span>
              </div>
              <div className="benchmark-header-right">
                <span className="benchmark-score">{dpsScores?.overallScore || 0}%</span>
                <span className="toggle-arrow">{expandedCategories.has('dps') ? '▲' : '▼'}</span>
              </div>
            </button>
            {expandedCategories.has('dps') && benchmarkData?.dps && (
              <div className="benchmark-content">
                {benchmarkData.dps.description && (
                  <p className="benchmark-description">{benchmarkData.dps.description}</p>
                )}
                <div className="benchmark-stats">
                  <div className="benchmark-stat">
                    <span className="stat-label">DPS sur 10s</span>
                    <span className="stat-raw">{benchmarkData.dps.dps10s}</span>
                    <span className="stat-score">{dpsScores?.dps10sScore || 0}%</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">DPS sur 20s</span>
                    <span className="stat-raw">{benchmarkData.dps.dps20s}</span>
                    <span className="stat-score">{dpsScores?.dps20sScore || 0}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tankiness */}
          <div className="benchmark-dropdown">
            <button
              className={`benchmark-header ${expandedCategories.has('tankiness') ? 'expanded' : ''}`}
              onClick={() => toggleCategory('tankiness')}
            >
              <div className="benchmark-header-left">
                <img src={tankinessIcon} alt="Tankiness" className="benchmark-icon" />
                <span className="benchmark-name">Tankiness</span>
              </div>
              <div className="benchmark-header-right">
                <span className="benchmark-score">{tankinessScores?.overallScore || 0}%</span>
                <span className="toggle-arrow">{expandedCategories.has('tankiness') ? '▲' : '▼'}</span>
              </div>
            </button>
            {expandedCategories.has('tankiness') && benchmarkData?.tankiness && (
              <div className="benchmark-content">
                {benchmarkData.tankiness.description && (
                  <p className="benchmark-description">{benchmarkData.tankiness.description}</p>
                )}
                <div className="benchmark-stats">
                  <div className="benchmark-stat">
                    <span className="stat-label">Coups de tour (base)</span>
                    <span className="stat-raw">{benchmarkData.tankiness.towerShotsBase}</span>
                    <span className="stat-score">{tankinessScores?.baseScore || 0}%</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">Coups de tour (avec skills)</span>
                    <span className="stat-raw">{benchmarkData.tankiness.towerShotsWithAbilities}</span>
                    <span className="stat-score">{tankinessScores?.withAbilitiesScore || 0}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Burst */}
          <div className="benchmark-dropdown">
            <button
              className={`benchmark-header ${expandedCategories.has('burst') ? 'expanded' : ''}`}
              onClick={() => toggleCategory('burst')}
            >
              <div className="benchmark-header-left">
                <img src={burstIcon} alt="Burst" className="benchmark-icon" />
                <span className="benchmark-name">Burst Damage</span>
              </div>
              <div className="benchmark-header-right">
                <span className="benchmark-score">{burstScores?.overallScore || 0}%</span>
                <span className="toggle-arrow">{expandedCategories.has('burst') ? '▲' : '▼'}</span>
              </div>
            </button>
            {expandedCategories.has('burst') && benchmarkData?.burst && (
              <div className="benchmark-content">
                {benchmarkData.burst.description && (
                  <p className="benchmark-description">{benchmarkData.burst.description}</p>
                )}
                <div className="benchmark-stats">
                  <div className="benchmark-stat">
                    <span className="stat-label">Dégâts totaux</span>
                    <span className="stat-raw">{benchmarkData.burst.totalDamage}</span>
                    <span className="stat-score">{burstScores?.damageScore || 0}%</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">% PV max</span>
                    <span className="stat-raw">{(benchmarkData.burst.maxHpPercent * 100).toFixed(1)}%</span>
                    <span className="stat-score">{burstScores?.maxHpScore || 0}%</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">Temps du combo</span>
                    <span className="stat-raw">{benchmarkData.burst.burstTime}s</span>
                    <span className="stat-score">{burstScores?.speedScore || 0}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Utility */}
          <div className="benchmark-dropdown">
            <button
              className={`benchmark-header ${expandedCategories.has('utility') ? 'expanded' : ''}`}
              onClick={() => toggleCategory('utility')}
            >
              <div className="benchmark-header-left">
                <img src={utilityIcon} alt="Utility" className="benchmark-icon" />
                <span className="benchmark-name">Utility</span>
              </div>
              <div className="benchmark-header-right">
                <span className="benchmark-score">{utilityScores?.overallScore || 0}%</span>
                <span className="toggle-arrow">{expandedCategories.has('utility') ? '▲' : '▼'}</span>
              </div>
            </button>
            {expandedCategories.has('utility') && benchmarkData?.utility && (
              <div className="benchmark-content">
                {benchmarkData.utility.description && (
                  <p className="benchmark-description">{benchmarkData.utility.description}</p>
                )}
                <div className="benchmark-stats">
                  <div className="benchmark-stat">
                    <span className="stat-label">Shield total</span>
                    <span className="stat-raw">{benchmarkData.utility.shieldTotal}</span>
                    <span className="stat-score">-</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">Shield sur 20s</span>
                    <span className="stat-raw">{benchmarkData.utility.shield20s}</span>
                    <span className="stat-score">{utilityScores?.shieldScore || 0}%</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">Heal total</span>
                    <span className="stat-raw">{benchmarkData.utility.healTotal}</span>
                    <span className="stat-score">-</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">Heal sur 20s</span>
                    <span className="stat-raw">{benchmarkData.utility.heal20s}</span>
                    <span className="stat-score">{utilityScores?.healScore || 0}%</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">CC total</span>
                    <span className="stat-raw">{benchmarkData.utility.ccTotal}s</span>
                    <span className="stat-score">-</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">CC sur 20s</span>
                    <span className="stat-raw">{benchmarkData.utility.cc20s}s</span>
                    <span className="stat-score">{utilityScores?.ccScore || 0}%</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">Buff Gold Efficiency</span>
                    <span className="stat-raw">{benchmarkData.utility.buffGoldEfficiency}g</span>
                    <span className="stat-score">{utilityScores?.buffScore || 0}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobility */}
          <div className="benchmark-dropdown">
            <button
              className={`benchmark-header ${expandedCategories.has('mobility') ? 'expanded' : ''}`}
              onClick={() => toggleCategory('mobility')}
            >
              <div className="benchmark-header-left">
                <img src={mobilityIcon} alt="Mobility" className="benchmark-icon" />
                <span className="benchmark-name">Mobility</span>
              </div>
              <div className="benchmark-header-right">
                <span className="benchmark-score">{mobilityScores?.overallScore || 0}%</span>
                <span className="toggle-arrow">{expandedCategories.has('mobility') ? '▲' : '▼'}</span>
              </div>
            </button>
            {expandedCategories.has('mobility') && benchmarkData?.mobility && (
              <div className="benchmark-content">
                {benchmarkData.mobility.description && (
                  <p className="benchmark-description">{benchmarkData.mobility.description}</p>
                )}
                <div className="benchmark-stats">
                  <div className="benchmark-stat">
                    <span className="stat-label">Distance de dash</span>
                    <span className="stat-raw">{benchmarkData.mobility.dashDistance} unités</span>
                    <span className="stat-score">{mobilityScores?.dashScore || 0}%</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">Bonus de vitesse</span>
                    <span className="stat-raw">{benchmarkData.mobility.speedBonus}%</span>
                    <span className="stat-score">{mobilityScores?.speedScore || 0}%</span>
                  </div>
                  <div className="benchmark-stat">
                    <span className="stat-label">Slow resist / Ténacité</span>
                    <span className="stat-raw">{benchmarkData.mobility.slowResistTenacity}%</span>
                    <span className="stat-score">{mobilityScores?.tenacityScore || 0}%</span>
                  </div>
                </div>
              </div>
            )}
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
