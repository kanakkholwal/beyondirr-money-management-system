"use client"

import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import * as React from "react";

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
import { cn } from "@/lib/utils";

interface ComboboxProps {
  value?: string
  onChange?: (value: string) => void,
  onSelect: (value: string) => void,
  loading?: boolean;
  options: {
    value: string;
    label: string;
  }[];

}

export function Combobox({ value, onChange, loading = false, options, onSelect }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [queryValue, setQueryValue] = React.useState(value || "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." value={queryValue} onInput={(e) => {
            setQueryValue(e.currentTarget.value);
            onChange?.(e.currentTarget.value);
          }} />
          <CommandList>
            {!loading && (<CommandEmpty>No result found.</CommandEmpty>)}
            {loading ? (<div className="py-6 text-center text-sm">
              <LoaderCircle className="animate-spin h-5 w-5 inline-block mr-2" />
              Loading...
            </div>) :
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onSelect(currentValue);
                      setOpen(false);
                      setQueryValue("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
