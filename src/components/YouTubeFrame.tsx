"use client";

import { useState } from "react";
import type { SyntheticEvent } from "react";
import { Play } from "@phosphor-icons/react";
import VideoCard from "./VideoCard";

interface YouTubeFrameProps {
  /**
   * YouTube video ID — the part after `v=`. Leave it out and the slot renders
   * as a reserved frame, so the layout holds before the films are published.
   */
  id?: string;
  title: string;
  /** Two-digit slot index shown in the corner. */
  index: string;
  className?: string;
}

/**
 * A click-to-play facade rather than an embedded player. YouTube's iframe pulls
 * roughly a megabyte and sets cookies on load; with three of them on the page
 * that's paid on every visit whether or not anyone presses play. The poster
 * costs a single image, and the real player is fetched on the click.
 */
export default function YouTubeFrame({ id, title, index, className = "" }: YouTubeFrameProps) {
  const [playing, setPlaying] = useState(false);

  // No ID yet — fall back to the reserved frame treatment.
  if (!id) {
    return <VideoCard index={index} label={title} className={className} />;
  }

  if (playing) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg border border-(--accent) bg-black ${className}`}
      >
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  // maxres doesn't exist for every upload; drop to hq on the first failure.
  function fallbackPoster(e: SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (img.dataset.fallback) return;
    img.dataset.fallback = "true";
    img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }

  return (
    <button
      type="button"
      data-cursor="none"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
      className={`cursor-hover-target group relative w-full overflow-hidden rounded-lg border border-(--hairline-strong) bg-(--surface-sunken) transition-[border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-(--accent) focus-visible:border-(--accent) ${className}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
        onError={fallbackPoster}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />

      {/* Scrim, so the index and the play mark hold over any thumbnail. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30"
      />

      <span className="u-index absolute top-3 left-3 z-10 text-white/85">{index}</span>

      <span className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-4 py-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-(--accent) text-(--accent-text) transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
          <Play size={16} weight="fill" />
        </span>
        <span className="u-meta text-white/90">Watch</span>
      </span>
    </button>
  );
}
