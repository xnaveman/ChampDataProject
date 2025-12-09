import type { Champion } from '../../types/champion';
import { getChampionIconUrl } from '../../utils/championData';
import { Link } from 'react-router-dom';
import './ChampionCard.css';

interface ChampionCardProps {
    champion: Champion;
    rank?: number;
    showStats?: boolean;
}

export default function ChampionCard({ champion, rank, showStats = false }: ChampionCardProps) {
    const roleColors: Record<string, string> = {
        tank: '#4a90a4',
        mage: '#9b59b6',
        assassin: '#e74c3c',
        marksman: '#f39c12',
        support: '#2ecc71',
        fighter: '#e67e22',
    };

    return (
        <Link to={`/champion/${champion.id}`} className="champion-card">
            {rank !== undefined && (
                <div className="champion-rank">#{rank}</div>
            )}

            <div className="champion-icon-wrapper">
                <img
                    src={getChampionIconUrl(champion.id)}
                    alt={champion.name}
                    className="champion-icon"
                    loading="lazy"
                />
            </div>

            <div className="champion-info">
                <h3 className="champion-name">{champion.name}</h3>
                <div className="champion-tags">
                    {champion.tags.map(tag => (
                        <span
                            key={tag}
                            className="champion-tag"
                            style={{
                                backgroundColor: roleColors[tag.toLowerCase()] || '#666',
                                opacity: 0.9
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {showStats && (
                <div className="champion-quick-stats">
                    <div className="stat-item">
                        <span className="stat-label">ATK</span>
                        <span className="stat-value">{champion.info.attack}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">DEF</span>
                        <span className="stat-value">{champion.info.defense}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">MAG</span>
                        <span className="stat-value">{champion.info.magic}</span>
                    </div>
                </div>
            )}
        </Link>
    );
}
