import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import HabitEntry from "./habit-entry";
import { THabitEntry } from "@/lib/types";

export default async function TodayHabits({
  habits,
}: {
  habits: THabitEntry[];
}) {
  return (
    <Table>
      {habits.length === 0 && (
        <TableCaption>No habits found for today!</TableCaption>
      )}
      <TableHeader>
        <TableRow className="grid grid-cols-5">
          <TableHead className="">Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="">Weekly Progress</TableHead>
          <TableHead className="">Current streak</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {habits.map((habit) => (
          <HabitEntry habit={habit} key={habit.id} />
        ))}
      </TableBody>
    </Table>
  );
}
