// components/AudioPlayer.js
import React, { useRef, useEffect } from "react";

const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? process.env.NEXT_PUBLIC_BASE_PATH : "";

const AudioPlayer = (props) => {
  // Create a ref to hold the audio element
  const { audioRef } = props;

  useEffect(() => {
    // Load the MP3 file from the public directory
    const audioElement = audioRef.current;
    audioElement.src = basePath + "/track.mp3"; // Path to your MP3 file in the public directory

    // Set the volume to 0.5 (50%)
    // audioElement.volume = 0.5;
    audioElement.currentTime = 65;

    // Optionally, you can play the audio automatically
    audioElement.play().catch((error) => {
      console.log("Error playing audio:", error);
    });

    return () => {
      // Cleanup on component unmount
      audioElement.pause();
      audioElement.src = "";
    };
  }, []);

  return (
    <div className="audio-player">
      <audio ref={audioRef} controls>
        Your browser does not support the <code>audio</code> element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
