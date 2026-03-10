"use client";

import { Check, ChevronDown } from "lucide-react";
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
  const processedValue = React.useMemo(() => {
    if (!value) return "";
    const str = String(value).trim();
    if (str && !str.startsWith("+") && /^\d+$/.test(str) && str.length > 0) {
      return `+${str}`;
    }
    return str;
  }, [value]);

  return (
    /* The wrapper div below acts as the visual "Input". 
      focus-within handles the blue ring for the entire group.
    */
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
        value={processedValue as RPNInput.Value}
        onChange={(v) => onChange?.(v || ("" as RPNInput.Value))}
        {...props}
      />
    </div>
  );
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    /* Removed borders and focus rings to let the parent container handle them */
    className={cn(
      "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full w-full bg-transparent rounded-none rounded-e-lg",
      className,
    )}
    {...props}
    ref={ref}
  />
));
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
          variant="ghost" /* Using ghost to remove the button's own border */
          className={cn(
            "flex gap-1 rounded-none rounded-s-lg px-3 border-r focus:z-10 h-full hover:bg-muted/50 transition-none",
            disabled && "opacity-50",
          )}
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <span className="text-muted-foreground text-sm ml-1">
            {value && `+${RPNInput.getCountryCallingCode(value)}`}
          </span>
          <ChevronDown
            className={cn(
              "-mr-1 h-4 w-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command className="bg-[#FBFCFD]">
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
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
