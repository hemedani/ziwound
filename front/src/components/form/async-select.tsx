"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
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
import { useDebounce } from "@/hooks/use-debounce";

export interface AsyncSelectOption<T = unknown> {
  id: string;
  label: string;
  subLabel?: string;
  prefix?: React.ReactNode;
  data?: T;
}

export type AsyncSelectValue = string | string[] | null;

export interface AsyncSelectLoadResult {
  options: AsyncSelectOption[];
  hasMore?: boolean;
}

export interface AsyncSelectProps<T = unknown> {
  value?: AsyncSelectValue;
  onChange?: (value: AsyncSelectValue) => void;
  defaultValue?: AsyncSelectValue;
  isMulti?: boolean;
  isClearable?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  name?: string;

  async?: boolean;
  loadOptions?: (inputValue: string, page?: number) => Promise<AsyncSelectLoadResult>;
  options?: AsyncSelectOption[];

  getOptionLabel?: (option: AsyncSelectOption<T>) => string;
  renderOption?: (option: AsyncSelectOption<T>) => React.ReactNode;
}

export function AsyncSelect<T = unknown>({
  value,
  onChange,
  defaultValue,
  isMulti = false,
  isClearable = true,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  disabled = false,
  loading = false,
  className,
  name,
  async = false,
  loadOptions,
  options: staticOptions = [],
  getOptionLabel,
  renderOption,
}: AsyncSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [internalValue, setInternalValue] = useState<AsyncSelectValue>(
    value !== undefined ? value : defaultValue || (isMulti ? [] : null)
  );

  const [asyncOptions, setAsyncOptions] = useState<AsyncSelectOption[]>([]);
  const [isAsyncLoading, setIsAsyncLoading] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleSelect = useCallback(
    (currentId: string) => {
      let newValue: AsyncSelectValue;

      if (isMulti) {
        const valArray = Array.isArray(internalValue) ? internalValue : [];
        newValue = valArray.includes(currentId)
          ? valArray.filter((v) => v !== currentId)
          : [...valArray, currentId];
      } else {
        newValue = currentId === internalValue && isClearable ? null : currentId;
        setOpen(false);
      }

      setInternalValue(newValue);
      onChange?.(newValue);
    },
    [internalValue, isMulti, isClearable, onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newValue: AsyncSelectValue = isMulti ? [] : null;
      setInternalValue(newValue);
      onChange?.(newValue);
    },
    [isMulti, onChange]
  );

  useEffect(() => {
    if (!async || !loadOptions || !open) return;

    let isMounted = true;

    const fetchOptions = async () => {
      setIsAsyncLoading(true);
      try {
        const result = await loadOptions(debouncedSearchQuery, 1);
        if (isMounted) {
          setAsyncOptions(result.options || []);
        }
      } catch (error) {
        console.error("Failed to load options", error);
        if (isMounted) {
          setAsyncOptions([]);
        }
      } finally {
        if (isMounted) {
          setIsAsyncLoading(false);
        }
      }
    };

    fetchOptions();

    return () => {
      isMounted = false;
    };
  }, [async, loadOptions, debouncedSearchQuery, open]);

  const displayOptions = useMemo(() => {
    return async ? asyncOptions : staticOptions;
  }, [async, asyncOptions, staticOptions]);

  const filteredOptions = useMemo(() => {
    if (async) return displayOptions;
    if (!searchQuery) return displayOptions;

    const lowerQuery = searchQuery.toLowerCase();
    return displayOptions.filter((opt) => {
      const label = getOptionLabel ? getOptionLabel(opt as AsyncSelectOption<T>) : opt.label;
      return label.toLowerCase().includes(lowerQuery) || (opt.subLabel && opt.subLabel.toLowerCase().includes(lowerQuery));
    });
  }, [async, displayOptions, searchQuery, getOptionLabel]);

  const allOptions = useMemo(() => {
    return [...displayOptions, ...staticOptions];
  }, [displayOptions, staticOptions]);

  const selectedLabels = useMemo(() => {
    if (isMulti) {
      const valArray = Array.isArray(internalValue) ? internalValue : [];
      if (valArray.length === 0) return null;

      const labels = valArray.map((v) => {
        const opt = allOptions.find((o) => o.id === v);
        return opt ? (getOptionLabel ? getOptionLabel(opt as AsyncSelectOption<T>) : opt.label) : v;
      });
      return labels.join(", ");
    } else {
      if (!internalValue) return null;
      const opt = allOptions.find((o) => o.id === internalValue);
      return opt ? (getOptionLabel ? getOptionLabel(opt as AsyncSelectOption<T>) : opt.label) : (internalValue as string);
    }
  }, [internalValue, isMulti, allOptions, getOptionLabel]);

  const showLoader = loading || isAsyncLoading;

  const defaultRenderOption = useCallback(
    (option: AsyncSelectOption<T>) => (
      <span className="flex items-center gap-2">
        {option.prefix && <span>{option.prefix}</span>}
        <span>{option.label}</span>
        {option.subLabel && (
          <span className="text-xs text-muted-foreground">({option.subLabel})</span>
        )}
      </span>
    ),
    []
  );

  const renderOptionFn = renderOption || defaultRenderOption;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-background px-3 font-normal",
            !selectedLabels && "text-muted-foreground",
            className
          )}
          ref={triggerRef}
        >
          <span className="truncate">{selectedLabels || placeholder}</span>
          <div className="flex items-center shrink-0">
            {isClearable && selectedLabels && !disabled && (
              <div
                role="button"
                tabIndex={0}
                aria-label="Clear selection"
                className="mr-2 rounded-full p-1 hover:bg-muted"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClear(e as unknown as React.MouseEvent);
                  }
                }}
              >
                <X className="h-3.5 w-3.5 opacity-50 hover:opacity-100" />
              </div>
            )}
            {showLoader ? (
              <Loader2 className="h-4 w-4 animate-spin opacity-50" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={!async}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {showLoader ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">Searching...</span>
                </div>
              ) : (
                emptyText
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = isMulti
                  ? (Array.isArray(internalValue) ? internalValue : []).includes(option.id)
                  : internalValue === option.id;

                return (
                  <CommandItem
                    key={option.id}
                    value={getOptionLabel ? getOptionLabel(option as AsyncSelectOption<T>) : option.label}
                    onSelect={() => handleSelect(option.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {renderOptionFn(option as AsyncSelectOption<T>)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      {name && (
        <input
          type="hidden"
          name={name}
          value={Array.isArray(internalValue) ? internalValue.join(",") : internalValue || ""}
        />
      )}
    </Popover>
  );
}
