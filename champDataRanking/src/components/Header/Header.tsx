import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <span className="logo-text">ChampData</span>
                    <span className="logo-suffix">Ranking</span>
                </Link>

                <nav className="nav">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Accueil
                    </Link>
                    <Link
                        to="/champions"
                        className={`nav-link ${isActive('/champions') ? 'active' : ''}`}
                    >
                        Champions
                    </Link>
                    <Link
                        to="/benchmark"
                        className={`nav-link ${isActive('/benchmark') ? 'active' : ''}`}
                    >
                        Benchmark
                    </Link>
                    <Link
                        to="/rankings"
                        className={`nav-link ${isActive('/rankings') ? 'active' : ''}`}
                    >
                        Rankings
                    </Link>
                </nav>
            </div>
        </header>
    );
}
