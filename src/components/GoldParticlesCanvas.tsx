import { useEffect, useRef } from "react";

export const GoldParticlesCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
      factor: number; // For parallax speed variation
    }> = [];

    const goldColors = ["#d4a359", "#f9ebb4", "#ffeeb8", "#ffe5b4", "#b8860b"];

    // Initialize particles
    const particleCount = Math.min(60, Math.floor((width * height) / 20000));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15 - 0.05, // Slight upward drift
        opacity: Math.random() * 0.5 + 0.1,
        factor: Math.random() * 15 + 5, // Parallax movement factor
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) / 20;
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) / 20;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse positions for smooth parallax
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      particles.forEach((p) => {
        // Move particles
        p.x += p.speedX;
        p.y += p.speedY;

        // Apply parallax offset
        const renderX = p.x + mouse.x * p.factor * 0.1;
        const renderY = p.y + mouse.y * p.factor * 0.1;

        // Wrap around borders
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        
        // Disable shadow on low end devices or just draw plain circle
        ctx.shadowBlur = p.radius * 3;
        ctx.shadowColor = p.color;
        ctx.fill();
        
        // Reset shadows to keep performance optimal
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="gold-particles-canvas absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default GoldParticlesCanvas;
