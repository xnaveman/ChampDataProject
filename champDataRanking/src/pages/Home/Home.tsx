import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Champion } from '../../types/champion';
import { loadChampions, searchChampions } from '../../utils/championData';
import ChampionCard from '../../components/ChampionCard/ChampionCard';
import './Home.css';

//Import benchmark icons
import mobility from '../../assets/icons/benchmark/CelerityTemp.png';
import tankiness from '../../assets/icons/benchmark/Overgrowth.png';
import dps from '../../assets/icons/benchmark/LethalTempoTemp.png';
import burst from '../../assets/icons/benchmark/CheapShot.png';
import utility from '../../assets/icons/benchmark/GlacialAugment.png';

// Import rune icons
import ResolveIcon from '../../assets/icons/runes/7204_Resolve.png';
import SorceryIcon from '../../assets/icons/runes/7202_Sorcery.png';
import DominationIcon from '../../assets/icons/runes/7200_Domination.png';
import WhimsyIcon from '../../assets/icons/runes/7203_Whimsy.png';
import PrecisionIcon from '../../assets/icons/runes/7201_Precision.png';

const BENCHMARK_CATEGORIES = [
    { id: 'tankiness', name: 'Tankiness', description: 'HP, Armure, Magic resist, Réductions de dégats, Tankiness effective.', icon: tankiness },
    { id: 'burst', name: 'Burst Damage', description: 'Potentiel de burst et durée, mobilité brute.', icon: burst },
    { id: 'dps', name: 'DPS', description: 'Taux de DPS soutenu sur 10 secondes', icon: dps },
    { id: 'utility', name: 'Utility', description: 'Soins, boucliers, contrôle de foule, buff gold efficiency.', icon: utility },
    { id: 'mobility', name: 'Mobility', description: 'Vitesse et capacités de déplacement d\'un point A vers un point B.', icon: mobility },
];

const ROLES = [
    { id: 'all', name: 'Tous', icon: null },
    { id: 'tank', name: 'Tank', icon: ResolveIcon },
    { id: 'fighter', name: 'Fighter', icon: ResolveIcon },
    { id: 'mage', name: 'Mage', icon: SorceryIcon },
    { id: 'assassin', name: 'Assassin', icon: DominationIcon },
    { id: 'marksman', name: 'Marksman', icon: PrecisionIcon },
    { id: 'support', name: 'Support', icon: WhimsyIcon },
];

export default function Home() {
    const [champions, setChampions] = useState<Record<string, Champion>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Champion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChampions().then(data => {
            setChampions(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            const results = searchChampions(champions, searchQuery).slice(0, 6);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, champions]);

    const championCount = Object.keys(champions).length;

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <h1 className="hero-title">
                    Champion <span className="highlight">Data</span> Ranking
                </h1>
                <p className="hero-subtitle">
                    Analyse et classement des {championCount} champions de League of Legends
                    <br />
                    Stats de base, tankiness, burst, DPS, utility et plus encore.
                </p>

                {/* Search Bar */}
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Rechercher un champion..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map(champion => (
                                <ChampionCard key={champion.id} champion={champion} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Benchmark Categories */}
            <section className="section">
                <h2 className="section-title">Catégories de Benchmark</h2>
                <p className="section-subtitle">Choisissez une métrique pour voir le classement</p>

                <div className="benchmark-grid">
                    {BENCHMARK_CATEGORIES.map(category => (
                        <Link
                            key={category.id}
                            to={`/benchmark?category=${category.id}`}
                            className="benchmark-card"
                        >
                            <img src={category.icon} alt={category.name} className="benchmark-icon-img" />
                            <h3 className="benchmark-name">{category.name}</h3>
                            <p className="benchmark-desc">{category.description}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Role Filters */}
            <section className="section">
                <h2 className="section-title">Par Rôle</h2>
                <p className="section-subtitle">Filtrez les champions par leur rôle principal</p>

                <div className="roles-grid">
                    {ROLES.map(role => (
                        <Link
                            key={role.id}
                            to={`/champions?role=${role.id}`}
                            className="role-card"
                        >
                            {role.icon ? (
                                <img src={role.icon} alt={role.name} className="role-icon-img" />
                            ) : (
                                <span className="role-icon-text">ALL</span>
                            )}
                            <span className="role-name">{role.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {loading && (
                <div className="loading">Chargement des données...</div>
            )}
        </div>
    );
}
