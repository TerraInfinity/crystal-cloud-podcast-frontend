/**
 * AudioPlayer component
 *
 * This component provides an audio player for playing audio content.
 * It includes play/pause functionality and displays the audio controls.
 *
 * @component
 * @param {AudioPlayerProps} props - The component props.
 * @returns {JSX.Element} The rendered audio player component.
 *
 * @prop {string} audioUrl - The URL of the audio file to be played.
 *
 * @example
 * <AudioPlayer audioUrl="https://example.com/audio.mp3" />
 *
 * The component maintains its own state to track whether the audio is currently playing.
 * It uses the HTML5 audio element to render the audio controls.
 */
import React, { useRef, useState, type JSX } from 'react';

// Define props interface for type safety
interface AudioPlayerProps {
  audioUrl: string;
}

function AudioPlayer({ audioUrl }: AudioPlayerProps): JSX.Element {
  const audioRef = useRef<HTMLAudioElement>(null); // Reference to the audio element
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to track play/pause status

  const togglePlay = (): void => {
    // Toggle play/pause functionality
    if (isPlaying) {
      audioRef.current?.pause(); // Pause the audio if it's currently playing
    } else {
      audioRef.current?.play(); // Play the audio if it's currently paused
    }
    setIsPlaying(!isPlaying); // Update the play/pause state
  };

  return (
    <div className="my-8" id="audio-player">
      <h2 className="mb-4 text-2xl font-semibold" id="audio-version-title">
        Audio Version
      </h2>
      <div className="flex items-center bg-gray-800 rounded-lg p-4" id="audio-controls">
        <audio
          ref={audioRef}
          src={audioUrl}
          className="w-full"
          controls
          id="audio-element"
        >
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}

export default AudioPlayer;