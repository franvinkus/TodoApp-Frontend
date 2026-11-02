export const triggerConfetti = () => {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#FF4D88", // Sakura Vivid Pink
    "#FFD700", // Gold
    "#10B981", // Emerald Green
    "#38BDF8", // Sky Blue
    "#A855F7", // Purple Blossom
    "#FF7875", // Coral
    "#FFF8EB", // Brand Cream
  ];

  interface ConfettiPiece {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    wRatio: number;
  }

  const pieces: ConfettiPiece[] = [];
  const pieceCount = 70;

  // Origin point around center-bottom or bottom
  const originX = canvas.width / 2;
  const originY = canvas.height * 0.7;

  for (let i = 0; i < pieceCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 6;
    pieces.push({
      x: originX + (Math.random() * 80 - 40),
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 8, // Shoot upwards
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      wRatio: Math.random() * 0.6 + 0.4,
    });
  }

  let animationId: number;
  const gravity = 0.35;
  const friction = 0.96;

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activePieces = 0;

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.vx *= friction;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.009; // Fade out gradually

      if (p.opacity > 0 && p.y < canvas.height + 20) {
        activePieces++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        // Draw confetti rectangular ribbon
        ctx.fillRect(
          (-p.size * p.wRatio) / 2,
          -p.size / 2,
          p.size * p.wRatio,
          p.size
        );
        ctx.restore();
      }
    });

    if (activePieces > 0) {
      animationId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  };

  render();
};

