'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Play tactile mechanical keyboard click audio (Web Audio API synthesis)
function playKeyThock(isHero = false) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = isHero ? 130 : 210;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // ignore audio autoplay restriction
  }
}

// 100% faithful SVG vector icons matching inspo (media_1791682346752.png)
const ICONS: Record<string, React.ReactNode> = {
  // Row 1, Col 1: Circular badge seal
  stamp: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-none stroke-[#8A9084] stroke-[2.2]"
    >
      <circle cx="24" cy="24" r="20" strokeDasharray="3 3" />
      <circle cx="24" cy="24" r="14" />
      <path d="M24 16v16M16 24h16" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3" fill="#8A9084" />
    </svg>
  ),

  // Row 1, Col 2: Atlassian twin diamond sails
  atlassian: (
    <svg viewBox="0 0 48 48" className="size-11 sm:size-12 md:size-13">
      <path
        d="M23 4c-.7 1-1.4 2.2-2 3.4L8.4 29.3c-.6 1.1-.4 2.6.5 3.5l8.5 8.2c1 1 2.6 1 3.6 0l14.5-14c1-1 1-2.5 0-3.5L23 4z"
        fill="#3D4537"
      />
      <path
        d="M25 44c.7-1 1.4-2.2 2-3.4l12.6-21.9c.6-1.1.4-2.6-.5-3.5l-8.5-8.2c-1-1-2.6-1-3.6 0L12.5 21c-1 1-1 2.5 0 3.5L25 44z"
        fill="#6A7761"
        fillOpacity="0.8"
      />
    </svg>
  ),

  // Row 1, Col 3: Datadog 'D' with dots/dog face
  datadog: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#1A1A1A]"
    >
      <path d="M10 8h14c9 0 16 7 16 16s-7 16-16 16H10V8zm9 8v16h5c5 0 8.5-3.5 8.5-8s-3.5-8-8.5-8h-5z" />
      <circle cx="20" cy="21" r="2.2" fill="#FFFFFF" />
      <path
        d="M27 20c1.5 1 2.5 2.5 2.5 4s-1 3-2.5 4"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  ),

  // Row 1, Col 4 & Row 3, Col 5: Slanted parallelogram fold
  polygon: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#1F241C]"
    >
      <polygon points="12,10 38,6 30,38 4,42" />
      <polygon
        points="18,14 44,10 36,36 10,40"
        fillOpacity="0.25"
        fill="#FFFFFF"
      />
    </svg>
  ),

  // Row 1, Col 5: Medium 3 ellipses
  medium: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#1A1A1A]"
    >
      <ellipse cx="13" cy="24" rx="9" ry="14" />
      <ellipse cx="29" cy="24" rx="5" ry="13" />
      <ellipse cx="40" cy="24" rx="2" ry="11" />
    </svg>
  ),

  // Row 1, Col 6: Reddit Snoo alien head
  reddit: (
    <svg viewBox="0 0 48 48" className="size-11 sm:size-12 md:size-13">
      <path
        d="M24 14l3-7 6 2"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="34" cy="9" r="2.8" fill="#1A1A1A" />
      <circle
        cx="24"
        cy="26"
        r="14"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="3.4"
      />
      <circle cx="8" cy="26" r="3.5" fill="#1A1A1A" />
      <circle cx="40" cy="26" r="3.5" fill="#1A1A1A" />
      <circle cx="19" cy="24" r="3" fill="#1A1A1A" />
      <circle cx="29" cy="24" r="3" fill="#1A1A1A" />
      <path
        d="M19 31c2 2 8 2 10 0"
        stroke="#1A1A1A"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  ),

  // Row 1, Col 7: Trello cards
  trello: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#1A1A1A]"
    >
      <rect
        x="6"
        y="6"
        width="36"
        height="36"
        rx="8"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="3.8"
      />
      <rect x="13" y="13" width="9" height="18" rx="2.5" />
      <rect x="26" y="13" width="9" height="12" rx="2.5" />
    </svg>
  ),

  // Row 1, Col 8 & Row 3, Col 4: Amazon 'a' with smile arrow
  amazon: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#1A1A1A]"
    >
      <path d="M25 14c-5.5 0-9 3-9 7.5 0 4 2.8 6.5 6.8 6.5 2.8 0 4.8-1.2 6.2-3.2v2.8h4.5V14.5c0-4.5-3-7.5-8.5-7.5zm.2 10.5c-2.4 0-4-1.4-4-3.5 0-2.2 1.6-3.5 4-3.5 2.4 0 4 1.4 4 3.5 0 2.1-1.6 3.5-4 3.5z" />
      <path
        d="M9 36c8 4 20 4 30-1"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M37 32l3 3.5-4 1.5" fill="#1A1A1A" />
    </svg>
  ),

  // Row 1, Col 10: Peace sign ✌
  peace: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 stroke-[#1A1A1A] stroke-[3] fill-none stroke-linecap-round stroke-linejoin-round"
    >
      <path d="M19 6c-1.8 0-3 1.4-3 3.2v14l-2-2.5c-1.2-1.5-3.2-1.5-4.4 0-1 1.2-1 3 0 4.2l6.5 8c2.5 3.2 6 5.1 10 5.1h4c5.5 0 10-4.5 10-10v-9c0-1.8-1.4-3.2-3.2-3.2-1.5 0-2.8 1.1-3.1 2.6-.4-1.5-1.7-2.6-3.2-2.6-1.5 0-2.8 1.1-3.1 2.6V8.2c0-1.8-1.4-3.2-3.2-3.2h-.5c-1.8 0-3 1.4-3 3.2v10.5h-1V9.2c0-1.8-1.4-3.2-3.2-3.2H19z" />
    </svg>
  ),

  // Row 2, Col 1: Discord speech bubble
  discord: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#1A1A1A]"
    >
      <path d="M40 10H8c-2.2 0-4 1.8-4 4v20c0 2.2 1.8 4 4 4h26l8 8V14c0-2.2-1.8-4-4-4zm-22 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm12 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
    </svg>
  ),

  // Row 2, Col 2: HashiCorp 4 pills 'H'
  hashicorp: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#262626]"
    >
      <rect x="11" y="8" width="6.5" height="14" rx="3.2" />
      <rect x="30.5" y="8" width="6.5" height="14" rx="3.2" />
      <rect x="11" y="26" width="6.5" height="14" rx="3.2" />
      <rect x="30.5" y="26" width="6.5" height="14" rx="3.2" />
      <rect x="20.8" y="17" width="6.5" height="14" rx="3.2" />
    </svg>
  ),

  // Row 2, Col 3 & Col 9: Bold lowercase '.b'
  bdot: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#1A1A1A]"
    >
      <circle cx="9" cy="33" r="3.8" />
      <path
        d="M21 9v24m0-7a7 7 0 1110 6.2 7 7 0 01-10-6.2z"
        stroke="#1A1A1A"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),

  // Row 2, Col 4 & Col 10: Soft-cyan pill with runner silhouette
  capsule: (
    <div className="w-[52px] sm:w-[60px] md:w-[68px] h-[30px] sm:h-[34px] md:h-[38px] rounded-none bg-[#88C6D8] border border-[#74B8CB] flex items-center justify-center shadow-inner">
      <svg
        viewBox="0 0 24 24"
        className="size-4 sm:size-5 md:size-5.5 fill-white"
      >
        <circle cx="12" cy="6" r="2.2" />
        <path d="M14 9h-4l-2 5 2.5 1 1.5-3.5 1.5 2.5v5h2v-6l-2-3 1-1.5 3 2.5 1-1.5L14 9z" />
      </svg>
    </div>
  ),

  // Row 2, Col 6 & Row 4, Col 5 & Col 9: Raycast 3 triangles
  raycast: (
    <svg viewBox="0 0 48 48" className="size-11 sm:size-12 md:size-13">
      <polygon points="10,38 22,14 34,38" fill="#889282" fillOpacity="0.4" />
      <polygon points="18,38 28,18 38,38" fill="#65725E" fillOpacity="0.75" />
      <polygon points="26,38 34,22 42,38" fill="#3A4434" />
    </svg>
  ),

  // Row 2, Col 7 & Row 4, Col 6 & Col 10: Mouse cursor arrow pointer
  cursor: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#222222]"
    >
      <path d="M10 6l24 16-12 2 7 12-5 2.5-7-12-7 6V6z" />
    </svg>
  ),

  // Row 2, Col 8 & Row 4, Col 7 & Col 11: HubSpot sprocket logo
  hubspot: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#333333]"
    >
      <path d="M36 17V11a3.5 3.5 0 10-5 0v6a10.5 10.5 0 00-6 4.3L15 15a3.5 3.5 0 10-3 2.7l10 6.2a10.5 10.5 0 1014-6.9zm-2.5-8.5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zM12 18a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0112 18zm24 18a6 6 0 116-6 6 6 0 01-6 6z" />
    </svg>
  ),

  // Row 3, Col 1: Faceted triangular mesh
  mesh: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 stroke-[#7D8877] stroke-[1.8] fill-none"
    >
      <polygon points="24,6 40,16 40,32 24,42 8,32 8,16" />
      <line x1="24" y1="6" x2="24" y2="42" />
      <line x1="8" y1="16" x2="40" y2="32" />
      <line x1="40" y1="16" x2="8" y2="32" />
      <polygon
        points="24,14 33,24 24,34 15,24"
        fill="#7D8877"
        fillOpacity="0.25"
      />
    </svg>
  ),

  // Row 3, Col 2: Pinterest 'P'
  pinterest: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#1A1A1A]"
    >
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="3.4"
      />
      <path
        d="M22 36l3-12c-.5-1-1-2.5-.5-4 1-2.5 3.5-2 4.5-.5s.5 4-1 6.5c-.8 1.5-.5 3 1 3 3 0 5-3.5 5-8 0-4-3-7-7.5-7-5.5 0-8.5 4-8.5 8.5 0 1.5.5 3 1.5 4l.5 1.5c-1.5 6-3 12.5-4 14.5"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  // Row 3, Col 6 & Col 10: Horizontal link chain ⚯
  linkchain: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-none stroke-[#1A1A1A] stroke-[4.2] stroke-linecap-round"
    >
      <rect x="8" y="16" width="20" height="16" rx="8" />
      <rect x="20" y="16" width="20" height="16" rx="8" />
    </svg>
  ),

  // Row 3, Col 7: Soft cyan circular badge with runner silhouette
  circleFigure: (
    <div className="size-10 sm:size-11 md:size-12 rounded-none bg-[#88C6D8] border border-[#74B8CB] flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className="size-5 sm:size-6 md:size-6.5 fill-white"
      >
        <circle cx="12" cy="7" r="2.5" />
        <path d="M12 11c-3 0-5 2-5 4v4h10v-4c0-2-2-4-5-4z" />
      </svg>
    </div>
  ),

  // Row 3, Col 8: Calligraphy fountain pen nib
  pen: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 stroke-[#1A1A1A] stroke-[3] fill-none stroke-linecap-round stroke-linejoin-round"
    >
      <circle cx="24" cy="24" r="17" strokeWidth="2.5" />
      <path d="M24 13l6 9-6 8-6-8 6-9zm0 17v4" />
      <circle cx="24" cy="22" r="1.5" fill="#1A1A1A" />
    </svg>
  ),

  // Row 4, Col 1: Donut ring 'O'
  donut: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-none stroke-[#1A1A1A] stroke-[6]"
    >
      <circle cx="24" cy="24" r="14" />
    </svg>
  ),

  // Row 4, Col 2: Twin slanted parallelograms //
  slashes: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#1D829F]"
    >
      <polygon points="10,36 18,12 26,12 18,36" />
      <polygon points="24,36 32,12 40,12 32,36" />
    </svg>
  ),

  // Row 4, Col 3: Rounded square with center dot
  squareDot: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 fill-[#1A1A1A]"
    >
      <rect
        x="8"
        y="8"
        width="32"
        height="32"
        rx="10"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="5"
      />
      <circle cx="24" cy="24" r="6" />
    </svg>
  ),

  // Row 4, Col 8: Three diagonal stripes ///
  stripes: (
    <svg
      viewBox="0 0 48 48"
      className="size-11 sm:size-12 md:size-13 stroke-[#00222C] stroke-[4.5] stroke-linecap-round"
    >
      <line x1="12" y1="36" x2="20" y2="12" />
      <line x1="20" y1="36" x2="28" y2="12" />
      <line x1="28" y1="36" x2="36" y2="12" />
    </svg>
  ),

  // Blank keycap tile
  blank: null,
};

