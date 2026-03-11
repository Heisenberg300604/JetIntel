"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Jet } from "@/lib/types";
import { Gauge, Users, Navigation, DollarSign } from "lucide-react";

const categoryColors: Record<string, string> = {
  Light: "bg-chart-2/15 text-chart-2 border-chart-2/20",
  Midsize: "bg-chart-4/15 text-chart-4 border-chart-4/20",
  "Super Midsize": "bg-chart-3/15 text-chart-3 border-chart-3/20",
  Heavy: "bg-chart-1/15 text-chart-1 border-chart-1/20",
  "Ultra Long Range": "bg-chart-5/15 text-chart-5 border-chart-5/20",
};

const categoryGradients: Record<string, string> = {
  Light: "from-chart-2/20 via-chart-4/10 to-muted",
  Midsize: "from-chart-4/20 via-chart-2/10 to-muted",
  "Super Midsize": "from-chart-3/20 via-chart-1/10 to-muted",
  Heavy: "from-chart-1/20 via-chart-5/10 to-muted",
  "Ultra Long Range": "from-primary/20 via-chart-1/10 to-muted",
};

export function JetCard({ jet, index = 0 }: { jet: Jet; index?: number }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc =
    !imgError && jet.image_url && jet.image_url.startsWith("http")
      ? jet.image_url
      : "/images/G650.jpg";

  return (
    <Link
      href={`/jets/${jet.id}`}
      className="group block animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Card className="overflow-hidden bg-card p-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 border border-border/60 hover:border-primary/20">
        {/* Image / Header */}
        <div
          className={`relative aspect-[16/10] bg-gradient-to-br ${
            categoryGradients[jet.category] || "from-muted to-secondary"
          } overflow-hidden flex items-center justify-center`}
        >
          <Image
            src={imageSrc}
            alt={`${jet.manufacturer} ${jet.model}`}
            width={300}
            height={200}
            className="h-4/5 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            priority={false}
            onError={() => setImgError(true)}
          />

          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/[0.03] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          <div className="absolute top-3 right-3 transition-transform duration-200 group-hover:scale-105">
            <Badge
              variant="outline"
              className={`${categoryColors[jet.category] || ""} text-xs`}
            >
              {jet.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {jet.manufacturer}
            </p>
            <h3 className="font-serif text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
              {jet.model}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <Navigation className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                {jet.range_nm.toLocaleString()} NM
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                {jet.max_passengers} pax
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Gauge className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                {jet.cruise_knots} kts
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <DollarSign className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                ${jet.price_new_million}M
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
