import { useEffect, useRef, useState } from "react";
import { CLIPS } from "../changelog";

/**
 * A changelog clip: silent and looping while it's on screen, and fetched only then. A visitor who
 * prefers reduced motion sees its still until they press it; a press pauses or plays it for anyone.
 */
export function Clip({ name, label }: { name: string; label: string }) {
  const button = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  // What the visitor chose by pressing it; until then, motion follows their preference.
  const [chosen, setChosen] = useState<boolean>();
  const [moving, setMoving] = useState<boolean>();
  // Shown instead of the video while it has never played.
  const [still, setStill] = useState<boolean>();

  useEffect(() => {
    const clip = video.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    const update = () => {
      const on = chosen ?? !reduce.matches;
      setMoving(on);
      if (on && seen) {
        if (!clip.src) clip.src = `${CLIPS}/${name}.mp4`;
        clip.play().catch(() => {});
      } else {
        clip.pause();
      }
      setStill(!clip.src);
    };
    // It starts loading a screen early, so it's playing by the time it's in view.
    const watch = new IntersectionObserver(
      ([entry]) => {
        seen = entry.isIntersecting;
        update();
      },
      { rootMargin: "100% 0px" },
    );
    watch.observe(button.current!);
    reduce.addEventListener("change", update);
    return () => {
      watch.disconnect();
      reduce.removeEventListener("change", update);
    };
  }, [chosen, name]);

  return (
    <button
      ref={button}
      type="button"
      className="clip"
      data-still={still}
      aria-label={moving ? `Pause: ${label}` : `Play: ${label}`}
      onClick={() => setChosen(!moving)}
    >
      <img src={`${CLIPS}/${name}-still.webp`} alt="" loading="lazy" decoding="async" />
      <video
        ref={video}
        poster={`${CLIPS}/${name}.webp`}
        muted
        autoPlay
        loop
        playsInline
        preload="none"
        aria-hidden
      />
    </button>
  );
}
