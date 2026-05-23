import { useEffect, useState } from "react";

const KEY = "gigai:sunlight";

export const useSunlight = () => {
  const [on, setOn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEY) === "1";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (on) root.classList.add("sunlight");
    else root.classList.remove("sunlight");
    localStorage.setItem(KEY, on ? "1" : "0");
  }, [on]);
  return { on, toggle: () => setOn((v) => !v) };
};
