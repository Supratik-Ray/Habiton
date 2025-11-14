"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ActionResponse, HabitField, User, ZodErrors } from "@/lib/types";
import { habitSchema, THabitSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

class AuthError extends Error {
  constructor(mssg: string) {
    super(mssg);
  }
}

type HabitErrors = ZodErrors<keyof THabitSchema>;

export const addHabit = async (
  formData: THabitSchema
): ActionResponse<HabitErrors> => {
  const result = habitSchema.safeParse(formData);
  if (!result.success) {
    const zodErrors: HabitErrors = {};
    result.error.issues.forEach(
      (issue) => (zodErrors[issue.path[0] as HabitField] = issue.message)
    );
    return { success: false, errors: zodErrors };
  }

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new AuthError("you are not authorized to add habit");
    await prisma.habit.create({
      data: { ...formData, userId: session.user.id },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something went wrong!" };
  }
};

type DeleteHabitResponse = Promise<
  { success: true } | { success: false; error: string }
>;

export const deleteHabit = async (id: number): DeleteHabitResponse => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return {
      success: false,
      error: "you are not authorized to delete this habit!",
    };
  try {
    const deleted = await prisma.habit.delete({
      where: { id, userId: session.user.id },
    });

    if (!deleted) return { success: false, error: "Habit not found!" };
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Couldn't delete habit. Some error occured!",
    };
  }
};
