import { useEffect, useRef } from "react";

/** Scroll-reactive 3D AI network visualization — fixed cinematic backdrop */
export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const isMobile = width < 768;

    const points: { x: number; y: number; z: number }[] = [];
    const numPoints = isMobile ? 55 : 150;
    const maxConnectionDist = isMobile ? 140 : 220;

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: (Math.random() - 0.5) * (isMobile ? 1500 : 3000),
        y: (Math.random() - 0.5) * (isMobile ? 1500 : 3000),
        z: Math.random() * 2000,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, width, height);

      const scrollY = window.scrollY;
      const focalLength = 350;
      const centerX = width / 2;
      const centerY = height / 2;
      const rotationAngle = scrollY * 0.0004;
      const cosR = Math.cos(rotationAngle);
      const sinR = Math.sin(rotationAngle);

      // Cinematic gradient wash
      const grad = ctx.createRadialGradient(centerX, centerY * 0.6, 0, centerX, centerY, width * 0.8);
      grad.addColorStop(0, "rgba(0, 82, 255, 0.04)");
      grad.addColorStop(0.5, "rgba(255, 69, 0, 0.02)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(0, 82, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      const gridOffset = (scrollY * 0.15) % gridSize;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = -gridOffset; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      points.forEach((p) => {
        let z = p.z - (scrollY * 0.8) % 2000;
        if (z < 0) z += 2000;

        const rx = p.x * cosR - z * sinR;
        const rz = p.x * sinR + z * cosR;
        const ry = p.y;

        if (rz > 50) {
          const scale = focalLength / rz;
          const px = centerX + rx * scale;
          const py = centerY + ry * scale;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const size = Math.max(0.5, scale * 2.5);
            const ratio = rz / 2000;
            const opacity = (1 - ratio) * 0.5;

            ctx.fillStyle = rz < 800 ? `rgba(0, 217, 255, ${opacity})` : `rgba(0, 82, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();

            points.forEach((other) => {
              let oz = other.z - (scrollY * 0.8) % 2000;
              if (oz < 0) oz += 2000;

              const orx = other.x * cosR - oz * sinR;
              const orz = other.x * sinR + oz * cosR;

              if (orz > 50) {
                const dx = rx - orx;
                const dy = ry - other.y;
                const dz = rz - orz;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxConnectionDist) {
                  const oscale = focalLength / orz;
                  const opx = centerX + orx * oscale;
                  const opy = centerY + other.y * oscale;
                  const lineOpacity = (1 - dist / maxConnectionDist) * 0.12 * Math.min(opacity, 1 - oz / 2000);
                  ctx.strokeStyle = `rgba(0, 160, 255, ${lineOpacity})`;
                  ctx.beginPath();
                  ctx.moveTo(px, py);
                  ctx.lineTo(opx, opy);
                  ctx.stroke();
                }
              }
            });
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 bg-black"
      aria-hidden
    />
  );
}
