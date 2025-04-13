/**
 * BlogContent component
 *
 * This component displays the main content of a blog post, including
 * a summary, audio player, video player, and a description section
 * that can be expanded or collapsed.
 *
 * @description The BlogContent component is a functional React component
 * that renders the main content of a blog post. It includes a summary,
 * an audio player for audio content, a video player for video content,
 * and a description section that can be expanded or collapsed for better
 * user experience.
 *
 * @component
 * @param {BlogContentProps} props - The component props.
 * @returns {JSX.Element} The rendered blog content component, which includes
 * the title, summary, audio player, video player, and an expandable description.
 */
import React, { useState, useEffect, type JSX } from 'react';
import Summary from './Summary';
import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

// Define interfaces for type safety
interface Blog {
  title?: string;
  summary?: string;
  audioUrl?: string;
  videoUrl?: string;
  content?: string;
}

interface BlogContentProps {
  blog: Blog;
}

interface VideoPlayerProps {
  videoUrl: string;
  id?: string; // Optional, with ? since it may not always be provided
}

/**
 * BlogContent function component
 *
 * @function BlogContent
 * @param {BlogContentProps} props - The component props.
 * @returns {JSX.Element} The rendered blog content component, which displays
 * the blog's title, summary, audio and video players, and an expandable description.
 */
function BlogContent({ blog }: BlogContentProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [audioVisible, setAudioVisible] = useState<boolean>(true);
  const [videoVisible, setVideoVisible] = useState<boolean>(true);

  useEffect(() => {
    if (blog && blog.summary) {
      setSummary(blog.summary);
    } else {
      setSummary('No summary provided.');
    }

    if (!blog?.audioUrl) {
      console.log('No audio data');
      setAudioVisible(false);
    }

    if (!blog?.videoUrl) {
      console.log('No video data');
      setVideoVisible(false);
    }
  }, [blog]);

  /**
   * Toggles the expanded state of the description section.
   * This function updates the `isExpanded` state to show or hide the full
   * description of the blog post, enhancing user interaction.
   *
   * @function toggleExpand
   */
  const toggleExpand = (): void => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article className="mb-12 px-4 sm:px-6 lg:px-8" id="blog-content">
      <h1
        className="mb-6 text-2xl font-bold sm:text-3xl lg:text-4xl text-center sm:text-left"
        id="blog-title"
      >
        {blog?.title || 'Category'}
      </h1>
      <Summary summary={summary} />
      {videoVisible && blog.videoUrl && (
        <div className="my-6" id="video-player-container">
          <div className="flex justify-center">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-video">
                <VideoPlayer videoUrl={blog.videoUrl} id="video-player" />
              </div>
            </div>
          </div>
        </div>
      )}
      {audioVisible && blog.audioUrl && (
        <div className="my-6" id="audio-player-container">
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <AudioPlayer audioUrl={blog.audioUrl} />
            </div>
          </div>
        </div>
      )}
      <section className="mt-8" id="blog-description">
        <h2 className="mb-4 text-xl font-semibold sm:text-2xl">Description</h2>
        <div
          className={`overflow-hidden transition-all duration-300 text-white text-opacity-80 ${
            isExpanded ? 'max-h-full' : 'max-h-32 sm:max-h-40'
          }`}
        >
          <p
            className="mb-4 leading-relaxed text-sm sm:text-base"
            id="blog-content-text"
          >
            {blog?.content || 'Description goes here.'}
          </p>
        </div>
        <button
          onClick={toggleExpand}
          className="mt-4 text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm sm:text-base"
          aria-expanded={isExpanded}
          id="toggle-description-button"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      </section>
    </article>
  );
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, id }) => (
  <div id={id}>
    <video src={videoUrl} controls />
  </div>
);

export default BlogContent;