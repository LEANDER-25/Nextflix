import { useContext, useState } from "react";
import "./newMovie.css";
// import storage from "../../firebase";
import { createMovie } from "../../context/movieContext/apiCalls";
import { MovieContext } from "../../context/movieContext/MovieContext";
import axios from "axios";

export default function NewMovie() {
  const [movie, setMovie] = useState(null);
  const [img, setImg] = useState(null);
  const [imgTitle, setImgTitle] = useState(null);
  const [imgSm, setImgSm] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  // const [uploaded, setUploaded] = useState(0);
  var [uploadedFileLinks, setUploadedFileLinks] = useState([]);

  const { dispatch } = useContext(MovieContext);

  const handleChange = (e) => {
    const value = e.target.value;
    setMovie({ ...movie, [e.target.name]: value });
  };

  const upload = async (items, movieId) => {
    let count = 0;
    items.forEach(async (item) => {
      console.log(
        "🚀 ~ file: NewMovie.jsx ~ line 25 ~ items.forEach ~ item",
        item
      );
      const isUploaded = await uploadItem(item);
      count += isUploaded;
      console.log("🚀 ~ file: NewMovie.jsx ~ line 34 ~ items.forEach ~ count", count)
    });

    console.log(
      "🚀 ~ file: NewMovie.jsx ~ line 38 ~ items.forEach ~ final count",
      count
    );

    if (count == 5) {
      return await updateMovieFileLink(movieId);
    }
    return null;
  };

  const uploadItem = async (item) => {
    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("name", item.name);
    formData.append("type", item.type);

    try {
      const res = await axios.post("files/upload", formData, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      console.log("🚀 ~ file: NewMovie.jsx ~ line 58 ~ uploadItem ~ res", res);
      // console.log(
      //   "🚀 ~ file: NewMovie.jsx ~ line 40 ~ uploadItem ~ res",
      //   res.data
      // );
      console.log(
        "🚀 ~ file: NewMovie.jsx ~ line 64 ~ uploadItem ~ res.status",
        res.status
      );
      if (res.status === 201) {
        console.log(' ~ file: NewMovie.jsx ~ line 58 ~ uploadItem ~ In IF');
        uploadedFileLinks = res.data
        setUploadedFileLinks(uploadedFileLinks);
        console.log("🚀 ~ file: NewMovie.jsx ~ line 72 ~ uploadItem ~ uploadedFileLinks", uploadedFileLinks)
        // uploadedFileLinks.push(res.data);
        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: NewMovie.jsx ~ line 49 ~ uploadItem ~ error",
        error
      );
    }
  };

  const updateMovieFileLink = async (movieId) => {
    try {
      const temp = {
        img: uploadedFileLinks[0].fileLink,
        imgTitle: uploadedFileLinks[1].fileLink,
        imgSm: uploadedFileLinks[2].fileLink,
        trailer: uploadedFileLinks[3].fileLink,
        video: uploadedFileLinks[4].fileLink,
      };
      const res = await axios.put(`movies/${movieId}`, temp, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      console.log(
        "🚀 ~ file: NewMovie.jsx ~ line 71 ~ updateMovieFileLink ~ res",
        res
      );
      return {
        data: res.data,
        status: res.status,
      };
    } catch (error) {
      console.log(
        "🚀 ~ file: NewMovie.jsx ~ line 73 ~ updateMovieFileLink ~ error",
        error
      );
    }
  };

  const handleUpload = async (movieId, isSeries) => {
    const videoType = isSeries === true ? "series" : "movie";
    return await upload([
      { name: movieId, file: img, type: "image" },
      { name: movieId, file: imgTitle, type: "imgTitle" },
      { name: movieId, file: imgSm, type: "background" },
      { name: movieId, file: trailer, type: "trailer" },
      { name: movieId, file: video, type: videoType },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "🚀 ~ file: NewMovie.jsx ~ line 61 ~ handleSubmit ~ movie",
      movie
    );
    const result = await createMovie(movie, dispatch);

    console.log(
      "🚀 ~ file: NewMovie.jsx ~ line 63 ~ handleSubmit ~ resBody",
      result.movieId
    );

    if (result.status !== 201) {
      alert(`Create and Upload ${movie.title} cancelled!`);
      return;
    }

    const res = await handleUpload(result.movieId, movie.isSeries);
    console.log("🚀 ~ file: NewMovie.jsx ~ line 129 ~ handleSubmit ~ res", res);

    if (res.status === 200 || res.status === 204) {
      alert(`Create and Upload ${movie.title} successfully!`);
    } else {
      alert(`Error while creating and upload movie`);
    }
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Movie</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Title image</label>
          <input
            type="file"
            id="imgTitle"
            name="imgTitle"
            onChange={(e) => setImgTitle(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Thumbnail image</label>
          <input
            type="file"
            id="imgSm"
            name="imgSm"
            onChange={(e) => setImgSm(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            type="text"
            placeholder="John Wick"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            type="text"
            placeholder="description"
            name="desc"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Year</label>
          <input
            type="text"
            placeholder="Year"
            name="year"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Genre</label>
          <input
            type="text"
            placeholder="Genre"
            name="genre"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Duration</label>
          <input
            type="text"
            placeholder="Duration"
            name="duration"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Limit</label>
          <input
            type="text"
            placeholder="limit"
            name="limit"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Is Series?</label>
          <select name="isSeries" id="isSeries" onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Trailer</label>
          <input
            type="file"
            name="trailer"
            onChange={(e) => setTrailer(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Video</label>
          <input
            type="file"
            name="video"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>
        <button className="addProductButton" onClick={handleSubmit}>
          Create
        </button>
        {/* {uploaded === 5 ? (
        ) : (
          <button className="addProductButton" onClick={handleUpload}>
            Upload
          </button>
        )} */}
      </form>
    </div>
  );
}
