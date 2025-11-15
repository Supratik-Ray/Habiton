import { Habit, Progress } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";

type calculateStreakParams = {
  frequencyType: Habit["frequencyType"];
  progressRecords: Progress[];
  days: Habit["days"];
};

//TODO: might change to ISOMAPPING (MON->0 SUN->6) later on

export const DAY_CODE = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const isValidDay = (date: Dayjs, habitDays: Habit["days"]) => {
  const day = date.day();
  return habitDays.includes(DAY_CODE[day] as Habit["days"][0]);
};

export const toKey = (date: Date) => {
  return dayjs(date).startOf("day").format("YYYY-MM-DD");
};

export const calculateStreak = ({
  frequencyType,
  progressRecords,
  days,
}: calculateStreakParams) => {
  //if progress records is empty return 0
  if (progressRecords.length === 0) return 0;

  const progressSet = new Set(progressRecords.map((p) => toKey(p.date)));
  const today = dayjs().startOf("day");
  const todayKey = toKey(today.toDate());

  let streak = 0;
  let cursor = today;

  //check if today is included in the progress Records
  //if included then increase streak by one or else dont
  //subract day by 1 for both case
  if (progressSet.has(todayKey)) {
    streak++;
  }
  cursor = cursor.subtract(1, "day");

  const MAX_ITER = 365 * 3; //3 yrs
  let counter = 1;
  //enter while loop
  while (counter <= MAX_ITER) {
    //check if frequency type is equal to  daily
    if (frequencyType === "daily") {
      //check if day in progress records
      if (progressSet.has(toKey(cursor.toDate()))) {
        //if present then increase streak by one and subtract day by 1
        streak++;
        cursor = cursor.subtract(1, "day");
      } else {
        //else break and return streak
        break;
      }
    }
    //else(specific days)
    else {
      //if current day is not in days then subtract day by 1 and skip
      if (!isValidDay(cursor, days)) {
        cursor = cursor.subtract(1, "day");
        counter++;
        continue;
      }
      // if current day in progress records increase streak by one and subtract day by 1
      if (progressSet.has(toKey(cursor.toDate()))) {
        streak++;
        cursor = cursor.subtract(1, "day");
      }
      //else break and return streak
      else {
        break;
      }
    }
    //increase counter
    counter++;
  }
  return streak;
};
