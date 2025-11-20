"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateStreak } from "@/utils/calculateStreak";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const addProgress = async (habitId: number) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    const normalized = dayjs(new Date()).startOf("day").toDate();
    await prisma.progress.create({
      data: { habitId, date: normalized, userId: session.user.id },
    });

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
      include: { progressRecords: { orderBy: { date: "desc" } }, user: true },
    });

    if (!habit) throw new Error("habit not found!");
    const streak = calculateStreak({
      frequencyType: habit.frequencyType,
      progressRecords: habit.progressRecords,
      days: habit.days,
    });

    if (streak > habit.user.highestStreak) {
      await prisma.user.update({
        where: { id: habit.userId },
        data: { highestStreak: streak },
      });
    }
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { success: false, error: "some error occured!" };
  }
};

export const deleteProgress = async (habitId: number) => {
  try {
    const normalized = dayjs().startOf("day").toDate();

    // 1. Fetch habit BEFORE deletion
    const habitBefore = await prisma.habit.findUnique({
      where: { id: habitId },
      include: {
        progressRecords: { orderBy: { date: "desc" } },
        user: true,
      },
    });

    if (!habitBefore) throw new Error("habit not found");

    const previousStreak = calculateStreak({
      frequencyType: habitBefore.frequencyType,
      progressRecords: habitBefore.progressRecords,
      days: habitBefore.days,
    });

    const highestStreak = habitBefore.user.highestStreak;

    // 2. Delete today's progress
    await prisma.progress.delete({
      where: { habitId_date: { habitId, date: normalized } },
    });

    // 3. If this habit wasn't the reason for highest streak — stop
    if (previousStreak !== highestStreak) {
      revalidatePath("/");
      return { success: true };
    }

    // 4. If it WAS — recalc all habits to find new highest
    const allHabits = await prisma.habit.findMany({
      where: { userId: habitBefore.userId },
      include: {
        progressRecords: { orderBy: { date: "desc" } },
      },
    });

    const allStreaks = allHabits.map((h) =>
      calculateStreak({
        frequencyType: h.frequencyType,
        progressRecords: h.progressRecords,
        days: h.days,
      })
    );

    const correctedHighest = Math.max(...allStreaks);

    await prisma.user.update({
      where: { id: habitBefore.userId },
      data: { highestStreak: correctedHighest },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Some error occurred" };
  }
};
