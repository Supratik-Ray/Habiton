import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import dayjs from "@/lib/dayjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import calculateCompletionRate from "@/utils/calculateCompletionRate";
import CompletionRateChart from "./completion-rate-chart";
import { CategoryChart } from "./category-chart";

export default async function InsightsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  //get all habits
  const allHabits = await prisma.habit.findMany({
    where: { userId: session.user.id },
  });

  //get last start and end dates for last 4 weeks
  const weeks = [
    {
      weekStart: dayjs().startOf("isoWeek"),
      weekEnd: dayjs().endOf("isoWeek"),
    },
  ];

  for (let i = 0; i < 3; i++) {
    const newWeekStart = weeks[i].weekStart.subtract(7, "days");
    const newWeekEnd = weeks[i].weekEnd.subtract(7, "days");
    weeks.push({ weekStart: newWeekStart, weekEnd: newWeekEnd });
  }

  //get all progresses for last 4 weeks
  const allProgresses = await prisma.progress.findMany({
    where: {
      AND: [
        { date: { lte: weeks[0].weekEnd.toDate() } },
        { date: { gte: weeks[weeks.length - 1].weekStart.toDate() } },
        { userId: session.user.id },
      ],
    },
  });

  const results = calculateCompletionRate(allHabits, allProgresses, weeks);

  //habit distribution
  const distribution = (
    await prisma.habit.groupBy({
      by: ["category"],
      _count: { id: true },
      where: { userId: session.user.id },
    })
  ).map((category) => {
    return { category: category.category, count: category._count.id };
  });

  return (
    <div className="p-10 min-h-screen flex flex-col gap-5">
      <h2 className="text-3xl text-black/80 font-bold">
        Insights of your habits
      </h2>
      <div>
        <CompletionRateChart completionRates={results} />
      </div>
      <div>
        <CategoryChart distributionData={distribution} />
      </div>
    </div>
  );
}
