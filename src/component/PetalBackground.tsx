"use client";
import { useEffect, useRef } from 'react';

class Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angularSpeed: number;
  color: string;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * -height; 
    this.size = Math.random() * 5 + 3; 
    this.speedY = Math.random() * 0.8 + 0.6; 
    this.speedX = Math.random() * 0.6 - 0.3; 
    this.angle = Math.random() * Math.PI * 2;
    this.angularSpeed = (Math.random() - 0.5) * 0.02;

    
    const palette = [
      'rgba(255, 130, 175, 0.80)', // Vibrant Sakura Pink
      'rgba(255, 95, 155, 0.75)',  // Deep Rose
      'rgba(255, 175, 205, 0.70)', // Soft Blossom
      'rgba(235, 135, 215, 0.70)', // Light Orchid Pink
      'rgba(255, 155, 145, 0.75)', // Warm Coral Rose
    ];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  update(width: number, height: number, mouse: { x: number; y: number }) {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.angle) * 0.3; 
    this.angle += this.angularSpeed;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.hypot(dx, dy);
    const sweepRadius = 120;

    if (distance < sweepRadius) {
      const force = (sweepRadius - distance) / sweepRadius;
      this.x -= (dx / distance) * force * 4; 
      this.y -= (dy / distance) * force * 4; 
    }

    if (this.y > height + 20) {
      this.y = -20;
      this.x = Math.random() * width;
    }
    if (this.x > width + 20) {
      this.x = -20;
    } else if (this.x < -20) {
      this.x = width + 20;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.6, this.size * 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
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

    const petalCount = 45;
    for (let i = 0; i < petalCount; i++) {
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
        pointerEvents: 'none' 
      }} 
    />
  );
}