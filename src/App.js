import './App.css';
import { useState } from 'react';
import { Button, IconButton, TextField } from '@mui/material';
import { Close, PlayArrow } from '@mui/icons-material';

function App() {
  const [videoURL, setVideoURL] = useState('');
  const [videoSelected, setVideoSelected] = useState(false);
  console.info('video', videoURL);
  return (
    <div className="App">
      {(videoSelected && videoURL) ?
        (<div>
          <video
          id="my-video"
          // controls
          preload="auto"
          width="640"
          height="480"
          poster="MY_VIDEO_POSTER.jpg"
          data-setup="{}"
        >
          <source src={videoSelected ? videoURL : 'null'} type="video/mp4"></source>
          <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a
            web browser that
            <a href="https://videojs.com/html5-video-support/" target="_blank"
            >supports HTML5 video</a
            >
          </p>
        </video>
        <IconButton>
          <Close onClick={() => setVideoSelected(false)} />
        </IconButton>
        </div>) :
        (<>
            <p>Select a video first!</p>
            <TextField id="outlined-basic" onChange={(evt) => setVideoURL(evt.target.value)} />
            <IconButton>
              <PlayArrow onClick={() => setVideoSelected(true)} />
            </IconButton>
        </>)}
    </div>
  );
}

export default App;
