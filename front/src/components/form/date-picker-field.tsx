"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar as MultiCalendar } from "react-multi-date-picker";

interface DatePickerFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  locale?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
}

function toGregorianString(date: DateObject): string {
  return date.convert(gregorian, gregorian_en).format("YYYY-MM-DD");
}

function fromGregorianString(
  value: string | undefined,
  isPersian: boolean
): DateObject | undefined {
  if (!value) return undefined;
  const d = new DateObject({
    date: value,
    calendar: gregorian,
    locale: gregorian_en,
  });
  if (!d.isValid) return undefined;
  return isPersian ? d.convert(persian, persian_fa) : d;
}

function formatDisplay(
  date: DateObject | undefined,
  isPersian: boolean
): string {
  if (!date) return "";
  return isPersian ? date.format("YYYY/MM/DD") : date.format("YYYY-MM-DD");
}

export function DatePickerField({
  value,
  defaultValue,
  onChange,
  locale = "en",
  placeholder,
  disabled = false,
  name,
  className,
}: DatePickerFieldProps) {
  const t = useTranslations("common");
  const isPersian = locale === "fa";
  const calendar = isPersian ? persian : gregorian;
  const calendarLocale = isPersian ? persian_fa : gregorian_en;

  const [internalValue, setInternalValue] = useState<string | undefined>(
    value ?? defaultValue
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const displayDate = useMemo(() => {
    return fromGregorianString(internalValue, isPersian);
  }, [internalValue, isPersian]);

  const displayText = useMemo(() => {
    return formatDisplay(displayDate, isPersian);
  }, [displayDate, isPersian]);

  const handleChange = (date: DateObject) => {
    const gregorianStr = toGregorianString(date);
    setInternalValue(gregorianStr);
    onChange?.(gregorianStr);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      {name && (
        <input type="hidden" name={name} value={internalValue || ""} />
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-offwhite hover:bg-white/10 hover:text-white",
              !displayText && "text-slate-body/50"
            )}
          >
            <CalendarIcon className="me-2 h-4 w-4 text-slate-body" />
            {displayText ? (
              <span>{displayText}</span>
            ) : (
              <span>{placeholder || t("selectDate")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-white/[0.08] bg-transparent backdrop-blur-none"
          align="start"
        >
          <div className="calendar-glass">
            <MultiCalendar
              value={displayDate}
              onChange={handleChange}
              calendar={calendar}
              locale={calendarLocale}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
