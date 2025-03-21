import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import ScaleLoader from "react-spinners/ScaleLoader";
import MovieCard from './components/MovieCard';
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearch } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};


function App() {
  const [debounceSearch, setDebounceSearch] = useState('');
  const [search, setSearch] = useState("");
  
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [trendingMovies, setTrendingMovies] = useState([]);
  let [color, setColor] = useState("#b093ff");
  

  useDebounce(() => setDebounceSearch(search), 500, [search])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error("Fail to fetch movies");        
      }

      const data = await response.json();
      
      if (data.Response == 'False') {
        setErrorMessage(data.Error || 'Fail to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || [])

      if (query && data.results.length > 0) {
        await updateSearch(query, data.results[0]);
      }

    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please, try again later.')
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);      
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);      
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearch)  
  }, [debounceSearch])
  

  useEffect(() => {
    loadTrendingMovies();
  }, []);
  

  return (
    <>
      <main>
        <div className='pattern' />
        <div className='wrapper'>
          <header>
            <img 
              src='./hero.png'
              alt='Hero Banner'
            />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
            {/* Search */}
            <Search search={search} setSearch={setSearch} />
          </header>
          {trendingMovies.length > 0 && (
            <section className='trending'>
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img 
                      src={movie.poster_url} 
                      alt={movie.title} 
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className='all-movies'>
            <h2>All movies</h2>
            {isLoading ? (
              <div className='text-red-500'>
                <ScaleLoader
                  color={color}
                  loading={isLoading}
                  size={35}
                />
              </div>
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}
          </section>
        </div>          
      </main>
    </>
  )
}

export default App
