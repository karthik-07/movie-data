import React from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import "./MovieThumb.css";

const MovieThumb = (props) => {
  return (
    <div className="rmdb-moviethumb">
      {props.clickable ? (
        <Link
          to={{
            pathname: `/${props.movieId}`,
            movieName: `/${props.movieName}`,
          }}
        >
          <img src={props.image} alt="moviethumb" />
        </Link>
      ) : (
        <img src={props.image} alt="moviethumb" />
      )}
    </div>
  );
};

MovieThumb.propTypes = {
  image: propTypes.string,
  movieId: propTypes.number,
  movieName: propTypes.string,
};
export default MovieThumb;
