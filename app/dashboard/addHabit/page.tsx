import AddHabitForm from "@/components/addHabit/AddHabitForm";

export default function AddHabit() {
  return (
    <div className="p-10 flex flex-col  gap-10">
      <h2 className="text-3xl text-black/70 font-bold text-center">
        Add a new Habit
      </h2>
      <AddHabitForm />
    </div>
  );
}
