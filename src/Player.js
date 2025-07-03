import { useState } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { ArrowLeft, ArrowRight, Close, Pause, PlayArrow } from '@mui/icons-material';

function Player() {
  const [videoURL, setVideoURL] = useState('');
  const [videoSelected, setVideoSelected] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  console.info('video', videoURL);
  console.info('current', currentTime);

  const videoPlayer = document.getElementById('my-video');
  console.info('video', videoPlayer);

  const togglePlay = () => {
    videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
  }

  const setStartMark = (time) => {
    setStartTime(currentTime);
  }

  const setEndMark = (time) => {
    setEndTime(currentTime);
  }

  return (
    (videoSelected && videoURL) ?
      (<div>
        <IconButton sx={{ position: 'fixed', right: 0, top: 0 }}>
          <Close onClick={() => setVideoSelected(false)} />
        </IconButton>
        <video
          id="my-video"
          // controls
          preload="auto"
          width="640"
          // height="480"
          poster="MY_VIDEO_POSTER.jpg"
          data-setup="{}"
          onTimeUpdate={(evt) => setCurrentTime(evt.target.currentTime)}
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
        <Box sx={{ justifyContent: 'center' }}>
        <IconButton onClick={togglePlay}>
          {videoPlayer.paused ? <PlayArrow /> : <Pause />}
        </IconButton>
        <IconButton onClick={setStartMark}>
          <ArrowRight  />
        </IconButton>
        <IconButton onClick={setEndMark}>
          <ArrowLeft />
        </IconButton>
        <IconButton>
          <Close onClick={() => setVideoSelected(false)} />
        </IconButton>
        </Box>
        <Box>
          Timestamp: {currentTime}s
          Clip start: {startTime}s
          Clip end: {endTime}s
        </Box>
      </div>) :
      (<>
        <p>Select a video first!</p>
        <TextField id="outlined-basic" onChange={(evt) => setVideoURL(evt.target.value)} />
        
      </>)
  );
}

export default Player;