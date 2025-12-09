import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Champion } from '../../types/champion';
import { loadChampions, searchChampions } from '../../utils/championData';
import ChampionCard from '../../components/ChampionCard/ChampionCard';
import './Champions.css';

const ROLES = [
    { id: 'all', name: 'Tous' },
    { id: 'tank', name: 'Tank' },
    { id: 'fighter', name: 'Fighter' },
    { id: 'mage', name: 'Mage' },
    { id: 'assassin', name: 'Assassin' },
    { id: 'marksman', name: 'Marksman' },
    { id: 'support', name: 'Support' },
];

type SortOption = 'name' | 'hp' | 'armor' | 'attackdamage' | 'attackspeed' | 'movespeed';

export default function Champions() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [champions, setChampions] = useState<Record<string, Champion>>({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('name');
    const [sortAsc, setSortAsc] = useState(true);

    const activeRole = searchParams.get('role') || 'all';

    useEffect(() => {
        loadChampions().then(data => {
            setChampions(data);
            setLoading(false);
        });
    }, []);

    const setRole = (role: string) => {
        setSearchParams({ role });
    };

    // Filtrage et tri des champions
    const filteredChampions = (() => {
        let list = Object.values(champions);

        // Filtre par recherche
        if (searchQuery.length >= 2) {
            list = searchChampions(champions, searchQuery);
        }

        // Filtre par rôle
        if (activeRole !== 'all') {
            list = list.filter(c =>
                c.tags.map(t => t.toLowerCase()).includes(activeRole.toLowerCase())
            );
        }

        // Tri
        list.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'hp':
                    comparison = b.stats.hp - a.stats.hp;
                    break;
                case 'armor':
                    comparison = b.stats.armor - a.stats.armor;
                    break;
                case 'attackdamage':
                    comparison = b.stats.attackdamage - a.stats.attackdamage;
                    break;
                case 'attackspeed':
                    comparison = b.stats.attackspeed - a.stats.attackspeed;
                    break;
                case 'movespeed':
                    comparison = b.stats.movespeed - a.stats.movespeed;
                    break;
            }

            return sortAsc ? comparison : -comparison;
        });

        return list;
    })();

    if (loading) {
        return <div className="loading">Chargement des champions...</div>;
    }

    return (
        <div className="champions-page">
            <div className="page-header">
                <h1 className="page-title">Champions</h1>
                <p className="page-subtitle">
                    {filteredChampions.length} champions
                </p>
            </div>

            {/* Filters */}
            <div className="filters">
                <div className="filter-group">
                    <input
                        type="text"
                        className="filter-search"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">Rôle</label>
                    <div className="filter-buttons">
                        {ROLES.map(role => (
                            <button
                                key={role.id}
                                className={`filter-btn ${activeRole === role.id ? 'active' : ''}`}
                                onClick={() => setRole(role.id)}
                            >
                                {role.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Trier par</label>
                    <select
                        className="filter-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                        <option value="name">Nom</option>
                        <option value="hp">HP</option>
                        <option value="armor">Armure</option>
                        <option value="attackdamage">AD</option>
                        <option value="attackspeed">Attack Speed</option>
                        <option value="movespeed">Vitesse</option>
                    </select>
                    <button
                        className="sort-order-btn"
                        onClick={() => setSortAsc(!sortAsc)}
                    >
                        {sortAsc ? '↑' : '↓'}
                    </button>
                </div>
            </div>

            {/* Champions Grid */}
            <div className="champions-grid">
                {filteredChampions.map((champion, index) => (
                    <ChampionCard
                        key={champion.id}
                        champion={champion}
                        rank={index + 1}
                        showStats={true}
                    />
                ))}
            </div>

            {filteredChampions.length === 0 && (
                <div className="no-results">
                    Aucun champion trouvé
                </div>
            )}
        </div>
    );
}