type IconKey = keyof typeof ICONS;

interface KeyTile {
  id: string;
  icon: IconKey;
  isHero?: boolean;
}

// 4 Rows x 11 Columns precisely matching the layout in inspo (media_1791682346752.png)
const ROWS: KeyTile[][] = [
  // Row 1
  [
    { id: '1-1', icon: 'stamp' },
    { id: '1-2', icon: 'atlassian' },
    { id: '1-3', icon: 'datadog' },
    { id: '1-4', icon: 'polygon' },
    { id: '1-5', icon: 'medium' },
    { id: '1-6', icon: 'reddit' },
    { id: '1-7', icon: 'trello' },
    { id: '1-8', icon: 'amazon' },
    { id: '1-9', icon: 'blank' },
    { id: '1-10', icon: 'peace' },
    { id: '1-11', icon: 'blank' },
  ],
  // Row 2
  [
    { id: '2-1', icon: 'discord' },
    { id: '2-2', icon: 'hashicorp' },
    { id: '2-3', icon: 'bdot' },
    { id: '2-4', icon: 'capsule' },
    // Center Hero 3D Keycap (Column 5)
    { id: 'HERO_KEY', icon: 'blank', isHero: true },
    { id: '2-6', icon: 'raycast' },
    { id: '2-7', icon: 'cursor' },
    { id: '2-8', icon: 'hubspot' },
    { id: '2-9', icon: 'bdot' },
    { id: '2-10', icon: 'capsule' },
    { id: '2-11', icon: 'blank' },
  ],
  // Row 3
  [
    { id: '3-1', icon: 'mesh' },
    { id: '3-2', icon: 'pinterest' },
    { id: '3-3', icon: 'blank' },
    { id: '3-4', icon: 'amazon' },
    { id: '3-5', icon: 'polygon' },
    { id: '3-6', icon: 'linkchain' },
    { id: '3-7', icon: 'circleFigure' },
    { id: '3-8', icon: 'pen' },
    { id: '3-9', icon: 'blank' },
    { id: '3-10', icon: 'linkchain' },
    { id: '3-11', icon: 'blank' },
  ],
  // Row 4
  [
    { id: '4-1', icon: 'donut' },
    { id: '4-2', icon: 'slashes' },
    { id: '4-3', icon: 'squareDot' },
    { id: '4-4', icon: 'blank' },
    { id: '4-5', icon: 'raycast' },
    { id: '4-6', icon: 'cursor' },
    { id: '4-7', icon: 'hubspot' },
    { id: '4-8', icon: 'stripes' },
    { id: '4-9', icon: 'raycast' },
    { id: '4-10', icon: 'cursor' },
    { id: '4-11', icon: 'hubspot' },
  ],
];

