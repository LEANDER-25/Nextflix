import { InfoOutlined, PlayArrow } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./featured.scss";

export default function Featured({ type, setGenre }) {
  const [content, setContent] = useState({});
  const [genres, setGenres] = useState([]);

  const history = useHistory();

  const handleGetGenre = async () => {
    try {
      const res = await axios.get("/genres", {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      console.log(
        "🚀 ~ file: Featured.jsx ~ line 20 ~ handleGetGenre ~ res",
        res.data
      );
      setGenres(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetGenre();
  }, []);

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        if (type === undefined) {
          type = "movie";
        } else {
          type = "series";
        }
        const res = await axios.get(`/movies/random?type=${type}`, {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setContent(res.data[0]);
      } catch (err) {
        console.log(err);
        const statusCode = err.response.status;
        console.log(statusCode);
        if (statusCode === 401) {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    };
    getRandomContent();
  }, [type]);

  console.log(content);
  return (
    <div className="featured">
      {type && (
        <div className="category">
          <span>{type === "movies" ? "Movies" : "Series"}</span>
          <select
            name="genre"
            id="genre"
            onChange={(e) => setGenre(e.target.value)}
          >
            <option>Genre</option>
            {genres.map((item, key) => {
              return <option value={`${item.genre.toLowerCase()}`}>{item.genre}</option>;
            })}
          </select>
        </div>
      )}
      <img src={content.img} alt="" />
      <div className="info">
        <img src={content.imgTitle} alt="" />
        <span className="desc">{content.desc}</span>
        <div className="buttons">
          <button
            className="play"
            onClick={() => history.push(`/watch/${content.movieId}`)}
          >
            <PlayArrow />
            <span>Play</span>
          </button>
          <button className="more">
            <InfoOutlined />
            <span>Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}
