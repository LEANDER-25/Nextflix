import axios from "axios";
import {
  createMovieFailure,
  createMovieStart,
  createMovieSuccess,
  deleteMovieFailure,
  deleteMovieStart,
  deleteMovieSuccess,
  getMoviesFailure,
  getMoviesStart,
  getMoviesSuccess,
} from "./MovieActions";

export const getMovies = async (dispatch) => {
  dispatch(getMoviesStart());
  try {
    const res = await axios.get("/movies", {
      headers: {
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(getMoviesSuccess(res.data));
  } catch (err) {
    dispatch(getMoviesFailure());
  }
};

//create
export const createMovie = async (movie, dispatch) => {
  dispatch(createMovieStart());
  try {
    console.log(movie);
    const res = await axios.post("/movies", movie, {
      headers: {
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    console.log(res);
    dispatch(createMovieSuccess(res.data));
    return {
      movieId: res.data.movieId,
      status: res.status
    };
  } catch (err) {
    console.log(err);
    console.log(err.response.status);
    console.log(err.response.data);
    dispatch(createMovieFailure());
    return null;
  }
};

//delete
export const deleteMovie = async (id, dispatch) => {
  dispatch(deleteMovieStart());
  try {
    await axios.delete("/movies/" + id, {
      headers: {
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
      },
    });
    dispatch(deleteMovieSuccess(id));
  } catch (err) {
    dispatch(deleteMovieFailure());
  }
};
