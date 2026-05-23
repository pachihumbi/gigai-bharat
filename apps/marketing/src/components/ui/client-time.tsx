import { useEffect, useState } from "react";

export function ClientTime({ prefix = "" }: { prefix?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return <span>{prefix}--:-- IST</span>;
  return (
    <span>
      {prefix}
      {time} IST
    </span>
  );
}
