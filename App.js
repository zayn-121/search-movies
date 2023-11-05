import { useEffect, useState } from "react";
import StarRating from "./StarRating";



const average = (arr) => arr.reduce((acc, curr) => acc + curr / arr.length, 0);

const KEY = "3b353a1c";

const App = () => {
  const [query, setquery] = useState("");
  const [updateMovie, setUpdateMovie] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [addMovie, setAddMovie] = useState([]);

  // function for adding movie in the watched movie list
  const handleAddMovie = (movie) => {
    setAddMovie((watched) => [...watched, movie]);
  };

  // function for selecting movies and displaying their details
  const handleSelectedId = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  // function for closing movie's details if the movie has already been selected
  const handleCloseMovieDetail = () => {
    setSelectedId(null);
  };

  // function to delete movie added in the watched-list
  const handleDelete = (id) => {
    setAddMovie((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  useEffect(() => {
    fetchMovies();
    return function () {
      controller.abort();
    };
  }, [query]);

  const controller = new AbortController();

  async function fetchMovies() {
    try {
      setLoading(true);
      setError("");

      const data = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
        { signal: controller.signal }
      );
      // console.log(data);

      if (!data.ok) {
        throw new Error(" Something went wrong with fetching movies.");
      }
      const json = await data?.json();
      // console.log(json);
      setUpdateMovie(json?.Search);
      setError("");
    } catch (err) {
      if (err.name !== "AbortError") {
        console.log(err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <NavBar>
        <Logo />
        <Search query={query} setquery={setquery} />
        <SearchResults updateMovie={updateMovie} />
      </NavBar>
      {/* ======Movies Box Begins===== */}
      <MovieBox>
        <Box>
          {loading && <Shimmer />}
          {!loading && !error && (
            <MoviesList
              query={query}
              updateMovie={updateMovie}
              setUpdateMovie={setUpdateMovie}
              setLoading={setLoading}
              setError={setError}
              onSelectedId={handleSelectedId}
            />
          )}
          {error && <ErrorMessage errorAlert={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MoviesInfo
              selectedId={selectedId}
              onCloseMovieDetail={handleCloseMovieDetail}
              onHandleAddMovie={handleAddMovie}
              addMovie={addMovie}
            />
          ) : (
            <WatchedMovies addMovie={addMovie} onDeleteWatched={handleDelete} />
          )}
        </Box>
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
      <p>🍿 Silver Screen</p>
    </div>
  );
};

// =====Search===
const Search = ({ query, setquery }) => {
  return (
    <div className="search">
      <form>
        <input
          type="search"
          value={query}
          onChange={(e) => setquery(e.target.value)}
          placeholder="Search a movie"
        ></input>
      </form>
    </div>
  );
};

// ==== search results===
const SearchResults = ({ updateMovie }) => {
  return (
    <p className="search-results">
      Found{" "}
      <strong>{updateMovie?.length > 0 ? updateMovie?.length : "0"} </strong>
      results
    </p>
  );
};

// =====Body=======
const MovieBox = ({ children }) => {
  return <div className="movies-box">{children}</div>;
};

const Box = ({ children }) => {
  const [isOpen, setIsopen] = useState(true);
  const toggleBtn = () => {
    setIsopen((open) => !open);
  };
  return (
    <div className="box">
      <p onClick={() => toggleBtn()}>
        <span>{isOpen ? "–" : "+"}</span>
      </p>
      {isOpen && children}
    </div>
  );
};

//======SHIMMER=======//
const Shimmer = () => {
  return <h2 className="shimmer">Loading Shimmer</h2>;
};

//======ERROR MESSAGE=======//
const ErrorMessage = ({ errorAlert }) => {
  return (
    <h2 className="error-message">
      <span>⛔</span> {errorAlert}
    </h2>
  );
};

const MoviesList = ({ updateMovie, onSelectedId }) => {
  return (
    <div className="movies-list">
      {updateMovie?.map((movie) => (
        <MoviesTable
          movie={movie}
          key={movie?.imdbID}
          onSelectedId={onSelectedId}
        />
      ))}
    </div>
  );
};

const MoviesInfo = ({
  selectedId,
  onCloseMovieDetail,
  onHandleAddMovie,
  addMovie,
}) => {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  const isWatched = addMovie.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = addMovie.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title,
    Year,
    Poster,
    Runtime,
    imdbRating,
    Plot,
    Released,
    Actors,
    Director,
    Genre,
  } = movie;

  // onClick handler function for the add movie button
  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      Poster,
      Title,
      imdbRating: Number(imdbRating),
      Runtime: Number(Runtime.split(" ").at(0)),
      userRating,
    };

    onHandleAddMovie(newWatchedMovie);
    onCloseMovieDetail();
  };

  useEffect(() => {
    fetchMovieDetails();
  }, []);
  async function fetchMovieDetails() {
    const data = await fetch(
      `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
    );
    const res = await data.json();
    console.log(res);
    setMovie(res);
  }

  return (
    <div className="movie-info">
      <header>
        <button className="btn" onClick={onCloseMovieDetail}>
          &larr;
        </button>
        <img src={movie?.Poster} alt={movie?.Title} />
        <div>
          <h1>{movie?.Title}</h1>
          <h4>
            {movie?.Released} - <span>{movie?.Runtime}</span>
          </h4>
          <h4>{movie?.Genre}</h4>
          <h4>⭐ {movie?.imdbRating} IMDB rating</h4>
        </div>
      </header>
      <section>
        <div>
          {!isWatched ? (
            <>
              <StarRating maxRating={10} onSetRating={setUserRating} />
              {userRating > 0 && (
                <button onClick={() => handleAdd()}>+ Add Movie</button>
              )}
            </>
          ) : (
            <h4>You rated this movie {watchedUserRating} 🌟</h4>
          )}
        </div>
        <h4>
          <em>{movie.Plot}</em>
        </h4>
        <h4>Starring {movie?.Actors}</h4>
        <h4>Directed by {movie?.Director}</h4>
      </section>
    </div>
  );
};

const MoviesTable = ({ movie, onSelectedId }) => {
  return (
    <div className="movies-table" onClick={() => onSelectedId(movie?.imdbID)}>
      <img src={movie?.Poster} alt={movie?.Title}></img>
      <div>
        <h3>{movie?.Title}</h3>
        <h5>📅{movie?.Year}</h5>
      </div>
    </div>
  );
};

const WatchedMovies = ({ addMovie, onDeleteWatched }) => {
  const avgImdbRating = average(addMovie?.map((movie) => movie?.imdbRating));
  const avgUserRating = average(addMovie?.map((movie) => movie?.userRating));
  const avgRuntime = average(addMovie?.map((movie) => movie?.Runtime));

  return (
    <>
      <div className="watched-movies">
        <div className="movies-watch-rating">
          <h3>MOVIES YOU'VE WATCHED</h3>
          <h4>
            <span>#️⃣ {addMovie?.length} movies</span>
            <span>⭐ {avgImdbRating.toFixed(2)} IMDB </span>
            <span>🌟 {avgUserRating.toFixed(2)} User </span>
            <span>⏳ {avgRuntime.toFixed(2)} min</span>
          </h4>
        </div>
        <div className="watched-data">
          <ul>
            {addMovie.map((watched) => (
              <WatchedList
                watched={watched}
                key={watched?.imdbID}
                onDeleteWatched={onDeleteWatched}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const WatchedList = ({ watched, onDeleteWatched }) => {
  return (
    <li className="watched-list">
      <img src={watched?.Poster} alt="poster1" />
      <div className="watched-list-rating-runtime">
        <h3>{watched?.Title}</h3>
        <h4>
          <span>⭐{watched?.imdbRating}</span>
          <span>🌟{watched?.userRating}</span>
          <span>⏳{watched?.Runtime}</span>
        </h4>
        <button onClick={() => onDeleteWatched(watched.imdbID)}>X</button>
      </div>
    </li>
  );
};
