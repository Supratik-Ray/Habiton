"use client";
import { type THabitEntry } from "@/lib/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/dashboard-home/progress-bar";
import { addProgress, deleteProgress } from "@/actions/progress";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { CATEGORY_BADGE_COLORS } from "@/lib/options";

export default function HabitEntry({ habit }: { habit: THabitEntry }) {
  const [isDone, setIsDone] = useState(habit.habitDoneToday);
  const [inProgress, setInProgress] = useState(false);

  const totalHabitsPerWeek =
    habit.frequencyType === "daily" ? 7 : habit.days.length;
  const totalProgressThisWeek = habit.weekProgress.length;
  const progressPercent = Math.round(
    (totalProgressThisWeek / totalHabitsPerWeek) * 100
  );

  const handleDone = async (habitId: number) => {
    setInProgress(true);
    const result = await addProgress(habitId);
    if (result.success) {
      setIsDone(true);
      toast.success("Task marked done!");
    } else {
      toast.error(result.error);
    }

    setInProgress(false);
  };

  const handleUnDone = async (habitId: number) => {
    setInProgress(true);
    const result = await deleteProgress(habitId);
    if (result.success) {
      toast.success("Task marked undone!");
      setIsDone(false);
    } else {
      toast.error(result.error);
    }
    setInProgress(false);
  };

  return (
    <TableRow
      key={habit.id}
      className={`grid grid-cols-5 ${
        isDone ? "bg-green-100 hover:bg-green-100" : ""
      }`}
    >
      <TableCell className="place-content-center text-black/70 font-semibold">
        {habit.name}
      </TableCell>
      <TableCell className="place-content-center">
        <span
          className={`${
            CATEGORY_BADGE_COLORS[habit.category]
          } bg-amber-500 rounded-md px-3 py-1 font-semibold text-white`}
        >
          {habit.category}
        </span>
      </TableCell>
      <TableCell className="place-content-center">
        <ProgressBar
          value={progressPercent}
          text={`${totalProgressThisWeek}/${totalHabitsPerWeek}`}
        />
      </TableCell>
      <TableCell className="place-content-center text-lg">
        <div className="flex gap-2 items-center">
          {habit.streak > 0 && (
            <Image
              src={"/flame.webp"}
              alt="flame image"
              height={30}
              width={30}
            />
          )}
          <span>{habit.streak}</span>
        </div>
      </TableCell>
      <TableCell className="place-content-center">
        <Button
          className="cursor-pointer text-center w-20"
          variant={isDone ? "destructive" : "default"}
          onClick={
            isDone ? () => handleUnDone(habit.id) : () => handleDone(habit.id)
          }
        >
          {inProgress && <Spinner />}
          {!inProgress && isDone && "Undone"}
          {!inProgress && !isDone && "Done"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
