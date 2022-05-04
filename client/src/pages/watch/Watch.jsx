import { ArrowBackOutlined } from "@material-ui/icons";
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import "./watch.scss";
import { useState } from "react";
import axios from "axios";
import ReactPlayer from 'react-player'

export default function Watch() {
  // const location = useLocation();
  // const movie = location.movie;
  let {id} = useParams();
  const [ watch, setWatch ] = useState();
  console.log(id);
  useEffect(() => {
    const getRandomContent = async () => {
      try {
        const res = await axios.get(`/movies/find/${id}`, {
          headers: {
            Authorization:
              "Bearer "+JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        console.log(res);
        setWatch(res);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomContent();
  }, [id]);
  console.log(watch);
  return (
    <div className="watch">
      <Link to="/">
        <div className="back">
          <ArrowBackOutlined />
          Home
        </div>
      </Link>
      {/* <ReactPlayer width={100+'%'} height={100+'%'}  url='https://drive.google.com/file/d/1v6gn055vQjsYvosxxtWWDrHZOxHOCDpF/view?usp=drivesdk' /> */}
      <iframe src="https://drive.google.com/file/d/1v6gn055vQjsYvosxxtWWDrHZOxHOCDpF/preview" className="video" allow="autoplay"></iframe>
    </div>
  );
}
