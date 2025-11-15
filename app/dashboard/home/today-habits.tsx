import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Days } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import HabitEntry from "./habit-entry";
import { calculateStreak, toKey, DAY_CODE } from "@/utils/calculateStreak";
import dayjs from "@/lib/dayjs";

export default async function TodayHabits() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  let today = new Date().getDay();
  const weekStart = dayjs().startOf("isoWeek").startOf("day").toDate();
  const weekEnd = dayjs().endOf("isoWeek").endOf("day").toDate();

  const todayHabits = await prisma.habit.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { frequencyType: "daily" },
        { days: { has: DAY_CODE[today] as Days } },
      ],
    },
    include: {
      progressRecords: {
        orderBy: { date: "desc" },
      },
    },
  });

  const results = todayHabits.map((habit) => {
    //calculate streak
    const streak = calculateStreak({
      frequencyType: habit.frequencyType,
      progressRecords: habit.progressRecords,
      days: habit.days,
    });

    //filter progress this week
    const weekProgress = habit.progressRecords.filter((progress) => {
      return progress.date >= weekStart && progress.date <= weekEnd;
    });

    //calculate if habit done today
    const habitDoneToday = weekProgress.some((progress) => {
      return toKey(progress.date) === toKey(new Date());
    });

    return { ...habit, streak, weekProgress, habitDoneToday };
  });

  return (
    <Table>
      {results.length === 0 && (
        <TableCaption>No habits found for today!</TableCaption>
      )}
      <TableHeader>
        <TableRow className="grid grid-cols-5">
          <TableHead className="">Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="">Week Progress</TableHead>
          <TableHead className="">Current streak</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((habit) => (
          <HabitEntry habit={habit} key={habit.id} />
        ))}
      </TableBody>
    </Table>
  );
}
