import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps, FieldValues } from "react-hook-form";
import z from "zod";

export function useZodForm<T extends FieldValues>(
  schema: z.ZodType<T>,
  props?: Omit<UseFormProps<T>, "resolver">
) {
  return useForm<T>({
    ...props,
    resolver: zodResolver(schema as any),
  });
}
