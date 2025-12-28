"use client";

import { Flag } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { EconomicEvent } from "@/lib/utils/economic-events";

interface EventsToggleProps {
  showEvents: boolean;
  onShowEventsChange: (show: boolean) => void;
  selectedTypes: EconomicEvent["type"][];
  onTypesChange: (types: EconomicEvent["type"][]) => void;
}

const eventTypeLabels: Record<EconomicEvent["type"], string> = {
  recession: "Recessions",
  policy: "Fed Policy",
  crisis: "Crises",
  election: "Elections",
  milestone: "Milestones",
};

const eventTypeColors: Record<EconomicEvent["type"], string> = {
  recession: "bg-negative",
  policy: "bg-chart-1",
  crisis: "bg-warning",
  election: "bg-chart-4",
  milestone: "bg-chart-2",
};

export function EventsToggle({
  showEvents,
  onShowEventsChange,
  selectedTypes,
  onTypesChange,
}: EventsToggleProps) {
  const toggleType = (type: EconomicEvent["type"]) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const allTypes: EconomicEvent["type"][] = ["recession", "policy", "crisis", "election", "milestone"];

  return (
    <div className="flex items-center gap-1">
      <Toggle
        pressed={showEvents}
        onPressedChange={onShowEventsChange}
        size="sm"
        aria-label="Toggle event markers"
        className="data-[state=on]:bg-primary/10"
      >
        <Flag className="h-4 w-4" />
      </Toggle>

      {showEvents && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              {selectedTypes.length === 0 ? "All Events" : `${selectedTypes.length} types`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Event Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.length === 0 || selectedTypes.includes(type)}
                onCheckedChange={() => toggleType(type)}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${eventTypeColors[type]}`} />
                  {eventTypeLabels[type]}
                </span>
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={selectedTypes.length === 0}
              onCheckedChange={() => onTypesChange([])}
            >
              Show All
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
