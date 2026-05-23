/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/loadGoogleMaps";
import { MapPin, Loader2 } from "lucide-react";

export interface PickedPlace {
  lat: number;
  lng: number;
  address: string;
}

interface Props {
  value?: PickedPlace | null;
  onChange: (p: PickedPlace) => void;
}

/**
 * Places (New) Autocomplete picker.
 * Uses AutocompleteSuggestion.fetchAutocompleteSuggestions per Google Maps Platform guidance.
 */
export const PlacePicker = ({ value, onChange }: Props) => {
  const [input, setInput] = useState(value?.address ?? "");
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const sessionRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const placesLibRef = useRef<google.maps.PlacesLibrary | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    loadGoogleMaps(["places"])
      .then(async (g) => {
        const places = (await g.maps.importLibrary("places")) as google.maps.PlacesLibrary;
        placesLibRef.current = places;
        sessionRef.current = new places.AutocompleteSessionToken();
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchSuggestions = (text: string) => {
    if (!placesLibRef.current || !sessionRef.current) return;
    const { AutocompleteSuggestion } = placesLibRef.current;
    AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: text,
      sessionToken: sessionRef.current,
      includedRegionCodes: ["in"],
    })
      .then((res) => setSuggestions(res.suggestions ?? []))
      .catch(() => setSuggestions([]));
  };

  const onInput = (v: string) => {
    setInput(v);
    setOpen(true);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (v.trim().length < 3) { setSuggestions([]); return; }
    debounceRef.current = window.setTimeout(() => fetchSuggestions(v), 250);
  };

  const pick = async (s: google.maps.places.AutocompleteSuggestion) => {
    const pred = s.placePrediction;
    if (!pred) return;
    const place = pred.toPlace();
    await place.fetchFields({ fields: ["location", "formattedAddress", "displayName"] });
    const loc = place.location;
    if (!loc) return;
    const picked: PickedPlace = {
      lat: loc.lat(),
      lng: loc.lng(),
      address: place.formattedAddress || pred.text?.text || input,
    };
    setInput(picked.address);
    setOpen(false);
    setSuggestions([]);
    onChange(picked);
    // New session after a selection per Google guidance.
    if (placesLibRef.current) {
      sessionRef.current = new placesLibRef.current.AutocompleteSessionToken();
    }
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
          placeholder={loading ? "Loading map…" : "Search your area"}
          disabled={loading}
          className="w-full h-12 pl-9 pr-10 rounded-xl bg-background/60 border border-border focus:border-primary focus:outline-none text-sm"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-auto rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl">
          {suggestions.map((s, i) => {
            const main = s.placePrediction?.mainText?.text ?? s.placePrediction?.text?.text;
            const sec = s.placePrediction?.secondaryText?.text;
            return (
              <li key={i}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(s)}
                  className="w-full text-left px-3 py-2.5 hover:bg-primary/10 transition flex items-start gap-2"
                >
                  <MapPin className="h-4 w-4 mt-0.5 text-secondary flex-none" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium truncate">{main}</span>
                    {sec && <span className="block text-[11px] text-muted-foreground truncate">{sec}</span>}
                  </span>
                </button>
              </li>
            );
          })}
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
