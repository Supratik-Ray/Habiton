import { Week } from "@/lib/types";
import { Days, Habit, Progress } from "@prisma/client";
import { DAY_CODE } from "./calculateStreak";
import dayjs from "@/lib/dayjs";
import { Dayjs } from "dayjs";

function getWeekLabel(index: number) {
  if (index === 0) {
    return "current week";
  }
  if (index === 1) {
    return "last week";
  }
  return `${index} weeks ago`;
}

function expectedForHabitInWeek(
  { weekStart, weekEnd }: { weekStart: Dayjs; weekEnd: Dayjs },
  habit: Habit
) {
  //1)habit created in current week (CreatedAt -> today)
  //2)habit not created in current week (weekstart -> today)
  //3)habit in the past week where it was created(createdAt -> weekEnd)
  //4)habit in the past week after the createdAt week (weekstart -> weekEnd)
  //5)habit in the past week before the createdAt week (0)
  const createdAt = dayjs(habit.createdAt);
  const today = dayjs().startOf("day");
  const validStart = dayjs.max(weekStart, createdAt);
  const validEnd = dayjs.min(weekEnd, today);

  //if week before habit-created Week
  if (validStart.isAfter(validEnd, "day")) return 0;

  //if daily habit
  if (habit.frequencyType === "daily") {
    return validEnd.diff(validStart, "days") + 1;
  }

  //if not daily habit
  let expected = 0;
  let current = validStart;

  while (current.isBefore(validEnd, "day") || current.isSame(validEnd, "day")) {
    const day = current.day();
    if (habit.days.includes(DAY_CODE[day] as Days)) {
      expected++;
    }
    current = current.add(1, "day");
  }
  return expected;
}

export default function calculateCompletionRate(
  allHabits: Habit[],
  allProgresses: Progress[],
  weeks: Week[]
) {
  const results = [];

  for (const [index, week] of weeks.entries()) {
    //calculating expectedDays for each habit in the week
    let totalExpectedThisWeek = 0;

    allHabits.forEach((habit) => {
      totalExpectedThisWeek += expectedForHabitInWeek(week, habit);
    });

    //calculating total progresses in the week
    const totalCompletedThisWeek = allProgresses.filter((progress) => {
      const progressDate = dayjs(progress.date);
      return progressDate.isBetween(week.weekStart, week.weekEnd, "day", "[]");
    }).length;

    results.push({
      label: getWeekLabel(index),
      totalExpected: totalExpectedThisWeek,
      totalCompleted: totalCompletedThisWeek,
    });
  }

  return results.toReversed();
}
