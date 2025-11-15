"use server";

import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export const addProgress = async (habitId: number) => {
  try {
    const normalized = dayjs(new Date()).startOf("day").toDate();
    await prisma.progress.create({ data: { habitId, date: normalized } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "some error occured!" };
  }
};

export const deleteProgress = async (habitId: number) => {
  try {
    const normalized = dayjs(new Date()).startOf("day").toDate();
    await prisma.progress.delete({
      where: { habitId_date: { habitId, date: normalized } },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "some error occured" };
  }
};