export function IsometricKeyboard() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isHeroPressed, setIsHeroPressed] = React.useState(false);
  const [pressedKeyId, setPressedKeyId] = React.useState<string | null>(null);

  // Mouse tilt parallax interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 90 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Exact isometric perspective matching user's reference image:
  // Row line tilts upward to the right by ~18-20 deg.
  const rotX = useTransform(smoothY, [-0.5, 0.5], [55, 49]);
  const rotZ = useTransform(smoothX, [-0.5, 0.5], [-25, -19]);
  const rotY = useTransform(smoothX, [-0.5, 0.5], [5, 11]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleHeroPress = () => {
    playKeyThock(true);
    setIsHeroPressed(true);
    setTimeout(() => setIsHeroPressed(false), 240);
  };

  const handleKeyClick = (id: string) => {
    playKeyThock(false);
    setPressedKeyId(id);
    setTimeout(() => setPressedKeyId(null), 180);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[520px] sm:h-[620px] md:h-[720px] lg:h-[780px] flex items-center justify-center overflow-hidden select-none"
      style={{
        perspective: '1400px',
        perspectiveOrigin: '50% 32%',
      }}
    >
      {/* Soft Vignette Mask around edges to dissolve keyboard smoothly into #F4F7F9 */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background:
            'radial-gradient(ellipse 74% 60% at 50% 46%, transparent 40%, #F4F7F9 84%, #F4F7F9 100%)',
        }}
      />

      {/* 3D Tilted Plane */}
      <motion.div
        style={{
          rotateX: rotX,
          rotateZ: rotZ,
          rotateY: rotY,
          transformStyle: 'preserve-3d',
        }}
        className="relative transition-transform duration-100 ease-out"
      >
        {/* Soft Ambient Cast Shadow under the entire board */}
        <div
          className="absolute -inset-12 rounded-none bg-black/10 blur-[50px] pointer-events-none"
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* The Grid Plate of Keycaps */}
        <div
          className="relative flex flex-col gap-3 sm:gap-4 md:gap-4.5 p-6 sm:p-8 md:p-10 rounded-none bg-[#EEF3F7]/80 border border-[#DCE4EC]/90 shadow-[0_35px_80px_rgba(0,34,44,0.06)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {ROWS.map((row, rIdx) => (
            <div
              key={rIdx}
              className="flex items-center gap-3 sm:gap-4 md:gap-4.5"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {row.map((item) => {
                if (item.isHero) {
                  return (
                    <div
                      key={item.id}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* ELEVATED 3D ELECTRIC-CYAN KEYCAP (Solid Extruded Floating Box with Official Mascot) */}
                      <motion.div
                        onClick={handleHeroPress}
                        animate={{
                          translateZ: isHeroPressed ? 14 : [38, 50, 38],
                        }}
                        transition={{
                          translateZ: isHeroPressed
                            ? { duration: 0.1, ease: 'easeIn' }
                            : {
                                duration: 3.8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ translateZ: 10 }}
                        className="absolute inset-0 cursor-pointer group"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Ambient Cyan Aura on the grid below */}
                        <div
                          className="absolute inset-0 bg-[#28BBEA]/30 blur-[28px] pointer-events-none"
                          style={{
                            transform: 'translateZ(-36px) translate(-14px, 22px)',
                          }}
                        />

                        {/* Realistic Cast Shadow on the grid below */}
                        <motion.div
                          animate={{
                            opacity: isHeroPressed ? 0.85 : [0.6, 0.45, 0.6],
                            scale: isHeroPressed ? 0.92 : [1, 1.08, 1],
                          }}
                          transition={{
                            duration: 3.8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute inset-0 bg-[#00222C]/65 blur-[18px] pointer-events-none"
                          style={{
                            transform:
                              'translateZ(-36px) translate(-14px, 22px)',
                          }}
                        />

                        {/* TOP FACE (Elevated at Z = 24px) */}
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-[#38C8F7] via-[#28BBEA] to-[#1BAFDE] border border-[#7BE2FF] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_12px_28px_rgba(40,187,234,0.35)] flex items-center justify-center select-none p-3 sm:p-4"
                          style={{
                            transform: 'translateZ(24px)',
                          }}
                        >
                          {/* Official Mascot Logo on Elevated Keycap */}
                          <motion.div
                            animate={{
                              scale: isHeroPressed ? 0.9 : [1, 1.04, 1],
                              rotate: isHeroPressed ? 6 : [0, 2, 0, -2, 0],
                            }}
                            transition={{
                              scale: isHeroPressed
                                ? { duration: 0.1 }
                                : {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                  },
                              rotate: isHeroPressed
                                ? { duration: 0.15 }
                                : {
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                  },
                            }}
                            className="relative w-full h-full flex items-center justify-center pointer-events-none"
                          >
                            <Image
                              src="/Maskot-itc.png"
                              alt="IT Club Official Mascot Keycap"
                              fill
                              className="object-contain drop-shadow-[0_4px_8px_rgba(0,34,44,0.4)]"
                              priority
                              sizes="(max-width: 640px) 60px, 80px"
                            />
                          </motion.div>
                        </div>

                        {/* FRONT FACE (Extrusion on bottom edge) */}
                        <div
                          className="absolute inset-x-0 bottom-0 h-[24px] bg-gradient-to-b from-[#189EC9] to-[#127E9F] border-b border-[#0D627D] pointer-events-none"
                          style={{
                            transform: 'rotateX(-90deg)',
                            transformOrigin: 'bottom center',
                          }}
                        />

                        {/* LEFT FACE (Extrusion on left edge) */}
                        <div
                          className="absolute inset-y-0 left-0 w-[24px] bg-gradient-to-r from-[#0E6C8B] to-[#158FB6] border-l border-[#0B546C] pointer-events-none"
                          style={{
                            transform: 'rotateY(-90deg)',
                            transformOrigin: 'left center',
                          }}
                        />

                        {/* RIGHT FACE (Extrusion on right edge) */}
                        <div
                          className="absolute inset-y-0 right-0 w-[24px] bg-gradient-to-l from-[#0D627D] to-[#1384A8] border-r border-[#0A4E65] pointer-events-none"
                          style={{
                            transform: 'rotateY(90deg)',
                            transformOrigin: 'right center',
                          }}
                        />

                        {/* BACK FACE (Extrusion on top edge) */}
                        <div
                          className="absolute inset-x-0 top-0 h-[24px] bg-gradient-to-t from-[#158FB6] to-[#0E6C8B] border-t border-[#0B546C] pointer-events-none"
                          style={{
                            transform: 'rotateX(90deg)',
                            transformOrigin: 'top center',
                          }}
                        />

                        {/* BOTTOM BASE FACE (Closes underside at Z = 0) */}
                        <div
                          className="absolute inset-0 bg-[#0A4E65] pointer-events-none"
                          style={{
                            transform: 'translateZ(0px)',
                          }}
                        />

                        {/* Tactile Click Ripple Ring */}
                        {isHeroPressed && (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0.8 }}
                            animate={{ scale: 2.8, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 border-2 border-[#28BBEA] pointer-events-none"
                          />
                        )}
                      </motion.div>
                    </div>
                  );
                }

                // Normal Tactile Keycaps in Grid
                const isPressed = pressedKeyId === item.id;
                const hasIcon = item.icon !== 'blank' && ICONS[item.icon];

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => handleKeyClick(item.id)}
                    animate={{
                      translateZ: isPressed ? 2 : 8,
                    }}
                    whileHover={{
                      translateZ: 14,
                      scale: 1.03,
                    }}
                    transition={{ duration: 0.15 }}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-none bg-[#FFFFFF] border border-[#DFE7ED] shadow-[0_4px_0_#D3DEE6,0_10px_22px_rgba(0,34,44,0.04)] flex items-center justify-center cursor-pointer transition-colors duration-150 hover:bg-[#F8FBFC] group"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Top Edge Bevel Highlight */}
                    <div className="absolute inset-0 rounded-none border-t border-white pointer-events-none" />

                    {/* Prominent Large Icon */}
                    {hasIcon && (
                      <div className="flex items-center justify-center w-full h-full p-2.5 sm:p-3 md:p-3.5 transition-transform duration-150 group-hover:scale-105">
                        {ICONS[item.icon]}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
