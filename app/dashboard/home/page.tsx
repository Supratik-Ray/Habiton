import Image from "next/image";
import TodayHabits from "@/components/dashboard-home/today-habits";
import Heatmap from "@/components/dashboard-home/heatmap";
import { calculateStreak, toKey, DAY_CODE } from "@/utils/calculateStreak";
import dayjs from "@/lib/dayjs";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Days } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const today = new Date().getDay();
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

  let totalHabitsCompletedToday = 0;

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
    if (habitDoneToday) totalHabitsCompletedToday++;

    return { ...habit, streak, weekProgress, habitDoneToday };
  });

  //fetch highest streak
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("user not found!");

  //group progresses by date for heatmap
  const yearStart = dayjs().startOf("year").toDate();
  const yearEnd = dayjs().endOf("year").toDate();
  const progresses = await prisma.progress.groupBy({
    by: ["date"],
    _count: { date: true },
    where: {
      // userId (TODO:implement later in progress model)
      userId: session.user.id,
      date: {
        gte: yearStart,
        lte: yearEnd,
      },
    },
  });

  const heatmapData = progresses.map((progress) => ({
    date: dayjs(progress.date).format("YYYY-MM-DD"),
    count: progress._count.date,
  }));
  return (
    <div className="p-10 bg-gray-50 min-h-full flex flex-col gap-10">
      <div className="grid md:grid-cols-3 gap-10 ">
        <div className="p-10 rounded-sm  shadow-md bg-white flex flex-col items-center justify-center gap-5">
          <p className="text-5xl font-bold flex gap-2 items-center justify-center">
            <span>
              <Image
                src={"/flame.webp"}
                alt="flame streak"
                height={50}
                width={50}
              />
            </span>
            {user.highestStreak}
          </p>
          <p className="text-black/50">Highest streak</p>
        </div>
        <div className="p-10 rounded-sm  shadow-md bg-white flex flex-col items-center justify-center gap-5">
          <p className="text-5xl font-bold">{results.length}</p>
          <p className="text-black/50">Habits today</p>
        </div>
        <div className="p-10 rounded-sm  shadow-md bg-white flex flex-col items-center justify-center gap-5">
          <p className="text-5xl font-bold">{totalHabitsCompletedToday}</p>
          <p className="text-black/50">Completed today</p>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-black/70">
          📅 Today&apos;s Habits
        </h2>
        <TodayHabits habits={results} />
      </div>
      <div className="space-y-10">
        <h2 className="text-xl font-bold text-black/70">
          🎯This Year progress
        </h2>
        <Heatmap data={heatmapData} startDate={yearStart} endDate={yearEnd} />
      </div>
    </div>
  );
}
