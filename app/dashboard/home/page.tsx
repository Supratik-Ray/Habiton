import Image from "next/image";
import TodayHabits from "./today-habits";
import Heatmap from "./heatmap";

export default function Home() {
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
            5
          </p>
          <p className="text-black/50">Highest streak</p>
        </div>
        <div className="p-10 rounded-sm  shadow-md bg-white flex flex-col items-center justify-center gap-5">
          <p className="text-5xl font-bold">4</p>
          <p className="text-black/50">Total habits</p>
        </div>
        <div className="p-10 rounded-sm  shadow-md bg-white flex flex-col items-center justify-center gap-5">
          <p className="text-5xl font-bold">2</p>
          <p className="text-black/50">Total Habits today</p>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-black/70">
          📅 Today&apos;s Habits
        </h2>
        <TodayHabits />
      </div>
      <div className="space-y-10">
        <h2 className="text-xl font-bold text-black/70">
          🎯This Year progress
        </h2>
        <Heatmap />
      </div>
    </div>
  );
}
