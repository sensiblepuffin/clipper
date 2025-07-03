import { useState } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { ArrowLeft, ArrowRight, Close, Pause, PlayArrow } from '@mui/icons-material';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';

function Player() {
  const [videoURL, setVideoURL] = useState('');
  const [videoPaused, setVideoPaused] = useState(true);
  const [videoSelected, setVideoSelected] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  var clipBuffer = [];
  const canvas = document.getElementById('output-canvas');
  const ctx = canvas?.getContext('2d');

  const togglePlay = async () => {
    const videoPlayer = document.getElementById('my-video');
    if (videoPlayer?.paused) {
      try {
        await videoPlayer.play()
      } catch (err) {
        console.warning('err', err);
      }
    } else {
      videoPlayer.pause();
    }
    setVideoPaused(videoPlayer.paused);
  }

  const setStartMark = () => {
    setStartTime(currentTime);
  }

  const setEndMark = () => {
    setEndTime(currentTime);
  }

  const updateCanvas = async (now, metadata) => {
    const video = document.getElementById('my-video');

    console.info('now, start, end', metadata.mediaTime, startTime, endTime);
    if (metadata.mediaTime >= startTime) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const bitmap = await createImageBitmap(video);
      const index = clipBuffer.length;
      clipBuffer.push(bitmap);
      const elapsed = (metadata.mediaTime - startTime) / 1000.0;
      const fps = (index / elapsed).toFixed(3);
      console.info('elapsed', elapsed, 'fps', fps);

      if (metadata.mediaTime <= endTime) {
        // Re-register the callback to run on the next frame
        video.requestVideoFrameCallback(updateCanvas);
      }
    }
  };

  const dumpClip = () => {
    const video = document.getElementById('my-video');
    if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) {
      video.requestVideoFrameCallback(updateCanvas);
    } else {
      console.error('wrong');
    }
  };

  const saveImages = () => {
    for (let img in clipBuffer) {
      window.location.href = img;
    }
  }

  // clip start/end logic
  if (startTime) {
    if (currentTime < startTime) {
      const videoPlayer = document.getElementById('my-video');
      !videoPlayer.paused && togglePlay();
      videoPlayer.currentTime = startTime;
    }
  }

  if (endTime) {
    // the end is nigh
    if (currentTime > endTime) {
      const videoPlayer = document.getElementById('my-video');
      !videoPlayer.paused && togglePlay();
      videoPlayer.currentTime = startTime; // loop from beginning of clip
    }
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
            <a href="https://videojs.com/html5-video-support/" rel="noreferrer" target="_blank"
            >supports HTML5 video</a
            >
          </p>
        </video>
        <Box sx={{ justifyContent: 'space-between' }}>
          <IconButton onClick={togglePlay}>
            {videoPaused ? <PlayArrow /> : <Pause />}
          </IconButton>
          <IconButton onClick={setStartMark}>
            <ArrowRight />
          </IconButton>
          <IconButton onClick={setEndMark}>
            <ArrowLeft />
          </IconButton>
          <IconButton onClick={dumpClip}>
            <VideoCameraBackIcon />
          </IconButton>
          <IconButton>
            <Close onClick={() => setVideoSelected(false)} />
          </IconButton>
        </Box>
        <Box>
          Timestamp: {currentTime}s
          Clip start: {startTime ?? 'N/A'}s
          Clip end: {endTime ?? 'N/A'}s
        </Box>
        <canvas id='output-canvas' />
        <Button onClick={saveImages} >Download images</Button>
      </div>) :
      (<>
        <p>Select a video first!</p>
        <TextField id="outlined-basic" onChange={(evt) => setVideoURL(evt.target.value)} />
        <IconButton>
          <PlayArrow onClick={() => setVideoSelected(true)} />
        </IconButton>
      </>)
  );
}

export default Player;