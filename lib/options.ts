export const HABIT_CATEGORIES = [
  { id: "health", label: "Health" },
  { id: "fitness", label: "Fitness" },
  { id: "learning", label: "Learning" },
  { id: "productivity", label: "Productivity" },
  { id: "mindfulness", label: "Mindfulness" },
  { id: "routine", label: "Routine" },
  { id: "finance", label: "Finance" },
] as const;

export const DAYS = [
  { id: "MON", label: "Monday" },
  { id: "TUE", label: "Tuesday" },
  { id: "WED", label: "Wednesday" },
  { id: "THU", label: "Thursday" },
  { id: "FRI", label: "Friday" },
  { id: "SAT", label: "Saturday" },
  { id: "SUN", label: "Sunday" },
] as const;

export const CATEGORY_BADGE_COLORS: Record<string, string> = {
  health: "bg-red-500 text-red-100",
  fitness: "bg-orange-500 text-orange-100",
  learning: "bg-blue-500 text-blue-100",
  productivity: "bg-indigo-500 text-indigo-100",
  mindfulness: "bg-purple-500 text-purple-100",
  routine: "bg-teal-500 text-teal-100",
  finance: "bg-green-500 text-green-100",
};
