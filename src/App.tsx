import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShowView from './pages/ShowView';
import EpisodeView from './pages/EpisodeView';
import WatchlistView from './pages/WatchlistView';
import CelebsView from './pages/CelebsView';
import CelebDetailsView from './pages/CelebDetailsView';
import MoviesView from './pages/MoviesView';
import MovieView from './pages/MovieView';
import TopMoviesView from './pages/TopMoviesView';
import TopShowsView from './pages/TopShowsView';
import TvShowsView from './pages/TvShowsView';
import About from './pages/About';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  return (
    <Router>
      <div className="font-sans antialiased text-gray-900 bg-black min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowView />} />
          <Route path="/movie/:id" element={<MovieView />} />
          <Route path="/episode/:id" element={<EpisodeView />} />
          <Route path="/movies" element={<MoviesView />} />
          <Route path="/tvshows" element={<TvShowsView />} />
          <Route path="/top-movies" element={<TopMoviesView />} />
          <Route path="/top-shows" element={<TopShowsView />} />
          <Route path="/watchlist" element={<WatchlistView />} />
          <Route path="/celebs" element={<CelebsView />} />
          <Route path="/celebs/:id" element={<CelebDetailsView />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
        <ScrollToTopButton />
      </div>
    </Router>
  );
}

export default App;
