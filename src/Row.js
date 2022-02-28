import React, { useEffect, useState } from "react";

import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

import "./Row.css";
import axios from "./axios";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, SetMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            SetMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || "")
                .then((url) => {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get("v"));
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row__posters">
                {/* several row posters */}

                {movies.map((movie) => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row__poster ${
                            isLargeRow && "row__posterLarge"
                        }`}
                        src={`${baseURL}${movie.poster_path}`}
                        alt={movie.name}
                    />
                ))}
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

const baseURL = "https://image.tmdb.org/t/p/original/";

export default Row;
