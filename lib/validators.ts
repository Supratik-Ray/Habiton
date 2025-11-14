import z from "zod";
import { HABIT_CATEGORIES, DAYS } from "./options";
const categories = HABIT_CATEGORIES.map((el) => el.id);
const days = DAYS.map((el) => el.id);

export const signupSchema = z
  .object({
    name: z
      .string({ error: "Full name is required." })
      .trim()
      .min(2, "Full name must atleast 2 characters long."),
    email: z.email("Email is required").trim(),
    password: z
      .string("Password is required")
      .min(8, "Password must be atleast 8 characters long"),
    confirmPassword: z.string("Please confirm your password"),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    { message: "Passwords must match", path: ["confirmPassword"] }
  );

export type TsignupSchema = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.email("Email is required").trim(),
  password: z.string("Password is required"),
});

export type TsigninSchema = z.infer<typeof signinSchema>;

export const habitSchema = z
  .object({
    name: z
      .string("Habit name is required")
      .trim()
      .min(2, "Habit name must be atleast 2 characters long"),
    category: z.enum(categories, { error: "Choose a valid category" }),
    frequencyType: z.enum(["daily", "specific"], {
      error: "Choose a valid habit type",
    }),
    days: z
      .array(z.enum(days), { error: "It should be a valid day value" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.frequencyType === "specific") {
        return data.days && data.days?.length > 0;
      }
      return true;
    },
    {
      path: ["days"],
      error: "Please select days",
    }
  );

export type THabitSchema = z.infer<typeof habitSchema>;
