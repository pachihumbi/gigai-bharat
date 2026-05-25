import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import * as echarts from "echarts";
import { supabase } from "@/lib/supabase";

export function AnalyticsPage() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const evRef = useRef<HTMLDivElement | null>(null);

  const { data: hotspots = [] } = useQuery({
    queryKey: ["admin", "hotspots"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("hotspot_analytics", { p_city: "Bengaluru" });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: overview } = useQuery({
    queryKey: ["admin", "analytics-overview"],
    queryFn: async () => {
      const [jobs, chargers, locations] = await Promise.all([
        supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("ev_chargers").select("id", { count: "exact", head: true }),
        supabase.from("worker_locations").select("id", { count: "exact", head: true }).eq("on_shift", true),
      ]);
      return {
        openJobs: jobs.count ?? 0,
        evStations: chargers.count ?? 0,
        activeWorkers: locations.count ?? 0,
      };
    },
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current, "dark");

    chart.setOption({
      backgroundColor: "transparent",
      title: { text: "Zone demand vs active workers", left: "center", textStyle: { fontSize: 14 } },
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, data: ["Demand weight", "Active workers"] },
      xAxis: {
        type: "category",
        data: hotspots.map((h: { zone_name: string }) => h.zone_name),
        axisLabel: { rotate: 30, fontSize: 10 },
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "Demand weight",
          type: "bar",
          data: hotspots.map((h: { weight: number }) => h.weight),
          itemStyle: { color: "#f97316" },
        },
        {
          name: "Active workers",
          type: "line",
          data: hotspots.map((h: { active_workers: number }) => h.active_workers),
          itemStyle: { color: "#22d3ee" },
          smooth: true,
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [hotspots]);

  useEffect(() => {
    if (!evRef.current) return;
    const chart = echarts.init(evRef.current, "dark");

    chart.setOption({
      backgroundColor: "transparent",
      title: { text: "Mobility ops snapshot", left: "center", textStyle: { fontSize: 14 } },
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          data: [
            { value: overview?.openJobs ?? 0, name: "Open jobs" },
            { value: overview?.evStations ?? 0, name: "EV stations" },
            { value: overview?.activeWorkers ?? 0, name: "Active workers" },
          ],
          itemStyle: {
            borderRadius: 6,
            borderColor: "#0f172a",
            borderWidth: 2,
          },
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [overview]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="mt-2 text-slate-400">Operational intelligence — ECharts + Supabase aggregates</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Open jobs", value: overview?.openJobs },
          { label: "EV stations cached", value: overview?.evStations },
          { label: "Workers on shift", value: overview?.activeWorkers },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{value ?? "—"}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div ref={chartRef} className="h-80 rounded-xl border border-white/10 bg-black/20 p-4" />
        <div ref={evRef} className="h-80 rounded-xl border border-white/10 bg-black/20 p-4" />
      </div>
    </div>
  );
}
