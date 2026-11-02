"use client";
import { useEffect, useRef } from 'react';

class Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  color: string;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * -height; 
    this.size = Math.random() * 4 + 2;
    this.speedY = Math.random() * 1 + 0.5; 
    this.speedX = Math.random() * 0.5 - 0.25; 
    const palette = [
      'rgba(255, 183, 197, 0.75)', // Sakura pink
      'rgba(255, 192, 203, 0.60)', // Soft blush
      'rgba(255, 218, 224, 0.80)', // Pastel rose
      'rgba(255, 235, 238, 0.70)', // Light creamy petal
    ];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  update(width: number, height: number, mouse: { x: number; y: number }) {
    
    this.y += this.speedY;
    this.x += this.speedX;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.hypot(dx, dy);
    const sweepRadius = 100;

    if (distance < sweepRadius) {
      const force = (sweepRadius - distance) / sweepRadius;
      this.x -= (dx / distance) * force * 5; 
      this.y -= (dy / distance) * force * 5; 
    }

    
    if (this.y > height) {
      this.y = -10;
      this.x = Math.random() * width;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function PetalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let petals: Petal[] = [];
    
    
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    
    for (let i = 0; i < 100; i++) {
      petals.push(new Petal(canvas.width, canvas.height));
    }

    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      petals.forEach(petal => {
        petal.update(canvas.width, canvas.height, mouse);
        petal.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%',
        height: '100%',
        zIndex: 0, 
        pointerEvents: 'none',
      }} 
    />
  );
}