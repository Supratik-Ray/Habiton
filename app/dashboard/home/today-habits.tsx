import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Days } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProgressBar from "./progress-bar";

const dayMapping: Record<number, Days> = {
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SAT",
  7: "SUN",
};
export default async function TodayHabits() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  let today = new Date().getDay();
  today = today === 0 ? 7 : today;

  const todayHabits = await prisma.habit.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { frequencyType: "daily" },
        { days: { has: dayMapping[today] as Days } },
      ],
    },
  });

  return (
    <Table>
      {todayHabits.length === 0 && (
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
        {todayHabits.map((habit) => (
          <TableRow key={habit.id} className="grid grid-cols-5">
            <TableCell className="place-content-center text-black/70 font-semibold">
              {habit.name}
            </TableCell>
            <TableCell className="place-content-center">
              <span className="bg-amber-500 rounded-md px-3 py-1 font-semibold text-white">
                {habit.category}
              </span>
            </TableCell>
            <TableCell className="place-content-center">
              <ProgressBar />
            </TableCell>
            <TableCell className="place-content-center text-lg">🔥3</TableCell>
            <TableCell className="place-content-center">
              <Button className="cursor-pointer">Done</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
