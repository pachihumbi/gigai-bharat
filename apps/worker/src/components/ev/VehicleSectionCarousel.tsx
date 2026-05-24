import { useCallback, useEffect, useState } from "react";
import type { EvSection, EvVehicle } from "@/lib/ev-demo";
import { VehicleCard } from "./VehicleCard";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type VehicleSectionCarouselProps = {
  section: EvSection;
  selectedId?: string;
  onSelectVehicle?: (vehicle: EvVehicle) => void;
  delay?: number;
};

export function VehicleSectionCarousel({
  section,
  selectedId,
  onSelectVehicle,
  delay = 0,
}: VehicleSectionCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <section className="animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-bright flex items-center gap-2">
            <span>{section.emoji}</span>
            {section.title}
          </h2>
          <p className="text-xs text-foreground/65 mt-0.5">{section.subtitle}</p>
        </div>
        <span className="text-[10px] font-mono-tech text-cyan-300/80 shrink-0">
          {current + 1}/{section.vehicles.length}
        </span>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {section.vehicles.map((vehicle) => (
            <CarouselItem key={vehicle.id} className="pl-3 basis-[88%] sm:basis-[72%]">
              <VehicleCard
                vehicle={vehicle}
                selected={selectedId === vehicle.id}
                onSelect={onSelectVehicle}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-3 flex justify-center gap-1.5">
        {section.vehicles.map((v, i) => (
          <button
            key={v.id}
            type="button"
            aria-label={`Go to ${v.name}`}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-6 bg-cyan-400" : "w-1.5 bg-white/20 hover:bg-white/35",
            )}
          />
        ))}
      </div>
    </section>
  );
}
