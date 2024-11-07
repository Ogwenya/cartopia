"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  entries,
  value,
  setValue,
  items_name,
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-disabled="true"
          className="w-full justify-between"
        >
          {value
            ? entries.find((entry) => entry.value === value)?.label || value
            : `select ${items_name}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder={`select ${items_name}...`}
            value={query}
            onValueChange={(value) => setQuery(value)}
          />
          <CommandEmpty>
            No {items_name} found.
          </CommandEmpty>

          <CommandGroup>
            <CommandList>
              {entries.map((entry) => (
                <CommandItem
                  key={entry.value}
                  value={entry.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === entry.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {entry.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
