import { useEffect, useRef, useState } from "react";
import { searchPlaces } from "@gigai/maps";
import { getMapConfig } from "@/lib/maps/config";
import { supabase } from "@/integrations/supabase/client";
import type { PickedPlace, PlaceSuggestion } from "@gigai/geo";
import { MapPin, Loader2 } from "lucide-react";

export type { PickedPlace };

interface Props {
  value?: PickedPlace | null;
  onChange: (p: PickedPlace) => void;
}

export const PlacePicker = ({ value, onChange }: Props) => {
  const [input, setInput] = useState(value?.address ?? "");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const mapConfig = getMapConfig();

  useEffect(() => {
    setInput(value?.address ?? "");
  }, [value?.address]);

  const fetchSuggestions = async (text: string) => {
    setLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const results = await searchPlaces(text, {
        lat: mapConfig.defaultCenter.lat,
        lng: mapConfig.defaultCenter.lng,
        limit: 5,
        proxyUrl: token ? mapConfig.geoProxyUrl : undefined,
        accessToken: token ?? undefined,
      });
      setSuggestions(results);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const onInput = (v: string) => {
    setInput(v);
    setOpen(true);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (v.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(() => void fetchSuggestions(v), 250);
  };

  const pick = (s: PlaceSuggestion) => {
    const picked: PickedPlace = {
      lat: s.lat,
      lng: s.lng,
      address: s.secondary ? `${s.label}, ${s.secondary}` : s.label,
    };
    setInput(picked.address);
    setOpen(false);
    setSuggestions([]);
    onChange(picked);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={input}
          onChange={(e) => onInput(e.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search your area (Photon OSM)"
          className="w-full h-12 pl-9 pr-10 rounded-xl bg-background/60 border border-border focus:border-primary focus:outline-none text-sm"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-auto rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
                className="w-full text-left px-3 py-2.5 hover:bg-primary/10 transition flex items-start gap-2"
              >
                <MapPin className="h-4 w-4 mt-0.5 text-secondary flex-none" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium truncate">{s.label}</span>
                  {s.secondary && (
                    <span className="block text-[11px] text-muted-foreground truncate">{s.secondary}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {value && (
        <p className="mt-2 text-[11px] font-mono-tech text-secondary truncate">
          📍 {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
};
