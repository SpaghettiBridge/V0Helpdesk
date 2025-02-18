import * as React from "react"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from "@/lib/utils"

export type Option = {
  label: string
  value: string
}

type MultiSelectProps = {
  options: Option[]
  selected?: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  selected = [],
  onChange,
  placeholder = "Select items...",
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selectedArray = Array.isArray(selected) ? selected : []

  const handleUnselect = (item: string) => {
    onChange(selectedArray.filter((i) => i !== item))
  }

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedArray.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {selectedArray.map((item) => (
                <Badge variant="secondary" key={item} className="mr-1">
                  {options.find((option) => option.value === item)?.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(
                    selectedArray.includes(option.value)
                      ? selectedArray.filter((item) => item !== option.value)
                      : [...selectedArray, option.value]
                  )
                  setOpen(true)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedArray.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

