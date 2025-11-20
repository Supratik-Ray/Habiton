"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

//select
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useForm, Controller, useWatch, SubmitHandler } from "react-hook-form";
import { HABIT_CATEGORIES, DAYS } from "@/lib/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, THabitSchema } from "@/lib/validators";
import { Spinner } from "../ui/spinner";
import { addHabit } from "@/actions/habits";
import { toast } from "sonner";
import { HabitField } from "@/lib/types";

export default function AddHabitForm() {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<THabitSchema>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      // category: "health",
      // frequencyType: "daily",
      days: [],
    },
  });

  const selectedFrequency = useWatch<THabitSchema, "frequencyType">({
    control,
    name: "frequencyType",
    defaultValue: "daily",
  });

  const onAddHabit: SubmitHandler<THabitSchema> = async (formData) => {
    const result = await addHabit(formData);
    if (result.success) {
      toast.success("Successfully added Habit!");
      reset();
      return;
    }

    if ("errors" in result) {
      Object.keys(result.errors).map((field) =>
        setError(field as HabitField, {
          type: "server",
          message: result.errors[field as HabitField],
        })
      );
    } else {
      toast.error(result.error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onAddHabit)}
      className="max-w-[700px] mx-auto w-full flex flex-col gap-6"
    >
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          type="text"
          placeholder="Your habit name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="name">Category</FieldLabel>
        <Select
          onValueChange={(v) =>
            setValue("category", v as THabitSchema["category"])
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {HABIT_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel>Choose frequency</FieldLabel>
        <Select
          onValueChange={(v) =>
            setValue("frequencyType", v as THabitSchema["frequencyType"])
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="specific">Specific days</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.frequencyType && (
          <p className="text-red-500 text-sm">{errors.frequencyType.message}</p>
        )}
      </Field>
      {selectedFrequency === "specific" && (
        <Field>
          <FieldLabel>Choose days</FieldLabel>
          <div className="flex gap-5 my-3">
            {DAYS.map((day) => (
              <Controller
                key={day.id}
                control={control}
                name="days"
                render={({ field: { value = [], onChange } }) => {
                  const checked = (value as string[]).includes(day.id);
                  return (
                    <span className="flex gap-2">
                      <Checkbox
                        id={day.id}
                        checked={checked}
                        onCheckedChange={(v) => {
                          if (v) {
                            onChange([...(value as string[]), day.id]);
                          } else {
                            onChange(
                              (value as string[]).filter((d) => d !== day.id)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={day.id} className="text-black/70">
                        {day.label}
                      </Label>
                    </span>
                  );
                }}
              />
            ))}
          </div>
          {errors.days && (
            <p className="text-red-500 text-sm">{errors.days.message}</p>
          )}
        </Field>
      )}

      <Button
        size={"lg"}
        className="cursor-pointer flex gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span>
              <Spinner />
            </span>
            Adding Habit...
          </>
        ) : (
          "Add Habit"
        )}
      </Button>
    </form>
  );
}
