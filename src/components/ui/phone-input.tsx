"use client";
import { Check, ChevronDown } from "lucide-react";
import { getCookie } from "cookies-next";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, value, ...props }, ref) => {
  const cookieCountry = getCookie("USER_COUNTRY") as string | undefined;
  const userCountry = (cookieCountry?.toUpperCase()) as RPNInput.Country | undefined;

  const processedValue = React.useMemo(() => {
    if (!value) return "";
    const str = String(value).trim();
    if (str === "+") return "";
    if (str && !str.startsWith("+") && /^\d+$/.test(str) && str.length > 0) {
      return `+${str}`;
    }
    return str;
  }, [value]);

  return (
    <div
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
    >
      <RPNInput.default
        ref={ref}
        className="flex w-full"
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        international={true}
        withCountryCallingCode={true}
        defaultCountry={userCountry || "PK"}
        value={processedValue as RPNInput.Value}
        onChange={(v) => {
          const val = v || "";
          if (val === "+") {
            onChange?.("" as RPNInput.Value);
          } else {
            onChange?.(val as RPNInput.Value);
          }
        }}
        {...props}
      />
    </div>
  );
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, value, onChange, ...props }, ref) => {
  const displayValue =
    typeof value === "string" && value.startsWith("+") ? value.slice(1) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (newVal && !newVal.startsWith("+")) {
      onChange?.({
        ...e,
        target: { ...e.target, value: `+${newVal}` },
      } as any);
    } else {
      onChange?.(e);
    }
  };

  return (
    <div className="flex-1 flex items-center relative">
      <span className="absolute left-3 text-muted-foreground pointer-events-none">
        +
      </span>
      <Input
        className={cn(
          "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full w-full bg-transparent rounded-none rounded-e-lg pl-6",
          className,
        )}
        value={displayValue}
        onChange={handleChange}
        {...props}
        ref={ref}
      />
    </div>
  );
});
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "flex gap-1 rounded-none rounded-s-lg px-3 focus:z-10 h-full hover:bg-muted/50 transition-none",
            disabled && "opacity-50",
          )}
          disabled={disabled}
        >
          <ChevronDown
            className={cn(
              "-mr-1 h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
          <FlagComponent country={value} countryName={value} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command className="bg-[#FBFCFD]">
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {(options || [])
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-foreground/50 text-sm">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex w-7 shrink-0 overflow-hidden">
      {Flag && (
        <span className="h-full w-full [&_svg]:h-full [&_svg]:w-full [&_svg]:object-cover [&_svg]:scale-[1.5] flex items-center justify-center">
          <Flag title={countryName} />
        </span>
      )}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
