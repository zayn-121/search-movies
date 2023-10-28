import { useState } from "react";

const moviesData = [
  {
    id: 1,
    name: "Iron Man",
    image: "https://shorturl.at/ehvF3",
    genre: "superhero",
    release: 2012,
  },
  {
    id: 2,
    name: "Captain America",
    image: "https://shorturl.at/fvDS6",
    genre: "superhero",
    release: 2013,
  },
  {
    id: 3,
    name: "Thor",
    image: "https://shorturl.at/jxzQR",
    genre: "superhero",
    release: 2014,
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) => arr.reduce((acc, curr) => acc + curr / arr.length, 0);

// const KEY = '3b353a1c';
// const query= 'interstellar';

// useEffect(function () {
//   async function fetchMovies() {
//     const res = await fetch(
//       `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
//     );
//     const data = await res.json();
//     // setMovies(data)
//     // console.log(data);
//   }
//   fetchMovies();
// }, []);
const KEY = '3b353a1c';
const App = () => {
  // const [noOfMoviesResult, setNoOfMoviesResult] = useState(moviesData);
  const [searchFound, setSearchFound] = useState(moviesData);
  
  return (
    <div className="app">
      <NavBar>
        <Logo />
        <Search />
        <SearchResults searchFound={searchFound} />
      </NavBar>
      {/* ======Movies Box Begins===== */}
      <MovieBox>
        <MoviesList searchFound={searchFound} />
        <WatchedMovies />
      </MovieBox>
    </div>
  );
};
export default App;

// ===NavBar===
const NavBar = ({ children }) => {
  return <div className="nav-bar">{children}</div>;
};

// =====Logo===
const Logo = () => {
  return (
    <div className="logo">
      <p>🍿 Popcorn</p>
    </div>
  );
};

// =====Search===
const Search = () => {
  return (
    <div className="search">
      <form>
        <input type="text" placeholder="Search a movie"></input>
      </form>
    </div>
  );
};

// ==== search results===
const SearchResults = ({ searchFound }) => {
  return (
    <p className="search-results">
      Found <strong>{searchFound.length}</strong> results
    </p>
  );
};

// =====Body=======
const MovieBox = ({ children }) => {
  return <div className="movies-box">{children}</div>;
};

const MoviesList = ({ searchFound,}) => {
  const [isOpen1, setIsOpen1] = useState(true);
  const toggleBtn = () => {
    setIsOpen1((open) => !open);
  };

  return (
    <div className="movies-list" searchFound={searchFound}>
      <p onClick={() => toggleBtn()}>
        <span>{isOpen1 ? "–" : "+"}</span>
      </p>
      <div>
        {isOpen1 &&
          moviesData.map((movie) => (
            <MoviesTable movie={movie} key={movie.id} />
          ))}
      </div>
    </div>
  );
};

const MoviesTable = ({ movie }) => {
  return (
    <div className="movies-table">
      <img src={movie.image} alt="ironman"></img>
      <div>
        <h3>{movie.name}</h3>
        <h5>📅{movie.release}</h5>
      </div>
    </div>
  );
};

const WatchedMovies = () => {
  const [isOpen2, setIsOpen2] = useState(true);
  const [totalMovies, setTotalMovies] = useState(tempWatchedData);

  const avgImdbRating = average(totalMovies.map((movie)=> movie.imdbRating))
  const avgUserRating = average(totalMovies.map((movie)=> movie.userRating))
  const avgRuntime = average(totalMovies.map((movie)=> movie.runtime))

  const toggleBtn = () => {
    setIsOpen2((open) => !open);
  };

  return (
    <>
      <div className="watched-movies">
        <div className="toggle-btn" onClick={() => toggleBtn()}>
          <p>
            <span>{isOpen2 ? "–" : "+"}</span>
          </p>
        </div>
        <div className="movies-watch-rating">
          <h3>MOVIES YOU'VE WATCHED</h3>
          <p>
            <span>#️⃣ {totalMovies.length} movies</span>
            <span>⭐ {avgImdbRating}</span>
            <span>🌟 {avgUserRating}</span>
            <span>⏳ {avgRuntime} min</span>
          </p>
        </div>
        <div className="watched-data">
          <ul>
            {isOpen2 &&
              tempWatchedData.map((watched) => (
                <WatchedList watched={watched} key={watched.imdbID} />
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const WatchedList = ({ watched }) => {
  return (
    <li className="watched-list">
      <img src={watched.Poster} alt="poster1" />
      <div className="watched-list-rating-runtime">
        <h3>{watched.Title}</h3>
        <p>
          <span>⭐{watched.imdbRating}</span>
          <span>🌟{watched.userRating}</span>
          <span>⏳{watched.runtime}</span>
        </p>
      </div>
    </li>
  );
};
