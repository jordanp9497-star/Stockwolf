"use client";

import { useState, useEffect } from "react";

interface StockWolfLogoProps {
  className?: string;
}

export default function StockWolfLogo({ className = "" }: StockWolfLogoProps) {
  const [imageExists, setImageExists] = useState(false);

  // Check if image exists on mount
  useEffect(() => {
    const img = new Image();
    img.src = "/brand/stockwolf-mark.png";
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
  }, []);

  // If image exists, use img tag (Next.js Image causes issues if file doesn't exist)
  if (imageExists) {
    return (
      <img
        src="/brand/stockwolf-mark.png"
        alt="StockWolf"
        className={`w-7 h-7 md:w-8 md:h-8 ${className}`}
        style={{ width: "28px", height: "28px" }}
      />
    );
  }

  // Fallback SVG - minimalist white wolf head
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-7 h-7 md:w-8 md:h-8 ${className}`}
      style={{ width: "28px", height: "28px" }}
    >
      {/* Wolf head outline - white fill */}
      <path
        d="M16 6C12 6 9 9 9 13C9 14.5 9.5 16 10.5 17C9.5 18 9 19.5 9 21C9 25 12 28 16 28C20 28 23 25 23 21C23 19.5 22.5 18 21.5 17C22.5 16 23 14.5 23 13C23 9 20 6 16 6Z"
        fill="currentColor"
        className="text-zinc-100"
      />
      {/* Left ear */}
      <path
        d="M11 10C10.5 9 9.5 9 9 10C8.5 11 9 12 10 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="text-zinc-100"
      />
      {/* Right ear */}
      <path
        d="M23 10C23.5 9 24.5 9 25 10C25.5 11 25 12 24 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="text-zinc-100"
      />
      {/* Left eye */}
      <circle cx="13" cy="15" r="1.5" fill="currentColor" opacity="0.9" className="text-zinc-100" />
      {/* Right eye */}
      <circle cx="19" cy="15" r="1.5" fill="currentColor" opacity="0.9" className="text-zinc-100" />
      {/* Nose */}
      <path
        d="M16 18C15 18 14.5 18.5 14.5 19C14.5 19.5 15 20 16 20C17 20 17.5 19.5 17.5 19C17.5 18.5 17 18 16 18Z"
        fill="currentColor"
        opacity="0.9"
        className="text-zinc-100"
      />
      {/* Mouth */}
      <path
        d="M14 21.5C14.5 22.5 15 23 16 23C17 23 17.5 22.5 18 21.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
        className="text-zinc-100"
      />
    </svg>
  );
}
