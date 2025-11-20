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

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ActionButtons from "../../../components/manage-habits/action-buttons";

export default async function ManageHabits() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
  });

  return (
    <div className="p-10 flex flex-col gap-20">
      <h2 className="text-3xl font-bold text-black/70 text-center">
        Manage your Habits
      </h2>
      <div className="w-full max-w-[800px] mx-auto">
        <Table>
          {habits.length === 0 && (
            <TableCaption>
              No habits found. Start by creating some!
            </TableCaption>
          )}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sl/No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Frequency Type</TableHead>
              <TableHead>actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {habits.map((habit, index) => (
              <TableRow key={habit.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{habit.name}</TableCell>
                <TableCell>{habit.category}</TableCell>
                <TableCell>{habit.frequencyType}</TableCell>
                <TableCell className="flex gap-5">
                  <ActionButtons id={habit.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
