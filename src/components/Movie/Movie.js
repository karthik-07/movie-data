import React, { useState, useEffect } from "react";
import { API_URL, API_KEY } from "../../config";
import Navigation from "../elements/Navigation/Navigation";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Actor from "../elements/Actor/Actor";
import Spinner from "../elements/Spinner/Spinner";
import "./Movie.css";


const Movie = (props) => {
  const [movie, setMovie] = useState(null)
  const [actors, setActors] = useState(null)
  const [directors, setDirectors] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const endpoint = `${API_URL}movie/${props.match.params.movieId}?api_key=${API_KEY}&language=en-US`
    fetchItems(endpoint)
  }, 
  [props.match.params.movieId]
  )

  const fetchItems = async (endpoint) => {
    const Movieresult = await fetch(endpoint).then((res) => res.json())
    if (Movieresult.status_code) {
      setLoading(false)
    } else {
      setMovie(Movieresult)
      const endpoint = `${API_URL}movie/${props.match.params.movieId}/credits?api_key=${API_KEY}`
      let creditsResult = await fetch(endpoint).then((res) => res.json())
      
      const directors = creditsResult.crew.filter((member) => member.job === "Director")
      
      setActors(creditsResult.cast)
      setDirectors(directors)
      setLoading(false)
    }
  }

  return (
    <div className="rmdb-movie">
      {movie ? (
        <div>
          <Navigation movie = {props.location.movieName} />
          <MovieInfo movie = {movie} directors = {directors} />
          <MovieInfoBar time = {movie.runtime} budget = {movie.budget} revenue = {movie.revenue} />
        </div>
      ) : null}
      {actors ? (
        <div className="rmdb-movie-grid">
          <FourColGrid header={"Actors"}>
            {actors.map((element, i) => (
              <Actor key ={i} actor = {element} />
            ))}
          </FourColGrid>
        </div>
      ) : null}
      {!actors && !loading ? <h1>No Movie Found</h1> : null}
      {loading ? <Spinner /> : null}
    </div>
  )
}

// class Movie extends Component {
//   state = {
//     movie: null,
//     actors: null,
//     directors: [],
//     loading: false,
//   };

//   componentDidMount() {
//     this.setState({ loading: true });
//     //Fetch Movie First
//     const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`;
//     this.fetchItems(endpoint);
//   }

//   fetchItems = (endpoint) => {
//     fetch(endpoint)
//       .then((result) => result.json())
//       .then((result) => {
//         console.log(result);
//         if (result.status_code) {
//           this.setState({ loading: false });
//         } else {
//           this.setState({ movie: result }, () => {
//             //Fetch Actors after state is set
//             const endpoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}`;
//             fetch(endpoint)
//               .then((result) => result.json())
//               .then((result) => {
//                 const directors = result.crew.filter(
//                   (member) => member.job === "Director"
//                 );
//                 this.setState({
//                   actors: result.cast,
//                   directors,
//                   loading: false,
//                 });
//               });
//           });
//         }
//       })
//       .catch((error) => console.log("Error:", error));
//   };

//   render() {
//     return (
//       <div className="rmdb-movie">
//         {this.state.movie ? (
//           <div>
//             <Navigation movie={this.props.location.movieName} />
//             <MovieInfo
//               movie={this.state.movie}
//               directors={this.state.directors}
//             />
//             <MovieInfoBar
//               time={this.state.movie.runtime}
//               budget={this.state.movie.budget}
//               revenue={this.state.movie.revenue}
//             />
//           </div>
//         ) : null}
//         {this.state.actors ? (
//           <div className="rmdb-movie-grid">
//             <FourColGrid header={"Actors"}>
//               {this.state.actors.map((element, i) => {
//                 return <Actor key={i} actor={element} />;
//               })}
//             </FourColGrid>
//           </div>
//         ) : null}
//         {!this.state.actors && !this.state.loading ? (
//           <h1>No Movie Found</h1>
//         ) : null}
//         {this.state.loading ? <Spinner /> : null}
//       </div>
//     );
//   }
// }

export default Movie;
