import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Champions from './pages/Champions/Champions';
import ChampionDetail from './pages/ChampionDetail/ChampionDetail';
import Benchmark from './pages/Benchmark/Benchmark';
import Rankings from './pages/Rankings/Rankings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/champions" element={<Champions />} />
            <Route path="/champion/:championId" element={<ChampionDetail />} />
            <Route path="/benchmark" element={<Benchmark />} />
            <Route path="/rankings" element={<Rankings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
