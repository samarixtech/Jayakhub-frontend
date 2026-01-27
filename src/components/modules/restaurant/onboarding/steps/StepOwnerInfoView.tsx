"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  ownerInfoSchema,
  OwnerInfoInput,
} from "@/lib/validators/restaurant-onboarding";
import { saveOwnerInfoAction } from "@/app/actions/restaurant/onboarding";
import { useServerAction } from "@/hooks/use-server-action";
import useLocale from "@/hooks/useLocals";

export default function StepOwnerInfoView() {
  const router = useRouter();
  const { country, language } = useLocale();

  const form = useForm<OwnerInfoInput>({
    resolver: zodResolver(ownerInfoSchema),
    defaultValues: {
      ownerName: "",
      ownerPhone: "",
    },
  });

  const { execute, isPending } = useServerAction(saveOwnerInfoAction, {
    onSuccess: () => {
      toast.success("Owner info saved!");
      router.push(`/${country}/${language}/restaurant/onboarding/step-restaurant-info`);
    },
  });

  const onSubmit = (data: OwnerInfoInput) => {
    execute(data);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        Who manages this restaurant?
      </Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Owner Name */}
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Full Name
                  </label>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        placeholder="John Doe"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Owner Phone */}
            <FormField
              control={form.control}
              name="ownerPhone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Contact Phone
                  </label>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        placeholder="+964 000 000 0000"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <div className="flex justify-between items-start">
                    <FormMessage />
                     <Typography className="text-[10px] text-gray-400">
                        We will send important updates to this number.
                     </Typography>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50">
             <Button
                type="submit"
                disabled={isPending}
                className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
              >
                {isPending ? "Saving..." : "Continue"}
              </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
