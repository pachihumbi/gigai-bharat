import { useRef, useState, type ReactNode } from "react";

interface CardTiltProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function CardTilt({
  children,
  className = "",
  glowColor = "rgba(0, 82, 255, 0.25)",
}: CardTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

    setRotateY(mouseX * 25);
    setRotateX(-mouseY * 25);
    setGlareX(((e.clientX - rect.left) / rect.width) * 100);
    setGlareY(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-panel group relative rounded-lg transition-all duration-300 ease-out ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        boxShadow: `0 20px 40px -15px ${glowColor}, inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-lg mix-blend-overlay opacity-40 transition-opacity duration-300 group-hover:opacity-60"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.25) 0%, transparent 50%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
