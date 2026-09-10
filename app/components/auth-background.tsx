"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Same three photos as the hero in web/, so the app opens on a view the user
// already recognises from the landing page.
const IMAGES = [
  "/images/hero-bg-1.jpg",
  "/images/hero-bg-2.jpg",
  "/images/hero-bg-3.jpg",
] as const;

/** How long each photo is held before the next one takes over. */
const HOLD_MS = 6000;
/** Must match the duration- class below, or images overlap mid-fade. */
const FADE_MS = 1200;

/**
 * Cross-fading photo backdrop for the auth screens. Client-side because only
 * the images need to be interactive — the headline and form around it stay
 * server-rendered.
 */
export default function AuthBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Auto-playing motion is disorienting for people who ask the OS to reduce
    // it, so they just get the first photo.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const timer = setInterval(
      () => setIndex((current) => (current + 1) % IMAGES.length),
      HOLD_MS + FADE_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {IMAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          // Only the first is LCP — the rest would fight it for bandwidth.
          priority={i === 0}
          sizes="(max-width: 448px) 100vw, 448px"
          className={cn(
            "object-cover transition-opacity duration-[1200ms] ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </>
  );
}
