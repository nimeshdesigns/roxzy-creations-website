import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleDir: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  dx: number;
  dy: number;
  opacity: number;
  size: number;
  color: string;
}

interface CosmicSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface Nebula {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
}

export default function ShootingStarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track cursor coordinates with dampening
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    // supernovas / stardust ripples on click
    const sparks: CosmicSpark[] = [];
    const handleWindowClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Create a gorgeous burst of cosmic dust
      const colors = ["#10b981", "#06b6d4", "#a855f7", "#34d399", "#22d3ee"];
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        sparks.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1,
          alpha: 1.0,
          decay: Math.random() * 0.02 + 0.015,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      // Also small chance to trigger an instant shooting star relative to click coordinate
      if (Math.random() < 0.6) {
        createShootingStarAt(clickX, clickY - 100);
      }
    };

    // Window Events
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("click", handleWindowClick);

    // Dynamic resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Star Colors distribution (cool cosmic palette)
    const starColors = [
      "rgba(255, 255, 255, ",
      "rgba(167, 243, 208, ", // soft emerald
      "rgba(165, 243, 252, ", // soft cyan
      "rgba(233, 213, 255, ", // soft purple
    ];

    // Initial static stars
    const stars: Star[] = Array.from({ length: 110 }).map(() => {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      return {
        x: sx,
        y: sy,
        originalX: sx,
        originalY: sy,
        size: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.012 + 0.003,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      };
    });

    // Cosmic Nebulae (large blurred ambient gradients)
    const nebulae: Nebula[] = [
      {
        x: width * 0.2,
        y: height * 0.3,
        targetX: width * 0.2,
        targetY: height * 0.3,
        radius: Math.min(width, height) * 0.4,
        color: "rgba(16, 185, 129, 0.045)", // Emerald
        pulseSpeed: 0.0008,
        pulsePhase: 0,
      },
      {
        x: width * 0.8,
        y: height * 0.7,
        targetX: width * 0.8,
        targetY: height * 0.7,
        radius: Math.min(width, height) * 0.45,
        color: "rgba(6, 182, 212, 0.045)", // Cyan
        pulseSpeed: 0.0006,
        pulsePhase: Math.PI / 3,
      },
      {
        x: width * 0.5,
        y: height * 0.5,
        targetX: width * 0.5,
        targetY: height * 0.5,
        radius: Math.min(width, height) * 0.35,
        color: "rgba(139, 92, 246, 0.03)", // Purple
        pulseSpeed: 0.0005,
        pulsePhase: Math.PI / 1.5,
      },
    ];

    // Shooting stars state
    const shootingStars: ShootingStar[] = [];

    const createShootingStar = () => {
      const startX = Math.random() * (width + 200) - 100;
      const startY = Math.random() * (height * 0.5);
      const angle = Math.PI / 4 + (Math.random() * 0.15 - 0.075);
      const speed = Math.random() * 10 + 6;
      const colors = ["#10b981", "#06b6d4", "#a855f7"];

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 90 + 50,
        speed: speed,
        dx: -Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        opacity: 1.0,
        size: Math.random() * 1.5 + 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    const createShootingStarAt = (clickX: number, clickY: number) => {
      const angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1);
      const speed = Math.random() * 13 + 8;
      const colors = ["#34d399", "#22d3ee", "#c084fc"];

      shootingStars.push({
        x: clickX,
        y: clickY,
        length: Math.random() * 100 + 70,
        speed: speed,
        dx: -Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        opacity: 1.2,
        size: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    // Frame update loop
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Dampen mouse movement
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        // Smoothly send cursor coordinate offscreen or fade away influence
        mouse.x += (-2000 - mouse.x) * 0.02;
        mouse.y += (-2000 - mouse.y) * 0.02;
      }

      // 1. Draw Nebulae
      nebulae.forEach((neb, index) => {
        // Subtle orbital floating based on mouse coordinate (parallax)
        const parallaxFactor = 0.015 * (index + 1);
        let targetX = neb.targetX;
        let targetY = neb.targetY;
        if (mouse.active) {
          targetX = neb.targetX + (mouse.x - width / 2) * parallaxFactor;
          targetY = neb.targetY + (mouse.y - height / 2) * parallaxFactor;
        }

        neb.x += (targetX - neb.x) * 0.05;
        neb.y += (targetY - neb.y) * 0.05;
        neb.pulsePhase += neb.pulseSpeed;

        const currentRadius = neb.radius * (1 + Math.sin(neb.pulsePhase) * 0.08);

        // Render ambient radiant glowing ball
        const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, currentRadius);
        grad.addColorStop(0, neb.color);
        grad.addColorStop(1, "rgba(6, 6, 8, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw and update static twinkling stars + Star force magnetic field
      stars.forEach((star) => {
        // Adjust twinkling transparency
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha >= 0.95) {
          star.alpha = 0.95;
          star.twinkleDir = -1;
        } else if (star.alpha <= 0.15) {
          star.alpha = 0.15;
          star.twinkleDir = 1;
        }

        // Magnetic repel calculation
        let drawX = star.x;
        let drawY = star.y;

        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          // Repel force inversely proportional to distance
          const force = (150 - dist) / 150;
          const pushX = (dx / dist) * force * 15;
          const pushY = (dy / dist) * force * 15;
          
          star.x += (star.originalX + pushX - star.x) * 0.1;
          star.y += (star.originalY + pushY - star.y) * 0.1;
        } else {
          // Softly float/spring back to place
          star.x += (star.originalX - star.x) * 0.05;
          star.y += (star.originalY - star.y) * 0.05;
        }

        ctx.fillStyle = `${star.color}${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Update & Draw Custom Mouse Sparklets trail
      if (mouse.active && Math.random() < 0.35) {
        // Add random dust
        const colors = ["#10b981", "#06b6d4", "#a855f7", "#ffffff"];
        sparks.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.4, // float slightly up
          size: Math.random() * 2 + 0.6,
          alpha: 1.0,
          decay: Math.random() * 0.015 + 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0; // Restore alpha state

      // 4. Draw and update shooting stars (meteors)
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];

        const trailX = ss.x - ss.dx * (ss.length / ss.speed);
        const trailY = ss.y - ss.dy * (ss.length / ss.speed);

        const gradient = ctx.createLinearGradient(ss.x, ss.y, trailX, trailY);
        gradient.addColorStop(0, ss.color);
        gradient.addColorStop(0.4, `rgba(14, 165, 233, ${ss.opacity * 0.5})`); // Cyan trail path
        gradient.addColorStop(1, "rgba(9, 9, 11, 0)"); // Fade

        ctx.strokeStyle = gradient;
        ctx.lineWidth = ss.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(trailX, trailY);
        ctx.stroke();

        // Update positions
        ss.x += ss.dx;
        ss.y += ss.dy;
        ss.opacity -= 0.015;

        // Prune offscreen or decayed shooting stars
        if (
          ss.opacity <= 0 ||
          ss.x < -200 ||
          ss.x > width + 200 ||
          ss.y > height + 200
        ) {
          shootingStars.splice(i, 1);
        }
      }

      // 5. Ambient chance to shoot stars
      if (Math.random() < 0.015 && shootingStars.length < 5) {
        createShootingStar();
      }

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      id="live-starfield-backdrop"
    />
  );
}
