import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  TrendingUp,
  Zap,
  Database,
  Upload,
  Search,
  ChevronRight,
  Globe,
  Cpu,
  Battery,
  Sun,
  Wind,
  Home,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  Layers,
  Sparkles,
  CreditCard
} from "lucide-react";
import { routeHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    routeHead(
      "/",
      "GigAI Bharat — India’s Workforce Operating System",
      "Investor-ready infrastructure for India's 23.5M gig workers. Live command center, worker economy map, AI dispatch, worker-owned ledger.",
      "GigAI Bharat — The future infrastructure layer",
    ),
  component: HomePage,
});

// ==========================================
// 1. 3D BACKGROUND CANVAS
// ==========================================
function BackgroundCanvas() {
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

    // Initialize 3D points
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

      // Scroll-based rotation speed and angles
      const rotationAngle = scrollY * 0.0004;
      const cosR = Math.cos(rotationAngle);
      const sinR = Math.sin(rotationAngle);

      // Draw subtle grid overlay
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

      // Draw 3D projected nodes and lines
      points.forEach((p) => {
        // Scroll pushes nodes forward (z changes)
        let z = p.z - (scrollY * 0.8) % 2000;
        if (z < 0) z += 2000;

        // Apply scroll rotation around Y axis
        const rx = p.x * cosR - z * sinR;
        const rz = p.x * sinR + z * cosR;
        const ry = p.y;

        if (rz > 50) {
          const scale = focalLength / rz;
          const px = centerX + rx * scale;
          const py = centerY + ry * scale;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const size = Math.max(0.5, scale * 2.5);
            // Color based on node position (near is blue-white, far is deep blue/orange)
            const ratio = rz / 2000;
            const opacity = (1 - ratio) * 0.5;

            ctx.fillStyle = rz < 800 ? `rgba(0, 217, 255, ${opacity})` : `rgba(0, 82, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();

            // Connect nearby points
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

                  const lineOpacity = (1 - dist / maxConnectionDist) * 0.12 * Math.min(opacity, (1 - oz / 2000));
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

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-black pointer-events-none" />;
}

// ==========================================
// 2. 3D CARD TILT WRAPPER
// ==========================================
interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

function CardTilt({ children, className = "", glowColor = "rgba(0, 82, 255, 0.25)" }: CardTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Rotation values (max 15 degrees)
    setRotateY(mouseX * 25);
    setRotateX(-mouseY * 25);

    // Glare values (0% to 100%)
    setGlareX(((e.clientX - rect.left) / width) * 100);
    setGlareY(((e.clientY - rect.top) / height) * 100);
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
      className={`relative rounded-lg border border-white/10 bg-black/45 backdrop-blur-md transition-all duration-300 ease-out ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        boxShadow: `0 20px 40px -15px ${glowColor}, inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
      }}
    >
      {/* Dynamic specular glare overlay */}
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

// ==========================================
// 3. SMART HUB 3D WIREFRAME CANVAS
// ==========================================
interface SmartHubCanvasProps {
  activeTab: string;
}

function SmartHubCanvas({ activeTab }: SmartHubCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 360;
      }
    };
    window.addEventListener("resize", handleResize);

    let angle = 0;
    const focalLength = 300;

    // 3D coordinates for wireframe models
    const chargeSlots: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < 8; i++) {
      const radius = 90;
      const theta = (i / 8) * Math.PI * 2;
      chargeSlots.push({
        x: Math.cos(theta) * radius,
        y: 40,
        z: Math.sin(theta) * radius,
      });
    }

    const solarGrid: { x: number; y: number; z: number }[] = [];
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        solarGrid.push({ x: x * 40, y: -60, z: z * 40 });
      }
    }

    const housingTower: { x: number; y: number; z: number }[] = [];
    for (let floor = 0; floor < 5; floor++) {
      const y = -floor * 35 + 20;
      housingTower.push(
        { x: -50, y, z: -50 },
        { x: 50, y, z: -50 },
        { x: 50, y, z: 50 },
        { x: -50, y, z: 50 }
      );
    }

    // Moving particles (EVs moving along path lines)
    const fleets: { x: number; y: number; z: number; speed: number; path: number }[] = [];
    for (let i = 0; i < 15; i++) {
      fleets.push({
        x: (Math.random() - 0.5) * 400,
        y: 40,
        z: (Math.random() - 0.5) * 400,
        speed: 1 + Math.random() * 2,
        path: Math.floor(Math.random() * 3),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Camera coordinates based on selected tab
      let camX = 0;
      let camY = -120;
      let camZ = 300;
      let targetAngle = angle;

      if (activeTab === "whitefield") {
        camY = -140;
        camZ = 280;
        targetAngle += 0.005;
      } else if (activeTab === "koramangala") {
        camY = -50;
        camZ = 320;
        targetAngle -= 0.003;
      } else {
        // electronic city
        camY = -220;
        camZ = 240;
        targetAngle += 0.008;
      }
      angle = targetAngle;

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Ground Grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let g = -5; g <= 5; g++) {
        // Project grid lines
        const draw3DLine = (x1: number, z1: number, x2: number, z2: number) => {
          // Project p1
          let rx1 = x1 * cosA - z1 * sinA;
          let rz1 = x1 * sinA + z1 * cosA + camZ;
          let scale1 = focalLength / rz1;
          let px1 = centerX + rx1 * scale1;
          let py1 = centerY + (40 - camY) * scale1;

          // Project p2
          let rx2 = x2 * cosA - z2 * sinA;
          let rz2 = x2 * sinA + z2 * cosA + camZ;
          let scale2 = focalLength / rz2;
          let px2 = centerX + rx2 * scale2;
          let py2 = centerY + (40 - camY) * scale2;

          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();
        };

        draw3DLine(g * 50, -250, g * 50, 250);
        draw3DLine(-250, g * 50, 250, g * 50);
      }

      // Draw active hubs based on selected tabs
      if (activeTab === "whitefield") {
        // Draw Charging Columns (Cylinders)
        ctx.strokeStyle = "rgba(0, 217, 255, 0.35)";
        ctx.lineWidth = 1.5;
        chargeSlots.forEach((slot) => {
          let rx = slot.x * cosA - slot.z * sinA;
          let rz = slot.x * sinA + slot.z * cosA + camZ;
          let scale = focalLength / rz;
          let px = centerX + rx * scale;
          let pyBase = centerY + (slot.y - camY) * scale;
          let pyTop = centerY + (slot.y - 60 - camY) * scale;

          // Vertical line representing pillar
          ctx.beginPath();
          ctx.moveTo(px, pyBase);
          ctx.lineTo(px, pyTop);
          ctx.stroke();

          // Pulsing energy rings
          ctx.fillStyle = "rgba(0, 217, 255, 0.1)";
          ctx.beginPath();
          ctx.arc(px, pyTop, Math.max(1, 15 * scale), 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (activeTab === "koramangala") {
        // Draw Solar Array (glowing canopy grid)
        ctx.strokeStyle = "rgba(255, 122, 0, 0.4)";
        ctx.lineWidth = 1;
        solarGrid.forEach((gridNode) => {
          let rx = gridNode.x * cosA - gridNode.z * sinA;
          let rz = gridNode.x * sinA + gridNode.z * cosA + camZ;
          let scale = focalLength / rz;
          let px = centerX + rx * scale;
          let py = centerY + (gridNode.y - camY) * scale;

          ctx.fillStyle = "rgba(255, 122, 0, 0.3)";
          ctx.beginPath();
          ctx.arc(px, py, Math.max(1, 2 * scale), 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Electronic City - housing tower wireframe
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1;

        // Draw horizontal floor loops
        for (let f = 0; f < 5; f++) {
          const idx = f * 4;
          const floorNodes = housingTower.slice(idx, idx + 4);
          ctx.beginPath();

          floorNodes.forEach((node, i) => {
            let rx = node.x * cosA - node.z * sinA;
            let rz = node.x * sinA + node.z * cosA + camZ;
            let scale = focalLength / rz;
            let px = centerX + rx * scale;
            let py = centerY + (node.y - camY) * scale;

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.stroke();
        }

        // Draw vertical columns connecting floors
        for (let c = 0; c < 4; c++) {
          ctx.beginPath();
          for (let f = 0; f < 5; f++) {
            const node = housingTower[f * 4 + c];
            let rx = node.x * cosA - node.z * sinA;
            let rz = node.x * sinA + node.z * cosA + camZ;
            let scale = focalLength / rz;
            let px = centerX + rx * scale;
            let py = centerY + (node.y - camY) * scale;

            if (f === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      // Draw EV fleet particles driving towards the center
      fleets.forEach((f) => {
        // Move towards center coordinates
        f.x -= (f.x / 300) * f.speed;
        f.z -= (f.z / 300) * f.speed;

        // Reset if reached center
        if (Math.abs(f.x) < 5 && Math.abs(f.z) < 5) {
          f.x = (Math.random() - 0.5) * 500;
          f.z = (Math.random() - 0.5) * 500;
        }

        let rx = f.x * cosA - f.z * sinA;
        let rz = f.x * sinA + f.z * cosA + camZ;

        if (rz > 50) {
          let scale = focalLength / rz;
          let px = centerX + rx * scale;
          let py = centerY + (f.y - camY) * scale;

          ctx.fillStyle = "rgba(0, 217, 255, 0.8)";
          ctx.beginPath();
          ctx.arc(px, py, Math.max(1, 3 * scale), 0, Math.PI * 2);
          ctx.fill();

          // Tiny glowing aura
          ctx.strokeStyle = "rgba(0, 217, 255, 0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(1, 8 * scale), 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, [activeTab]);

  return <canvas ref={canvasRef} className="w-full h-full bg-slate-950/40 rounded border border-white/5" />;
}

// ==========================================
// 4. GURUKUL AI SKILL GRAPH CANVAS
// ==========================================
interface SkillNode {
  id: string;
  name: string;
  x: number;
  y: number;
  unlocked: boolean;
  multiplier: string;
  desc: string;
}

interface SkillGraphProps {
  onSelectNode: (node: SkillNode) => void;
  selectedNodeId: string;
}

function SkillGraph({ onSelectNode, selectedNodeId }: SkillGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<SkillNode[]>([
    {
      id: "base",
      name: "Standard Gig Worker",
      x: 200,
      y: 180,
      unlocked: true,
      multiplier: "1.0x",
      desc: "Base status. Standard delivery and ride-hail onboarding with platform fees.",
    },
    {
      id: "ev",
      name: "EV Mobility Specialist",
      x: 380,
      y: 90,
      unlocked: true,
      multiplier: "1.4x",
      desc: "Certified VinFast MPV7 driver. Includes battery management, range optimization, and fast-charge safety.",
    },
    {
      id: "dispatch",
      name: "AI Dispatch Captain",
      x: 380,
      y: 270,
      unlocked: false,
      multiplier: "1.8x",
      desc: "Coordinated cluster lead. Leverages local demand maps to guide other drivers and reduce dead mileage.",
    },
    {
      id: "finance",
      name: "Worker Finance Expert",
      x: 560,
      y: 90,
      unlocked: false,
      multiplier: "2.1x",
      desc: "Fintech certified. Leverages credit identity ledger to secure micro-loans and manage neo-bank operations.",
    },
    {
      id: "leader",
      name: "Smart Hub Fleet Lead",
      x: 560,
      y: 270,
      unlocked: false,
      multiplier: "2.5x",
      desc: "Full network manager. Runs solar charge diagnostics, housing community welfare, and local fleet dispatch.",
    },
  ]);

  const handleUpgrade = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          const updated = { ...node, unlocked: true };
          onSelectNode(updated);
          return updated;
        }
        return node;
      })
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 360);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
      }
    };
    window.addEventListener("resize", handleResize);

    // Connections between node indices
    const connections = [
      { from: "base", to: "ev" },
      { from: "base", to: "dispatch" },
      { from: "ev", to: "finance" },
      { from: "dispatch", to: "leader" },
    ];

    let pulseOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      pulseOffset = (pulseOffset + 0.5) % 100;

      // Draw connections
      connections.forEach((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.from);
        const toNode = nodes.find((n) => n.id === conn.to);
        if (!fromNode || !toNode) return;

        // Scaling factor for coordinates relative to parent width
        const scaleX = width / 700;
        const fx = fromNode.x * scaleX;
        const fy = fromNode.y;
        const tx = toNode.x * scaleX;
        const ty = toNode.y;

        const isLineActive = fromNode.unlocked && toNode.unlocked;

        // Draw connection line
        ctx.strokeStyle = isLineActive ? "rgba(0, 217, 255, 0.4)" : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = isLineActive ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // Draw floating pulse indicator if line is active
        if (isLineActive) {
          const ratio = pulseOffset / 100;
          const px = fx + (tx - fx) * ratio;
          const py = fy + (ty - fy) * ratio;

          ctx.fillStyle = "#00d9ff";
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        const scaleX = width / 700;
        const nx = node.x * scaleX;
        const ny = node.y;

        const isSelected = node.id === selectedNodeId;

        // Outer glow rings
        if (isSelected) {
          ctx.strokeStyle = "rgba(0, 217, 255, 0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(nx, ny, 25 + Math.sin(pulseOffset * 0.1) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Main circle border
        ctx.strokeStyle = node.unlocked
          ? isSelected
            ? "#00d9ff"
            : "rgba(0, 217, 255, 0.6)"
          : "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = isSelected ? 3 : 2;

        // Inner fill
        ctx.fillStyle = node.unlocked
          ? isSelected
            ? "rgba(0, 82, 255, 0.3)"
            : "rgba(0, 82, 255, 0.15)"
          : "rgba(255, 255, 255, 0.03)";

        ctx.beginPath();
        ctx.arc(nx, ny, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Text label
        ctx.fillStyle = node.unlocked ? "#ffffff" : "rgba(255, 255, 255, 0.4)";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.multiplier, nx, ny + 4);

        ctx.fillStyle = isSelected ? "#00d9ff" : "#a1a1aa";
        ctx.font = "10px 'Orbitron', sans-serif";
        ctx.fillText(node.name, nx, ny - 24);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    // Handle canvas click events
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const scaleX = width / 700;

      nodes.forEach((node) => {
        const nx = node.x * scaleX;
        const ny = node.y;

        const distance = Math.sqrt((clickX - nx) ** 2 + (clickY - ny) ** 2);
        if (distance < 25) {
          onSelectNode(node);
        }
      });
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animId);
    };
  }, [nodes, selectedNodeId]);

  const currentNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3 items-center">
      <div className="lg:col-span-2 relative">
        <canvas ref={canvasRef} className="w-full h-[360px] bg-slate-950/40 rounded border border-white/5 cursor-pointer" />
        <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded border border-white/10 flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="h-3.5 w-3.5 text-[#00d9ff]" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#00d9ff]">Interactive Skill Tree</span>
        </div>
      </div>
      <div className="border border-white/10 bg-black/55 backdrop-blur-md p-5 rounded-lg">
        <h4 className="font-mono text-xs uppercase tracking-wider text-[#ff7a00]">Node Blueprint</h4>
        <h3 className="mt-2 font-serif text-2xl text-white">{currentNode.name}</h3>
        <div className="mt-4 flex items-center justify-between border-y border-white/5 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Earnings Yield</p>
            <p className="text-xl font-bold text-[#00d9ff]">{currentNode.multiplier}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Status</p>
            <p className={`font-mono text-xs font-semibold ${currentNode.unlocked ? "text-emerald-400" : "text-amber-500 animate-pulse"}`}>
              {currentNode.unlocked ? "ACTIVE CERTIFIED" : "ONBOARDING LOCKED"}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-foreground/80 leading-relaxed min-h-[60px]">{currentNode.desc}</p>
        {!currentNode.unlocked ? (
          <button
            onClick={() => handleUpgrade(currentNode.id)}
            className="mt-6 w-full flex items-center justify-center gap-2 border border-[#ff7a00]/40 bg-[#ff7a00]/10 hover:bg-[#ff7a00]/25 text-[#ff7a00] py-3 text-xs font-mono uppercase tracking-wider transition-colors duration-200 rounded"
          >
            Upgrade & Unlock Track <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <div className="mt-6 flex items-center justify-center gap-2 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 py-3 text-xs font-mono uppercase tracking-wider select-none">
            <CheckCircle2 className="h-4 w-4" /> Certification Validated
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT & PAGES
// ==========================================
export function HomePage() {
  const ctaLink = "https://app.bharatgig.live";

  // HERO: Incrementing active workers
  const [activeWorkers, setActiveWorkers] = useState(12420911);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkers((prev) => prev + Math.floor(Math.random() * 4) + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // HERO: Telemetry logs
  const [logs, setLogs] = useState<string[]>([
    "Bengaluru → Electronic City (Rapido) — Match 1.2s",
    "Delhi → Noida (Zomato) — Match 2.4s",
    "Mumbai → Bandra (Swiggy) — Match 1.8s",
    "Bengaluru → Whitefield (Uber) — Match 2.1s"
  ]);
  useEffect(() => {
    const logPool = [
      "Hyderabad → Secunderabad (Zomato) — Match 1.9s",
      "Kolkata → Salt Lake (Swiggy) — Match 2.5s",
      "Chennai → Adyar (Uber) — Match 2.0s",
      "Pune → Hinjewadi (Rapido) — Match 1.5s",
      "Bengaluru → Indiranagar (Swiggy) — Match 1.7s",
      "Delhi → Gurugram (Rapido) — Match 2.3s"
    ];
    const interval = setInterval(() => {
      const newLog = logPool[Math.floor(Math.random() * logPool.length)];
      setLogs((prev) => [newLog, ...prev.slice(0, 3)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // LEDGER: OCR scanner simulation
  const [ocrStatus, setOcrStatus] = useState<"idle" | "scanning" | "done">("idle");
  const [ocrLogs, setOcrLogs] = useState<string[]>([]);
  const startOcrScan = () => {
    if (ocrStatus === "scanning") return;
    setOcrStatus("scanning");
    setOcrLogs(["INITIALIZING MULTI-PLATFORM OCR PIPELINE..."]);

    const steps = [
      { time: 600, log: "LOCATING EARNINGS PAYSLIP SCREENSHOT..." },
      { time: 1300, log: "EXTRACTING METADATA: BASE FARE, INCENTIVES, FUEL TIPS..." },
      { time: 2000, log: "MATCHING DRIVER AADHAAR HASH SYSTEM..." },
      { time: 2700, log: "SUCCESS: 98.6% VERIFICATION ACCURACY" },
      { time: 3300, log: "COMPUTING GIG CREDIT INTEGRITY RATING..." }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setOcrLogs((prev) => [...prev, `[OK] ${step.log}`]);
      }, step.time);
    });

    setTimeout(() => {
      setOcrStatus("done");
    }, 3800);
  };

  // COMPLIANCE: Audit simulator
  const [auditStatus, setAuditStatus] = useState<"idle" | "running" | "done">("idle");
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const startAudit = () => {
    if (auditStatus === "running") return;
    setAuditStatus("running");
    setAuditLogs(["STARTING REGULATORY COMPLIANCE AUDIT..."]);

    const logsList = [
      "RETRIEVING DIGILOCKER EPF TRUST CHAIN...",
      "VERIFYING KARNATAKA WELFARE Contribution (1% CESS)...",
      "CHECKING MANDATORY 12H MACRO-REST LOGS...",
      "VALIDATING PROVIDENT FUND READY REGISTERS...",
      "SYSTEM COMPLIANT: 100% SECURE LEGAL STANDARD"
    ];

    logsList.forEach((log, index) => {
      setTimeout(() => {
        setAuditLogs((prev) => [...prev, `[AUDIT] ${log}`]);
      }, (index + 1) * 700);
    });

    setTimeout(() => {
      setAuditStatus("done");
    }, 4200);
  };

  // ECOSYSTEM: Tab status
  const [activeHubTab, setActiveHubTab] = useState("whitefield");

  // GURUKUL: Multilingual onboarding chat mockup
  const [chatLanguage, setChatLanguage] = useState<"en" | "kn" | "hi" | "ta" | "te">("en");
  const chatContent = {
    en: {
      name: "Gurukul AI Coach",
      msg: "Welcome to GigAI. Let's build your sovereign credit score. Upload your payslip screenshot or speak to get started.",
      action: "Upload Payslip Screen"
    },
    kn: {
      name: "ಗುರುಕುಲ AI ಮಾರ್ಗದರ್ಶಿ",
      msg: "ಗಿಗೈಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ರಚಿಸೋಣ. ನಿಮ್ಮ ಪೇಸ್ಲಿಪ್ ಸ್ಕ್ರೀನ್ ಶಾಟ್ ಅಪ್ ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ.",
      action: "ಸ್ಕ್ರೀನ್ ಶಾಟ್ ಅಪ್ ಲೋಡ್ ಮಾಡಿ"
    },
    hi: {
      name: "गुरुकुल AI सलाहकार",
      msg: "गिगएआई में आपका स्वागत है। आइए आपकी क्रेडिट आईडी बनाएं। अपनी पेस्लिप स्क्रीनशॉट अपलोड करें या बोलकर शुरू करें।",
      action: "स्क्रीनशॉट अपलोड करें"
    },
    ta: {
      name: "குருகுல் AI வழிகாட்டி",
      msg: "வரவேற்கிறோம். உங்களது கடன் தகுதியை உருவாக்குவோம். சம்பளப் பட்டியல் ஸ்கிரீன்ஷார்ட் பதிவேற்றவும் அல்லது பேசவும்.",
      action: "பதிவேற்றுக"
    },
    te: {
      name: "గురుకుల్ AI సలహాదారు",
      msg: "గిగ్-ఏఐ కి స్వాగతం. మీ క్రెడిట్ స్కోరును నిర్మిద్దాం. మీ పేస్లిప్ స్క్రీన్ షాట్ అప్ లోడ్ చేయండి లేదా మాట్లాడండి.",
      action: "అప్ లోడ్ చేయండి"
    }
  };

  useEffect(() => {
    const langs: ("en" | "kn" | "hi" | "ta" | "te")[] = ["en", "kn", "hi", "ta", "te"];
    const interval = setInterval(() => {
      setChatLanguage((prev) => {
        const nextIdx = (langs.indexOf(prev) + 1) % langs.length;
        return langs[nextIdx];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [selectedSkillNodeId, setSelectedSkillNodeId] = useState("base");

  // ROI: Workers Scale slider input
  const [roiWorkers, setRoiWorkers] = useState(100000); // base 100k workers

  const roiCalculations = useMemo(() => {
    const ridesPerYear = 320;
    const avgEarningsPerRide = 400; // Rs
    const gmv = roiWorkers * ridesPerYear * avgEarningsPerRide;
    const gmvCr = gmv / 10000000;
    const lendingOpportunityCr = gmvCr * 0.15;
    const insuranceRevenueCr = gmvCr * 0.04;
    const totalTransactionsCr = (roiWorkers * ridesPerYear) / 10000000;
    const valuationCr = gmvCr * 0.55;

    return {
      gmvCr: gmvCr.toFixed(0),
      lendingCr: lendingOpportunityCr.toFixed(0),
      insuranceCr: insuranceRevenueCr.toFixed(1),
      transactionsCr: totalTransactionsCr.toFixed(1),
      valuationCr: valuationCr.toFixed(0),
    };
  }, [roiWorkers]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-black selection:bg-[#00d9ff]/20 selection:text-white">
      {/* 3D scrolling canvas background */}
      <BackgroundCanvas />

      {/* ==========================================
          HEADER SECTION (Apple/Anduril styled HUD)
          ========================================== */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-12">
          <div className="flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center border border-[#00d9ff]/45 bg-[#0052ff]/5">
              <span className="absolute inset-0 bg-[#00d9ff]/10 animate-pulse-dot" />
              <span className="font-mono text-xs font-bold text-[#00d9ff]">G/B</span>
            </span>
            <div className="leading-none">
              <span className="font-mono text-xs font-bold tracking-[0.25em] text-white">GIGAI BHARAT</span>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff4500] mt-0.5">Mobility OS</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {["Ledger", "ShramSetu", "Smart Hub", "Gurukul", "ROI"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a1a1aa] hover:text-[#00d9ff] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            href={ctaLink}
            className="border border-[#00d9ff]/40 bg-[#0052ff]/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[#00d9ff] hover:bg-[#00d9ff] hover:text-black transition-all duration-200"
          >
            Worker App →
          </a>
        </div>
      </header>

      {/* ==========================================
          SECTION 1: HERO SECTION
          ========================================== */}
      <section id="hero" className="relative min-h-[90vh] flex items-center border-b border-white/5">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-12 grid gap-12 lg:grid-cols-12 items-center w-full">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 border border-white/5 bg-white/5 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff7a00]">National Infrastructure</span>
            </div>
            <h1 className="font-serif text-[2.75rem] leading-[0.95] tracking-tight sm:text-display-lg md:text-[4.5rem] lg:text-[5.5rem] text-white">
              India’s Workforce
              <br />
              <span className="bg-gradient-to-r from-[#ff4500] via-[#00d9ff] to-[#00d9ff] bg-clip-text italic text-transparent font-medium">
                Operating System.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#a1a1aa] md:text-lg">
              AI infrastructure for the people who move the economy. Coordinating VinFast EV fleets, solar-powered charging hubs, worker housing communities, and sovereign data ledgers at national scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href={ctaLink}
                className="flex items-center justify-center gap-2 border border-[#ff4500] bg-[#ff4500]/10 hover:bg-[#ff4500] hover:text-black text-[#ff7a00] hover:scale-[1.02] active:scale-[0.98] py-3.5 px-5 font-mono text-[11px] uppercase tracking-wider transition-all duration-300 rounded"
              >
                Join Workforce <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#smart-hub"
                className="flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 text-white hover:scale-[1.02] active:scale-[0.98] py-3.5 px-5 font-mono text-[11px] uppercase tracking-wider transition-all duration-300 rounded"
              >
                Explore Infrastructure
              </a>
              <a
                href="#roi"
                className="flex items-center justify-center border border-white/10 bg-[#0052ff]/10 hover:bg-[#00d9ff] hover:text-black text-[#00d9ff] hover:scale-[1.02] active:scale-[0.98] py-3.5 px-5 font-mono text-[11px] uppercase tracking-wider transition-all duration-300 rounded"
              >
                Investor Intelligence
              </a>
            </div>
          </div>

          {/* Live Command Center HUD Panel */}
          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-black/55 backdrop-blur-md rounded shadow-2xl overflow-hidden shadow-[#00d9ff]/10">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00d9ff] animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Command Center Live</span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#00d9ff] border border-[#00d9ff]/25 px-2 py-0.5 bg-[#00d9ff]/5">
                  OPERATIONAL
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">Active Workers</span>
                    <p className="text-2xl font-bold tabular-nums text-white mt-1">
                      {activeWorkers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">Dispatch p50</span>
                    <p className="text-2xl font-bold text-[#00d9ff] mt-1">1.8s</p>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">OCR Parses/min</span>
                    <p className="text-2xl font-bold text-[#ff7a00] mt-1">847</p>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">Settlements/hr</span>
                    <p className="text-2xl font-bold text-white mt-1">2.1M</p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground block mb-2">
                    AI Dispatch Log Stream
                  </span>
                  <div className="bg-black/60 rounded border border-white/5 p-3 font-mono text-[10px] space-y-2 h-[110px] overflow-hidden">
                    <AnimatePresence>
                      {logs.map((log, index) => (
                        <motion.div
                          key={log + index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-between text-muted-foreground border-b border-white/5 pb-1.5 last:border-0"
                        >
                          <span className="truncate max-w-[220px] text-white/90">{log.split(" — ")[0]}</span>
                          <span className="text-[#00d9ff] shrink-0">{log.split(" — ")[1]}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2: AI WORKER LEDGER
          ========================================== */}
      <section id="ledger" className="py-20 border-b border-white/5 bg-gradient-to-b from-black to-slate-950/20">
        <div className="mx-auto max-w-7xl px-5 md:px-12 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#00d9ff]">01 // SOVEREIGN LEDGER</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">AI Worker Ledger</h2>
            <p className="text-[#a1a1aa] text-base md:text-lg max-w-2xl">
              GigAI Bharat replaces private platform rent with worker-owned row-level security ledgers. Verified screenshots automatically transform earnings into a bankable credit identity.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* OCR Income verification simulator */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border border-white/10 bg-black/55 backdrop-blur-md p-6 rounded-lg">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#00d9ff]" />
                    <span className="font-mono text-xs uppercase tracking-wider text-white">OCR Verification Sandbox</span>
                  </div>
                  {ocrStatus !== "idle" && (
                    <button
                      onClick={() => setOcrStatus("idle")}
                      className="font-mono text-[9px] text-[#ff7a00] hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left payslip mockup */}
                  <div className="relative border border-white/5 bg-slate-950/50 p-4 rounded min-h-[220px] flex flex-col justify-between overflow-hidden">
                    {/* Pulsing laser line if scanning */}
                    {ocrStatus === "scanning" && (
                      <motion.div
                        className="absolute inset-x-0 h-1.5 bg-[#ff4500] shadow-[0_0_12px_#ff4500] opacity-80"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                    <div className="border-b border-white/5 pb-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">Platform Invoice Payload</span>
                      <p className="text-xs font-semibold text-white mt-1">SWIGGY_BENGALURU_LOGS_2026.pdf</p>
                    </div>

                    <div className="font-mono text-[10px] space-y-2 py-4 text-muted-foreground">
                      <p className="flex justify-between"><span>BASE FARE:</span> <span className="text-white">₹28,450.00</span></p>
                      <p className="flex justify-between"><span>INCENTIVE YIELD:</span> <span className="text-white">₹14,200.00</span></p>
                      <p className="flex justify-between"><span>CUSTOMER TIP:</span> <span className="text-white">₹5,600.00</span></p>
                      <div className="border-t border-white/5 my-2" />
                      <p className="flex justify-between text-white font-semibold"><span>GROSS YIELD:</span> <span>₹48,250.00</span></p>
                    </div>

                    <button
                      onClick={startOcrScan}
                      disabled={ocrStatus === "scanning"}
                      className="w-full flex items-center justify-center gap-2 border border-[#ff4500] bg-[#ff4500]/10 hover:bg-[#ff4500] hover:text-black text-[#ff7a00] py-2 px-3 font-mono text-[10px] uppercase tracking-wider transition-colors duration-200 rounded disabled:opacity-50"
                    >
                      {ocrStatus === "scanning" ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" /> Extracting...
                        </>
                      ) : ocrStatus === "done" ? (
                        "Audit Complete"
                      ) : (
                        "Simulate OCR Audit"
                      )}
                    </button>
                  </div>

                  {/* Right: terminal logs outputs */}
                  <div className="flex flex-col justify-between border border-white/5 bg-black/70 p-4 rounded font-mono text-[10px] min-h-[220px]">
                    <div>
                      <span className="text-muted-foreground uppercase tracking-wider text-[9px] block mb-2">OCR Diagnostic Console</span>
                      {ocrLogs.length === 0 ? (
                        <p className="text-[#a1a1aa]/40 italic">Waiting for simulation triggers...</p>
                      ) : (
                        <div className="space-y-1.5 h-[120px] overflow-y-auto">
                          {ocrLogs.map((log, i) => (
                            <p key={i} className={log.startsWith("[OK]") ? "text-emerald-400" : "text-[#00d9ff]"}>
                              {log}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {ocrStatus === "done" && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 border border-emerald-500/20 bg-emerald-500/5 p-3 rounded flex flex-col gap-1"
                      >
                        <p className="text-emerald-400 font-bold uppercase text-[9px] tracking-wider">CERTIFIED EXTRACT DATA</p>
                        <p className="text-xs text-white/90">Verified Income: ₹48,250 · Platform: Swiggy/Uber · DigiLocker KYC Verified</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sovereign credit ID card (3D tilt on mouse hover) */}
            <div className="lg:col-span-4">
              <CardTilt glowColor="rgba(0, 217, 255, 0.3)">
                <div className="p-6 h-[340px] flex flex-col justify-between relative overflow-hidden select-none">
                  {/* Subtle decorative background circles */}
                  <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-[#00d9ff]/5 border border-[#00d9ff]/10" />
                  <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-[#ff4500]/5 border border-[#ff4500]/10" />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#00d9ff] font-semibold">SOVEREIGN WORKER CREDENTIAL</span>
                      <p className="font-mono text-xs font-bold text-white mt-1">GIGAI BHARAT MESH</p>
                    </div>
                    <span className="border border-[#00d9ff]/30 bg-[#00d9ff]/10 px-2 py-0.5 font-mono text-[9px] text-[#00d9ff] rounded">AA+</span>
                  </div>

                  <div className="py-6">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Verified Credit Score</p>
                    <p className="text-5xl font-bold font-serif text-white mt-1 tabular-nums">742</p>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-[#00d9ff] mt-2 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> DigiLocker Verified
                    </p>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">ID Node</p>
                      <p className="font-mono text-xs text-white">GB-IND-560032</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-[#00d9ff]/60" />
                  </div>
                </div>
              </CardTilt>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: SHRAMSETU COMPLIANCE ENGINE
          ========================================== */}
      <section id="shramsetu" className="py-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-5 md:px-12 grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff4500]">02 // REGULATORY INFRASTRUCTURE</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">ShramSetu Compliance</h2>
            <p className="text-[#a1a1aa] text-base leading-relaxed md:text-lg">
              Automated compliance with the Social Security Code. Tracking contributions, Karnataka welfare fees (1% cess), and accidental/health insurance allocations via DigiLocker.
            </p>
            <div className="border border-white/10 bg-black/40 p-5 space-y-4">
              <div>
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>Karnataka 1% Welfare Fee Track</span>
                  <span className="text-white">68% COMPLETE</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-1.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[#ff4500] to-[#00d9ff]" style={{ width: "68%" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-white/5 bg-slate-950/40 p-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">EPF Contribution</span>
                  <span className="font-mono text-sm text-[#00d9ff] font-semibold mt-1 block">T+0 SETTLED</span>
                </div>
                <div className="border border-white/5 bg-slate-950/40 p-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">ESIC Readiness</span>
                  <span className="font-mono text-sm text-emerald-400 font-semibold mt-1 block">ACTIVE INCLUSION</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-white/10 bg-black/55 backdrop-blur-md rounded-lg overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-white/5">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#ff4500]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white">Compliance Audit Center</span>
                </div>
                <span className="font-mono text-[9px] text-[#ff4500] animate-pulse">MONITORING</span>
              </div>

              <div className="p-6 space-y-4">
                <div className="border border-white/5 bg-black/75 rounded p-4 font-mono text-[10px] h-[160px] overflow-y-auto space-y-1.5">
                  {auditLogs.length === 0 ? (
                    <p className="text-[#a1a1aa]/40 italic">Audit queue ready. Trigger audit scan below...</p>
                  ) : (
                    auditLogs.map((log, i) => (
                      <p key={i} className={log.includes("SYSTEM COMPLIANT") ? "text-emerald-400 font-semibold" : "text-[#ff7a00]"}>
                        {log}
                      </p>
                    ))
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-400" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#a1a1aa]">DPDP-Aligned Data Security</span>
                  </div>
                  <button
                    onClick={startAudit}
                    disabled={auditStatus === "running"}
                    className="border border-[#ff4500] bg-[#ff4500]/10 hover:bg-[#ff4500] hover:text-black text-[#ff7a00] font-mono text-[10px] uppercase tracking-wider py-2.5 px-4 rounded transition-all duration-200 disabled:opacity-50"
                  >
                    {auditStatus === "running" ? "Auditing logs..." : "Verify compliance audit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 4: SMART HUB ECOSYSTEM
          ========================================== */}
      <section id="smart-hub" className="py-20 border-b border-white/5 bg-gradient-to-b from-slate-950/20 to-black">
        <div className="mx-auto max-w-7xl px-5 md:px-12 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#00d9ff]">03 // PHYSICAL INFRASTRUCTURE</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">Smart Hub Ecosystem</h2>
            <p className="text-[#a1a1aa] text-base md:text-lg max-w-2xl">
              Coordinating urban infrastructure for clean energy transitions. 3D grid layout tracking EV charging hubs, worker solar carports, housing grids, and sustainable VinFast EV fleets.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-stretch">
            {/* 3D Wireframe canvas */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-4">
              <div className="flex gap-2">
                {[
                  { id: "whitefield", label: "Whitefield Fast Hub" },
                  { id: "koramangala", label: "Koramangala Solar" },
                  { id: "electroniccity", label: "Electronic City Yard" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHubTab(tab.id)}
                    className={`font-mono text-[9px] uppercase tracking-wider py-2 px-4 border transition-all duration-200 ${
                      activeHubTab === tab.id
                        ? "border-[#00d9ff] bg-[#00d9ff]/10 text-white"
                        : "border-white/5 bg-white/5 text-[#a1a1aa] hover:border-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-h-[300px]">
                <SmartHubCanvas activeTab={activeHubTab} />
              </div>
            </div>

            {/* VinFast EV Fleet specs */}
            <div className="lg:col-span-5 border border-white/10 bg-black/55 backdrop-blur-md p-6 rounded-lg flex flex-col justify-between">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#ff7a00]">Workforce mobility partner</span>
                <h3 className="font-serif text-3xl text-white mt-1">VinFast MPV7 Fleet</h3>
                <p className="mt-3 text-sm text-[#a1a1aa] leading-relaxed">
                  Integrating battery intelligence and telemetry into dispatch. Designed as sustainable urban transport at nation scale.
                </p>

                <div className="mt-6 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-mono text-[10px] text-muted-foreground">WLTP RANGE</span>
                    <span className="font-mono text-xs font-semibold text-white">468 km (City/Highway mix)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-mono text-[10px] text-muted-foreground">DC FAST CHARGE</span>
                    <span className="font-mono text-xs font-semibold text-[#00d9ff]">25 min (10–80% SOC)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-mono text-[10px] text-muted-foreground">OPERATING COST</span>
                    <span className="font-mono text-xs font-semibold text-emerald-400">₹1.2 / km vs ₹4.8 ICE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">BATTERY SPEC</span>
                    <span className="font-mono text-xs font-semibold text-white">90 kWh LFP (AI diagnostics)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href={ctaLink}
                  className="w-full flex items-center justify-center gap-2 border border-[#00d9ff] bg-[#0052ff]/10 hover:bg-[#00d9ff] hover:text-black text-[#00d9ff] py-3 text-xs font-mono uppercase tracking-wider transition-colors duration-200 rounded"
                >
                  Explore EV Fleet Infrastructure
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: GURUKUL AI
          ========================================== */}
      <section id="gurukul" className="py-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-5 md:px-12 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff4500]">04 // MULTILINGUAL LEARNING</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">Gurukul AI</h2>
            <p className="text-[#a1a1aa] text-base md:text-lg max-w-2xl">
              Not a typical learning platform. Gurukul AI is an interactive mentor and skill graph that updates qualifications and boosts earnings potential in under 5 minutes.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Chatbot Coach */}
            <div className="lg:col-span-4 border border-white/10 bg-black/55 backdrop-blur-md p-6 rounded-lg min-h-[360px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
                  <Globe className="h-4 w-4 text-[#ff7a00] animate-spin-slow" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white">Onboarding Coach Preview</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded border border-white/5 p-3">
                    <span className="font-mono text-[9px] text-[#ff7a00] font-bold">
                      {chatContent[chatLanguage].name}
                    </span>
                    <p className="mt-1.5 text-xs text-white/90 leading-relaxed transition-all duration-300">
                      {chatContent[chatLanguage].msg}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#0052ff]/10 border border-[#00d9ff]/30 text-white rounded p-3 max-w-[80%]">
                      <p className="text-xs font-mono">EN / KN / HI / TA / TE support active</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button className="w-full border border-white/10 hover:border-white/20 bg-white/5 text-white font-mono text-[10px] uppercase tracking-wider py-2.5 rounded">
                  {chatContent[chatLanguage].action}
                </button>
                <div className="flex justify-center gap-1.5">
                  {(["en", "kn", "hi", "ta", "te"] as const).map((lang) => (
                    <span
                      key={lang}
                      onClick={() => setChatLanguage(lang)}
                      className={`cursor-pointer font-mono text-[9px] uppercase px-1.5 py-0.5 border rounded ${
                        chatLanguage === lang
                          ? "border-[#ff7a00] text-[#ff7a00] bg-[#ff7a00]/5"
                          : "border-white/5 text-muted-foreground hover:text-white"
                      }`}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Skill Graph Canvas */}
            <div className="lg:col-span-8">
              <SkillGraph
                onSelectNode={(node) => setSelectedSkillNodeId(node.id)}
                selectedNodeId={selectedSkillNodeId}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 6: INVESTOR ROI LAYER
          ========================================== */}
      <section id="roi" className="py-20 border-b border-white/5 bg-gradient-to-b from-black to-slate-950/20">
        <div className="mx-auto max-w-7xl px-5 md:px-12 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#00d9ff]">05 // FINANCIAL INFRASTRUCTURE</span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">Investor ROI Layer</h2>
            <p className="text-[#a1a1aa] text-base md:text-lg max-w-2xl">
              See how verified worker cash flows power fintech pools, loan dispersals, micro-insurance products, and a neobanking system with zero default rate.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-stretch">
            {/* ROI parameters slider */}
            <div className="lg:col-span-5 border border-white/10 bg-black/55 backdrop-blur-md p-6 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
                  <TrendingUp className="h-4 w-4 text-[#00d9ff]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white">Scale Parameter controls</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between font-mono text-xs text-white">
                      <span>WORKER SCALE</span>
                      <span className="text-[#00d9ff] font-bold">{(roiWorkers / 1000).toFixed(0)}K Drivers</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="1500000"
                      step="50000"
                      value={roiWorkers}
                      onChange={(e) => setRoiWorkers(Number(e.target.value))}
                      className="mt-3 w-full accent-[#00d9ff] bg-white/10 h-1 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between font-mono text-[8px] text-muted-foreground mt-1">
                      <span>50K</span>
                      <span>500K</span>
                      <span>1M</span>
                      <span>1.5M</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-6 space-y-4 font-mono text-[11px] text-[#a1a1aa]">
                    <div className="flex justify-between">
                      <span>AVG ANNUITY GMV RATE:</span>
                      <span className="text-white">₹1,28,000 / Driver</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EMBEDDED FINANCE PENETRATION:</span>
                      <span className="text-[#00d9ff]">15% Pool Reserve</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NEOBANK TRANSACTION YIELD:</span>
                      <span className="text-white">0.85% APY Match</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/5 pt-6">
                <a
                  href={ctaLink}
                  className="w-full flex items-center justify-center gap-2 border border-[#ff4500] bg-[#ff4500]/10 hover:bg-[#ff4500] hover:text-black text-[#ff7a00] py-3 text-xs font-mono uppercase tracking-wider transition-colors duration-200 rounded"
                >
                  Request Investor Intro
                </a>
              </div>
            </div>

            {/* ROI projections display */}
            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
              <div className="border border-white/10 bg-black/45 backdrop-blur-md p-5 rounded-lg">
                <Layers className="h-4 w-4 text-[#00d9ff]" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block mt-3">Projected Annual GMV</span>
                <p className="text-3xl font-serif font-bold text-white mt-1 tabular-nums">₹ {roiCalculations.gmvCr} Cr</p>
                <p className="text-[10px] text-muted-foreground mt-1">Coordinated urban dispatch transaction size</p>
              </div>

              <div className="border border-white/10 bg-black/45 backdrop-blur-md p-5 rounded-lg">
                <Shield className="h-4 w-4 text-[#ff7a00]" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block mt-3">Lending Opportunity</span>
                <p className="text-3xl font-serif font-bold text-[#ff7a00] mt-1 tabular-nums">₹ {roiCalculations.lendingCr} Cr</p>
                <p className="text-[10px] text-muted-foreground mt-1">Verified ledger microfinance allocation capacity</p>
              </div>

              <div className="border border-white/10 bg-black/45 backdrop-blur-md p-5 rounded-lg">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block mt-3">Annual Transactions</span>
                <p className="text-3xl font-serif font-bold text-white mt-1 tabular-nums">{roiCalculations.transactionsCr} Cr</p>
                <p className="text-[10px] text-muted-foreground mt-1">Total coordinated dispatch trips processed</p>
              </div>

              <div className="border border-white/10 bg-black/45 backdrop-blur-md p-5 rounded-lg">
                <Database className="h-4 w-4 text-[#00d9ff]" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block mt-3">Projected Valuation</span>
                <p className="text-3xl font-serif font-bold text-[#00d9ff] mt-1 tabular-nums">₹ {roiCalculations.valuationCr} Cr</p>
                <p className="text-[10px] text-muted-foreground mt-1">Based on 5-year network effect compounding</p>
              </div>

              <div className="sm:col-span-2">
                <CardTilt glowColor="rgba(255, 69, 0, 0.2)">
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-[#ff7a00]" />
                      <div>
                        <h4 className="font-serif text-lg text-white">Embedded Finance Debit Card</h4>
                        <p className="text-xs text-[#a1a1aa] mt-0.5">GigPay fintech neobanking infrastructure</p>
                      </div>
                    </div>
                    <span className="border border-white/10 bg-white/5 py-2 px-4 text-xs font-mono text-white animate-pulse">
                      GIGPAY ACTIVE
                    </span>
                  </div>
                </CardTilt>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 7: CTA (JOIN THE FUTURE OF WORK)
          ========================================== */}
      <section id="join" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,82,255,0.15),transparent_75%)] pointer-events-none" />
        <div className="mx-auto max-w-5xl px-5 text-center relative z-10 space-y-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#00d9ff]">06 // NETWORK EFFECT ENLISTMENT</span>
          <h2 className="font-serif text-5xl md:text-7xl text-white tracking-tight">
            Join the Future of Work
          </h2>
          <p className="max-w-2xl mx-auto text-[#a1a1aa] text-base md:text-lg">
            Whether you are an investor looking for sovereign data moats, a fleet operator optimizing EV operations, or a worker ready to own your financial future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a
              href={ctaLink}
              className="flex items-center justify-center gap-2 border border-[#ff4500] bg-[#ff4500] hover:bg-[#ff7a00] hover:border-[#ff7a00] text-black py-4 px-8 font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 rounded hover:scale-[1.02]"
            >
              Start Onboarding Now <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@bharatgig.live"
              className="flex items-center justify-center border border-white/15 bg-white/5 hover:bg-white/10 text-white py-4 px-8 font-mono text-xs uppercase tracking-wider transition-all duration-200 rounded"
            >
              Contact Command Center
            </a>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground pt-8">
            © 2026 GIGAI BHARAT · MIT OPEN SOURCE CORE · DPDP COMPLIANT
          </p>
        </div>
      </section>
    </div>
  );
}
